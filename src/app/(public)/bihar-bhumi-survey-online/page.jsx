import React from "react";
import Link from "next/link";
import { 
  FileSignature, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import CompactQuickLinks from "@/components/QuickLinksFooter";

export const metadata = {
  title: "Bihar Bhumi Survey Online - Download & Fill Form 2, 3 (Vanshavali)",
  description: "Complete tools for Bihar Bhumi Survey Online. Generate Form 2 (Self Declaration) and Form 3 (Vanshavali) PDF in Hindi for Bihar land survey.",
  keywords: "bihar bhumi survey online, bihar land survey form, vanshavali form kaise bhare, bihar land survey online, form 2 self declaration bihar survey",
};

export default function SurveyOnlineHub() {
  return (
    <div className="min-h-screen bg-[#EFF6FF] text-slate-800 font-sans selection:bg-orange-200 selection:text-orange-900 pb-12">
      
      {/* 🚀 SEO STRUCTURED DATA (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Bihar Bhumi Survey Online क्या है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "यह बिहार सरकार द्वारा चलाया जा रहा विशेष भूमि सर्वेक्षण अभियान है, जिसमें सभी जमीनों का नया खतियान और नक्शा तैयार किया जा रहा है।"
                }
              },
              {
                "@type": "Question",
                name: "Vanshavali Form 3 कब जरूरी होता है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "यदि जमाबंदी आपके पूर्वजों (दादा-परदादा) के नाम पर है, तो अपने हिस्से की जमीन साबित करने के लिए वंशावली (Form 3) देना अनिवार्य है।"
                }
              },
              {
                "@type": "Question",
                name: "Self Declaration Form 2 क्या है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "इस फॉर्म में रैयत (जमीन का मालिक) अपनी जमीन की पूरी जानकारी (खाता, खेसरा, चौहद्दी) स्व-घोषणा के रूप में सरकार को देता है।"
                }
              }
            ]
          })
        }}
      />

      {/* HEADER */}
      <header className="relative bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#15803D] text-white py-16 px-4 overflow-hidden shadow-lg">
        {/* Background Decorative Icon */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
          <FileText size={350} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20 shadow-sm">
            <ShieldCheck size={18} className="text-[#F97316]" />
            <span className="tracking-wide">Official Form Generators</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Bihar Land <span className="text-[#F97316]">Survey</span> Forms
          </h1>

          <h2 className="text-xl md:text-3xl mt-4 font-medium text-blue-100">
            बिहार विशेष भूमि सर्वेक्षण - ऑनलाइन फॉर्म
          </h2>

          <p className="mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-blue-50/90">
            अपने मोबाइल से <strong>स्वघोषणा (Form 2)</strong> और <strong>वंशावली (Form 3)</strong> आसानी से भरें और तुरंत PDF डाउनलोड करें।
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 mt-8 space-y-10">

        {/* INFO BANNER */}
        <div className="bg-[#FFF7ED] border-l-4 border-[#F97316] p-5 rounded-r-lg shadow-sm flex items-start gap-4">
          <AlertTriangle className="text-[#F97316] flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-[#9A3412] text-lg">जरूरी सूचना (Important)</h3>
            <p className="text-sm md:text-base text-[#9A3412] mt-1">
              फॉर्म जनरेट करने से पहले कृपया अपनी <strong>Jamabandi (Register 2)</strong> की जानकारी और <strong>खाता/खेसरा नंबर</strong> पास रखें। गलत जानकारी भरने से सर्वे में परेशानी हो सकती है।
            </p>
          </div>
        </div>

        {/* TOOLS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Vanshavali Tool */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-green-100 hover:shadow-xl hover:border-green-300 transition-all duration-300 flex flex-col relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-green-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <Users size={120} />
            </div>
            
            <div className="relative z-10 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-green-100 text-[#15803D] rounded-xl flex items-center justify-center shadow-sm">
                  <Users size={24} />
                </div>
                <span className="bg-[#15803D] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  सर्वाधिक उपयोग
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                वंशावली फॉर्म (Form 3)
              </h2>

              <p className="text-slate-600 mb-6 text-sm md:text-base min-h-[60px]">
                अपने परिवार के सदस्यों का विवरण डालें और बिहार भूमि सर्वे के लिए ऑटोमैटिक <strong>वंशावली PDF</strong> जनरेट करें।
              </p>
            </div>

            <Link
              href="/#tools"
              className="mt-auto flex items-center justify-center gap-2 bg-[#15803D] text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md relative z-10"
            >
              Form 3 बनाएँ <ChevronRight size={20} />
            </Link>
          </div>

          {/* Form 2 Tool */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-blue-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <FileSignature size={120} />
            </div>

            <div className="relative z-10 flex-grow">
              <div className="w-12 h-12 bg-blue-100 text-[#1E3A8A] rounded-xl flex items-center justify-center mb-4 shadow-sm">
                <FileSignature size={24} />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                स्वघोषणा फॉर्म (Form 2)
              </h2>

              <p className="text-slate-600 mb-6 text-sm md:text-base min-h-[60px]">
                जमीन के मालिक का नाम, खाता, खेसरा और चौहद्दी की जानकारी डालकर <strong>Self Declaration PDF</strong> तैयार करें।
              </p>
            </div>

            <Link
              href="/prapatra-2"
              className="mt-auto flex items-center justify-center gap-2 bg-[#1E3A8A] text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md relative z-10"
            >
              Form 2 बनाएँ <ChevronRight size={20} />
            </Link>
          </div>

        </div>

        {/* STEP GUIDE & ABOUT (Two Columns on Large Screens) */}
        <section className="grid md:grid-cols-2 gap-6">
          
          {/* How it Works */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Info className="text-[#1E3A8A]" size={24} />
              ऑनलाइन फॉर्म कैसे भरें?
            </h2>
            <ol className="space-y-4">
              {[
                "अपने जरूरी कागजात (खतियान, रसीद, आधार कार्ड) पास रखें।",
                "अपनी जरूरत के अनुसार ऊपर दिए गए Form 2 या Form 3 पर क्लिक करें।",
                "फॉर्म में मांगी गई सभी जानकारी हिंदी या अंग्रेजी में सही-सही भरें।",
                "जानकारी चेक करें और 'Generate PDF' बटन दबाएं।",
                "PDF डाउनलोड करें, उसका प्रिंट आउट निकालें और सर्वे शिविर में जमा करें।"
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-slate-700 text-sm md:text-base">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* About Survey */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-[#15803D]" size={24} />
              भूमि सर्वेक्षण क्यों हो रहा है?
            </h2>
            <p className="text-slate-600 mb-4 text-sm md:text-base leading-relaxed">
              बिहार सरकार राज्य में जमीन के पुराने रिकॉर्ड्स को डिजिटल करने और पारिवारिक विवादों को खत्म करने के लिए <strong>विशेष भूमि सर्वेक्षण 2024-26</strong> करा रही है।
            </p>
            <p className="text-slate-600 mb-5 text-sm md:text-base leading-relaxed">
              इस सर्वे में सभी जमीन मालिकों को अपने कागजात दिखाने होंगे। अगर आपकी जमीन पुश्तैनी है, तो आपको <strong>वंशावली</strong> के साथ-साथ <strong>स्वघोषणा पत्र</strong> भी देना अनिवार्य है।
            </p>
            <ul className="space-y-2">
               <li className="flex items-center gap-2 text-slate-700 text-sm"><CheckCircle2 size={16} className="text-[#15803D]" /> नया डिजिटल खतियान बनेगा</li>
               <li className="flex items-center gap-2 text-slate-700 text-sm"><CheckCircle2 size={16} className="text-[#15803D]" /> नया नक्शा तैयार होगा</li>
               <li className="flex items-center gap-2 text-slate-700 text-sm"><CheckCircle2 size={16} className="text-[#15803D]" /> ऑनलाइन लगान रसीद कटेगी</li>
            </ul>
          </div>

        </section>

        {/* FAQ */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle size={24} className="text-[#1E3A8A]" />
            <h2 className="text-2xl font-bold text-slate-800">
              सामान्य प्रश्न (FAQs)
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">
                क्या यह फॉर्म मोबाइल से भरा जा सकता है?
              </h3>
              <p className="text-slate-600 text-sm">
                हाँ, यह वेबसाइट मोबाइल फ्रेंडली है। आप अपने स्मार्टफोन से सारी जानकारी भरकर सीधे PDF डाउनलोड कर सकते हैं।
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">
                वंशावली फॉर्म (Form 3) पर किसका हस्ताक्षर लगेगा?
              </h3>
              <p className="text-slate-600 text-sm">
                PDF प्रिंट करने के बाद, फॉर्म पर रैयत (जमीन का वारिस) को अपना हस्ताक्षर या अंगूठे का निशान लगाना होगा।
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-2">
                क्या यह पोर्टल सुरक्षित है?
              </h3>
              <p className="text-slate-600 text-sm">
                हाँ, आपकी द्वारा दर्ज की गई जानकारी सिर्फ आपके ब्राउज़र में रहती है और हम कोई भी पर्सनल डेटा अपने सर्वर पर सेव नहीं करते हैं।
              </p>
            </div>
          </div>
        </section>

        {/* OFFICIAL LINKS */}
        <section className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-2xl border border-blue-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
             <ExternalLink className="text-[#1E3A8A]" size={20} />
             Important Govt Links (सरकारी वेबसाइट)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://dlrs.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white border border-blue-200 p-4 rounded-xl hover:shadow-md hover:border-blue-400 transition-all text-slate-700 font-medium group"
            >
              <span>Bihar Land Survey Official Portal</span>
              <ExternalLink size={18} className="text-slate-400 group-hover:text-[#1E3A8A]" />
            </a>

            <a
              href="https://parimarjanplus.bihar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white border border-blue-200 p-4 rounded-xl hover:shadow-md hover:border-blue-400 transition-all text-slate-700 font-medium group"
            >
              <span>Parimarjan Plus (परिमार्जन पोर्टल)</span>
              <ExternalLink size={18} className="text-slate-400 group-hover:text-[#1E3A8A]" />
            </a>
          </div>
        </section>

        {/* QUICK LINKS COMPONENT */}
        <div className="mt-8">
           <CompactQuickLinks />
        </div>

      </main>
    </div>
  );
}