import Razorpay from "razorpay";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const options = {
      amount: 199 * 100, // Fixed ₹199 in paise
      currency: "INR",
      receipt: `sub_rcpt_${Date.now()}`,
      notes: { 
        type: "AMIN_PROFILE_SUBSCRIPTION",
        userId: userId // Important for tracking
      }
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (err) {
    console.error("Subscription Order Error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}