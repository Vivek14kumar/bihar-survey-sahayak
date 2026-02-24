import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("analyticsDB");

  const stats = await db
    .collection("dailyStats")
    .find({})
    .sort({ date: -1 })
    .limit(7)
    .toArray();

  return Response.json(stats);
}