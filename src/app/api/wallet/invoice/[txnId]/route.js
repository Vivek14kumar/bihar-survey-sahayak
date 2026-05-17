import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed
import connectDB from "../../../utils/dbConnect";
import User from "../../../models/User";
import Transaction from "../../../models/Transaction";
import AminProfile from "../../../models/AminProfile";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    // Await params for Next.js 15 compatibility
    const { txnId } = await params;

    await connectDB();

    // 1. Get the requesting user
    const user = await User.findOne({ email: session.user.email }).select("_id").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // 2. Find the specific transaction
    const transaction = await Transaction.findOne({ txnId: txnId }).lean();
    if (!transaction) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    // 3. 🚨 STRICT SECURITY (Anti-IDOR): Ensure the logged-in user OWNS this transaction
    if (transaction.user.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Access Denied. You do not own this invoice." }, { status: 403 });
    }

    // 4. Fetch the Amin Profile to get their business name & address
    const profile = await AminProfile.findOne({ userId: user._id }).lean();

    // 5. Calculate Subscription Start and End Dates based on the transaction time
    const startDate = new Date(transaction.time);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30); // 30-Day Subscription cycle

    // 6. Return formatted secure data
    return NextResponse.json({
      success: true,
      invoice: {
        invoiceNo: `INV-${transaction.txnId.substring(0, 10).toUpperCase()}`,
        transactionId: transaction.txnId,
        orderDate: transaction.time,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        amount: transaction.amount,
        description: transaction.form,
        paymentMethod: transaction.note || "Digital Payment",
        status: transaction.status,
        customerDetails: {
          name: profile?.ownerNameEn || session.user.name || "Valued Amin",
          email: session.user.email,
          phone: profile?.publicMobile || "N/A",
          address: profile?.publicAddress || "N/A",
          regNo: profile?.registrationNumber || "N/A"
        }
      }
    });

  } catch (error) {
    console.error("Invoice Fetch Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}