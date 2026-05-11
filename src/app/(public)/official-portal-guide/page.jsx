import React from "react";
import { 
  ShieldAlert, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Globe, 
  Lock,
  Landmark,
  FileText
} from "lucide-react";
import CompactQuickLinks from "@/components/QuickLinksFooter";

export const metadata = {
  title: "Bhumi Jankari Bihar Government Portal Guide | सरकारी वेबसाइट गाइड",
  description: "भू‍मि जानकारी बिहार की सरकारी वेबसाइट का सुरक्षित उपयोग कैसे करें। Jamabandi, registry और जमीन की जानकारी देखने के लिए आधिकारिक लिंक।",
  keywords: "bhumi jankari bihar government in, bhumi jankari bihar, bihar bhumi portal, bihar land records online, bhumijankari bihar",
};

export default function OfficialPortalGuidePage() {
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
                name: "बिहार भूमि जानकारी की असली वेबसाइट कौन सी है?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "बिहार सरकार की असली भूमि जानकारी वेबसाइट biharbhumi.bihar.gov.in और bhumijankari.bihar.gov.in है।"
                }
              },
              {
                "@type": "Question",
                name: "Bhumi Jankari Bihar Government in कैसे खोजें?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "जमीन की जानकारी के लिए हमेशा .gov.in या .bihar.gov.in वाली आधिकारिक वेबसाइट का ही उपयोग करें।"
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
          <Globe size={350} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20 shadow-sm">
            <Lock size={18} className="text-[#F97316]" />
            <span className="tracking-wide">Safe & Secure Portal Guide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Bhumi Jankari <span className="text-[#F97316]">Bihar</span> Guide
          </h1>

          <h2 className="text-xl md:text-3xl mt-4 font-medium text-blue-100">
            बिहार भूमि सरकारी वेबसाइट गाइड
          </h2>

          <p className="mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-blue-50/90">
            Learn how to safely identify and use the official Bihar Government portals for land records, registry, and Jamabandi.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 mt-8 space-y-10">

        {/* DISCLAIMER */}
        <div className="bg-[#FEF2F2] border-l-4 border-red-600 p-5 rounded-r-lg shadow-sm flex items-start gap-4">
          <ShieldAlert className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-red-800 text-lg">Disclaimer (अस्वीकरण)</h3>
            <p className="text-sm md:text-base text-red-800 mt-1">
              यह वेबसाइट एक स्वतंत्र जानकारी और टूल प्लेटफॉर्म है। जमीन का आधिकारिक डेटा केवल बिहार सरकार के <strong>Revenue and Land Reforms Department</strong> द्वारा संचालित सरकारी पोर्टल पर ही उपलब्ध होता है। हम किसी भी सरकारी संस्था का प्रतिनिधित्व नहीं करते हैं।
            </p>
          </div>
        </div>

        {/* INTRO - Identifying Fake Sites */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#1E3A8A]"></div>
          
          <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-3">
            <Globe className="text-[#1E3A8A]" size={28} />
            Bhumi Jankari Bihar Official Website
          </h2>

          <p className="text-slate-600 mb-4 text-lg leading-relaxed">
            बहुत से लोग इंटरनेट पर <strong>bhumi jankari bihar government in</strong> या <strong>bihar bhumi portal</strong> खोजते हैं। इस दौरान कई बार फर्जी (Fake) वेबसाइट भी सामने आ जाती हैं जो आधिकारिक जैसी दिखती हैं।
          </p>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
            <CheckCircle2 className="text-[#15803D] flex-shrink-0" size={24} />
            <p className="text-slate-700 font-medium">
              सुरक्षा टिप: हमेशा यह सुनिश्चित करें कि वेबसाइट का URL <code className="bg-white text-[#1E3A8A] px-2 py-1 rounded shadow-sm border border-slate-200 mx-1 font-mono text-sm">.gov.in</code> या <code className="bg-white text-[#1E3A8A] px-2 py-1 rounded shadow-sm border border-slate-200 mx-1 font-mono text-sm">.bihar.gov.in</code> पर खत्म हो।
            </p>
          </div>
        </section>

        {/* OFFICIAL LINKS */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <Landmark className="text-[#15803D]" size={28} />
            बिहार भूमि आधिकारिक वेबसाइट लिंक्स
          </h2>

          <div className="space-y-4">
            {/* BIHAR BHUMI */}
            <div className="group border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-blue-300 hover:shadow-md transition-all duration-300 bg-slate-50 hover:bg-white">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 text-[#1E3A8A] rounded-lg mt-1 group-hover:bg-[#1E3A8A] group-hover:text-white transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl">
                    Bihar Bhumi Portal
                  </h3>
                  <p className="text-slate-600 mt-1">
                    जमाबंदी, खाता, खेसरा और LPC आवेदन देखने के लिए।
                  </p>
                  <p className="text-sm font-mono text-slate-400 mt-2">biharbhumi.bihar.gov.in</p>
                </div>
              </div>

              <a
                href="https://biharbhumi.bihar.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2 bg-white text-[#1E3A8A] border-2 border-[#1E3A8A] py-2.5 px-6 rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-all font-bold shadow-sm"
              >
                वेबसाइट खोलें <ExternalLink size={18} />
              </a>
            </div>

            {/* BHUMI JANKARI REGISTRY */}
            <div className="group border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center hover:border-green-300 hover:shadow-md transition-all duration-300 bg-slate-50 hover:bg-white">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 text-[#15803D] rounded-lg mt-1 group-hover:bg-[#15803D] group-hover:text-white transition-colors">
                  <Search size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xl">
                    Bhumi Jankari Registry Portal
                  </h3>
                  <p className="text-slate-600 mt-1">
                    रजिस्ट्री, MVR और जमीन के दस्तावेज खोजने के लिए।
                  </p>
                  <p className="text-sm font-mono text-slate-400 mt-2">bhumijankari.bihar.gov.in</p>
                </div>
              </div>

              <a
                href="https://bhumijankari.bihar.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2 bg-white text-[#15803D] border-2 border-[#15803D] py-2.5 px-6 rounded-lg hover:bg-[#15803D] hover:text-white transition-all font-bold shadow-sm"
              >
                रजिस्ट्री पोर्टल <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* STEP GUIDE & INFO */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Step by Step */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Search className="text-[#1E3A8A]" size={24} />
              जमीन की जानकारी कैसे देखें?
            </h2>

            <ol className="space-y-4">
              {[
                "Bihar Bhumi की आधिकारिक वेबसाइट खोलें।",
                "अपना जिला (District) और अंचल (Circle) चुनें।",
                "अपने गांव का मौजा (Mauza) चुनें।",
                "खाता या खेसरा नंबर दर्ज करें।",
                "Search बटन दबाकर अपनी जमाबंदी और जमीन की जानकारी देखें।"
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Department Info */}
          <section className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Landmark className="text-slate-600" size={24} />
              महत्वपूर्ण जानकारी
            </h2>
            
            <p className="text-slate-600 leading-relaxed mb-4">
              बिहार में जमीन से जुड़ी सभी ऑनलाइन और ऑफलाइन सेवाएं जैसे जमाबंदी (Register 2), रजिस्ट्री, भूमि सर्वेक्षण (Land Survey) और रिकॉर्ड अपडेट की प्रक्रिया <strong>Revenue and Land Reforms Department (राजस्व एवं भूमि सुधार विभाग)</strong> द्वारा संचालित की जाती हैं।
            </p>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <p className="text-sm text-slate-500 font-medium">Department Helpdesk</p>
              <p className="text-slate-800 font-bold mt-1">टोल-फ्री नंबर 1800-345-6215</p>
            </div>
          </section>

        </div>

        {/* QUICK LINKS COMPONENT */}
        <div className="mt-8">
           <CompactQuickLinks />
        </div>

      </main>
    </div>
  );
}