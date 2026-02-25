import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("analyticsDB");

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  const collection = db.collection("downloadLimits");

  let user = await collection.findOne({ ip });

  // 🆕 First time user
  if (!user) {
    await collection.insertOne({
      ip,
      freeUsed: 1,
      credits: 0,
      updatedAt: new Date(),
    });

    return Response.json({
      allowed: true,
      freeRemaining: 2,
    });
  }

  // ✅ If free limit not finished
  if (user.freeUsed < 3) {
    await collection.updateOne(
      { ip },
      { $inc: { freeUsed: 1 }, $set: { updatedAt: new Date() } }
    );

    return Response.json({
      allowed: true,
      freeRemaining: 3 - (user.freeUsed + 1),
    });
  }

  // ✅ If user has paid credit
  if (user.credits > 0) {
    await collection.updateOne(
      { ip },
      { $inc: { credits: -1 }, $set: { updatedAt: new Date() } }
    );

    return Response.json({ allowed: true });
  }

  // ❌ No free left & no credit
  return Response.json({ allowed: false });
}