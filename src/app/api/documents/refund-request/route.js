import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../utils/dbConnect";
import Document from "../../models/Document";

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const { docId } = await req.json();

    // Update the document status to REFUND_REQUESTED
    const updatedDoc = await Document.findByIdAndUpdate(
      docId, 
      { $set: { status: "REFUND_REQUESTED" } },
      { new: true }
    );

    if (!updatedDoc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Refund Request Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

