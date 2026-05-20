// 1. 🚀 PERFORMANCE WIN: Cache the entire directory for 60 seconds!
// No more "force-dynamic". Zero DB hits for normal visitors.
export const revalidate = 60;

import dbConnect from "@/app/api/utils/dbConnect";
import Amin from "@/app/api/models/AminProfile";
import { Users } from "lucide-react";

// 2. Import your existing Client Component!
import AminSearchGrid from "@/components/AminSearchGrid"; 

export const metadata = {
  title: "Bihar Amin Directory",
  description:
    "Find experienced amin professionals for जमीन मापी, सीमांकन, बंटवारा and survey services across Bihar.",
};

// 3. Remove searchParams entirely from the server function
export default async function AllAminsPage() {
  await dbConnect();

  // Fetch ALL live profiles. We will let the Client Component handle the filtering.
  const aminsData = await Amin.find({
    status: "live",
    isProfilePublished: true,
  })
    .select("-about -rejectionReason")
    .sort({ createdAt: -1 })
    .lean();

  const amins = JSON.parse(JSON.stringify(aminsData));

  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-b from-[#f0f9ff] to-[#f8fafc] py-14 sm:py-20">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/30 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADING ================= */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-cyan-100 shadow-sm text-cyan-700 text-xs font-bold tracking-wider uppercase">
            <Users size={14} />
            Bihar Amin Directory
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            बिहार के उपलब्ध अमीन
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed">
            जमीन मापी, सीमांकन, बंटवारा और सर्वे संबंधित
            सेवाओं के लिए बिहार के अनुभवी अमीन खोजें।
          </p>
        </div>

        {/* ================= INSTANT CLIENT SEARCH & GRID ================= */}
        {/* Pass all the fetched amins into the grid. It will handle the search UI! */}
        <AminSearchGrid initialAmins={amins} />

      </div>
    </section>
  );
}