// src/models/PdfAnalytics.js

import mongoose from "mongoose";

const PdfAnalyticsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // PDF file name, e.g., "Prapatra_2.pdf"
    preview: { type: Number, default: 0 },  // Number of times PDF was previewed
    download: { type: Number, default: 0 }, // Number of times PDF was downloaded
    createdAt: { type: Date, default: Date.now }, // When PDF record was created
  },
  { versionKey: false }
);

export default mongoose.models.PdfAnalytics ||
  mongoose.model("PdfAnalytics", PdfAnalyticsSchema);