"use client";

import Vanshavali from "@/components/Vanshavali";
import { ShieldCheck, FileText, Languages, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import FAQClient from "./faq/FAQClient";

export default function Home() {
  return (
    <main className="relative pb-32">

      {/* ================= HERO ================= */}
      <section className="relative pt-28 pb-40 px-4 sm:px-6 md:px-12 text-center overflow-hidden">

        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-600 to-violet-600 opacity-90 -z-10" />

        {/* Floating glass card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto backdrop-blur-xl bg-white/10 
          border border-white/20 rounded-3xl p-8 sm:p-10 shadow-2xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            बिहार भूमि सर्वे 2026
            <br />
            <span className="text-yellow-300">वंशावली निर्माण ऑनलाइन</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            बिना एजेंट, बिना परेशानी। अपनी पारिवारिक वंशावली तैयार करें और तुरंत आधिकारिक प्रारूप में PDF डाउनलोड करें।
          </p>
          
          {/* CTA */}
          <div className="mt-8 sm:mt-10 grid grid-cols-2 items-center gap-4">
            <a
              href="#tool"
              className="inline-block bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold
              px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
            >
              अभी वंशावली बनाएं
            </a>
            
            <a
              href="/prapatra-2"
              className="inline-block border border-2 text-white font-semibold
              px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition duration-300"
            >
              अभी प्रपत्र-2 भरे ⟶
            </a>
          </div>
          <p className=" mt-4 text-xs sm:text-xs font-bold text-white border border-black rounded p-1 bg-black max-w-[100%] text-center">
              यह एक निजी नागरिक सहायता टूल है। यह कोई सरकारी वेबसाइट नहीं है। उपयोगकर्ता सभी विवरण अपने स्थानीय सर्वे शिविर (अमीन / पर्यवेक्षक) से सत्यापित करें।
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
