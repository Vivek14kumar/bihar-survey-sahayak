"use client";

import Link from "next/link";
import Vanshavali from "@/components/Vanshavali";
import VanshawaliTutorial from "@/components/VanshawaliTutorial";
import { motion } from "framer-motion";
import { ArrowRight, FileSignature } from "lucide-react"; 
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
        
        {/* 🌟 नया सेक्शन: कॉम्पैक्ट और आकर्षक बटन 🌟 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8 mt-2 w-full px-4"
        >
          <Link href="/vanshavali-manual" className="w-full sm:w-auto relative block">
            
            {/* छोटा बाउंस करता 'नया' बैज */}
            <span className="absolute -top-2.5 -right-2 z-10 flex h-5 items-center rounded-full bg-red-600 px-2.5 text-[10px] font-bold text-white shadow-md animate-bounce border border-white">
              NEW
            </span>

            <button className="group relative w-full sm:w-auto flex flex-col items-center justify-center px-6 py-2.5 text-white transition-all duration-300 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-[length:200%_auto] hover:bg-right border border-transparent rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 focus:outline-none">
              
              {/* Main Heading & Icon in one line */}
              <div className="flex items-center gap-2 font-bold">
               
                <FileSignature size={18} className="text-emerald-50" />
                <span className="text-sm md:text-base drop-shadow-sm">
                  अपना वंशावली ट्री (वंशवृक्ष) खुद बनाएं
                </span>
                {/* छोटा "Click Here" जो उसी लाइन में दिखेगा */}
                <span className="hidden sm:flex items-center bg-white/20 px-2 py-0.5 rounded-md text-[9px] uppercase tracking-wide ml-1 group-hover:bg-white/30 transition-colors">
                  Click Here
                </span>
              </div>

              {/* Subtext - very compact */}
              <span className="text-[10px] sm:text-[11px] font-medium text-emerald-100/90 mt-0.5">
                (अपनी जरूरत के अनुसार बॉक्स जोड़कर डिज़ाइन तैयार करें) अगर वंशवृक्ष बड़ी है 
              </span>

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