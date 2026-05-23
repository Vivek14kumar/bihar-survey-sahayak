import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, // "Vanshavali", "Prapatra 2", etc.
  clientName: { type: String, required: true }, // The name of their customer
  clientMobile: { type: String, default: "" },  // The customer's mobile number
  cost: { type: Number, required: true },       // How much was deducted
  ref: { type: String, required: true, unique: true }, // DOC-XXXXXX
  txnId: { type: String, required: true },      // TXN-XXXXXX (Links to the wallet deduction)
  date: { type: Date, default: Date.now },
  // Add this inside your DocumentSchema
  status: { 
    type: String, 
    enum: ["COMPLETED", "REFUND_REQUESTED", "REFUNDED", "REFUND_REJECTED"], 
    default: "COMPLETED" 
  },
  refundReason : {type: String, required: true},
  adminMessage: {type: String},
});

// This prevents Mongoose from crashing in Next.js hot-reloads
export default mongoose.models.Document || mongoose.model('Document', DocumentSchema);