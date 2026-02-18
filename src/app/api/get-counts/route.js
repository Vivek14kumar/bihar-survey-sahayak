import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("pdfDatabase");

  const data = await db
    .collection("pdfCounts")
    .find()
    .sort({ download: -1 }) // 🔥 Sort by download DESC
    .toArray();

  return Response.json({ data });
}
