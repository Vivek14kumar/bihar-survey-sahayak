import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();

  try {
    // App Router: Parse the body using req.json()
    const body = await req.json();
    const { 
      userType, ownerName, shopName, mobileNumber, 
      email, password, address, district, block, pincode 
    } = body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or mobile already exists.' }, 
        { status: 400 }
      );
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate User ID
    const prefix = userType === "normal" ? "BSS-USER" : "BSS-OP";
    const random6Digit = Math.floor(100000 + Math.random() * 900000);
    const generatedUserId = `${prefix}-${random6Digit}`;

    // 4. Save to Database
    const newUser = await User.create({
      userId: generatedUserId,
      userType: userType || 'normal',
      ownerName,
      shopName: shopName || "",
      mobileNumber,
      email,
      password: hashedPassword,
      address,
      district,
      block,
      pincode,
      walletBalance: 0
    });

    // 5. Return Success
    return NextResponse.json(
      { message: 'Account created successfully!', generatedId: generatedUserId }, 
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: 'Internal Server Error', errorDetail: error.message }, 
      { status: 500 }
    );
  }
}