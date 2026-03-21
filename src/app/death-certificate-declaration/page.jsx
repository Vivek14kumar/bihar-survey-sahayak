export const metadata = {
  title: 'स्व-घोषणा पत्र (मृत्यु प्रमाण हेतु) - मुखिया सरपंच सत्यापन | Bihar Land Survey',
  description: 'बिहार भूमि सर्वेक्षण में पूर्वजों का मृत्यु प्रमाण पत्र नहीं होने पर यह स्व-घोषणा पत्र (Self Declaration) बनाएं। मुखिया/सरपंच सत्यापन के फॉर्मेट के साथ मात्र ₹3 में PDF डाउनलोड करें।',
  keywords: [
    'स्व-घोषणा पत्र मृत्यु प्रमाण हेतु',
    'death certificate self declaration format bihar',
    'mukhiya sarpanch death verification format',
    'bina death certificate survey form',
    'ancestor death proof bihar survey',
    'mrityu praman patra mukhiya dwara satyapit',
    'vanshavali mrityu praman patra affidavit',
    'death certificate declaration in hindi',
    'Bihar Survey Sahayak',
    'bihar bhumi survey death certificate alternative'
  ],
  authors: [{ name: 'Bihar Survey Sahayak' }],
  openGraph: {
    title: 'स्व-घोषणा पत्र (मृत्यु प्रमाण) - मुखिया सत्यापन के साथ बनाएं',
    description: 'पूर्वजों का मृत्यु प्रमाण पत्र नहीं है? बिहार सर्वे के लिए मान्य यह स्व-घोषणा पत्र तैयार करें, जिस पर सीधे मुखिया या सरपंच की मुहर लगवाई जा सकती है। ऑनलाइन PDF डाउनलोड करें।',
    url: 'https://biharsurveysahayak.com/death-declaration', // अपना असली URL डालें
    siteName: 'Bihar Survey Sahayak',
    images: [
      {
        url: 'https://biharsurveysahayak.com/og-death-declaration.png', // बैनर इमेज (मुखिया सत्यापन वाला ग्राफ़िक लगायें)
        width: 1200,
        height: 630,
        alt: 'Death Certificate Self Declaration Mukhiya Verification',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'मृत्यु प्रमाण पत्र नहीं है? यह स्व-घोषणा पत्र (मुखिया सत्यापन) दें',
    description: 'बिहार सर्वे के लिए मान्य स्व-घोषणा पत्र फॉर्मेट। मुखिया/सरपंच से वेरीफाई कराने के लिए सबसे सही फॉर्मेट मात्र ₹3 में डाउनलोड करें।',
    images: ['https://biharsurveysahayak.com/og-death-declaration.png'],
  },
  alternates: {
    canonical: 'https://biharsurveysahayak.com/death-declaration', // अपना असली URL डालें
  },
};

// अपने क्लाइंट कंपोनेंट को यहाँ इम्पोर्ट करें
import DeathCertificateDeclaration from './DeathCertificateDeclaration'; 

export default function Page() {
  return (
    <main>
      <DeathCertificateDeclaration />
    </main>
  );
}