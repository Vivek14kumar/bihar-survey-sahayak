import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import webpush from "web-push";

export async function POST(req) {
  try {
    // FIX: Moved the configuration INSIDE the function!
    webpush.setVapidDetails(
      'mailto:your-email@example.com', // Make sure to put your real email here
      process.env.NEXT_PUBLIC_VAPID_KEY,
      process.env.PRIVATE_VAPID_KEY
    );

    const body = await req.json();
    const { title, message, slug, adminToken } = body;

    // Security Check
    if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("bihar_survey_db");
    const collection = db.collection("subscribers");

    // Fetch all saved subscriptions
    const subscribers = await collection.find({}).toArray();

    if (subscribers.length === 0) {
      return NextResponse.json({ message: "No subscribers found." }, { status: 200 });
    }

    const payload = JSON.stringify({
      title: title,
      body: message,
      url: `/blog/${slug}` 
    });

    // Send notifications 
    const notifications = subscribers.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.subscription, payload);
      } catch (err) {
        // If the browser subscription is dead, delete it from DB
        if (err.statusCode === 410 || err.statusCode === 404) {
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