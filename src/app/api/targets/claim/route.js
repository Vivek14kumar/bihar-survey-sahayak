import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/app/api/utils/dbConnect";
import User from "@/app/api/models/User";
import DailyTarget from "@/app/api/models/DailyTarget";
import Transaction from "@/app/api/models/Transaction";
import Notification from "@/app/api/models/Notification";

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();
    const { targetId } = await req.json();
    const today = new Date().toISOString().split('T')[0];

    const user = await User.findOne({ email: session.user.email });
    const dailyTarget = await DailyTarget.findOne({ user: user._id, dateString: today });

    if (!dailyTarget) return NextResponse.json({ error: "No targets found for today" }, { status: 404 });

    // Find the specific target item inside the array
    const targetItem = dailyTarget.targets.id(targetId);

    if (!targetItem) return NextResponse.json({ error: "Target not found" }, { status: 404 });
    if (targetItem.isRewardClaimed) return NextResponse.json({ error: "Already claimed" }, { status: 400 });
    if (targetItem.currentProgress < targetItem.targetForm) return NextResponse.json({ error: "Target not met yet" }, { status: 400 });

    // 1. Mark as claimed
    targetItem.isRewardClaimed = true;
    await dailyTarget.save();

    // 2. Add Money to Wallet (Bulletproof Math)
    const currentBalance = Number(user.walletBalance) || 0;
    const rewardAmount = Number(targetItem.cashbackReward) || 0;
    
    user.walletBalance = currentBalance + rewardAmount;
    await user.save();

    // 3. Log the Transaction in the Ledger
    await Transaction.create({
      user: user._id,
      txnId: `RWD-${Date.now().toString().slice(-6)}`,
      type: "CREDIT",
      status: "SUCCESS",
      amount: targetItem.cashbackReward,
      form: `${targetItem.formName} Target Reward`,
      isCredit: true,
      note: "Claimed manual daily target reward"
    });

    // 4. Send Notification
    await Notification.create({
      user: user._id,
      title: "Reward Claimed! 🏆",
      message: `You claimed ₹${targetItem.cashbackReward} for completing your ${targetItem.formName} target!`,
      type: "SUCCESS"
    });

    return NextResponse.json({ success: true, newBalance: user.walletBalance });
  } catch (error) {
    console.error("Claim Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}