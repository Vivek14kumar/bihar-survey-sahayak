import { NextResponse } from "next/server";

// FIX 1: Using the "@" alias is much safer! It always points to the root of your project.
import clientPromise from "@/lib/mongodb"; 

// FIX 2: Using the App Router syntax (export async function POST)
export async function POST(req) {
  try {
    const subscription = await req.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ error: "Invalid subscription object" }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("bihar_survey_db"); // Change to your actual DB name if different
    const collection = db.collection("subscribers");

    // Check if user is already subscribed
    const existingSub = await collection.findOne({ 
      "subscription.endpoint": subscription.endpoint 
    });

    if (existingSub) {
      return NextResponse.json({ message: "User is already subscribed." }, { status: 200 });
    }

    // Save new subscription
    await collection.insertOne({ 
      subscription: subscription,
      createdAt: new Date()
    });

    return NextResponse.json({ message: "Subscription saved successfully!" }, { status: 201 });
    
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}