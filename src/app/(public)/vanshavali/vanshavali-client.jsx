"use client";

import Link from "next/link";
import Vanshavali from "@/components/Vanshavali";
import VanshawaliTutorial from "@/components/VanshawaliTutorial";
import { motion } from "framer-motion";
import { ArrowRight, FileSignature,ImagePlus, Sparkles } from "lucide-react"; 
export default function VanshavaliClient() {
  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 md:px-12 bg-slate-50 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            वंशावली जनरेटर
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            अपने विवरण दर्ज करें और एक क्लिक में आधिकारिक प्रारूप में पीडीएफ डाउनलोड करें।
          </p>
        </div>
        
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-2 px-4 max-w-6xl mx-auto"
>

  {/* ================= Manual Builder ================= */}
  <Link href="/vanshavali-manual" className="relative block">

    <span className="absolute -top-2 -right-2 z-10 flex h-5 items-center rounded-full bg-red-600 px-2.5 text-[10px] font-bold text-white shadow-md animate-bounce border border-white">
      NEW
    </span>

    <button className="group w-full flex flex-col items-center justify-center px-6 py-4 text-white transition-all duration-300 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] hover:bg-right rounded-xl shadow-lg hover:shadow-emerald-400/40 hover:-translate-y-1">

      <div className="flex items-center gap-2 font-bold">

        <FileSignature
          size={22}
          className="group-hover:rotate-6 transition-transform"
        />

        <span className="text-base">
          अपना वंशावली ट्री खुद बनाएं और मुखिया/सरपंच से ह० एवं मुहर 
        </span>

      </div>

      <p className="text-xs text-emerald-100 mt-2 text-center">
        अपनी आवश्यकता अनुसार बॉक्स जोड़ें, मुखिया/सरपंच कार्य के लिए उपयुक्त।
      </p>

      <div className="mt-3 flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full">
        Click Here
        <ArrowRight size={13}/>
      </div>

    </button>

  </Link>

  {/* ================= Photo Builder ================= */}

  <Link href="/vanshavali-photo" className="relative block">

    <span className="absolute -top-2 -right-2 z-10 flex h-5 items-center rounded-full bg-orange-500 px-2.5 text-[10px] font-bold text-white shadow-md animate-pulse border border-white">
      🔥 HOT
    </span>

    <button className="group w-full flex flex-col items-center justify-center px-6 py-4 text-white transition-all duration-300 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-600 bg-[length:200%_auto] hover:bg-right rounded-xl shadow-lg hover:shadow-fuchsia-400/40 hover:-translate-y-1">

      <div className="flex items-center gap-2 font-bold">

        <ImagePlus
          size={22}
          className="group-hover:scale-110 transition-transform"
        />

        <span className="text-base">
          फोटो वाली वंशावली बनाएं
        </span>

      </div>

      <p className="text-xs text-purple-100 mt-2 text-center">
        अपने परिवार के सदस्यों की फोटो के साथ प्रोफेशनल वंशवृक्ष डिज़ाइन करें।
      </p>

      <div className="mt-3 flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full">
        Try Now
        <ArrowRight size={13}/>
      </div>

    </button>

  </Link>

</motion.div>

        {/* Tutorial Video */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl p-2 sm:p-2 mb-10"
        >
           <Vanshavali />
          <VanshawaliTutorial />
        </motion.div>

        {/* The Tool */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6 sm:p-8"
        >
         
        </motion.div>
        
      </div>
    </main>
  );
}