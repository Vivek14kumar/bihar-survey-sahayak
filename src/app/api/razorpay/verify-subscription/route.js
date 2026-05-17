import crypto from "crypto";
import dbConnect from "../../utils/dbConnect";
import AminProfile from "../../models/AminProfile";
import Transaction from "../../models/Transaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await req.json();

    // 1. Verify the Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid Payment Signature" }, { status: 400 });
    }

    // 2. Fetch the user's profile
    const profile = await AminProfile.findOne({ userId });
    if (!profile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
    }

    // 3. Calculate New Expiry Date (Add 30 Days)
    let newExpiryDate = new Date();
    
    // If they renew early, add 30 days to their REMAINING time
    if (profile.subscriptionEndsAt && profile.subscriptionEndsAt > new Date()) {
      newExpiryDate = new Date(profile.subscriptionEndsAt);
      newExpiryDate.setDate(newExpiryDate.getDate() + 30);
    } else {
      // If expired, start 30 days from right now
      newExpiryDate.setDate(new Date().getDate() + 30);
    }

    // B. Create Transaction Record for direct online payment
    await Transaction.create({
      user: userId,
      txnId: razorpay_payment_id, // Using the actual Razorpay ID
      type: 'DEBIT',              // MUST match enum
      status: 'SUCCESS',
      amount: 199,                // 199 as a Number
      form: 'Profile Subscription (30 Days) - Paid via UPI/Card',
      isCredit: false,
      razorpayOrderId: razorpay_order_id,     // Saved per your schema
      razorpayPaymentId: razorpay_payment_id  // Saved per your schema
    });

    // 4. Update MongoDB
    await AminProfile.findOneAndUpdate(
      { userId: userId },
      { 
        $set: { 
          status: 'live', // Turn profile back on
          hasPaid: true,
          subscriptionEndsAt: newExpiryDate
        } 
      }
    );

    return NextResponse.json({ success: true, message: "Subscription Extended!" });

  } catch (err) {
    console.error("Verification Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}