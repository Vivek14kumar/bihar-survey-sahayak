import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("analyticsDB");

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    // ✅ safer IP detection
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.headers.get("x-real-ip") || "unknown";

    const collection = db.collection("dailyStats");

    const todayDoc = await collection.findOne({ date: today });

    if (!todayDoc) {
      await collection.insertOne({
        date: today,
        pageViews: 1,
        uniqueVisitors: 1,
        visitors: [ip],

        vanshawaliCreated: 0,
        prapatra2Printed: 0,
        vanshawaliPaid: 0,
        prapatra2Paid: 0,
        totalRevenue: 0,
      });
    } else {
      const alreadyVisited = todayDoc.visitors?.includes(ip);

      await collection.updateOne(
        { date: today },
        {
          $inc: {
            pageViews: 1,
            uniqueVisitors: alreadyVisited ? 0 : 1,
          },
          $addToSet: { visitors: ip },
        }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("TRACK VISIT ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Server Error" },
      { status: 500 }
    );
  }
}