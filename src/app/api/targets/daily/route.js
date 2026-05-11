import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../utils/dbConnect";
import User from "../../models/User";
import DailyTarget from "../../models/DailyTarget"; // Make sure your model is imported!

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Get today's date in YYYY-MM-DD format (Matches your DB 'dateString')
  const today = new Date().toISOString().split('T')[0];

  // Fetch target for THIS user on THIS specific date
  const targetDoc = await DailyTarget.findOne({ user: user._id, dateString: today }).lean();

  if (!targetDoc) {
    return NextResponse.json({ targets: [] }); // Send empty if none exists for today
  }

  return NextResponse.json(targetDoc);
}