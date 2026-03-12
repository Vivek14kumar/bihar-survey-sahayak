import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const { type } = await req.json(); // Get type from frontend

    // Set price based on type (Amount is in paise: ₹1 = 100 paise)
    let amount = 0;
    if (type === "prapatra2") {
      amount = 5 * 100; // ₹5
    } else if (type === "vanshavali") {
      amount = 10 * 100; // ₹10
    }else if (type === "affidavit") {
      amount = 3 * 100; // ✅ ₹3 per document
    }else if (type === "objectionLetter") {
      amount = 3 * 100; // ✅ ₹3 per document
    }else if (type === "cancellationJama") {
      amount = 3 * 100; // ✅ ₹3 per document
    }else if (type === "batwara") {
      amount = 39 * 100; // ✅ ₹39 per document
    }  else {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: { formType: type } // Useful for tracking
    };

    const order = await razorpay.orders.create(options);
    return Response.json(order);
  } catch (err) {
    console.error("Order Creation Error:", err);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}