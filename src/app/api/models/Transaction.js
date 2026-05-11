import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // NEW FIELDS WE ADDED:
  txnId: { type: String, required: true, unique: true }, 
  type: { type: String, enum: ['CREDIT', 'DEBIT', 'REFUND'], required: true },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
  
  // UPDATED FIELD:
  amount: { type: Number, required: true }, // Changed from String to Number
  
  // EXISTING FIELDS:
  form: { type: String, required: true }, 
  isCredit: { type: Boolean, required: true }, 
  
  // RAZORPAY FIELDS:
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  
  time: { type: Date, default: Date.now }
});

// This prevents Mongoose from crashing in Next.js hot-reloads
export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);