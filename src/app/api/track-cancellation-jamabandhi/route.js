import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { type } = await req.json(); // "objection-letter"

  const client = await clientPromise;
  const db = client.db("analyticsDB");

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

  await db.collection("dailyStats").updateOne(
    { date: today },
    {
      $inc: {
        cancellationJamabandhi: 1,   // count
        totalRevenue: 3,          // ₹5 per objection letter (change if needed)
      },
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}