import clientPromise from "@/lib/mongodb";

export async function POST() {
  const client = await clientPromise;
  const db = client.db("analyticsDB");

  // India date (important for your Bihar users)
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  }); 
  // Format: YYYY-MM-DD

  await db.collection("dailyStats").updateOne(
    { date: today },
    {
      $inc: { vanshawaliCreated: 1 },
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}