import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";
import AminProfile from "../../models/AminProfile";
import Transaction from "../../models/Transaction"; // <-- Import your Transaction model

export async function POST(req) {
  await dbConnect();
  
  try {
    const { userId } = await req.json();
    const SUBSCRIPTION_COST = 199;

    const user = await User.findById(userId);
    if (!user || user.walletBalance < SUBSCRIPTION_COST) {
      return Response.json({ success: false, error: "Insufficient wallet balance." }, { status: 400 });
    }

    const profile = await AminProfile.findOne({ userId });
    if (!profile) return Response.json({ success: false, error: "Profile not found" }, { status: 404 });

    let newExpiryDate = new Date();
    if (profile.subscriptionEndsAt && profile.subscriptionEndsAt > new Date()) {
      newExpiryDate = new Date(profile.subscriptionEndsAt);
      newExpiryDate.setDate(newExpiryDate.getDate() + 30);
    } else {
      newExpiryDate.setDate(new Date().getDate() + 30);
    }

    // A. Deduct balance
    user.walletBalance -= SUBSCRIPTION_COST;
    await user.save();

    // B. Create Transaction Record (Strictly matching your schema)
    await Transaction.create({
      user: userId,
      txnId: `SUB_WAL_${Date.now()}`,
      type: 'DEBIT',             // MUST match enum ['CREDIT', 'DEBIT', 'REFUND']
      status: 'SUCCESS',
      amount: SUBSCRIPTION_COST, // 199 as a Number
      form: 'Profile Subscription (30 Days) - Paid via Wallet', 
      isCredit: false            // Triggers your frontend debit filters
    });

    // C. Update Profile
    await AminProfile.findOneAndUpdate(
      { userId: userId },
      { $set: { status: 'live', hasPaid: true, subscriptionEndsAt: newExpiryDate } }
    );

    return Response.json({ success: true, message: "Paid via Wallet!" });

  } catch (err) {
    return Response.json({ success: false, error: "Server error" }, { status: 500 });
  }
}