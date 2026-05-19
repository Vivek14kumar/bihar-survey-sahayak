import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../utils/dbConnect"; // Adjust this path if yours is different
import User from "../../models/User";
import Transaction from "../../models/Transaction";
import Document from "../../models/Document";

// 👉 NEW IMPORTS REQUIRED FOR GAMIFICATION
import DailyTarget from "../../models/DailyTarget"; 
import Notification from "../../models/Notification"; 

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formName, cost, clientName, clientMobile } = await req.json();
  const numericCost = Number(cost);

  if (isNaN(numericCost) || numericCost <= 0) {
    return NextResponse.json({ error: "Invalid cost amount" }, { status: 400 });
  }

  await connectDB();

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.walletBalance < numericCost) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 });
    }

    // 1. BULLETPROOF TRANSACTION ID GENERATOR
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestampStr = Date.now().toString().slice(-6);
    const txnId = `TXN-${timestampStr}-${randomStr}`;

    // 2. Deduct Balance
    user.walletBalance -= numericCost;
    await user.save();

    // 3. Log the DEBIT Transaction
    const transaction = await Transaction.create({
      user: user._id,
      txnId: txnId,
      form: formName,
      amount: numericCost,
      type: 'DEBIT',
      status: 'SUCCESS',
      isCredit: false,
    });

    // 4. Save Generated Document
    const document = await Document.create({
      user: user._id,
      title: formName,
      clientName: clientName || "Unknown Client",
      clientMobile: clientMobile || "N/A",
      cost: numericCost,
      ref: `DOC-${Math.floor(Math.random() * 900000)}`,
      txnId: txnId,
      status: "COMPLETED",
    });

    // ==========================================
    // 5. GAMIFICATION & CASHBACK ENGINE (NEW)
    // ==========================================
    const todayStr = new Date().toISOString().split("T")[0]; // e.g., "2026-05-09"
    
    // Find today's target for this specific operator
    let dailyTarget = await DailyTarget.findOne({ user: user._id, dateString: todayStr });

    // (Optional) If you want to auto-create defaults for operators who don't have one today:
    if (!dailyTarget) {
      dailyTarget = await DailyTarget.create({
        user: user._id,
        dateString: todayStr,
        targets: [
          { formName: "Vanshawali", targetForm: 4, cashbackReward: 10 },
          { formName: "Prapatra 2", targetForm: 4, cashbackReward: 5 },
          // Add your other forms here
        ]
      });
    }

    // Look for the specific form they just generated
    const formTarget = dailyTarget.targets.find(t => t.formName === formName);

    if (formTarget && !formTarget.isRewardClaimed) {
      formTarget.currentProgress += 1;

      // DID THEY HIT THE TARGET JUST NOW?
      if (formTarget.currentProgress >= formTarget.targetAmount) {
        
        // A. Give Cashback
        user.walletBalance += formTarget.cashbackReward;
        await user.save(); // Save the new balance
        
        // B. Log Cashback Transaction
        await Transaction.create({
          user: user._id,
          txnId: `CB-${Date.now()}`,
          type: "CREDIT",
          status: "SUCCESS",
          amount: formTarget.cashbackReward,
          form: `Target Hit: ${formName}`,
          isCredit: true,
        });

        // C. Send Notification to Operator
        await Notification.create({
          user: user._id, // Must match your Notification schema
          title: ` ${formName} Target Achieved!`,
          message: `Congratulations! You generated ${formTarget.targetAmount} forms today. ₹${formTarget.cashbackReward} cashback has been added to your wallet.`,
          type: "SUCCESS"
        });

        // D. Lock the reward
        formTarget.isRewardClaimed = true;
      }
      
      // Save the target progress
      await dailyTarget.save();
    }
    // ==========================================
    
    return NextResponse.json({ 
      success: true, 
      newBalance: user.walletBalance, // This will accurately reflect if they won cashback!
      transaction: {
        id: transaction._id,
        txnId: transaction.txnId,
        form: transaction.form,
        amount: `-₹${transaction.amount}`, 
        isCredit: transaction.isCredit,
        time: transaction.time.toLocaleString()
      },
      document: {
        id: document._id,
        title: document.title,
        clientName: document.clientName,
        clientMobile: document.clientMobile,
        cost: document.cost,
        ref: document.ref,
        txnId: document.txnId,
        date: document.date.toLocaleDateString('en-IN',{day: 'numeric', month: 'short', year: 'numeric',hour: '2-digit', minute: '2-digit'})
      }
    });

  } catch (error) {
    console.error("Failed to generate document:", error);
    return NextResponse.json({ error: "Server error occurred" }, { status: 500 });
  }
}