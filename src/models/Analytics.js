import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, default: 0 },
  date: { type: String }, // only for todayVisitorsMeta
});

export default mongoose.models.Analytics ||
  mongoose.model("Analytics", AnalyticsSchema);