import clientPromise from "@/lib/mongodb";

export async function POST() {
  const client = await clientPromise;
  const db = client.db("analyticsDB");

  await db.collection("siteStats").updateOne(
    { name: "vanshawaliCreated" },
    { $inc: { count: 1 } },
    { upsert: true }
  );

  return Response.json({ success: true });
}
