export const metadata = {
  title: 'प्रपत्र 3 (1) वंशावली फॉर्म ऑनलाइन बनाएं | Prapatra 3 pdf| Bihar Land Survey',
  description: 'बिहार विशेष भूमि सर्वेक्षण के लिए प्रपत्र 3(1) वंशावली (Vanshavali) फॉर्म ऑनलाइन भरें। हमारा स्मार्ट ट्री-बिल्डर (Tree Builder) इस्तेमाल करें और मात्र ₹8 में असली सरकारी फॉर्मेट में PDF डाउनलोड करें।',
  keywords: [
    'prapatra 3 (1) vanshavali pdf',
    'bihar land survey vanshavali form',
    'प्रपत्र 3 (1) वंशावली फॉर्म बिहार',
    'vanshavali kaise banaye bihar survey',
    'family tree format for bihar land survey',
    'bihar bhumi survey form 3 download',
    'online vanshavali maker bihar',
    'vanshavali form pdf',
    'Prapatra 3 pdf',
    'Bihar Survey Sahayak',
    'वंशावली बनाने का तरीका'
  ],
  authors: [{ name: 'Bihar Survey Sahayak' }],
  openGraph: {
    title: 'प्रपत्र 3 (1) वंशावली - स्मार्ट ट्री मेकर के साथ ऑनलाइन बनाएं',
    description: 'बिहार भूमि सर्वेक्षण के लिए अपनी वंशावली (Family Tree) चुटकियों में तैयार करें। नाम डालें और हमारा सिस्टम अपने आप सरकारी फॉर्मेट (प्रपत्र 3) में आपका फॉर्म तैयार कर देगा।',
    url: 'https://biharsurveysahayak.com/vanshavali-prapatra-3', // अपना असली URL डालें
    siteName: 'Bihar Survey Sahayak',
    images: [
      {
        url: 'https://biharsurveysahayak.com/og-vanshavali.png', // बैनर इमेज (ट्री डायग्राम वाला ग्राफ़िक लगायें)
        width: 1200,
        height: 630,
        alt: 'Prapatra 3 (1) Vanshavali Format Bihar Survey',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'बिहार सर्वे: प्रपत्र 3 (1) वंशावली फॉर्म ऑनलाइन बनाएं',
    description: 'हाथ से डायग्राम बनाने की झंझट खत्म! यहाँ नाम टाइप करें और ऑटोमैटिक वंशावली ट्री के साथ अपना प्रपत्र 3(1) मात्र ₹8 में डाउनलोड करें।',
    images: ['https://biharsurveysahayak.com/og-vanshavali.png'],
  },
  alternates: {
    canonical: 'https://biharsurveysahayak.com/vanshavali-prapatra-3', // अपना असली URL डालें
  },
};

// अपने क्लाइंट कंपोनेंट को यहाँ इम्पोर्ट करें
import PrapatraVanshavaliTree from "./prapatra-3";

export default function Page() {
  return (
    <main>
      <PrapatraVanshavaliTree />
    </main>
  );
}