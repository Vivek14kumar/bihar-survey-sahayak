export const metadata = {
  title: 'प्रपत्र 2 (Prapatra 2) स्व-घोषणा फॉर्म ऑनलाइन बनाएं |Prapatra 2 pdf | Bihar Land Survey',
  description: 'बिहार विशेष भूमि सर्वेक्षण के लिए प्रपत्र 2 (रैयत द्वारा धारित भूमि की स्व-घोषणा) ऑनलाइन भरें। मात्र ₹8 में बिना किसी गलती के असली सरकारी फॉर्मेट में PDF डाउनलोड करें और प्रिंट निकालें।',
  keywords: [
    'prapatra 2 form bihar survey',
    'bihar bhumi survey prapatra 2 pdf',
    'form 2 bihar land survey download',
    'prapatra 2 kaise bhare',
    'रैयत द्वारा धारित भूमि की स्व-घोषणा प्रपत्र 2',
    'online prapatra 2 maker bihar',
    'bihar special survey form 2 pdf',
    'land declaration form 2 bihar',
    'Bihar Survey Sahayak',
    'Prapatra 2 pdf',
    'प्रपत्र 2 पीडीएफ डाउनलोड'
  ],
  authors: [{ name: 'Bihar Survey Sahayak' }],
  openGraph: {
    title: 'प्रपत्र 2 (Prapatra 2) - भूमि स्व-घोषणा फॉर्म ऑनलाइन बनाएं',
    description: 'जमीन का ब्यौरा देने के लिए बिहार सर्वे का प्रपत्र 2 (Form 2) यहाँ से ऑनलाइन भरें। अपना नाम, खाता, खेसरा डालें और तुरंत 100% सही सरकारी फॉर्मेट में फॉर्म डाउनलोड करें।',
    url: 'https://biharsurveysahayak.com/prapatra-2', // अपना असली URL डालें
    siteName: 'Bihar Survey Sahayak',
    images: [
      {
        url: 'https://biharsurveysahayak.com/og-prapatra-2.png', // बैनर इमेज (प्रपत्र 2 के फॉर्म वाला ग्राफ़िक लगायें)
        width: 1200,
        height: 630,
        alt: 'Prapatra 2 Form 2 Bihar Land Survey Format',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'बिहार भूमि सर्वे: प्रपत्र 2 (स्व-घोषणा) फॉर्म 2 मिनट में बनाएं',
    description: 'अब हाथ से फॉर्म भरने में गलती नहीं होगी! ऑनलाइन अपनी जमीन का ब्यौरा भरें और मात्र ₹8 में प्रपत्र 2 का प्रिंट-रेडी PDF डाउनलोड करें।',
    images: ['https://biharsurveysahayak.com/og-prapatra-2.png'],
  },
  alternates: {
    canonical: 'https://biharsurveysahayak.com/prapatra-2', // अपना असली URL डालें
  },
};

// अपने क्लाइंट कंपोनेंट (प्रपत्र 2 वाले फॉर्म) को यहाँ इम्पोर्ट करें
import LandscapePage from './prapatra-2'; // अपने कॉम्पोनेन्ट का सही नाम डालें

export default function Page() {
  return (
    <main>
      <LandscapePage />
    </main>
  );
}