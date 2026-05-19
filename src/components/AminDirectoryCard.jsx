import React from "react";
import {
  MapPin,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

const AminDirectoryCard = ({ profile }) => {
  // Render only if profile is live
  if (!profile || profile.status !== "live") return null;
  //console.log("What is my frontend receiving?", profile);
  // Active services
  const activeServices = Object.keys(profile.services || {})
    .filter((key) => profile.services[key])
    .map((service) => {
      const names = {
        landMeasure: "जमीन मापी",
        demarcation: "सीमांकन",
        partition: "बंटवारा",
        surveyHelp: "सर्वे सहायता",
      };

      return names[service] || service;
    });

  // Monogram letter
  const initial = profile.ownerNameEn
    ? profile.ownerNameEn.charAt(0).toUpperCase()
    : "A";

  return (
    <div className="group relative w-full max-w-sm">
      
      {/* Soft Premium Glow */}
      <div className="absolute -inset-[1px] rounded-[30px] bg-gradient-to-br from-cyan-300/20 via-transparent to-blue-300/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>

      {/* Main Card */}
      <div
        className="
        relative overflow-hidden rounded-[28px]
        
        bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800
        text-white shadow-2xl
        backdrop-blur-xl
        transition-all duration-500
        hover:-translate-y-2
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
      "
      >
        {/* Premium Top Accent */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400"></div>

        {/* Background Soft Circles */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-cyan-200/10 blur-3xl"></div>

        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-blue-200/10 blur-3xl"></div>

        {/* Watermark Initial */}
        <div className="absolute right-4 bottom-3 text-[90px] font-black text-white/[0.03] pointer-events-none select-none">
          {initial}
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              
              {/* Monogram */}
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-300 to-sky-400 text-slate-900 flex items-center justify-center text-2xl font-black shadow-xl border border-white/20">
                  {initial}
                </div>

                {/* Verified Badge 
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-sky-400 border-2 border-slate-800 flex items-center justify-center">
                  <BadgeCheck size={12} className="text-white" />
                </div>*/}
              </div>

              {/* Name Section */}
              <div>
                <h2 className="text-2xl font-black leading-tight tracking-tight text-white">
                  {profile.ownerNameHi}
                </h2>

                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300 font-semibold mt-1">
                  {profile.ownerNameEn}
                </p>

                {/* Registration Number */}
                {profile.registrationNumber && (
                  <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
                    <ShieldCheck size={13} className="text-cyan-200" />

                    <span className="text-[11px] font-semibold tracking-wide text-slate-100">
                      {profile.registrationNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"></div>

          {/* Experience + Area */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Experience */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-cyan-200" />

                <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Experience
                </span>
              </div>

              <h3 className="text-3xl font-black text-white leading-none">
                {profile.experience || 0}+
              </h3>

              <p className="text-xs text-slate-300 mt-1">
                Years
              </p>
            </div>

            {/* Service Areas */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
              
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-cyan-200" />

                <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
                  Area
                </span>
              </div>

              <p className="text-sm text-slate-100 leading-relaxed line-clamp-2 capitalize">
                {profile.serviceAreas
                  ?.slice(0, 2)
                  .map((area) => area.toLowerCase())
                  .join(", ")}
              </p>

              {profile.serviceAreas?.length > 2 && (
                <span className="text-[11px] text-cyan-200 font-medium">
                  +{profile.serviceAreas.length - 2} more areas
                </span>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[1px] flex-1 bg-white/10"></div>

              <span className="text-[11px] uppercase tracking-[0.25em] text-slate-300 font-bold">
                Services
              </span>

              <div className="h-[1px] flex-1 bg-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {activeServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm"
                >
                  <CheckCircle2
                    size={15}
                    className="text-cyan-200 shrink-0"
                  />

                  <span className="text-xs font-medium text-slate-100 truncate">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-7 flex items-center gap-3">
            
            {/* Call Button 
            <a
              href={`tel:${profile.mobile}`}
              className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition"
            >
              <PhoneCall size={18} className="text-white" />
            </a>*/}

            {/* View Profile */}
            <a
              href={`/amin/${profile.slug}`}
              className="group/btn flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 px-5 py-4 text-sm font-bold text-slate-900 shadow-lg hover:shadow-cyan-400/30 transition-all"
            >
              View Full Profile

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </a>
          </div>

          {/* Bottom Branding 
          <div className="mt-5 flex items-center justify-between text-[10px] text-slate-300">
            <span className="tracking-widest uppercase">
              Bihar Survey Expert
            </span>

            <span className="text-cyan-200 font-semibold">
              Premium Profile
            </span>
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default AminDirectoryCard;