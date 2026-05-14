import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../utils/dbConnect";
import User from "../../models/User";
import Transaction from "../../models/Transaction";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json([], { status: 401 });

  await connectDB();
  
  const user = await User.findOne({ email: session.user.email });
  if (!user) return NextResponse.json([]);

  const transactions = await Transaction.find({ user: user._id }).sort({ time: -1 }).lean();

  // Format the data for the frontend
  const formattedTransactions = transactions.map(tx => ({
    id: tx._id.toString(),
    txnId: tx.txnId || "N/A", // The new field
    form: tx.form,
    amount: tx.amount, // Now a number
    isCredit: tx.isCredit,
    type: tx.type || "UNKNOWN",
    status: tx.status || "SUCCESS", // The new field
    time: tx.time.toLocaleString()
  }));

  return NextResponse.json(formattedTransactions);
}