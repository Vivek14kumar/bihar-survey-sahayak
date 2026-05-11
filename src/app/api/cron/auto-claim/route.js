import { NextResponse } from "next/server";
import dbConnect from "@/app/api/utils/dbConnect";
import User from "@/app/api/models/User";
import DailyTarget from "@/app/api/models/DailyTarget";
import Transaction from "@/app/api/models/Transaction";
import Notification from "@/app/api/models/Notification";

export async function GET(req) {
  // Security Check: Make sure only YOUR cron job can trigger this, not random internet users.
  // Set CRON_SECRET in your .env file
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await dbConnect();
    // Get today's date in India Standard Time
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); 
    
    // Find ALL target documents from today where at least one target isn't claimed
    const targetsToProcess = await DailyTarget.find({ dateString: today });
    let totalProcessed = 0;

    for (let targetDoc of targetsToProcess) {
      let docUpdated = false;
      let totalRewardForUser = 0;

      for (let targetItem of targetDoc.targets) {
        // If they met the target, but forgot to claim it
        if (targetItem.currentProgress >= targetItem.targetForm && !targetItem.isRewardClaimed) {
          targetItem.isRewardClaimed = true;
          totalRewardForUser += targetItem.cashbackReward;
          docUpdated = true;
        }
      }

      if (docUpdated && totalRewardForUser > 0) {
        await targetDoc.save();
        
        const user = await User.findById(targetDoc.user);
        if (user) {
          user.walletBalance += totalRewardForUser;
          await user.save();

          await Transaction.create({
            user: user._id,
            txnId: `AUTO-${Date.now().toString().slice(-6)}`,
            type: "CREDIT",
            status: "SUCCESS",
            amount: totalRewardForUser,
            form: "System Auto-Claim",
            isCredit: true,
            note: "System automatically claimed missed rewards at end of day."
          });

          await Notification.create({
            user: user._id,
            title: "Rewards Auto-Claimed! 🌙",
            message: `You forgot to claim your targets yesterday, but we got you covered! ₹${totalRewardForUser} was added to your wallet.`,
            type: "SUCCESS"
          });
          
          totalProcessed++;
        }
      }
    }

    return NextResponse.json({ success: true, processedUsers: totalProcessed });
  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}