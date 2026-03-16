import React from "react";
import Link from "next/link";
import { 
  Search, 
  FileText, 
  Map, 
  Info, 
  CheckCircle2, 
  BookOpen,
  HelpCircle,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import CompactQuickLinks from "@/components/QuickLinksFooter";

export const metadata = {
  title: "Bihar Bhumi Jankari - बिहार भूमि जानकारी | Jamabandi Register 2 Check",
  description: "Bihar Bhumi Jankari: Check Jamabandi Register 2, Khata, Khesra and Bihar land records online. बिहार में जमीन की जानकारी, जमाबंदी और भूमि सर्वे की पूरी जानकारी।",
  keywords: "bihar bhumi jankari, bhumi jankari bihar government, bihar land records, jamabandi register 2 bihar, khatiyan bihar, bihar survey",
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Bihar Bhumi Jankari क्या है?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Bihar Bhumi Jankari से आप अपनी जमीन की जानकारी जैसे Jamabandi, Khata और Khesra नंबर ऑनलाइन देख सकते हैं।"
          }
        },
        {
          "@type": "Question",
          name: "Register 2 कैसे देखें?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "बिहार भूमि वेबसाइट पर जाकर जिला, अंचल और मौजा चुनें, फिर खाता या खेसरा नंबर डालकर जमाबंदी देखें।"
          }
        }
      ]
    })
  }}
/>
export default function BiharBhumiJankariPage() {
  return (
    <div className="min-h-screen bg-[#EFF6FF] text-slate-800 font-sans selection:bg-orange-200 selection:text-orange-900">
     
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{
         __html: JSON.stringify({
           "@context": "https://schema.org",
           "@type": "FAQPage",
           mainEntity: [
             {
               "@type": "Question",
               name: "Bihar Bhumi Jankari क्या है?",
               acceptedAnswer: {
                 "@type": "Answer",
                 text: "Bihar Bhumi Jankari से आप अपनी जमीन की जानकारी जैसे Jamabandi, Khata और Khesra नंबर ऑनलाइन देख सकते हैं।"
               }
             },
             {
               "@type": "Question",
               name: "Register 2 कैसे देखें?",
               acceptedAnswer: {
                 "@type": "Answer",
                 text: "बिहार भूमि वेबसाइट पर जाकर जिला, अंचल और मौजा चुनें, फिर खाता या खेसरा नंबर डालकर जमाबंदी देखें।"
               }
             }
           ]
         })
       }}
     />

      {/* HERO SECTION */}
      <header className="relative bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#15803D] text-white py-16 px-4 overflow-hidden shadow-lg">
        {/* Background Decorative Icon */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
          <Map size={350} />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20 shadow-sm">
            <ShieldCheck size={18} className="text-[#F97316]" />
            <span className="tracking-wide">Bihar Land Survey 2024-26</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Bihar <span className="text-[#F97316]">Bhumi</span> Jankari
          </h1>

          <h2 className="text-xl md:text-2xl mt-4 font-medium text-blue-100">
            बिहार भूमि जानकारी | Land Records Bihar
          </h2>

          <p className="mt-6 text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-blue-50/90">
            Check your Jamabandi Register 2, Khata, and Khesra number online. Ensure your land records are accurate and ready for the upcoming survey.
          </p>

        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto p-4 py-12 space-y-12">

        {/* INTRO SECTION */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#1E3A8A]"></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-[#1E3A8A] rounded-lg">
              <Info size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#1E3A8A]">
              Bihar Bhumi Jankari क्या है?
            </h2>
          </div>
          
          <p className="text-slate-600 leading-relaxed mb-4 text-lg">
            <b>Bihar Bhumi Jankari</b> बिहार सरकार की ऑनलाइन भूमि रिकॉर्ड
            सेवा है जिसके माध्यम से नागरिक अपनी जमीन से संबंधित जानकारी
            ऑनलाइन देख सकते हैं। इसमें मुख्य रूप से
            <span className="text-[#15803D] font-semibold"> जमाबंदी (Register 2), खाता नंबर, खेसरा नंबर, और जमीन के मालिक का नाम</span> शामिल होता है।
          </p>
          <p className="text-slate-600 leading-relaxed text-lg">
            Through the portal, citizens can easily verify their property ownership and rectify discrepancies before the Bihar Land Survey process begins in their village.
          </p>
        </section>

        {/* QUICK TOOLS */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Tool 1 */}
          <div className="group bg-white border border-blue-100 p-8 rounded-2xl hover:shadow-xl hover:border-blue-300 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-blue-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <Search size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 text-[#1E3A8A] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <Search size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Jamabandi Register 2
              </h3>
              <p className="text-slate-600 mb-6 min-h-[48px]">
                अपनी जमीन की जमाबंदी और मालिक की जानकारी ऑनलाइन चेक करें।
              </p>
              <Link
                href="/register-2-online"
                className="inline-flex items-center gap-2 bg-[#1E3A8A] text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors font-medium shadow-md"
              >
                Register 2 देखें <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* Tool 2 */}
          <div className="group bg-white border border-green-100 p-8 rounded-2xl hover:shadow-xl hover:border-green-300 transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-green-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
              <FileText size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-green-100 text-[#15803D] rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <FileText size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Land Survey Forms
              </h3>
              <p className="text-slate-600 mb-6 min-h-[48px]">
                बिहार भूमि सर्वे के लिए स्वघोषणा (Form 2) और वंशावली (Form 3) बनाएं।
              </p>
              <Link
                href="/bihar-bhumi-survey-online"
                className="inline-flex items-center gap-2 bg-[#15803D] text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
              >
                Survey Tools <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* TERMS TABLE */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen size={24} className="text-[#1E3A8A]" />
            <h2 className="text-2xl font-bold text-slate-800">
              Important Land Record Terms
            </h2>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold text-slate-700 w-1/3">Term</th>
                  <th className="p-4 font-bold text-slate-700">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-[#1E3A8A]">Jamabandi (Register 2)</td>
                  <td className="p-4 text-slate-600">जमीन के मालिक और टैक्स की जानकारी रखने वाला मुख्य रिकॉर्ड।</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-[#1E3A8A]">Khata Number</td>
                  <td className="p-4 text-slate-600">जमीन के मालिक (रैयत) को दिया गया खाता नंबर।</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-[#1E3A8A]">Khesra Number</td>
                  <td className="p-4 text-slate-600">जमीन के प्लॉट की विशिष्ट पहचान संख्या (Plot Number)।</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-[#1E3A8A]">Khatiyan</td>
                  <td className="p-4 text-slate-600">जमीन के इतिहास और मालिकाना हक का पूरा दस्तावेज़।</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-[#1E3A8A]">Lagaan</td>
                  <td className="p-4 text-slate-600">सरकार को दिया जाने वाला वार्षिक भूमि कर (Land Tax)।</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* STEP GUIDE & SURVEY INFO (Two Columns on Large Screens) */}
        <section className="grid md:grid-cols-2 gap-6">
          
          {/* How to Check */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Search className="text-[#1E3A8A]" size={20} />
              Bhumi Jankari कैसे देखें?
            </h2>
            <ul className="space-y-4">
              {[
                "बिहार भूमि की आधिकारिक वेबसाइट खोलें।",
                "अपना जिला (District) और अंचल (Circle) चुनें।",
                "अपने गांव का मौजा (Mauza) चुनें।",
                "खाता नंबर, खेसरा नंबर या नाम से खोजें।",
                "Search बटन दबाएं और डिटेल्स देखें।"
              ].map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-[#1E3A8A] flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Alert/Survey Info */}
          <div className="bg-[#FFF7ED] p-8 rounded-2xl border border-[#FED7AA]">
            <h2 className="text-xl font-bold text-[#9A3412] mb-4 flex items-center gap-2">
              <Info className="text-[#F97316]" size={20} />
              Land Survey 2024-2026
            </h2>
            <p className="text-[#9A3412] mb-5 leading-relaxed">
              बिहार सरकार पूरे राज्य में विशेष भूमि सर्वेक्षण कर रही है ताकि सभी जमीनी रिकॉर्ड्स को डिजिटल और विवाद-मुक्त किया जा सके।
            </p>
            <ul className="space-y-3">
              {[
                "स्वघोषणा (Form 2) जमा करना अनिवार्य है।",
                "जमाबंदी आपके या आपके पूर्वज के नाम पर होनी चाहिए।",
                "वंशावली (Form 3) तैयार रखें।",
                "आधार कार्ड और लगान रसीद अपडेट रखें।"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-[#9A3412]">
                  <CheckCircle2 size={18} className="text-[#F97316] mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </section>

        {/* INTERNAL LINKS */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Useful Survey Tools
          </h2>
          <CompactQuickLinks />
        </section>

        {/* FAQ */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle size={24} className="text-[#1E3A8A]" />
            <h2 className="text-2xl font-bold text-slate-800">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">
                क्या बिहार भूमि जानकारी ऑनलाइन देख सकते हैं?
              </h4>
              <p className="text-slate-600">
                हाँ, आप बिहार सरकार के राजस्व एवं भूमि सुधार विभाग की वेबसाइट के माध्यम से अपनी जमीन की जमाबंदी और खाता-खेसरा की जानकारी निःशुल्क देख सकते हैं।
              </p>
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">
                Register 2 क्या होता है?
              </h4>
              <p className="text-slate-600">
                Register 2 (जमाबंदी पंजी) अंचल कार्यालय में रखा जाने वाला एक मुख्य रिकॉर्ड है जिसमें जमीन के वर्तमान मालिक का नाम, रकबा (Area) और लगान (Tax) का विवरण होता है।
              </p>
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="text-center text-sm text-slate-400 pt-8 border-t border-slate-200 mt-12">
          <p>
            Disclaimer: This website provides educational information and formatting tools related to Bihar land records and the survey process. It is an independent platform and not an official government website.
          </p>
        </section>

      </main>

    </div>
  );
}