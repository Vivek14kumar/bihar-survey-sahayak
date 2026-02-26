/*import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { type } = await req.json(); // "vanshavali" or "prapatra2"
  const client = await clientPromise;
  const db = client.db("analyticsDB");
  const collection = db.collection("downloadLimits");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  let user = await collection.findOne({ ip });

  const MAX_FREE = 2;
  
  // Define which field to check based on type
  const freeField = type === "vanshavali" ? "freeUsedVanshavali" : "freeUsedPrapatra";

  // 🆕 Scenario 1: Brand New User
  if (!user) {
    const newUser = {
      ip,
      freeUsedVanshavali: type === "vanshavali" ? 1 : 0,
      freeUsedPrapatra: type === "prapatra2" ? 1 : 0,
      credits: 0,
      updatedAt: new Date(),
    };
    await collection.insertOne(newUser);

    return Response.json({
      allowed: true,
      freeRemaining: MAX_FREE - 1,
    });
  }

  // ✅ Scenario 2: Paid Credits (Check first to give priority to paid users)
  if (user.credits > 0) {
    await collection.updateOne(
      { ip },
      { $inc: { credits: -1 }, $set: { updatedAt: new Date() } }
    );
    return Response.json({ allowed: true, isPaid: true });
  }

  // ✅ Scenario 3: Free Downloads left for specific type
  const currentUsed = user[freeField] || 0;
  if (currentUsed < MAX_FREE) {
    await collection.updateOne(
      { ip },
      { $inc: { [freeField]: 1 }, $set: { updatedAt: new Date() } }
    );

    return Response.json({
      allowed: true,
      freeRemaining: MAX_FREE - (currentUsed + 1),
    });
  }

  // ❌ Scenario 4: Limit Reached
  return Response.json({ allowed: false });
}*/

import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { type } = await req.json();
  const client = await clientPromise;
  const db = client.db("analyticsDB");
  const collection = db.collection("downloadLimits");

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  let user = await collection.findOne({ ip });

  // 1. If user doesn't exist, they definitely have 0 credits
  if (!user) {
    await collection.insertOne({
      ip,
      credits: 0,
      updatedAt: new Date(),
    });
    return Response.json({ allowed: false });
  }

  // 2. Check for Paid Credits only
  if (user.credits > 0) {
    await collection.updateOne(
      { ip },
      { $inc: { credits: -1 }, $set: { updatedAt: new Date() } }
    );
    return Response.json({ allowed: true, isPaid: true });
  }

  // 3. No credits = No download
  return Response.json({ allowed: false });
}