"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle, Clock, AlertCircle, Download, FileText, 
  ArrowRight, Sparkles, Monitor, Smartphone, Users, Lock, Unlock 
} from "lucide-react";
import QuickLinksFooter from "@/components/QuickLinksFooter";

export default function ShapathPatraPage() {
  const [selectedIssue, setSelectedIssue] = useState("raiyat");
  const [hasAffidavit, setHasAffidavit] = useState(false); // New state for Step-by-Step logic

  const issues = {
    raiyat: {
      title: "रैयत/पिता का नाम सुधार",
      docs: ["शपथ पत्र (Mandatory)", "दाखिल-खारिज शुद्धि पत्र", "जमाबंदी पंजी कॉपी", "आधार कार्ड", "लगान रसीद"],
      time: "15 दिन"
    },
    land: {
      title: "खाता/खेसरा/रकबा सुधार",
      docs: ["शपथ पत्र (Mandatory)", "CS/RS खतियान", "दाखिल-खारिज आदेश", "LPC (दखल-कब्जा)", "बिक्री पत्र (Kewala)"],
      time: "15-75 दिन"
    },
    lagan: {
      title: "लगान (Lagan) सुधार",
      docs: ["शपथ पत्र", "पुरानी लगान रसीद", "शुद्धि पत्र", "अंचल अभिलेख प्रति"],
      time: "15 दिन"
    },
    caste_address: {
      title: "जाति/पता सुधार",
      docs: ["जाति प्रमाण पत्र", "आधार/वोटर ID", "बिजली बिल/राशन कार्ड", "निवास प्रमाण पत्र"],
      time: "15 दिन"
    }
  };

  return (
    <>
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      
      {/* HEADER */}
      <header className="w-full bg-white border-b border-slate-200 py-6 px-4 sticky top-0 z-50 shadow-sm">
  <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center gap-4">
    
    {/* Title Section - Centered */}
    <div>
      <h1 className="text-2xl md:text-4xl font-black text-slate-900 flex items-center gap-2 justify-center">
        <FileText className="text-indigo-600" size={32} /> 
        परिमार्जन प्लस <span className="text-indigo-600">सहायक</span>
      </h1>
      <p className="text-slate-500 text-xs md:text-sm mt-1 font-semibold tracking-wide uppercase">
        शुद्धिकरण की 100% सटीक मार्गदर्शिका (2026)
      </p>
    </div>

    {/* Social Proof Badge - Centered & Refined */}
    <div className="flex items-center gap-3 bg-indigo-50 px-6 py-2 rounded-full border border-indigo-100 shadow-sm animate-in fade-in zoom-in duration-700">
      <div className="flex -space-x-2">
        {/* Decorative dots to mimic user avatars */}
        <div className="w-6 h-6 rounded-full bg-indigo-200 border-2 border-white"></div>
        <div className="w-6 h-6 rounded-full bg-indigo-300 border-2 border-white"></div>
        <div className="w-6 h-6 rounded-full bg-indigo-400 border-2 border-white"></div>
      </div>
      <span className="text-xs md:text-sm font-black text-indigo-700">
        अबतक <span className="text-indigo-900 text-base">1650+</span> लोगों ने सफलता पूर्वक आवेदन किया
      </span>
    </div>

  </div>
</header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: SELECTION PANEL */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-amber-500" size={20} />
                <h3 className="text-lg font-bold text-slate-800">सुधार का चयन करें</h3>
              </div>
              
              <div className="space-y-3">
                {Object.keys(issues).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedIssue(key)}
                    className={`group w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                      selectedIssue === key 
                      ? "border-indigo-600 bg-indigo-50/50 shadow-md scale-[1.02]" 
                      : "border-transparent bg-slate-50 hover:border-indigo-200 shadow-sm"
                    }`}
                  >
                    <div>
                      <span className={`block text-base font-bold ${selectedIssue === key ? "text-indigo-700" : "text-slate-700"}`}>
                        {issues[key].title}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">समाधान: {issues[key].time}</span>
                    </div>
                    <ArrowRight size={20} className={`${selectedIssue === key ? "text-indigo-600 opacity-100" : "text-slate-200 opacity-0"} transition-all`} />
                  </button>
                ))}
              </div>
            </div>

            {/* QUICK STATS FOR TRUST */}
            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
               <h4 className="font-bold mb-4 flex items-center gap-2 text-indigo-400">
                 <Clock size={18} /> समय सीमा
               </h4>
               <p className="text-sm text-slate-300 leading-relaxed">
                 सरकारी नियमों के अनुसार आपका आवेदन 15 दिनों के भीतर निष्पादित किया जाना अनिवार्य है।
               </p>
            </div>
          </div>

          {/* RIGHT: DOCUMENT VIEWER & WORKFLOW */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-slate-100">
              
              {/* STEP 1: DOCUMENTATION */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                   <div className="flex items-center gap-3">
                    <span className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">1</span>
                    <h3 className="text-2xl font-black text-slate-800">दस्तावेज़ और शपथ पत्र <span className="text-rose-500">*</span></h3>
                   </div>
                   <span className="hidden sm:block bg-rose-100 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Mandatory</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {issues[selectedIssue].docs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-indigo-200">
                      <CheckCircle size={20} className="text-green-500 shrink-0" />
                      <span className="text-slate-700 font-bold text-sm">{doc}</span>
                    </div>
                  ))}
                </div>

                {/* THE "ENFORCEMENT" CHECKBOX */}
                <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-dashed border-indigo-200 mb-8">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="w-6 h-6 mt-1 accent-indigo-600 rounded-md" 
                      checked={hasAffidavit}
                      onChange={(e) => setHasAffidavit(e.target.checked)}
                    />
                    <div>
                      <span className="font-black text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">मेरे पास हस्ताक्षरित शपथ पत्र है</span>
                      <p className="text-slate-500 text-sm mt-1">पोर्टल पर जाने से पहले यह सुनिश्चित करें कि आपके पास यह दस्तावेज़ है।</p>
                    </div>
                  </label>
                </div>

                <Link href="/shapath-patra">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] active:scale-95">
                    <Download size={24} /> शपथ पत्र डाउनलोड करें
                  </button>
                </Link>
              </div>

              {/* STEP 2: SUBMISSION (Conditional Styling) */}
              <div className={`transition-all duration-500 pt-10 border-t-2 border-slate-100 ${hasAffidavit ? 'opacity-100 pointer-events-auto' : 'opacity-40 grayscale pointer-events-none'}`}>
                <div className="flex items-center gap-3 mb-8">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg ${hasAffidavit ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {hasAffidavit ? <Unlock size={20} /> : <Lock size={20} />}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800">आधिकारिक पोर्टल पर जमा करें</h3>
                </div>

                <div className="bg-rose-50 border-l-8 border-rose-500 p-5 rounded-2xl mb-8">
                  <div className="flex gap-4">
                    <AlertCircle className="text-rose-500 shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-black text-rose-900">रिजेक्शन से बचने की आखरी सलाह:</p>
                      <p className="text-sm text-rose-800 font-medium">
                        सभी दस्तावेज़ों को स्कैन करें, मर्ज करें और 1MB के भीतर रखें। बिना **हस्ताक्षर** के फाइल अपलोड न करें।
                      </p>
                    </div>
                  </div>
                </div>

                <a 
                  href="https://parimarjanplus.bihar.gov.in/ParimarjanNew/userDashboard.aspx" 
                  target="_blank"
                  className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black text-xl shadow-2xl transition-all hover:-translate-y-1"
                >
                  आधिकारिक पोर्टल पर जाएँ <ArrowRight size={24} />
                </a>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
    <div>
      <QuickLinksFooter/>
    </div>
    </>
  );
}