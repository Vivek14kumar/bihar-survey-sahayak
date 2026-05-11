import "./globals.css";
import VisitTracker from "@/components/VisitTracker";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/Providers";
import { Toaster } from "react-hot-toast";
import { Teko, Hind, Noto_Sans_Devanagari } from "next/font/google";

const teko = Teko({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-teko",
});

const hind = Hind({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
});

const notoHindi = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hindi",
});


// Your metadata stays here perfectly safe!
export const metadata = {
  title: "वंशावली निर्माण ऑनलाइन | Bihar Land Survey Helper | Vanshavali Maker 2026",
  description: "Prepare your Vanshavali safely for Bihar Land Survey 2026. Generate official format PDF instantly without login.",
  manifest: "/manifest.json",
  keywords: [
    "Bihar Bhumi", "Vanshavali", "vanshavali maker", "Bihar Land Survey 2026",
    "Bihar Bhumi Survey 2026", "Bihar Survey PDF", "Bihar Land Record Helper", 
    "DCLR Vanshawali Certificate"
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className={`${teko.variable} ${hind.variable} ${notoHindi.variable} bg-slate-50 text-slate-900 antialiased`} suppressHydrationWarning>
        
        {/* SCHEMAS */}
        <Script id="software-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Bihar Survey Sahayak",
            "operatingSystem": "Web",
            "applicationCategory": "UtilityApplication",
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "ratingCount": "12450" },
            "offers": { "@type": "Offer", "price": "10.00", "priceCurrency": "INR" }
          })}
        </Script>

        <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
              "@type": "Question",
              "name": "बिहार भूमि सर्वे के लिए वंशावली कैसे बनाएं?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Bihar Survey Sahayak पोर्टल पर जाकर आप अपने परिवार के सदस्यों का नाम भरकर मात्र 2 मिनट में आधिकारिक वंशावली PDF तैयार कर सकते हैं।"
              }
            }]
          })}
        </Script>
        
        <Script src="https://www.google.com/inputtools/request?itc=hi-t-i0-und&num=1" strategy="lazyOnload" />
        
        <VisitTracker />
        <Analytics/>
        <Toaster position="top-right" reverseOrder={false} />

        {/* CORE APP WRAPPER */}
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}