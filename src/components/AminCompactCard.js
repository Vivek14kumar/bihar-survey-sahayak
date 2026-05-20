import React from "react";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

export default function AminCompactCard({ profile }) {
  const initial = profile.ownerNameEn ? profile.ownerNameEn.charAt(0).toUpperCase() : "A";
  
  // Get just the first district
  const mainArea = profile.serviceAreas?.[0] || "Bihar";

  return (
    <Link href={`/amin/${profile.slug}`} className="block h-full group relative">
      {/* Background & Hover Glow */}
      <div className="absolute -inset-[1px] rounded-[20px] bg-gradient-to-br from-cyan-300/20 via-transparent to-blue-300/10 blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

      <div className="relative h-full flex flex-col p-3.5 rounded-[18px] bg-gradient-to-br from-slate-800 to-slate-800/90 border border-white/10 shadow-lg overflow-hidden">
        
        {/* Top: Avatar & Exp */}
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-300 to-sky-400 text-slate-900 flex items-center justify-center text-lg font-black shadow-md">
            {initial}
          </div>
          <div className="bg-white/10 px-2 py-0.5 rounded-md border border-white/5">
            <span className="text-[10px] font-bold text-cyan-200">{profile.experience || 0}+ Yrs</span>
            
          </div>
          
        </div>
        

        {/* Middle: Info */}
        <div className="flex-1">
          <h3 className="text-sm font-black text-white leading-tight line-clamp-1 py-1">
            {profile.ownerNameHi}
          </h3>
          <span className="text-[8px] uppercase tracking-[0.25em] text-slate-300 font-semibold mt-1 ">
                  {profile.ownerNameEn}
                </span>
          <div className="flex items-center gap-1 mt-1.5 text-slate-400">
            <MapPin size={12} className="shrink-0" />
            <span className="text-[11px] capitalize truncate">{mainArea.toLowerCase()}</span>
          </div>

          {profile.registrationNumber && (
            <div className="flex items-center gap-1 mt-1 text-slate-400">
              <ShieldCheck size={12} className="text-cyan-400/80 shrink-0" />
              <span className="text-[10px] font-medium truncate">{profile.registrationNumber}</span>
            </div>
          )}
        </div>

        {/* Bottom: Action (Hidden on default, subtle indicator) */}
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">View</span>
          <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-slate-900 transition-colors">
            <ArrowRight size={12} />
          </div>
        </div>

      </div>
    </Link>
  );
}