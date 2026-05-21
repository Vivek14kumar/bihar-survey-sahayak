import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; // Update path if needed
import dbConnect from "../../utils/dbConnect"; // Update path if needed
import User from "../../models/User"; // Update path if needed

export async function POST(request) {
  try {
    // 1. Verify the user is actually logged in
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    await dbConnect();

    // 2. Get the Mongo _id directly from the secure server session
    const mongoUserId = session.user.id;

    // 3. Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      mongoUserId,
      { acceptedDeclaration: true },
      { new: true } 
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found in database." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Terms accepted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error accepting terms:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}