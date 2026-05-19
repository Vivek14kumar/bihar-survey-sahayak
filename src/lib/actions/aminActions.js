// src/lib/actions/aminActions.js (Adjust path based on your project)
import mongoose from "mongoose";
// Import your database connection and Amin model here
import dbConnect from "@/app/api/utils/dbConnect";
import AminProfile from "../../app/api/models/AminProfile"; 

export async function getLiveAminProfilesForSitemap() {
  try {
    await dbConnect(); // Ensure DB is connected

    //
    // Only fetch Amins who are live and published
    // We only select 'slug' and 'updatedAt' because that's all the sitemap needs.
    const liveAmins = await AminProfile.find(
      { 
        status: "live", 
        isProfilePublished: true 
      },
      { slug: 1, updatedAt: 1, _id: 0 } // Projection: Fetch only what we need
    ).lean(); // .lean() makes it a plain JS object, which is faster

    return liveAmins;
  } catch (error) {
    console.error("Failed to fetch Amin profiles for sitemap:", error);
    return []; // Return empty array so the rest of the sitemap doesn't break if DB fails
  }
}