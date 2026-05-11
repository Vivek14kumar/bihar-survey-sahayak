import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Database 
} from 'lucide-react';
import CompactQuickLinks from "@/components/QuickLinksFooter";

// DYNAMIC METADATA FOR SEO
export const metadata = {
  title: 'रजिस्टर 2 (जमाबंदी) ऑनलाइन चेक करें - Bihar Bhumi Jankari',
  description: 'बिहार भूमि पोर्टल पर अपना रजिस्टर 2 (जमाबंदी) ऑनलाइन देखने की स्टेप-बाय-स्टेप गाइड। भूमि सर्वे से पहले अपना खाता और खेसरा वेरिफाई करें।',
  keywords: [
    'bihar bhumi jankari register 2',
    'jamabandi bihar hindi',
    'register 2 kaise dekhe',
    'bihar bhumi jankari',
    'check jamabandi online bihar'
  ],
};

export default function Register2OnlinePage() {
  return (
    <div className="min-h-screen bg-[#EFF6FF] text-slate-800 font-sans selection:bg-orange-200 selection:text-orange-900 pb-16">
      
      {/* 🚀 SEO STRUCTURED DATA (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "बिहार में रजिस्टर 2 (जमाबंदी) ऑनलाइन कैसे चेक करें",
            "description": "बिहार भूमि पोर्टल पर अपनी जमाबंदी और जमीन का रिकॉर्ड खोजने की आसान गाइड।",
            "step": [
              {
                "@type": "HowToStep",
                "name": "आधिकारिक पोर्टल पर जाएं",
                "text": "बिहार भूमि की आधिकारिक वेबसाइट (biharbhumi.bihar.gov.in) पर जाएं।"
              },
              {
                "@type": "HowToStep",
                "name": "जमाबंदी पर क्लिक करें",
                "text": "होमपेज पर 'जमाबंदी पंजी देखें' विकल्प को चुनें।"
              },
              {
                "@type": "HowToStep",
                "name": "लोकेशन चुनें",
                "text": "अपना जिला (District) और अंचल (Circle) चुनें, फिर Proceed पर क्लिक करें।"
              },
              {
                "@type": "HowToStep",
                "name": "विवरण खोजें",
                "text": "अपना मौजा चुनें और खाता, खेसरा या रैयत के नाम का उपयोग करके खोजें।"
              }
            ]
          })
        }}
      />

      {/* HERO SECTION */}
      <header className="relative bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#15803D] text-white py-16 px-4 overflow-hidden shadow-lg">
        {/* Background Decorative Icon */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
          <Database size={350} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20 shadow-sm">
            <ShieldCheck size={18} className="text-[#F97316]" />
            <span className="tracking-wide">आधिकारिक रिकॉर्ड सत्यापन (Verification)</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Register 2 <span className="text-[#F97316]">ऑनलाइन</span> चेक करें
          </h1>

          <h2 className="text-xl md:text-3xl mt-4 font-medium text-blue-100">
            अपनी जमाबंदी पंजी ऑनलाइन देखें
          </h2>

          <p className="mt-6 text-base md:text-lg font-light max-w-2xl mx-auto text-blue-50/90 leading-relaxed">
            बिहार भूमि सर्वेक्षण (Land Survey) के फॉर्म जमा करने से पहले आधिकारिक जमाबंदी रिकॉर्ड में अपनी जमीन का विवरण, खाता और खेसरा नंबर वेरिफाई करें।
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-8 space-y-10">
        
        {/* WARNING BANNER */}
        <div className="bg-[#FFF7ED] border-l-4 border-[#F97316] p-5 rounded-r-lg shadow-sm flex items-start gap-4">
          <AlertTriangle className="text-[#F97316] flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-[#9A3412] text-lg">सर्वे के लिए जरूरी सूचना</h3>
            <p className="text-sm md:text-base text-[#9A3412] mt-1">
              प्रपत्र 2 (स्वघोषणा) या प्रपत्र 3 (वंशावली) भरने से पहले यह सुनिश्चित कर लें कि <strong>रजिस्टर 2</strong> में आपके या आपके पूर्वजों के नाम से जमाबंदी कायम है।
            </p>
          </div>
        </div>

        {/* WHAT IS REGISTER 2 SECTION */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#1E3A8A]"></div>
          
          <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-3">
            <Database className="text-[#1E3A8A]" size={28} />
            रजिस्टर 2 (Register 2) क्या है?
          </h2>
          
          <p className="text-slate-600 leading-relaxed mb-6 text-lg">
            रजिस्टर 2, जिसे <strong>जमाबंदी (Jamabandi)</strong> के रूप में भी जाना जाता है, अंचल कार्यालय द्वारा रखा जाने वाला सबसे महत्वपूर्ण दस्तावेज है। यह जमीन के अधिकारों का निरंतर रिकॉर्ड है जो दर्शाता है कि वर्तमान में किसी विशेष जमीन के लिए लगान (Land Tax) कौन भर रहा है।
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {[
              "रैयत का नाम वेरिफाई करें",
              "खाता और खेसरा नंबर जानें",
              "कुल रकबा (Area) का विवरण देखें",
              "वर्तमान लगान रसीद की स्थिति जानें"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50/50 transition-colors">
                <CheckCircle size={20} className="text-[#15803D] flex-shrink-0" /> 
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* STEP BY STEP GUIDE */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
            <MapPin className="text-[#15803D]" size={28} />
            जमाबंदी चेक करने की स्टेप-बाय-स्टेप प्रक्रिया
          </h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1E3A8A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">1</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-1">आधिकारिक पोर्टल पर जाएं</h3>
                <p className="text-slate-600 text-sm mb-3">बिहार सरकार की आधिकारिक राजस्व एवं भूमि सुधार वेबसाइट (Bihar Bhumi) पर जाएं।</p>
                <a 
                  href="https://biharbhumi.bihar.gov.in/Biharbhumi/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-white border border-[#1E3A8A] text-[#1E3A8A] px-4 py-2 rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-colors font-bold shadow-sm"
                >
                  आधिकारिक वेबसाइट खोलें <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1E3A8A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">2</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-1">"जमाबंदी पंजी देखें" चुनें</h3>
                <p className="text-slate-600 text-sm">वेबसाइट के होमपेज पर, <strong>"जमाबंदी पंजी देखें"</strong> वाले बॉक्स को खोजें और उस पर क्लिक करें।</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1E3A8A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">3</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-1">लोकेशन का विवरण दर्ज करें</h3>
                <p className="text-slate-600 text-sm">ड्रॉपडाउन मेनू से अपना <strong>जिला (District)</strong> और <strong>अंचल (Circle)</strong> चुनें, फिर "Proceed" (आगे बढ़ें) बटन पर क्लिक करें।</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1E3A8A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">4</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-1">मौजा चुनें और सर्च करें</h3>
                <p className="text-slate-600 text-sm mb-2">अपना <strong>मौजा (Mauza/Village)</strong> चुनें। अब आप इनमें से किसी भी विकल्प से अपनी जमाबंदी खोज सकते हैं:</p>
                <ul className="list-disc pl-5 text-sm text-[#15803D] font-medium space-y-1">
                  <li>भाग वर्तमान / पृष्ठ संख्या</li>
                  <li>रैयत का नाम (Raiyat Name)</li>
                  <li>प्लॉट नंबर (Khesra)</li>
                  <li>खाता नंबर (Khata Number)</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* FUNNEL CTA (CALL TO ACTION) */}
        <section className="bg-gradient-to-r from-[#15803D] to-[#166534] p-10 rounded-3xl shadow-xl text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10">
             <FileText size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/30">
              <FileText size={32} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">क्या आपको अपनी जमाबंदी की जानकारी मिल गई?</h2>
            
            <p className="text-green-100 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              अब जब आप अपना खाता, खेसरा और रकबा जान गए हैं, तो आप सर्वे के लिए अपना आधिकारिक दस्तावेज बनाने के लिए पूरी तरह तैयार हैं।
            </p>
            
            <Link 
              href="/prapatra-2" 
              className="inline-flex items-center gap-2 bg-white text-[#15803D] font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300"
            >
              प्रपत्र 2 (Form 2) अभी बनाएँ <ExternalLink size={18} />
            </Link>
          </div>
        </section>

        {/* QUICK LINKS */}
        <div className="mt-8">
           <CompactQuickLinks />
        </div>

      </main>
    </div>
  );
}