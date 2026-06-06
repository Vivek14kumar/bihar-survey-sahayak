// src/app/(public)/page.js
// ❌ CRITICAL: Do NOT put "use client" in this file!
export const revalidate = 3600;

import HeroSection from "@/components/HeroSection";
import HomeClientContent from "@/components/HomeClientContent"; // Your new animated component
import HomePageAminsSection from "@/components/HomePageAminsSection"; // Your Mongoose Server component
import DistrictSection from "@/components/DistrictSection";
import CompactQuickLinks from "@/components/QuickLinksFooter";
import FAQClient from "./faq/FAQClient";
import FloatingUpdateCard from "@/components/FloatingUpdateCard";

export default function Home() {
  return (
    <main className="relative ">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Features & CTA (Client Component for Animations) */}
      <HomeClientContent />

      {/* 3. Amin Directory (Server Component for Fast Load & Mongoose & SEO) */}
      <HomePageAminsSection />

      {/* 4. Districts & Links */}
      <section>
        <DistrictSection />
      </section>

      <section className="p-10">
        <CompactQuickLinks />
      </section>

      {/* 5. Trust Badges */}
      <section className="max-w-4xl mx-auto mt-24 px-4 sm:px-6 md:px-12">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-slate-800">
            लोग इस टूल पर भरोसा क्यों करते हैं?
          </h3>
          <div className="grid sm:grid-cols-2 gap-6 text-slate-700 text-sm sm:text-base">
            <div className="flex items-start gap-3"> सुरक्षित यूजर अकाउंट और डैशबोर्ड</div>
            <div className="flex items-start gap-3"> आसान क्रेडिट और वॉलेट सिस्टम</div>
            <div className="flex items-start gap-3"> मोबाइल और लैपटॉप दोनों में सुरक्षित</div>
            <div className="flex items-start gap-3"> सर्वे शिविर में उपयोग योग्य प्रारूप</div>
          </div>
        </div>
      </section>

      {/* 6. Legal & FAQ */}
      <section className="max-w-3xl mx-auto mt-16 px-4 sm:px-6 md:px-12">
        <div className="bg-slate-100 rounded-2xl shadow-md p-6 text-slate-600 text-sm sm:text-base">
          <h3 className="font-bold text-red-600 text-xl mb-3">कानूनी सूचना</h3>
          <p>
            यह एक निजी नागरिक सहायता टूल है। यह कोई सरकारी वेबसाइट नहीं है।
            उपयोगकर्ता सभी विवरण अपने स्थानीय सर्वे शिविर (अमीन / पर्यवेक्षक) से सत्यापित करें।
          </p>
        </div>
      </section>
      <FloatingUpdateCard/>
      <FAQClient />
    </main>
  );
}