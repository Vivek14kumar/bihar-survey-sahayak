// ध्यान दें: यहाँ "use client" नहीं लिखना है

// Step 1 में बनाई गई फाइल को इम्पोर्ट करें
import AffidavitClient from './AffidavitClient'; 

// आपका SEO Meta Data (यह सर्वर साइड पर रेंडर होगा और Google को दिखेगा)
export const metadata = {
  title: 'मृत्यु प्रमाण पत्र नहीं होने पर शपथ पत्र (Affidavit Format) | Bihar Land Survey',
  description: 'बिहार विशेष भूमि सर्वेक्षण में पूर्वजों (दादा/परदादा) का मृत्यु प्रमाण पत्र (Death Certificate) नहीं होने पर यह शपथ पत्र दें। 2 मिनट में ऑनलाइन फॉर्म भरें और डायरेक्ट PDF डाउनलोड या प्रिंट करें।',
  keywords: [
    'mrityu praman patra affidavit format pdf',
    'death certificate nahi hai to kya kare bihar survey',
    'bihar land survey death certificate alternative',
    'bina mrityu praman patra ke survey kaise kare',
    'purvajo ka mrityu praman patra shapath patra',
    'shapath patra format bihar survey',
    'मृत्यु प्रमाण पत्र नहीं होने का शपथ पत्र',
    'death certificate missing affidavit bihar',
    'vanshavali and death certificate affidavit',
    'Bihar Survey Sahayak'
  ],
  authors: [{ name: 'Bihar Survey Sahayak' }],
  openGraph: {
    title: 'मृत्यु प्रमाण पत्र नहीं है? बिहार सर्वे के लिए यहाँ से शपथ पत्र बनाएं',
    description: 'अगर आपके पूर्वजों का मृत्यु प्रमाण पत्र नहीं है, तो बिहार भूमि सर्वेक्षण के लिए मान्य यह शपथ पत्र (Affidavit) ऑनलाइन तैयार करें और PDF डाउनलोड करें।',
    url: 'https://biharsurveysahayak.com/death-certificate-affidavit', // अपना असली URL डालें
    siteName: 'Bihar Survey Sahayak',
    images: [
      {
        url: 'https://biharsurveysahayak.com/og-death-certificate.png', // बैनर इमेज
        width: 1200,
        height: 630,
        alt: 'Death Certificate Affidavit Format Bihar Survey',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'पूर्वजों का मृत्यु प्रमाण पत्र नहीं है? यह शपथ पत्र दें',
    description: 'बिहार भूमि सर्वेक्षण के लिए मान्य शपथ पत्र फॉर्मेट। मात्र ₹3 में बिना वाटरमार्क डाउनलोड करें।',
    images: ['https://biharsurveysahayak.com/og-death-certificate.png'],
  },
};

export default function Page() {
  return (
    <main>
      <AffidavitClient />
    </main>
  );
}