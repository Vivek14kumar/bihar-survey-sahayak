export const metadata = {
  title: 'आपसी सहमति बंटवारा पंचनामा ऑनलाइन बनाएं (Partition Deed) | Download आपसी पंचनामा बंटवारा Form PDF Free (Bihar Survey 2026)',
  description: 'बिहार विशेष भूमि सर्वेक्षण के लिए 100 रुपये के स्टाम्प पेपर पर प्रिंट करने योग्य आपसी सहमति बंटवारा पंचनामा (Batwara Panchnama) ऑनलाइन तैयार करें। ऑटोमैटिक हिस्सा कैलकुलेटर के साथ मात्र ₹8 में PDF डाउनलोड करें।',
  keywords: [
    'batwara panchnama format bihar',
    'aapsi batwara kagaz kaise banaye',
    'bihar bhumi survey batwara form',
    'family partition deed format hindi pdf',
    'zamin ka batwara kaise kare bihar',
    'panchnama format in hindi',
    '100 rs stamp paper batwara format',
    'online batwara form maker',
    'bihar land survey partition deed',
    'Bihar Survey Sahayak',
    'Download आपसी पंचनामा बंटवारा Form PDF Free (Bihar Survey 2026)'
  ],
  authors: [{ name: 'Bihar Survey Sahayak' }],
  openGraph: {
    title: 'ऑनलाइन आपसी सहमति बंटवारा पंचनामा (Family Partition Deed)',
    description: 'जमीन का बंटवारा करना हुआ आसान! हमारा ऑटोमैटिक कैलकुलेटर इस्तेमाल करें और सभी भाइयों का हिस्सा बराबर बांटकर 2 मिनट में अपना बंटवारा पंचनामा तैयार करें। स्टाम्प पेपर पर सीधा प्रिंट करें।',
    url: 'https://biharsurveysahayak.com/batwara-panchnama', // अपना असली URL डालें
    siteName: 'Bihar Survey Sahayak',
    images: [
      {
        url: 'https://biharsurveysahayak.com/og-batwara.png', // बैनर इमेज (स्टाम्प पेपर वाला ग्राफ़िक लगायें)
        width: 1200,
        height: 630,
        alt: 'Batwara Panchnama Format Bihar Land Survey',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'बिहार सर्वे: आपसी सहमति बंटवारा पंचनामा 2 मिनट में बनाएं',
    description: 'ऑटोमैटिक हिस्सा (रकबा/डिसमिल) कैलकुलेटर के साथ अपना बंटवारा फॉर्म भरें। मात्र ₹8 में असली 100 रु के स्टाम्प फॉर्मेट में डाउनलोड करें।',
    images: ['https://biharsurveysahayak.com/og-batwara.png'],
  },
  alternates: {
    canonical: 'https://biharsurveysahayak.com/batwara-panchnama', // अपना असली URL डालें
  },
};

// अपने क्लाइंट कंपोनेंट (बंटवारा फॉर्म) को यहाँ इम्पोर्ट करें
import LegalPanchnama from './batwara'; 

export default function Page() {
  return (
    <main>
      <LegalPanchnama />
    </main>
  );
}