"use client";

import Link from "next/link";

// Premium Icon Components
function SurveyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function FamilyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function CourtIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function TreeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function StampIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function FormsPage() {
  const forms = [
    { title: "वंशावली", description: "परिवार वृक्ष / वंश सूची तैयार करें", link: "/#tool", icon: FamilyIcon, color: "from-green-500 to-emerald-400" },
    { title: "प्रपत्र-2", description: "जमीन सर्वे हेतु आवश्यक मुख्य फॉर्म", link: "/prapatra-2", icon: SurveyIcon, color: "from-blue-500 to-cyan-400" },
    { title: "प्रपत्र-3 (1)", description: "जमीन सर्वे हेतु आवश्यक फॉर्म", link: "/prapatra-3-1", icon: SurveyIcon, color: "from-indigo-500 to-blue-400" },
    { title: "पारिवारिक भूमि बंटवारा", description: "आपसी सहमति से पारिवारिक भूमि बंटवारा", link: "/batwara-application-bihar", icon: FamilyIcon, color: "from-purple-500 to-pink-400" },
    { title: "शपथ-पत्र", description: "घोषणा हेतु शपथ पत्र तैयार करें", link: "/shapath-patra", icon: StampIcon, color: "from-amber-500 to-orange-400" },
    { title: "आपत्ति पत्र", description: "सर्वे आपत्ति दर्ज करने हेतु आवेदन", link: "/objection-letter", icon: StampIcon, color: "from-rose-500 to-red-400" },
    { title: "जमाबन्दी रद्दकरन पत्र", description: "जमाबन्दी के रद्दकरन हेतु याचिका पत्र", link: "/cancellation-jamabandhi", icon: SurveyIcon, color: "from-teal-500 to-emerald-400" },
    { title: "श्रीमान कार्यपालक दंडाधिकारी", description: "मृत्यु प्रमाण पत्र उपलब्ध न होने पर (कोर्ट सत्यापन)", link: "/death-certificate-affidavit", icon: CourtIcon, color: "from-slate-600 to-slate-400" },
    { title: "स्व-घोषणा पत्र (मृत्यु प्रमाण)", description: "मृत्यु प्रमाण पत्र उपलब्ध न होने पर (मुखिया सत्यापन)", link: "/death-certificate-declaration", icon: CourtIcon, color: "from-cyan-500 to-teal-400" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 py-8 px-4 sm:px-6 z-0">
      
      {/* 🚀 Dynamic Soft Background Blobs (Apple-style Glassmorphism) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-300/30 blur-[120px] mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-300/30 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-teal-200/40 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>
        
        {/* Subtle grid pattern for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-50"></div>
      </div>

      <div className="relative z-10">
        
        {/* 🏷 Premium Header */}
        <div className="max-w-4xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 border border-blue-200 bg-white/60 backdrop-blur-md text-blue-700 text-xs sm:text-sm px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-semibold tracking-wide uppercase">services / सेवाएँ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
            जमीन सर्वे <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">को बनाएं आसान</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
            लंबी लाइनों और गलतियों को अलविदा कहें। सभी आवश्यक सर्वे फॉर्म ऑनलाइन भरें, तुरंत प्रिंट करें। एक सुरक्षित और पेशेवर अनुभव, आपके घर बैठे।
          </p>
        </div>

        {/* 📦 Responsive Grid: 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {forms.map((form, index) => {
            const Icon = form.icon;

            return (
              <Link 
                href={form.link} 
                key={index}
                className="group relative flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-white/80 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(59,130,246,0.12)] hover:border-blue-100"
              >
                
                {/* 🌈 Animated Top Border Gradient */}
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${form.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20`}></div>

                {/* 🌟 Background Watermark Icon (Visible permanently, animates on hover) */}
                <div className="absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 z-0">
                  <Icon className="w-28 h-28 md:w-40 md:h-40 text-slate-100 opacity-60 group-hover:text-blue-50 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none" />
                </div>

                <div className="relative z-10">
                  
                  {/* 🏛 Premium Icon Badge */}
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5 md:mb-8 transition-all duration-500 group-hover:bg-blue-50 group-hover:scale-110 group-hover:shadow-inner">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-slate-400 group-hover:text-blue-600 transition-colors duration-500" />
                  </div>

                  <h2 className="text-sm sm:text-lg md:text-2xl font-bold mb-2 text-slate-800 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {form.title}
                  </h2>

                  <p className="text-[11px] sm:text-sm md:text-base text-slate-500 leading-relaxed line-clamp-3">
                    {form.description}
                  </p>
                </div>

                {/* ➡️ Action Link & Subtle Arrow Animation */}
                <div className="relative z-10 mt-6 md:mt-10 flex items-center gap-2 text-[11px] sm:text-sm md:text-base font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>अभी भरें <span className="hidden sm:inline">| Fill Now</span></span>
                  <div className="relative flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors">
                    <svg 
                      className="w-3 h-3 md:w-4 md:h-4 transform transition-transform duration-300 group-hover:translate-x-0.5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

              </Link>
            );
          })}
        </div>

        {/* 🌟 Footer Section 
        <div className="max-w-4xl mx-auto text-center mt-16 md:mt-24">
          <p className="text-slate-400 font-semibold mb-3 text-sm">सर्वे में पारदर्शिता और दक्षता</p>
          <div className="bg-white/60 backdrop-blur-md border border-slate-200 px-6 py-4 rounded-2xl inline-block shadow-sm">
            <span className="text-xs sm:text-sm font-medium text-slate-600">यह पहल बिहार सरकार की राजस्व और भूमि सुधार विभाग की डिजिटल सेवाओं को बढ़ावा देने के लिए है।</span>
          </div>
        </div>*/}

      </div>

      {/* 🔮 Animation Definitions */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}