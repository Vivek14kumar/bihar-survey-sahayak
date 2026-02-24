import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("analyticsDB");

    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    await db.collection("dailyStats").updateOne(
      { date: today },
      {
        $inc: { prapatra2Printed: 1 },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}