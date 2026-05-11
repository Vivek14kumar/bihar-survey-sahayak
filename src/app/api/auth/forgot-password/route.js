import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
// Import your database connection and User model
import connectDB from "@/app/api/utils/dbConnect";
import User from "@/app/api/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { identifier } = await req.json();

    // 1. Find the operator by email, mobile, or userId
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { mobileNumber: identifier },
        { userId: identifier }
      ]
    });

    if (!user) {
      // NEW: Tells the frontend to show an error
      return NextResponse.json({ error: "No account found with these details. Please check your spelling or register a new account." }, { status: 400 });
    }

    if (!user.email) {
      return NextResponse.json({ error: "No email registered for this account." }, { status: 400 });
    }

    // 2. Generate a secure, random 40-character token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 3. Save the token and an expiration time (15 minutes from now) to the database
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 Minutes
    await user.save();

    // 4. Create the password reset link
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    // 5. Configure Nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 6. Draft the email
    const message = `
      You are receiving this email because a password reset was requested for your Bihar Survey Sahayak account.
      
      Please click on the following link, or paste it into your browser to complete the process:
      ${resetUrl}

      This link will expire in 15 minutes.
      
      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    // 7. Send the email
    await transporter.sendMail({
      from: `"Bihar Survey Sahayak" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ error: "Email could not be sent" }, { status: 500 });
  }
}