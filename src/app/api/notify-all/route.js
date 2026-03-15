import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import webpush from "web-push";

// Configure VAPID keys
webpush.setVapidDetails(
  'mailto:viktechzweb@gmail.com', // Change to your actual email
  process.env.NEXT_PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

export async function POST(req) {
  try {
    const { title, message, slug, adminToken } = await req.json();

    // Security Check: Ensure only you can trigger this
    if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("bihar_survey_db");
    const collection = db.collection("subscribers");

    // Fetch all saved subscriptions
    const subscribers = await collection.find({}).toArray();

    const payload = JSON.stringify({
      title: title,
      body: message,
      url: `/blog/${slug}` // Opens the blog when clicked
    });

    // Send notifications and handle users who have unsubscribed/cleared data
    const notifications = subscribers.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (err) {
        // If the browser subscription is no longer valid (HTTP 410), delete it from DB
        if (err.statusCode === 410) {
          await collection.deleteOne({ _id: sub._id });
        }
      }
    });

    await Promise.all(notifications);

    return NextResponse.json({ 
      success: true, 
      message: `Notifications sent to ${subscribers.length} users!` 
    }, { status: 200 });

  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 });
  }
}