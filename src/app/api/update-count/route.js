import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { pdf, type } = await req.json();

  const client = await clientPromise;
  const db = client.db("pdfDatabase");

  await db.collection("pdfCounts").updateOne(
    { name: pdf },
    {
      $inc: { [type]: 1 },
    },
    { upsert: true }
  );

  return Response.json({ success: true });
}
