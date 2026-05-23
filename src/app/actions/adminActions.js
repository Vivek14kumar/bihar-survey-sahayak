// src/app/actions/adminActions.js
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "../api/utils/dbConnect";
import User from "../api/models/User";
import Transaction from "../api/models/Transaction";
import Document from "../api/models/Document";
import Notification from "../api/models/Notification";
import DailyTarget from "../api/models/DailyTarget";
import { revalidatePath } from "next/cache";

// Utility to verify admin status
async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    throw new Error("Unauthorized Access");
  }
}

// 1. Update Wallet Balance (Manual Credit/Debit)
export async function updateWalletBalance(userId, amount, actionType, note) {
  await checkAdmin();
  await dbConnect();

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const adjustment = actionType === "ADD" ? Number(amount) : -Number(amount);
  user.walletBalance += adjustment;
  await user.save();

  // Log the manual transaction
  await Transaction.create({
    user: userId,
    txnId: `ADM-${Date.now().toString().slice(-6)}`,
    type: actionType === "ADD" ? "CREDIT" : "DEBIT",
    status: "SUCCESS",
    amount: Number(amount),
    form: "Credited from Bihar Survey Sahayak", // Admin Manual Adjustment
    isCredit: actionType === "ADD",
    note: note || "Adjusted by Super Admin"
  });

  revalidatePath("/admin/users");
  return { success: true, message: `Wallet updated successfully.` };
}

// 2. Process Refund for a specific Document
// ✅ APPROVE REFUND
export async function approveRefundRequest(docId) {
  await dbConnect();
  
  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found");
  
  // 👉 SAFETY NET: If it was already refunded by a previous click, just return success
  if (doc.status === "REFUNDED") return { success: true };
  
  // Normal check
  if (doc.status !== "REFUND_REQUESTED") throw new Error("Refund not requested");

  const user = await User.findById(doc.user);
  
  // 1. Return the money
  user.walletBalance += doc.cost;
  await user.save();

  // 2. Log the Refund Transaction
  await Transaction.create({
    user: user._id,
    txnId: `REF-${doc.txnId.replace('TXN-', '')}`, 
    type: "CREDIT",
    status: "SUCCESS",
    amount: doc.cost,
    form: `Refund: ${doc.title}`,
    isCredit: true,
  });

  // 3. Update Document Status
  doc.status = "REFUNDED";
  await doc.save();

  // 4. 👉 THE NOTIFICATION FIX: Changed 'userId' to 'user'
  await Notification.create({
    user: user._id, 
    title: " Refund Approved",
    message: `Your refund request for ${doc.title} (${doc.cost} Crs) has been approved.`,
    type: "SUCCESS"
  });

  revalidatePath("/admin/ledger");
  return { success: true };
}

// ❌ REJECT REFUND
export async function rejectRefundRequest(docId, adminReason) {
  await dbConnect();
  
  const doc = await Document.findById(docId);
  if (!doc) throw new Error("Document not found");
  
  const user = await User.findById(doc.user);

  // Change status back to Paid (or you could use "REFUND_REJECTED" if you prefer)
  doc.status = "REFUND_REJECTED"; 
  doc.adminMessage = adminReason; // Save the reason to the document
  await doc.save();

  // (Optional) Notify Operator message: `Your refund request for ${doc.title} was denied. Reason: "${adminReason}"`,
  await Notification.create({
    user: user._id,
    title: " Refund Denied",
    message: `Your refund request for ${doc.title} was reviewed and denied .`,
    type: "ERROR"
  });

  revalidatePath("/admin/ledger");
  return { success: true };
}

  export async function processRefund(docId, txnId) {
  await checkAdmin(); 
  await dbConnect();

  const originalDoc = await Document.findById(docId);
  if (!originalDoc) throw new Error("Document not found");

  const user = await User.findById(originalDoc.user);
  
  // 1. Return money to wallet
  user.walletBalance += originalDoc.cost;
  await user.save();

  // 2. Create a Refund Transaction
  await Transaction.create({
    user: user._id,
    txnId: `REF-${txnId}`,
    type: "CREDIT",
    status: "SUCCESS",
    amount: originalDoc.cost,
    form: `Refund: ${originalDoc.title}`,
    isCredit: true,
    note: `Admin refund for Doc: ${originalDoc.ref}`
  });

  // 3. Mark document as Refunded (The Bulletproof Way)
  await Document.findByIdAndUpdate(docId, { 
    $set: { status: "REFUNDED" } 
  });

  // 👉 4. Create an In-App Notification for the Operator
  await Notification.create({
    user: user._id, // <-- CHANGED THIS LINE
    title: " Refund Processed",
    message: `A refund of ${originalDoc.cost} Crs for document '${originalDoc.title}' has been credited back to your wallet.`,
    type: "SUCCESS"
  });

  revalidatePath("/admin/ledger");
  return { success: true };
}

// 3. Set Global Target for a Specific Form (For Today)
export async function updateGlobalFormTarget(formName, targetFormLimit, cashbackReward) {
  await checkAdmin();
  await dbConnect();
  
  const todayStr = new Date().toISOString().split("T")[0];
  const operators = await User.find({ role: { $ne: "admin" } });

  for (const op of operators) {
    let dailyTarget = await DailyTarget.findOne({ user: op._id, dateString: todayStr });
    
    if (!dailyTarget) {
      dailyTarget = new DailyTarget({ user: op._id, dateString: todayStr, targets: [] });
    }
    
    const targetIndex = dailyTarget.targets.findIndex(t => t.formName === formName);
    
    if (targetIndex > -1) {
      // FIX: Changed from targetAmount to targetForm
      dailyTarget.targets[targetIndex].targetForm = Number(targetFormLimit);
      dailyTarget.targets[targetIndex].cashbackReward = Number(cashbackReward);
    } else {
      // FIX: Changed from targetAmount to targetForm
      dailyTarget.targets.push({ 
        formName, 
        targetForm: Number(targetFormLimit), 
        cashbackReward: Number(cashbackReward) 
      });
    }
    
    await dailyTarget.save();
  }

  revalidatePath("/admin/users");
  return { success: true };
}

// 4. Set Individual Target for a Specific Operator
export async function updateIndividualFormTarget(userId, formName, targetFormLimit, cashbackReward) {
  await checkAdmin();
  await dbConnect();
  
  const todayStr = new Date().toISOString().split("T")[0];
  let dailyTarget = await DailyTarget.findOne({ user: userId, dateString: todayStr });
  
  if (!dailyTarget) {
    dailyTarget = new DailyTarget({ user: userId, dateString: todayStr, targets: [] });
  }
  
  const targetIndex = dailyTarget.targets.findIndex(t => t.formName === formName);
  
  if (targetIndex > -1) {
    // FIX: Changed from targetAmount to targetForm
    dailyTarget.targets[targetIndex].targetForm = Number(targetFormLimit);
    dailyTarget.targets[targetIndex].cashbackReward = Number(cashbackReward);
  } else {
    // FIX: Changed from targetAmount to targetForm
    dailyTarget.targets.push({ 
      formName, 
      targetForm: Number(targetFormLimit), 
      cashbackReward: Number(cashbackReward) 
    });
  }
  
  await dailyTarget.save();
  revalidatePath("/admin/users");
  return { success: true };
}

// 5. Send Broadcast Notification (To ALL Operators)
export async function broadcastNotification(title, message, type = 'INFO') {
  await checkAdmin();
  await dbConnect();

  const operators = await User.find({ role: { $ne: "admin" } }).select('_id');
  
  // FIX: Changed targetUserId to user to match standard schema
  const notifications = operators.map(op => ({
    user: op._id,
    title,
    message,
    type
  }));

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }

  return { success: true, message: `Broadcast sent to ${notifications.length} operators.` };
}