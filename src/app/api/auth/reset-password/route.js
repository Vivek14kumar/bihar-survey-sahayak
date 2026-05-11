import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import connectDB from "@/app/api/utils/dbConnect";
import User from "@/app/api/models/User";

export async function POST(req) {
  try {
     await connectDB();
    const { token, newPassword } = await req.json();

    // 1. Hash the token from the URL to match what is saved in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find the user with this token, ensuring the token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Checks if expiration date is strictly greater than right now
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired password reset token." }, { status: 400 });
    }

    // 3. Hash the new password securely
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 4. Clear the temporary token fields from the database
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    return NextResponse.json({ message: "Password has been reset successfully." }, { status: 200 });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}