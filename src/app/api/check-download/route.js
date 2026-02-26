import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db("analyticsDB");
  const collection = db.collection("downloadLimits");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  let user = await collection.findOne({ ip });

  const MAX_FREE = 3;

  // 🆕 Scenario 1: Brand New User
  if (!user) {
    await collection.insertOne({
      ip,
      freeUsed: 1,
      credits: 0,
      updatedAt: new Date(),
    });

    return Response.json({
      allowed: true,
      freeRemaining: MAX_FREE - 1, // Will return 2
    });
  }

  // ✅ Scenario 2: Existing User with Free Downloads left
  if (user.freeUsed < MAX_FREE) {
    const newUsedCount = user.freeUsed + 1;
    await collection.updateOne(
      { ip },
      { $inc: { freeUsed: 1 }, $set: { updatedAt: new Date() } }
    );

    return Response.json({
      allowed: true,
      freeRemaining: MAX_FREE - newUsedCount, // Returns 1 or 0
    });
  }

  // ✅ Scenario 3: Paid Credits
  if (user.credits > 0) {
    await collection.updateOne(
      { ip },
      { $inc: { credits: -1 }, $set: { updatedAt: new Date() } }
    );
    return Response.json({ allowed: true, isPaid: true });
  }

  // ❌ Scenario 4: Limit Reached
  return Response.json({ allowed: false });
}