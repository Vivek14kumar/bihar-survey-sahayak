import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Map, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  FileKey
} from "lucide-react";
import CompactQuickLinks from "@/components/QuickLinksFooter";

export const metadata = {
  title: "Bihar Land Record & Khatiyan - जमीन की जानकारी (Jamin Jankari)",
  description: "बिहार में जमीन की जानकारी कैसे देखें। खाता, खेसरा और खतियान ऑनलाइन देखने और डाउनलोड करने की पूरी गाइड।",
  keywords: "land record bihar bhumi, jamin ki jankari bihar, jamin jankari in bihar, bihar ki bhumi jankari, khatiyan bihar online",
};

export default function LandRecordsPage() {
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
                name: "बिहार में जमीन की जानकारी कैसे देखें?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "बिहार भूमि की आधिकारिक वेबसाइट पर जाकर अपना जिला, अंचल और मौजा चुनें। फिर खाता या खेसरा नंबर डालकर जमीन की जानकारी देख सकते हैं।"
                }
              },
              {
                "@type": "Question",
                name: "खतियान (Khatiyan) क्या है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "खतियान जमीन का मूल दस्तावेज होता है जिसमें जमीन के मालिक का नाम, खाता नंबर, खेसरा नंबर और जमीन का पूरा इतिहास दर्ज होता है।"
                }
              },
              {
                "@type": "Question",
                name: "खाता और खेसरा में क्या अंतर है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "खाता नंबर जमीन मालिक का अकाउंट नंबर होता है जिसमें कई प्लॉट हो सकते हैं, जबकि खेसरा नंबर किसी विशेष जमीन के प्लॉट का पहचान नंबर होता है।"
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
          <BookOpen size={350} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20 shadow-sm">
            <ShieldCheck size={18} className="text-[#F97316]" />
            <span className="tracking-wide">Bihar Land Records Guide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Bihar Land Records <span className="text-[#F97316]">(Khatiyan)</span>
          </h1>

          <h2 className="text-xl md:text-3xl mt-4 font-medium text-blue-100">
            बिहार में जमीन की जानकारी और खतियान
          </h2>

          <p className="mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-blue-50/90">
            Learn how to check your Khata, Khesra, and download your digital land records online in Bihar.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 mt-8 space-y-10">

        {/* INTRO */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#1E3A8A]"></div>
          
          <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-3">
            <Map className="text-[#1E3A8A]" size={28} />
            जमीन की जानकारी क्या होती है?
          </h2>

          <p className="text-slate-600 mb-4 text-lg leading-relaxed">
            बिहार में जमीन से जुड़ी जानकारी जैसे <strong>खाता नंबर, खेसरा नंबर, खतियान और जमाबंदी</strong> को ऑनलाइन देखा जा सकता है। यह सभी रिकॉर्ड बिहार सरकार के राजस्व एवं भूमि सुधार विभाग के पोर्टल पर उपलब्ध होते हैं।
          </p>

          <p className="text-slate-600 text-lg leading-relaxed">
            इन डिजिटल रिकॉर्ड्स की मदद से आप अपनी जमीन का मालिकाना हक (Ownership), प्लॉट की जानकारी, उसका क्षेत्रफल और जमीन का पूरा इतिहास घर बैठे देख सकते हैं।
          </p>
        </section>

        {/* KHATIYAN, KHATA, KHESRA INFO */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <FileKey className="text-[#15803D]" size={28} />
            Khatiyan, Khata और Khesra समझें
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            
            {/* Khatiyan Card */}
            <div className="group bg-[#FFF7ED] p-6 rounded-xl border border-[#FED7AA] hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 text-[#EA580C] rounded-xl flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-[#9A3412] text-xl mb-3">
                खतियान (Khatiyan) क्या है?
              </h3>
              <p className="text-[#9A3412] leading-relaxed">
                खतियान जमीन का <strong>मूल दस्तावेज (Master Document)</strong> होता है। इसमें जमीन के मालिक का नाम, खाता नंबर, खेसरा नंबर, और जमीन का प्रकार दर्ज होता है। यह पुश्तैनी जमीन के मालिकाना हक को साबित करने का सबसे मजबूत सबूत है।
              </p>
            </div>

            {/* Khata & Khesra Card */}
            <div className="group bg-blue-50 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 text-[#1E3A8A] rounded-xl flex items-center justify-center mb-4">
                <Map size={24} />
              </div>
              <h3 className="font-bold text-[#1E3A8A] text-xl mb-3">
                खाता और खेसरा क्या होता है?
              </h3>
              <ul className="space-y-4">
                <li>
                  <span className="font-bold text-slate-800 block mb-1">खाता नंबर (Khata Number):</span>
                  <span className="text-slate-600">यह जमीन मालिक या परिवार का 'अकाउंट नंबर' होता है। एक खाता नंबर के अंदर जमीन के कई अलग-अलग प्लॉट हो सकते हैं।</span>
                </li>
                <li>
                  <span className="font-bold text-slate-800 block mb-1">खेसरा नंबर (Khesra Number / Plot No):</span>
                  <span className="text-slate-600">यह किसी विशेष जमीन के टुकड़े या प्लॉट का विशिष्ट नंबर होता है, जो सरकारी नक्शे (Map) में उस जगह को दर्शाता है।</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* STEP GUIDE */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Search className="text-[#1E3A8A]" size={24} />
            बिहार में जमीन की जानकारी कैसे देखें?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <ol className="space-y-4">
              {[
                "Bihar Bhumi (biharbhumi.bihar.gov.in) की आधिकारिक वेबसाइट खोलें।",
                "होमपेज पर 'अपना खाता देखें' या 'जमाबंदी पंजी देखें' पर क्लिक करें।",
                "नक्शे में अपना जिला (District) और अंचल (Circle) चुनें।",
                "सूची से अपने गांव का मौजा (Mauza) चुनें।",
                "खाता नंबर, खेसरा नंबर, या रैयत के नाम से खोजें।",
                "Search बटन दबाकर अपनी जमीन का डिजिटल रिकॉर्ड (Khatiyan) देखें और PDF डाउनलोड करें।"
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-slate-700 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
               <FileText size={48} className="text-slate-300 mb-4" />
               <p className="text-slate-500 font-medium">Record Viewing</p>
               <p className="text-sm text-slate-400 mt-2">Make sure you have your Khata or Khesra number handy before searching on the official portal.</p>
            </div>
          </div>
        </section>

        {/* SURVEY CTA */}
        <section className="bg-gradient-to-r from-[#15803D] to-[#166534] p-8 rounded-2xl shadow-md text-white flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
             <CheckCircle2 size={150} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              क्या आप भूमि सर्वे 2024-26 के लिए तैयार हैं?
            </h3>

            <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
              यदि आपने अपनी जमीन का खाता और खेसरा निकाल लिया है, तो आप बिहार भूमि सर्वेक्षण के लिए अपना <strong>स्वघोषणा (Form 2)</strong> और <strong>वंशावली (Form 3)</strong> आसानी से बना सकते हैं।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#tools"
                className="flex items-center justify-center gap-2 bg-white text-[#15803D] py-3 px-8 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg"
              >
                वंशावली (Form 3) बनाएँ <ChevronRight size={18} />
              </Link>
              <Link
                href="/prapatra-2"
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white py-3 px-8 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                स्वघोषणा (Form 2)
              </Link>
            </div>
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