import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../utils/dbConnect";
import Document from "../../models/Document";

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    
    // Extract docId and the new reason sent from the frontend
    const { docId, reason } = await req.json();

    if (!docId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update the document status to REFUND_REQUESTED and store the reason
    const updatedDoc = await Document.findByIdAndUpdate(
      docId, 
      { 
        $set: { 
          status: "REFUND_REQUESTED",
          refundReason: reason // Saves the selected/typed reason here
        } 
      },
      { new: true }
    );

    if (!updatedDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, doc: updatedDoc });
  } catch (error) {
    console.error("Refund Request Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}