import dbConnect from "../utils/dbConnect";
import AminProfile from "../models/AminProfile";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, message: "Invalid User ID format" }, { status: 400 });
    }

    // Fetch the profile
    const profile = await AminProfile.findOne({ userId: userId }).lean();

    if (!profile) {
      // Return 200 with null profile so the frontend knows they just need to create a new one
      return NextResponse.json({ success: true, message: "Profile not found", profile: null }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      profile: profile,
    });

  } catch (error) {
    console.error("GET Profile Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}