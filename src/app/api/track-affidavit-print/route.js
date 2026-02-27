import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { type } = await req.json(); // "affidavit"

  const client = await clientPromise;
  const db = client.db("analyticsDB");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  await db.collection("dailyStats").updateOne(
    { date: today },
    {
      $inc: {
        affidavitPaid: 1,     // count
        totalRevenue: 3,      // ₹3 per affidavit
      },
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}