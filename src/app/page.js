"use client";

import Vanshavali from "@/components/Vanshavali";
import { ShieldCheck, FileText, Languages, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import FAQClient from "./faq/FAQClient";
import VanshawaliTutorial from "@/components/VanshawaliTutorial";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import DistrictSection from "@/components/DistrictSection";

export default function Home() {
  return (
    <main className="relative pb-32">

      {/* ================= HERO ================= */}
<section className="relative pt-32 pb-44 px-4 sm:px-6 md:px-12 text-center overflow-hidden">

  {/* Animated Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-blue-700 to-violet-700 -z-20" />

  {/* Glow Effect */}
  <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
  bg-purple-500 opacity-30 blur-[120px] rounded-full -z-10" />

  {/* Floating Circles */}
  <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse" />
  <div className="absolute bottom-20 right-10 w-28 h-28 bg-white/10 rounded-full animate-bounce" />

  {/* Glass Card */}
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="max-w-5xl mx-auto backdrop-blur-2xl bg-white/10 
    border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl"
  >

    {/* Badge */}
    <div className="inline-block mb-6 px-4 py-1 bg-yellow-400 text-black font-bold rounded-full text-sm shadow-md">
      🔥 2026 नया अपडेट
    </div>

    {/* Heading */}
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
      बिहार भूमि सर्वे 2026
      <br />
      <span className="bg-gradient-to-r from-yellow-300 via-emerald-300 to-cyan-300 
      bg-clip-text text-transparent animate-pulse">
        वंशावली निर्माण ऑनलाइन
      </span>
    </h1>

    {/* Sub Text */}
    <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
      अब बिना परेशानी और बिना लंबी लाइन के। 
      <span className="font-semibold text-yellow-200"> 2 मिनट में अपनी पारिवारिक वंशावली तैयार करें </span>
      और तुरंत आधिकारिक प्रारूप में PDF डाउनलोड करें।
    </p>

    {/* CTA Buttons */}
    <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
      
      <a
        href="#tool"
        className="relative inline-flex items-center justify-center
        bg-gradient-to-r from-emerald-400 to-green-500 text-white font-bold
        px-10 py-4 rounded-xl shadow-xl 
        hover:scale-105 hover:shadow-2xl transition-all duration-300"
      >
        अभी वंशावली बनाएं
      </a>
      
      <a
        href="/prapatra-2"
        className="inline-flex items-center justify-center
        border-2 border-white text-white font-bold
        px-10 py-4 rounded-xl shadow-xl 
        hover:bg-white hover:text-indigo-700 transition-all duration-300"
      >
        अभी प्रपत्र-2 भरें →
      </a>
      
      <a
        href="/batwara-application-bihar"
        className="relative inline-flex items-center justify-center
        bg-gradient-to-r from-emerald-400 to-green-500 text-white font-bold
        px-10 py-4 rounded-xl shadow-xl 
        hover:scale-105 hover:shadow-2xl transition-all duration-300"
      >
        अभी बंटवारा पत्र बनाएं
      </a>

    </div>

    {/* Social Proof */}
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6 text-white text-sm">
      <div>
        <h3 className="text-2xl font-bold text-yellow-300">10,000+</h3>
        सफल डाउनलोड
      </div>
      <div>
        <h3 className="text-2xl font-bold text-yellow-300">2 मिनट</h3>
        औसत समय
      </div>
      <div>
        <h3 className="text-2xl font-bold text-yellow-300">Live Demo</h3>
        तुरंत टेस्ट करें
      </div>
    </div>

    {/* Disclaimer */}
    <p className="mt-8 text-xs font-semibold text-white border border-black rounded-md p-2 bg-black/80">
       यह एक निजी नागरिक सहायता टूल है। यह कोई सरकारी वेबसाइट नहीं है। 
      उपयोगकर्ता सभी विवरण अपने स्थानीय सर्वे शिविर (अमीन / पर्यवेक्षक) से सत्यापित करें।
    </p>

  </motion.div>
</section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 -mt-24 relative z-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

          {[
            {
              icon: <ShieldCheck size={24} className="text-white" />,
              title: "लोकल डेटा सुरक्षा",
              desc: "आपका डेटा केवल आपके डिवाइस में रहता है।",
              color: "from-purple-500 to-indigo-500",
            },
            {
              icon: <FileText size={24} className="text-white" />,
              title: "तुरंत PDF",
              desc: "एक क्लिक में आधिकारिक प्रारूप PDF डाउनलोड।",
              color: "from-emerald-400 to-green-500",
            },
            {
              icon: <Languages size={24} className="text-white" />,
              title: "हिंदी टाइपिंग सपोर्ट",
              desc: "आसान हिंदी टाइपिंग और ऑटो फॉर्मेट।",
              color: "from-pink-500 to-rose-500",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`backdrop-blur-xl bg-gradient-to-r ${item.color} border border-white/20 
              rounded-2xl p-6 shadow-xl text-white hover:scale-105 transform transition duration-300`}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
          
      {/* ================= TOOL ================= */}
      <section id="tool" className="max-w-6xl mx-auto mt-28 px-4 sm:px-6 md:px-12">
        {/* Tutorial Video */}
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    viewport={{ once: true }}
    className="bg-white rounded-3xl shadow-2xl p-2 sm:p-2 mb-10"
  >
    <VanshawaliTutorial />
  </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          <Vanshavali />
        </motion.div>
      </section>

      {/*===================District Links========= */}
      <section>
        <DistrictSection />
      </section>

      {/*=====================Quick Links============*/}
      <section className="p-10">
        <CompactQuickLinks/>
      </section>
          
      {/* ================= TRUST ================= */}
      <section className="max-w-4xl mx-auto mt-24 px-4 sm:px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800">
            लोग इस टूल पर भरोसा क्यों करते हैं?
          </h3>

          <div className="grid sm:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base">
            {[
              "कोई लॉगिन या रजिस्ट्रेशन आवश्यक नहीं",
              "कोई सर्वर पर डेटा सेव नहीं किया जाता",
              "मोबाइल और लैपटॉप दोनों में सुरक्षित",
              "सर्वे शिविर में उपयोग योग्य प्रारूप",
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="text-emerald-600 mt-1" size={18} />
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= LEGAL ================= */}
      <section className="max-w-3xl mx-auto mt-16 px-4 sm:px-6 md:px-12">
        <div className="bg-slate-100 rounded-2xl shadow-md p-6 text-slate-600 text-sm sm:text-base">
          <h3 className="font-bold text-red-600 text-xl mb-3">कानूनी सूचना</h3>
          <p>
            यह एक निजी नागरिक सहायता टूल है। यह कोई सरकारी वेबसाइट नहीं है।
            उपयोगकर्ता सभी विवरण अपने स्थानीय सर्वे शिविर (अमीन / पर्यवेक्षक) से सत्यापित करें।
          </p>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <FAQClient />
    </main>
  );
}
