import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST() {
  const client = await clientPromise;
  const db = client.db("analyticsDB");

  await db.collection("siteStats").updateOne(
    { _id: new ObjectId("69971185b671b2d85dd313b2") },
    { $inc: { prapatra2Printed: 1 } }
  );

  return Response.json({ success: true });
}