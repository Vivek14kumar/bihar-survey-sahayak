// app/api/subscribe/route.js
import clientPromise from "../../lib/mongodb"; // Update this path to where your connection file is

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription object" });
    }

    // 1. Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("bihar_survey_db"); // Replace with your actual database name
    const collection = db.collection("subscribers");

    // 2. Check if user is already subscribed (prevent duplicates)
    const existingSub = await collection.findOne({ 
      "subscription.endpoint": subscription.endpoint 
    });

    if (existingSub) {
      return res.status(200).json({ message: "User is already subscribed." });
    }

    // 3. Save new subscription
    await collection.insertOne({ 
      subscription: subscription,
      createdAt: new Date()
    });

    res.status(201).json({ message: "Subscription saved successfully!" });
    
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}