import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { amount } = await req.json();

    // Prevent operators from trying to top up ₹0
    if (!amount || amount < 1) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Razorpay expects amount in paise (₹1 = 100 paise)
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `wallet_rcpt_${Date.now()}`,
      notes: { type: "WALLET_RECHARGE" }
    };

    const order = await razorpay.orders.create(options);
    return Response.json(order);
  } catch (err) {
    console.error("Wallet Order Creation Error:", err);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}