"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16 sm:py-24 "
    >
      {/* Background Image - Restored & Responsive */}
      <div className="absolute inset-0 -z-30">
        
        {/* Desktop Image (Hidden on mobile, block on md screens and up) */}
        <Image
          src="/images/bg-survey1.png"
          alt="Bihar Survey Background Desktop"
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-cover object-center"
        />

        {/* Mobile Image 9:16 (Block on mobile, hidden on md screens and up) */}
        <Image
          src="/images/bg-survey1-mobile.png" 
          alt="Bihar Survey Background Mobile"
          fill
          priority
          sizes="100vw"
          className="block md:hidden object-cover object-center"
        />

        {/* Very subtle dark overlay to help the glass panel pop */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Floating Shapes */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-4 sm:left-12 w-12 h-12 sm:w-20 sm:h-20 bg-white/30 rounded-full backdrop-blur-md shadow-lg border border-white/40"
      />

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-24 right-4 sm:right-12 w-16 h-16 sm:w-24 sm:h-24 bg-white/30 rounded-full backdrop-blur-md shadow-lg border border-white/40"
      />

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-5xl mx-auto text-center "
      >
        {/* Glassmorphism Card for Readability over Image */}
        <div className=" backdrop-blur-[3px] rounded-3xl sm:rounded-[2.5rem] sm:p-10 p-4 border border-white/50 shadow-2xl">
          
          {/* Badge */}
          <div
            className="inline-flex items-center justify-center gap-2 mb-6 sm:mb-8 
            px-4 sm:px-5 py-2 rounded-full
            bg-yellow-400 text-black text-[11px] sm:text-sm
            font-bold shadow-md font-[var(--font-hind)]"
          >
            🔥 2026 नया अपडेट
          </div>

          {/* Heading */}
          <h1
            className="font-[var(--font-teko)]
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl
            leading-[1.1] sm:leading-[1.2] tracking-wide
            text-gray-900 font-bold drop-shadow-sm"
          >
            बिहार भूमि सर्वे सहायता प्लेटफॉर्म 2026
          </h1>

          {/* Subtext */}
          <p
            className="mt-4 sm:mt-6 max-w-2xl mx-auto
            text-sm sm:text-lg md:text-xl
            leading-relaxed text-gray-800 font-semibold
            font-[var(--font-hindi)]"
          >
            वंशावली, प्रपत्र, बंटवारा, शपथ पत्र, सर्वे सहायता और जमीन से जुड़ी सभी जरूरी सेवाएं — अब ऑनलाइन।
          </p>

          {/* CTA Buttons - Fully Responsive Stack */}
          <div
            className="mt-8 sm:mt-10 flex flex-col lg:flex-row
            items-center justify-center gap-4 sm:gap-5 w-full"
          >
            <a
              href="#tool"
              className="w-full lg:w-auto flex-1
              bg-gradient-to-r from-emerald-500 to-green-600
              text-white font-bold
              px-6 sm:px-8 py-4
              rounded-xl sm:rounded-2xl
              shadow-[0_8px_20px_rgba(16,185,129,0.3)]
              hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(16,185,129,0.5)]
              transition-all duration-300
              font-[var(--font-hind)] text-base sm:text-lg text-center"
            >
              अभी वंशावली बनाएं
            </a>

            <a
              href="/prapatra-2"
              className="w-full lg:w-auto flex-1
              bg-white/90 backdrop-blur-sm
              text-emerald-700 font-bold
              px-6 sm:px-8 py-4
              rounded-xl sm:rounded-2xl border-2 border-emerald-200
              shadow-md hover:-translate-y-1 hover:bg-white
              transition-all duration-300
              font-[var(--font-hind)] text-base sm:text-lg text-center"
            >
              प्रपत्र-2 भरें →
            </a>

            <a
              href="/batwara-application-bihar"
              className="w-full lg:w-auto flex-1
              bg-gradient-to-r from-emerald-500 to-green-600
              text-white font-bold
              px-6 sm:px-8 py-4
              rounded-xl sm:rounded-2xl
              shadow-[0_8px_20px_rgba(16,185,129,0.3)]
              hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(16,185,129,0.5)]
              transition-all duration-300
              font-[var(--font-hind)] text-base sm:text-lg text-center"
            >
              अभी बंटवारा पत्र बनाएं
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 sm:mt-8 px-2 sm:px-4">
          <p className="mx-auto max-w-5xl text-sm font-medium text-gray-200 border border-slate-600/50 rounded-xl p-2 sm:p-4 bg-slate-900/70 backdrop-blur-md shadow-lg">
            यह एक निजी नागरिक सहायता टूल है। यह कोई सरकारी वेबसाइट नहीं है। 
            उपयोगकर्ता सभी विवरण अपने स्थानीय सर्वे शिविर (अमीन / पर्यवेक्षक) से सत्यापित करें।
          </p>
        </div>

      </motion.div>
    </section>
  );
}