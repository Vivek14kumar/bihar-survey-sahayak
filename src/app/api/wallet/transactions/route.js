import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../utils/dbConnect";
import User from "../../models/User";
import Transaction from "../../models/Transaction";

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const txFilter = searchParams.get("type") || "ALL";
    const dateFilter = searchParams.get("date") || "ALL";

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email }).select("_id").lean();
    if (!user) return NextResponse.json({ data: [], hasMore: false });

    // --- Build the Database Query ---
    let query = { user: user._id };

    // 1. Apply Type Filters
    if (txFilter === "REWARD") {
      query.$or = [{ form: /reward/i }, { note: /auto-claim/i }];
    } else if (txFilter === "REFUND") {
      query.$or = [{ form: /refund/i }, { note: /refund/i }];
    } else if (txFilter === "CREDIT") {
      query.isCredit = true;
      query.form = { $not: /reward|refund/i };
      query.note = { $not: /auto-claim|refund/i };
    } else if (txFilter === "DEBIT") {
      query.isCredit = false;
    }

    // 2. Apply Date Filters
    const now = new Date();
    if (dateFilter === "TODAY") {
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      query.time = { $gte: startOfToday };
    } else if (dateFilter === "WEEK") {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      query.time = { $gte: lastWeek };
    } else if (dateFilter === "MONTH") {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      query.time = { $gte: lastMonth };
    }

    // --- Execute Pagination ---
    const skip = (page - 1) * limit;

    const [transactions, totalCount] = await Promise.all([
      Transaction.find(query).sort({ time: -1 }).skip(skip).limit(limit).lean(),
      Transaction.countDocuments(query)
    ]);

    const formattedTransactions = transactions.map(tx => ({
      id: tx._id.toString(),
      txnId: tx.txnId || "N/A",
      form: tx.form,
      amount: tx.amount,
      isCredit: tx.isCredit,
      type: tx.type || "UNKNOWN",
      status: tx.status || "SUCCESS",
      time: tx.time instanceof Date ? tx.time.toISOString() : tx.time
    }));

    // Return the data AND a boolean telling the frontend if there are more pages
    return NextResponse.json({
      data: formattedTransactions,
      hasMore: skip + formattedTransactions.length < totalCount
    });

  } catch (error) {
    console.error("Pagination error:", error);
    return NextResponse.json({ data: [], error: "Server Error" }, { status: 500 });
  }
}