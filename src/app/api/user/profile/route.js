import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../utils/dbConnect";
import User from "../../models/User";

// GET: Fetch the user profile
export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  
  const user = await User.findOne({ email: session.user.email }).select("-password");
  
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}

// PUT: Update the user profile
export async function PUT(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updateData = await req.json();

  await connectDB();

  try {
    // Only extract the fields we want to allow the user to change
    const { ownerName, shopName, mobileNumber, address, district, block, pincode } = updateData;

    // Find the user and update their details
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        $set: { 
          ownerName, 
          shopName, 
          mobileNumber, 
          address, 
          district,
          block, 
          pincode 
        } 
      },
      { new: true } // Return the updated document
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}