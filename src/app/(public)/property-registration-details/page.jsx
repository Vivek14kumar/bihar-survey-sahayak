import React from "react";
import Link from "next/link";
import { 
  FileSignature, 
  Landmark, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  MapPin,
  ShieldCheck,
  FileText
} from "lucide-react";
import CompactQuickLinks from "@/components/QuickLinksFooter";

export const metadata = {
  title: "Property Registration Details Bihar - भूमि रजिस्ट्री (केवाला) जानकारी",
  description: "बिहार में जमीन की रजिस्ट्री कैसे देखें। Bhumi Jankari पोर्टल पर ऑनलाइन केवाला, रजिस्ट्री और जमीन के दस्तावेज देखने की पूरी गाइड।",
  keywords: "property registration details bihar, bihar bhumi registry jankari, bhumi jankari registry bihar, land registry bihar online, kewala bihar",
};

export default function PropertyRegistrationPage() {
  return (
    <div className="min-h-screen bg-[#EFF6FF] text-slate-800 font-sans selection:bg-orange-200 selection:text-orange-900 pb-16">

      {/* 🚀 SEO STRUCTURED DATA (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "बिहार में जमीन की रजिस्ट्री (केवाला) ऑनलाइन कैसे देखें",
            "description": "Bhumi Jankari पोर्टल पर ऑनलाइन रजिस्ट्री और केवाला डिटेल्स चेक करने की प्रक्रिया।",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Bhumi Jankari पोर्टल पर जाएं",
                "text": "बिहार सरकार के आधिकारिक भूमि जानकारी पोर्टल (bhumijankari.bihar.gov.in) पर जाएं।"
              },
              {
                "@type": "HowToStep",
                "name": "Advance Search चुनें",
                "text": "वेबसाइट पर 'Advance Search' या 'Search Registry' के विकल्प पर क्लिक करें।"
              },
              {
                "@type": "HowToStep",
                "name": "रजिस्ट्रेशन ऑफिस चुनें",
                "text": "अपना रजिस्ट्रेशन ऑफिस, लोकेशन और अंचल (Circle) की जानकारी भरें।"
              },
              {
                "@type": "HowToStep",
                "name": "रिकॉर्ड खोजें",
                "text": "खाता नंबर, खेसरा नंबर या पार्टी के नाम से अपनी रजिस्ट्री का विवरण खोजें।"
              }
            ]
          })
        }}
      />

      {/* HERO SECTION */}
      <header className="relative bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#15803D] text-white py-16 px-4 overflow-hidden shadow-lg">
        {/* Background Decorative Icon */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10 pointer-events-none">
          <FileSignature size={350} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20 shadow-sm">
            <ShieldCheck size={18} className="text-[#F97316]" />
            <span className="tracking-wide">Official Registry Guide</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            Property Registration <span className="text-[#F97316]">Details</span>
          </h1>

          <h2 className="text-xl md:text-3xl mt-4 font-medium text-blue-100">
            बिहार में भूमि रजिस्ट्री (केवाला) की जानकारी
          </h2>

          <p className="mt-6 text-base md:text-lg font-light max-w-2xl mx-auto text-blue-50/90 leading-relaxed">
            जमीन की रजिस्ट्री और <strong>केवाला (Sale Deed)</strong> की प्रमाणित जानकारी ऑनलाइन देखें और भूमि सर्वेक्षण के लिए अपने दस्तावेज़ तैयार करें।
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 mt-8 space-y-10">

        {/* INTRO */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-[#1E3A8A]"></div>
          
          <h2 className="text-2xl font-bold text-[#1E3A8A] mb-4 flex items-center gap-3">
            <Landmark className="text-[#1E3A8A]" size={28} />
            बिहार में भूमि रजिस्ट्री (Kewala) क्या होती है?
          </h2>

          <p className="text-slate-600 mb-4 text-lg leading-relaxed">
            जब कोई व्यक्ति जमीन खरीदता या बेचता है, तो उस जमीन का निबंधन (Registration) सब-रजिस्ट्रार ऑफिस में किया जाता है। इस पूरी कानूनी प्रक्रिया के बाद जमीन का जो मुख्य आधिकारिक दस्तावेज तैयार होता है, उसे <strong>केवाला (Sale Deed)</strong> कहा जाता है।
          </p>

          <p className="text-slate-600 text-lg leading-relaxed">
            आजकल बिहार में जमीन की पुरानी और नई रजिस्ट्री की जानकारी ऑनलाइन भी आसानी से देखी जा सकती है। इसके लिए आपको बिहार सरकार के <strong>Bhumi Jankari</strong> पोर्टल पर जाकर एडवांस सर्च का उपयोग करना होता है।
          </p>
        </section>

        {/* INFO SECTION: WHAT YOU SEE */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
            <FileText className="text-[#15803D]" size={28} />
            ऑनलाइन रजिस्ट्री जानकारी में क्या-क्या दिखता है?
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            {[
              "जमीन खरीदने (Buyer) और बेचने (Seller) वाले का नाम",
              "रजिस्ट्री की सटीक तारीख (Registration Date)",
              "जमीन का खाता और खेसरा नंबर (Khata/Khesra)",
              "जमीन का क्षेत्रफल (Area) और लोकेशन",
              "डीड नंबर (Sale Deed Number)",
              "जमीन की चौहद्दी (Boundary Details)"
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                <CheckCircle2 size={20} className="text-[#1E3A8A] flex-shrink-0 mt-0.5" /> 
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* STEP BY STEP GUIDE */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
            <Search className="text-[#F97316]" size={28} />
            जमीन की रजिस्ट्री कैसे देखें (Step by Step)
          </h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            {/* Step 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1E3A8A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">1</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-1">आधिकारिक पोर्टल पर जाएं</h3>
                <p className="text-slate-600 text-sm mb-3">सबसे पहले बिहार सरकार के 'Bhumi Jankari' रजिस्ट्री पोर्टल पर जाएं।</p>
                <a 
                  href="https://bhumijankari.bihar.gov.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm bg-white border border-[#1E3A8A] text-[#1E3A8A] px-4 py-2 rounded-lg hover:bg-[#1E3A8A] hover:text-white transition-colors font-bold shadow-sm"
                >
                  रजिस्ट्री पोर्टल खोलें <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1E3A8A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">2</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-1">Advance Search चुनें</h3>
                <p className="text-slate-600 text-sm">वेबसाइट पर जाने के बाद <strong>“Advance Search”</strong> या <strong>“Search Registry”</strong> वाले विकल्प पर क्लिक करें।</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1E3A8A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">3</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-1">लोकेशन की जानकारी भरें</h3>
                <p className="text-slate-600 text-sm">ड्रॉपडाउन से अपना <strong>Registration Office</strong> (जहाँ रजिस्ट्री हुई थी), Property Location, और Circle चुनें।</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1E3A8A] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">4</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-800 text-lg mb-1">सर्च करें (Search details)</h3>
                <p className="text-slate-600 text-sm mb-2">अंत में <strong>मौजा (Mauza)</strong> चुनें। अब आप अपनी केवाला का विवरण खोजने के लिए इनमें से कोई एक दर्ज करें:</p>
                <ul className="list-disc pl-5 text-sm text-[#15803D] font-medium space-y-1">
                  <li>खाता नंबर (Khata No.)</li>
                  <li>खेसरा नंबर (Plot No.)</li>
                  <li>खरीदने या बेचने वाले का नाम</li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* FUNNEL CTA (CALL TO ACTION) */}
        <section className="bg-gradient-to-r from-[#15803D] to-[#166534] p-10 rounded-3xl shadow-xl text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10">
             <FileSignature size={200} />
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-white/30">
              <MapPin size={32} className="text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">क्या आपको अपनी केवाला डिटेल्स मिल गई हैं?</h2>
            
            <p className="text-green-100 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              यदि आपके पास जमीन की रजिस्ट्री (Kewala) और खाता-खेसरा की जानकारी मौजूद है, तो आप सर्वे के लिए अपना <strong>स्वघोषणा फॉर्म (Form 2)</strong> मिनटों में तैयार कर सकते हैं।
            </p>
            
            <Link 
              href="/prapatra-2" 
              className="inline-flex items-center gap-2 bg-white text-[#15803D] font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-slate-100 hover:-translate-y-1 transition-all duration-300"
            >
              स्वघोषणा (Form 2) बनाएँ <ExternalLink size={18} />
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