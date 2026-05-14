import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../utils/dbConnect";
import User from "../models/User";
import Document from "../models/Document";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const currentUser = await User.findOne({ email: session.user.email });
  if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    // 1. MongoDB Aggregation: Group all documents by user, count them, and sort highest to lowest
    const leaderboardPipeline = await Document.aggregate([
      { $group: { _id: "$user", formCount: { $sum: 1 } } },
      { $sort: { formCount: -1 } },
      { 
        $lookup: { 
          from: "users", 
          localField: "_id", 
          foreignField: "_id", 
          as: "userDetails" 
        } 
      },
      { $unwind: "$userDetails" },
      {
      $project: {
        _id: 1,
        formCount: 1,
        name: "$userDetails.ownerName",
        shopName: "$userDetails.shopName",
        district: "$userDetails.district",
      }
    }
    ]);

    // 2. Extract the Top 2 Shops (Format names for privacy, e.g., "Vivek K.")
    const topShops = leaderboardPipeline.slice(0, 3).map(shop => {
      const displayName = shop.name;
      /*const nameParts = (shop.name || "CSC Operator").split(" ");
      const displayName = nameParts.length > 1 
        ? `${nameParts[0]} ${nameParts[1].charAt(0)}.` 
        : nameParts[0];*/
        
      return {
        id: shop._id.toString(),
        ownerName: displayName,
        shopName: shop.shopName,
        city: shop.district || "Bihar", // Replace with shop.city if you save city data in DB
        count: shop.formCount
      };
    });

    // 3. Calculate Current User's Rank
    const totalUsersWithForms = leaderboardPipeline.length;
    const userIndex = leaderboardPipeline.findIndex(
      op => op._id.toString() === currentUser._id.toString()
    );

    let rankString = "No forms yet";
    if (userIndex !== -1) {
      const rank = userIndex + 1;
      const percentile = Math.ceil((rank / totalUsersWithForms) * 100);
      
      if (rank === 1) rankString = "Rank #1";
      else if (rank <= 3) rankString = `Rank #${rank}`;
      else if (percentile <= 10) rankString = "Top 10%";
      else if (percentile <= 25) rankString = "Top 25%";
      else rankString = `Top ${percentile}%`;
    }

    return NextResponse.json({ 
      topShops, 
      userRank: rankString 
    }, { headers: { 'Cache-Control': 'no-store' } }); // Prevent caching

  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}