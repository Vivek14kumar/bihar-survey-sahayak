import dbConnect from "../../utils/dbConnect";
import AminProfile from "../../models/AminProfile";
import { NextResponse } from "next/server";

// Helper function to create a clean URL string
function createSlug(name) {
  if (!name) return `user-${Math.floor(1000 + Math.random() * 9000)}`;
  const baseSlug = name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
  const randomNum = Math.floor(1000 + Math.random() * 9000); 
  return `${baseSlug}-${randomNum}`;
}

export async function POST(req) {
  await dbConnect();
  
  try {
    const data = await req.json();
    
    // SECURITY 1: Destructure out fields the user is NEVER allowed to modify directly.
    // We also extract `actionType` to determine the business logic.
    const { 
      userId, 
      hasPaid, 
      _id, 
      status, // Prevent users from passing { status: 'live' }
      subscriptionEndsAt, 
      isProfilePublished,
      actionType,
      ...profileData 
    } = data;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // 1. Fetch existing profile to check current state
    let existingProfile = await AminProfile.findOne({ userId });

    // SECURITY 2: If the profile is permanently blocked, reject all updates
    if (existingProfile && existingProfile.status === "blocked") {
      return NextResponse.json(
        { success: false, error: "Your profile has been permanently blocked due to policy violations." }, 
        { status: 403 }
      );
    }

    // 2. Generate slug if it's a NEW profile OR if an existing profile is missing one
    if (!existingProfile || !existingProfile.slug) {
      profileData.slug = createSlug(profileData.ownerNameEn);
    }

    // 3. Handle Business Logic based on `actionType` from the frontend
    if (actionType === "submitVerification") {
      // Validation: Ensure documents are actually provided before moving to 'pending'
      if (!profileData.aadhaarUrl) {
        return NextResponse.json({ success: false, error: "Aadhaar Card is required for verification." }, { status: 400 });
      }

      if (profileData.hasFormalCertificate && !profileData.certificateUrl) {
        return NextResponse.json({ success: false, error: "Certificate document is missing." }, { status: 400 });
      }
      
      if (!profileData.hasFormalCertificate && !profileData.experienceLetterUrl) {
        return NextResponse.json({ success: false, error: "Mukhiya Letter / Affidavit is missing." }, { status: 400 });
      }

      // If validation passes, shift the state to pending
      profileData.status = "pending";
    }

    // 4. Update or Create the document
    const savedProfile = await AminProfile.findOneAndUpdate(
      { userId: userId },
      { $set: profileData }, 
      { new: true, upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: actionType === "submitVerification" ? "Submitted for verification!" : "Profile Saved!",
      slug: savedProfile.slug,
      status: savedProfile.status
    });

  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}