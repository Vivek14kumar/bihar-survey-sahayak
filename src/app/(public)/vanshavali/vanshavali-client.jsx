"use client";

import Vanshavali from "@/components/Vanshavali";
import VanshawaliTutorial from "@/components/VanshawaliTutorial";
import { motion } from "framer-motion";

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