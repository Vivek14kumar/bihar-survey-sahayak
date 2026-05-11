// models/DailyTarget.js
import mongoose from "mongoose";

const dailyTargetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dateString: { type: String, required: true }, // Format: "YYYY-MM-DD" for easy querying
  
  // Array of targets for different forms
  targets: [
    {
      formName: { type: String, required: true }, // e.g., "Vanshawali", "Prapatra 2"
      targetForm: { type: Number, required: true }, // e.g., 5
      currentProgress: { type: Number, default: 0 },  // Starts at 0
      cashbackReward: { type: Number, required: true }, // e.g., ₹10
      isRewardClaimed: { type: Boolean, default: false } // Prevents double payouts
    }
  ],
  
  createdAt: { type: Date, default: Date.now }
});

// Ensure a user only has ONE target document per day
dailyTargetSchema.index({ user: 1, dateString: 1 }, { unique: true });

export default mongoose.models.DailyTarget || mongoose.model("DailyTarget", dailyTargetSchema);