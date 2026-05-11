import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../utils/dbConnect"; // Use your exact dbConnect path
import User from "../models/User";
import Notification from "../models/Notification";

// 1. Fetch Notifications
export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json([], { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json([]);

  // Fetch top 20 most recent notifications
  const notifications = await Notification.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return NextResponse.json(notifications, {
    headers: { 'Cache-Control': 'no-store, max-age=0' }
  });
}

// 2. Mark a SINGLE Notification as Read
export async function PUT(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  try {
    await connectDB();
    
    // We now expect the specific notification ID from the frontend
    const { notifId } = await req.json(); 

    // Update ONLY that specific notification
    await Notification.findByIdAndUpdate(
      notifId,
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}