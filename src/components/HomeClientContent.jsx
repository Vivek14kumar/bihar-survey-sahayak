// src/components/HomeClientContent.jsx
"use client";

import Link from "next/link";
import { FileText, Languages, MoveRight, CheckCircle, Wallet, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeClientContent() {
  return (
    <>
      {/* ================= FEATURES ================= */}
      {/* ================= FEATURES ================= */}
<section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 -mt-4 relative z-10">

  {/* Section Heading 
  <div className="text-center mb-10">
    
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold tracking-wider uppercase border border-cyan-100">
      Trusted Features
    </span>
  </div>*/}

  {/* Cards */}
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

    {[
      {
        icon: <ShieldCheck size={28} className="text-white" />,
        title: "लोकल डेटा सुरक्षा",
        desc: "आपका डेटा केवल आपके डिवाइस में सुरक्षित रहता है।",
        color: "from-violet-500 via-indigo-500 to-blue-500",
        glow: "from-violet-400/30 to-blue-400/20",
      },
      {
        icon: <FileText size={28} className="text-white" />,
        title: "तुरंत PDF डाउनलोड",
        desc: "एक क्लिक में आधिकारिक प्रारूप PDF डाउनलोड करें।",
        color: "from-emerald-400 via-green-500 to-teal-500",
        glow: "from-emerald-400/30 to-teal-400/20",
      },
      {
        icon: <Languages size={28} className="text-white" />,
        title: "हिंदी टाइपिंग सपोर्ट",
        desc: "आसान हिंदी टाइपिंग और ऑटो टेक्स्ट फॉर्मेट।",
        color: "from-pink-500 via-rose-500 to-orange-400",
        glow: "from-pink-400/30 to-orange-300/20",
      },
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: i * 0.15 }}
        viewport={{ once: true }}
        className="group relative"
      >

        {/* Glow */}
        <div
          className={`absolute -inset-[1px] rounded-[28px] bg-gradient-to-br ${item.glow} blur-2xl opacity-0 group-hover:opacity-100 transition duration-700`}
        ></div>

        {/* Card */}
        <div
          className="
          relative overflow-hidden
          rounded-[28px]
          border border-white/40
          bg-white/70
          backdrop-blur-2xl
          p-6 sm:p-7
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]
          hover:-translate-y-2
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          transition-all duration-500
          min-h-[260px]
          flex flex-col
        "
        >

          {/* Background Gradient Orb */}
          <div
            className={`absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-3xl`}
          ></div>

          {/* Top Icon */}
          <div
            className={`
            relative z-10
            w-16 h-16 rounded-2xl
            bg-gradient-to-br ${item.color}
            flex items-center justify-center
            shadow-lg
            group-hover:scale-110
            transition-transform duration-500
          `}
          >
            {item.icon}
          </div>

          {/* Content */}
          <div className="relative z-10 mt-6 flex-1">

            <h3 className="text-xl font-black text-slate-900 leading-snug">
              {item.title}
            </h3>

            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              {item.desc}
            </p>
          </div>

          {/* Bottom Accent */}
          <div className="relative z-10 mt-6 flex items-center gap-2 text-sm font-semibold text-slate-700">
            
            <div
              className={`w-8 h-1 rounded-full bg-gradient-to-r ${item.color}`}
            ></div>

            <span>Premium Feature</span>
          </div>

          {/* Hover Shine */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none">
            <div className="absolute -left-20 top-0 h-full w-20 rotate-12 bg-white/30 blur-2xl"></div>
          </div>
        </div>
      </motion.div>
    ))}

    
  </div>
  <header className="mt-8 bg-gradient-to-r from-indigo-700 via-blue-600 to-emerald-600 text-white p-6 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Users size={120} />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md inline-flex self-start">
              <Users size={32} className="text-yellow-300" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-3xl font-extrabold tracking-tight">
                बिहार भूमि सर्वेक्षण वंशावली <span className="text-yellow-300">2026</span> एवं सादा वंशावली
              </h1>
              <h2 className="text-sm sm:text-base font-medium text-emerald-50 mt-1 flex items-center gap-2">
                Online Vanshawali Maker & Family Tree Generator for Bihar Land Survey
              </h2>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-start gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider">Official 2026 Format</span>
            </div>
            <Link href="/vanshavali" className="flex w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-6 rounded-2xl font-bold text-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
              वंशावली बनाएं ➔  
            </Link>
          </div>
        </div>
  </header>
</section>
    </>
  );
}