import "./globals.css";
import Navbar from "@/components/Navbar";
import VisitTracker from "@/components/VisitTracker";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import MobilePopup from "@/components/MobilePopup";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "वंशावली निर्माण ऑनलाइन | Bihar Land Survey Helper | Vanshavali Maker 2026",
  description:
    "Prepare your Vanshavali safely for Bihar Land Survey 2026. Generate official format PDF instantly without login.",
  keywords:
    " Bihar Bhumi, bihar bhumi,Vanshavali, Vanshwali, Bihar, Bihar Land Survey 2026, Vanshavali Maker, Bihar Survey PDF, Bihar Land Record Helper",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className="bg-slate-50 text-slate-900 antialiased">
        
        {/* --- ADD SCHEMA MARKUP HERE --- */}
        <Script id="software-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Bihar Survey Sahayak",
            "operatingSystem": "Web",
            "applicationCategory": "UtilityApplication",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "12450"
            },
            "offers": {
              "@type": "Offer",
              "price": "10.00",
              "priceCurrency": "INR"
            }
          })}
        </Script>

        <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "बिहार भूमि सर्वे के लिए वंशावली कैसे बनाएं?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Bihar Survey Sahayak पोर्टल पर जाकर आप अपने परिवार के सदस्यों का नाम भरकर मात्र 2 मिनट में आधिकारिक वंशावली PDF तैयार कर सकते हैं।"
                }
              }
            ]
          })}
        </Script>
        {/* ------------------------------ */}
        
        <Script
          src="https://www.google.com/inputtools/request?itc=hi-t-i0-und&num=1"
          strategy="beforeInteractive"
        />
        
        {/* 🔥 TRACK VISIT */}
        <VisitTracker />

        {/* ✅ NEW MODERN NAVBAR */}
        <Navbar />

        <Analytics/>
        
        {/* PAGE CONTENT */}
        <main className="min-h-screen">
          <Toaster position="top-right" reverseOrder={false} />
          {children}
          <MobilePopup /> {/* Pop-up will appear only on mobile */}
        </main>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-300 mt-24">
          <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

            {/* About */}
            <div>
              <h4 className="font-semibold text-white mb-4">
                About Platform
              </h4>
              <p className="text-sm leading-relaxed text-slate-400">
                Bihar Survey Sahayak is a private citizen assistance platform
                designed to help users prepare Vanshavali documents for Bihar
                Land Survey 2026 in official-ready PDF format.
              </p>
            </div>

            {/* Important */}
            <div>
              <h4 className="font-semibold text-white mb-4">
                Important Notice
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Not a Government Website</li>
                <li>No data stored on servers</li>
                <li>Works entirely on your device</li>
                <li>Verify details at official survey camps</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="/about"
                    className="hover:text-white transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-and-conditions"
                    className="hover:text-white transition"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/disclaimer"
                    className="hover:text-white transition"
                  >
                    Disclaimer
                  </a>
                </li>
                <li>
                  <a
                    href="/feedback"
                    className="hover:text-white transition"
                  >
                    Feedback
                  </a>
                </li>
                <li>
                  <a
                    href="/faq"
                    className="hover:text-white transition"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/refund"
                    className="hover:text-white transition"
                  >
                    Refund
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 text-center text-xs text-slate-500 py-6">
            © {new Date().getFullYear()} Bihar Survey Sahayak — Private Technical Tool  <br></br>
            <span className="block sm:inline">
            Designed &amp; Maintained by{" "}
            <a
              href="mailto:viktechzweb@gmail.com"
              className="text-blue-500 hover:text-blue-600 font-semibold"
              aria-label="Email VIKTECHZ"
            >
              VIK-TECHZ
            </a>
          </span>
          </div>
        </footer>
        
      </body>
    </html>
  );
  
}

