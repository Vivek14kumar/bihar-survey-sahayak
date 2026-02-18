import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { type } = await req.json();

  const client = await clientPromise;
  const db = client.db("analyticsDB");

  if (!type) {
    return Response.json({ error: "Missing type" }, { status: 400 });
  }

  await db.collection("siteStats").updateOne(
    { name: type },
    { $inc: { count: 1 } },
    { upsert: true }
  );

  return Response.json({ success: true });
}
