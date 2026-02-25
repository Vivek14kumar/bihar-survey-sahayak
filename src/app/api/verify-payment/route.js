import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return Response.json({ success: false }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("analyticsDB");

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  await db.collection("downloadLimits").updateOne(
    { ip },
    {
      $inc: { credits: 1 }, // 🎟 Add 1 paid credit
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}