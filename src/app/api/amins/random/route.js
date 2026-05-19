import { NextResponse } from "next/server";
// Import your database connection and Mongoose model
import dbConnect from "../../utils"; 
import Amin from "../../models/AminProfile";

// PERFORMANCE HACK: Cache this route for 60 seconds.
// It will serve the same random 6 cards for a minute, saving heavy database hits.
export const revalidate = 60; 

export async function GET(request) {
  try {
    await dbConnect();

    // Grab the limit from the URL (e.g., /api/amins/random?limit=6) or default to 6
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 6;

    // The $sample aggregation is the fastest way to get random documents in MongoDB
    const randomAmins = await Amin.aggregate([
      // Step 1: Only pick profiles that are live
      { $match: { status: "live" } },
      
      // Step 2: Randomly select the specified number of documents
      { $sample: { size: limit } }
    ]);

    // Convert MongoDB ObjectIds to strings so React doesn't throw serialization errors
    const serializedAmins = randomAmins.map((amin) => ({
      ...amin,
      _id: amin._id.toString(),
      userId: amin.userId ? amin.userId.toString() : null,
    }));

    return NextResponse.json({ success: true, data: serializedAmins });

  } catch (error) {
    console.error("Error fetching random Amins:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}