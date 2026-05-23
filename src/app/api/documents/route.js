import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../utils/dbConnect";
import User from "../models/User";
import Document from "../models/Document";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json([], { status: 401 });

  await connectDB();
  
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json([]);

  const docs = await Document.find({ user: user._id }).sort({ date: -1 }).lean();

  const formattedDocs = docs.map(doc => ({
    id: doc._id.toString(),
    title: doc.title,
    clientName: doc.clientName || "Unknown Client",
    clientMobile: doc.clientMobile || "N/A",
    cost: doc.cost || "N/A",
    ref: doc.ref,
    txnId: doc.txnId || "N/A",
    status: doc.status || "COMPLETED",
    adminMessage: doc.adminMessage,
    date: doc.date.toLocaleDateString('en-IN',{day: 'numeric', month: 'short', year: 'numeric',hour: '2-digit', minute: '2-digit'})
  }));

  return NextResponse.json(formattedDocs);
}