import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true }, // Auto-generated ID (BSS-USER or BSS-OP)
  userType: { 
    type: String, 
    enum: ['cyber_cafe', 'amin', 'normal'], //'csc'
    default: 'normal',
    required: true
  },
  role: { type: String, default: "operator" },
  ownerName: { type: String, required: true },
  shopName: { type: String, required: false }, // Made optional for 'normal' users
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  district: { type: String, required: true },
  block: { type: String, required: true },
  pincode: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  acceptedDeclaration: {
    type: Boolean,
    required: true,
    default: false
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);