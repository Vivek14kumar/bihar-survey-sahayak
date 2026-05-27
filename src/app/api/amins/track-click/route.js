import { NextResponse } from "next/server";
import dbConnect from "../../utils/dbConnect";
import AminProfile from "../../models/AminProfile";

export async function POST(req) {
  try {
    await dbConnect();

    const { slug, type } = await req.json();

    if (!slug || !type) {
      return NextResponse.json(
        { success: false, error: "Missing slug or type" },
        { status: 400 }
      );
    }

    // Use .toLowerCase() so it works whether the frontend sends "whatsapp" or "whatsApp"
    const updateField =
      type.toLowerCase() === "whatsapp"
        ? { $inc: { whatsAppClicks: 1 } } // MATCH THE SCHEMA EXACTLY: capital A
        : { $inc: { callClicks: 1 } };

    await AminProfile.updateOne(
      { slug },
      updateField
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}