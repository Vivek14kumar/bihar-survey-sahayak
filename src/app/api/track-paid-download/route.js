import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("analyticsDB");

    await db.collection("paidDownloads").insertOne({ ...data, timestamp: new Date() });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}