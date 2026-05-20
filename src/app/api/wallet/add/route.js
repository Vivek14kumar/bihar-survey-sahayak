import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../utils/dbConnect";
import User from "../../models/User";
import Transaction from "../../models/Transaction";
import crypto from "crypto";

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Extract the Razorpay details sent from your new frontend logic
  const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } = await req.json();
  const numericAmount = Number(amount); 

  // Prevent adding 0 or negative numbers
  if (!numericAmount || numericAmount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  // 2. VERIFY RAZORPAY SIGNATURE (Crucial Security Step!)
  // If you are just testing and want to bypass this temporarily, you can comment this block out.
  // But NEVER launch your app without this!
  if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Payment verification failed. Fraud attempt detected." }, { status: 400 });
    }
  } else {
    // If no razorpay details are sent, reject it!
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  await connectDB();

  try {
    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 3. Update Balance
    user.walletBalance += numericAmount;
    await user.save();

    // 4. Generate a Unique Transaction ID (Or use the Razorpay Payment ID!)
    // It's usually better to use the Razorpay ID so you can track it in your Razorpay Dashboard
    const txnId = razorpayPaymentId || `TXN-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // 5. Log Transaction
    const transaction = await Transaction.create({
      user: user._id,
      txnId: txnId,             
      form: "Wallet Recharge",
      amount: numericAmount,    
      type: 'CREDIT',           
      status: 'SUCCESS',        
      isCredit: true,
      // Optional: Add a field to your schema to save the Order ID for records!
      // razorpayOrderId: razorpayOrderId 
    });

    return NextResponse.json({ 
      success: true, 
      newBalance: user.walletBalance, 
      transaction: { 
        id: transaction._id,
        txnId: transaction.txnId,
        form: transaction.form,
        amount: transaction.amount , //`+₹${transaction.amount}`
        isCredit: transaction.isCredit,
        time: transaction.time ? transaction.time.toLocaleString() : new Date().toLocaleString()
      } 
    }); 
  } catch (error) {
    console.error("Wallet Top-up Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}