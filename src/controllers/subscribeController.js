// controllers/subscribeController.js
const Subscriber = require('../models/Subscriber'); 

exports.saveSubscription = async (req, res) => {
  try {
    const subscription = req.body;

    // 1. Validate that the request actually contains a subscription object
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Invalid subscription object" });
    }

    // 2. Check for duplicates (prevents the database from filling up with the same user)
    const existingSub = await Subscriber.findOne({ 
      "subscription.endpoint": subscription.endpoint 
    });

    if (existingSub) {
      return res.status(200).json({ message: "User is already subscribed." });
    }

    // 3. Save the new subscriber to MongoDB
    const newSubscriber = new Subscriber({ subscription });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscription saved successfully!" });
    
  } catch (error) {
    console.error("Error saving subscription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};