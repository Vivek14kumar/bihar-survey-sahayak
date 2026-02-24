import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("analyticsDB");

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "unknown";

    const collection = db.collection("dailyStats");

    await collection.updateOne(
      { date: today },
      {
        $inc: { pageViews: 1 },
        $addToSet: { visitors: ip },
        $setOnInsert: {
          date: today,
          uniqueVisitors: 0,
          vanshawaliCreated: 0,
          prapatra2Printed: 0,
          vanshawaliPaid: 0,
          prapatra2Paid: 0,
          totalRevenue: 0,
        },
      },
      { upsert: true }
    );

    const doc = await collection.findOne({ date: today });

    await collection.updateOne(
      { date: today },
      { $set: { uniqueVisitors: doc.visitors.length } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}