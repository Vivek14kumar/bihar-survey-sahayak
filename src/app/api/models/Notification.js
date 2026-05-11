import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  message: String,
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true // Good for tracking when a notification was sent
});

// This "||" check is vital in Next.js to prevent "OverwriteModelError" 
// when the server reloads during development.
const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

export default Notification;