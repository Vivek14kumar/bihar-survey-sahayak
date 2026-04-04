import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// --- KEEP YOUR EXISTING GET HANDLER ---
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bihar_survey");

    const feedbacks = await db
      .collection("feedbacks")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = feedbacks.map((fb) => ({
      _id: fb._id.toString(),
      name: fb.name,
      email: fb.email,
      message: fb.message,
      createdAt: fb.createdAt ? fb.createdAt.toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json(serialized, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching feedbacks" }, { status: 500 });
  }
}

// --- ADD THIS POST HANDLER ---
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("bihar_survey");
    
    // Parse the body from the request
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const result = await db.collection("feedbacks").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Feedback saved!", id: result.insertedId }, { status: 201 });
  } catch (err) {
    console.error("POST Error:", err);
    return NextResponse.json({ message: "Error saving feedback" }, { status: 500 });
  }
}