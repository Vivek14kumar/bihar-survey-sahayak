import { NextResponse } from 'next/server';
import connectMongo from '../../utils/dbConnect'; // Adjust this import based on your db utility path
import AminProfile from '../../models/AminProfile';

// ==========================================
// GET: Fetch profiles for Admin Dashboard
// ==========================================
export async function GET() {
  try {
    await connectMongo();
    
    // Fetch all profiles so the admin can see 'draft', 'pending', 'live', 'rejected', etc.
    // Sorted by newest first
    const profiles = await AminProfile.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error("GET Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profiles" }, 
      { status: 500 }
    );
  }
}

// ==========================================
// POST: Handle Approve, Reject, or Block
// ==========================================
export async function POST(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { profileId, action, reason } = body;

    if (!profileId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" }, 
        { status: 400 }
      );
    }

    let updateData = {};

    switch (action) {
      case 'live':
        // Calculate 3 days from right now for the trial
        const trialExpiry = new Date();
        trialExpiry.setDate(trialExpiry.getDate() + 3);

        updateData = { 
          status: 'live', 
          isProfilePublished: true, // Make profile public
          subscriptionEndsAt: trialExpiry, // Starts the 3-day trial
          rejectionReason: "" // Clear any previous rejection reasons
        };
        break;

      case 'reject':
        if (!reason) {
          return NextResponse.json(
            { success: false, error: "Rejection reason is required" }, 
            { status: 400 }
          );
        }
        updateData = { 
          status: 'rejected', 
          isProfilePublished: false, // Ensure it's hidden
          rejectionReason: reason 
        };
        break;

      case 'block':
        updateData = { 
          status: 'blocked', 
          isProfilePublished: false, 
          rejectionReason: "Account permanently blocked by administrator." 
        };
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action type" }, 
          { status: 400 }
        );
    }

    // Update the document in the database
    const updatedProfile = await AminProfile.findByIdAndUpdate(
      profileId, 
      updateData, 
      { new: true } // Returns the updated document
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
    
  } catch (error) {
    console.error("POST Verification Error:", error);
    return NextResponse.json(
      { success: false, error: "Database update failed" }, 
      { status: 500 }
    );
  }
}