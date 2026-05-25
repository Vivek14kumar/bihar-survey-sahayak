// components/HomePageAminsSection.js
// ✅ Server Component

import dbConnect from "@/app/api/utils/dbConnect";
import Amin from "@/app/api/models/AminProfile";
import AminSearchGrid from "./AminSearchGrid"; // Import client wrapper
import { Sparkles } from "lucide-react";
import Link from "next/link";


export default async function HomePageAminsSection() {
  await dbConnect();

  const aminsData = await Amin.aggregate([
    { $match: { status: "live", isProfilePublished: true } },
    { $sample: { size: 8 } }, // Fetch 8 sample cards to give filters room to breathe
    { $project: { about: 0, rejectionReason: 0 } }
  ]);

  const amins = JSON.parse(JSON.stringify(aminsData));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f9ff] to-[#f8fafc] py-16 sm:py-20">
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-200/30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-200/30 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADING */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-cyan-100 shadow-sm text-cyan-700 text-xs font-bold tracking-wider uppercase">
            <Sparkles size={14} />
            अपने क्षेत्र के अमीन से संपर्क करें
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            उपलब्ध अमीन 
          </h2>
        </div>

        {/* INTERACTIVE SEARCH & GRID SYSTEM */}
        <AminSearchGrid initialAmins={amins} />
        
        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/amins"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white font-bold shadow-xl hover:scale-105 transition-all"
          >
            सभी अमीन देखें
          </Link>
        </div>
        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex  items-center gap-2 mt-6 text-lg font-semibold text-slate-800 hover:text-blue-600 transition-colors duration-300"
          >
             अपनी Amin Service को हजारों लोगों तक पहुँचाएं — <spam className=" text-indigo-500 p-1 rounded-xl">अभी जुड़ें</spam>
          </Link>
        </div>
      </div>
    </section>
  );
}