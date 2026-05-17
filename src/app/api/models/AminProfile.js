import mongoose from "mongoose";

const AminProfileSchema = new mongoose.Schema({
  // 1. Identity & Routing
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  slug: { type: String, unique: true },
  
  // 2. SaaS & Verification Status
  status: { 
    type: String, 
    // UPDATE: Added 'blocked' to handle the permanent block policy
    enum: ['draft', 'pending', 'live', 'expired', 'blocked', 'rejected'], 
    default: 'draft' 
  },
  rejectionReason: { type: String, default: "" },
  subscriptionEndsAt: { type: Date }, // Controls the 3-day trial and ₹199/month paywall
  hasPaid: { type: Boolean, default: false },
  isProfilePublished: { type: Boolean, default: false }, 
  
  // 3. Personal Branding
  ownerNameEn: { type: String, required: true },
  ownerNameHi: { type: String, required: true },
  
  // 4. Contact Details
  publicMobile: { type: String },
  whatsappNumber: { type: String },
  publicEmail: { type: String },
  publicAddress: { type: String },
  
  // 5. Working Hours & Operations
  startDay: { type: String, default: "सोमवार" },
  endDay: { type: String, default: "शनिवार" },
  startTime: { type: String, default: "09:00" },
  endTime: { type: String, default: "18:00" },
  workingHours: { type: String }, 
  serviceAreas: [{ type: String }],
  
  // 6. Professional Details
  // UPDATE: Tracks if the user checked the "I don't have a certificate" box
  hasFormalCertificate: { type: Boolean, default: true }, 
  registrationNumber: { type: String }, // Optional
  certificateNumber: { type: String },  // Optional
  experience: { type: Number },
  about: { type: String, maxlength: 250 }, 
  
  // 7. Services Provided
  services: {
    landMeasure: { type: Boolean, default: false },
    demarcation: { type: Boolean, default: false },
    partition: { type: Boolean, default: false },
    surveyHelp: { type: Boolean, default: false },
  },
  
  // 8. KYC & Verification Documents (Cloudinary URLs)
  aadhaarUrl: { type: String, default: "" },
  certificateUrl: { type: String, default: "" },
  experienceLetterUrl: { type: String, default: "" },

  // 9. Social Media & Marketing Links
  facebookUrl: { type: String, default: "" },
  youtubeUrl: { type: String, default: "" },
  instagramUrl: { type: String, default: "" },

  // 10. Legal & Compliance
  acceptedTerms: { 
    type: Boolean, 
    required: true, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.models.AminProfile || mongoose.model("AminProfile", AminProfileSchema);