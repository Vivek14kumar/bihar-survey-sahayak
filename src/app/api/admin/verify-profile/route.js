import dbConnect from "../../utils/dbConnect";
import AminProfile from "../../models/AminProfile";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Fetch profiles for the admin dashboard
export async function GET(req) {
  await dbConnect();
  
  // Optional: Add security check here
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all profiles that are not in 'draft' mode
    const profiles = await AminProfile.find({ 
      status: { $in: ['pending', 'live', 'blocked', 'rejected'] } 
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch profiles" }, { status: 500 });
  }
}

// POST: Handle the Admin's decision (Approve, Reject, Block)
export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { profileId, action, reason } = await req.json();

    let updateData = {};

    if (action === "live") {
      // Approve & Start 3-Day Trial
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 3);
      
      updateData = { 
        status: "live", 
        subscriptionEndsAt: trialEnd,
        rejectionReason: "" // Clear any previous rejections
      };
    } else if (action === "reject") {
      // Reject & Require Fixes
      updateData = { 
        status: "rejected", 
        rejectionReason: reason 
      };
    } else if (action === "block") {
      // Permanently Block
      updateData = { status: "blocked" };
    }

    await AminProfile.findByIdAndUpdate(profileId, { $set: updateData });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}