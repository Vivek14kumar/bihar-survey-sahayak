// app/create-forms/page.jsx

import FormsClient from "./FormsPage";

export const metadata = {
  title: 'Bihar Land Survey Forms Generator - Vanshavali, Batwara, Prapatra | Bihar Survey Sahayak',
  description: 'बिहार भूमि सर्वेक्षण के लिए वंशावली, प्रपत्र-2, प्रपत्र-3 (1), पारिवारिक बँटवारा, शपथ-पत्र और आपत्ति पत्र ऑनलाइन तैयार करें। आसान और फास्ट फॉर्म जनरेटर।',
  keywords: [
    'Bihar land survey forms online',
    'Vanshavali kaise banaye online',
    'Batwara application format Bihar',
    'Prapatra 2 aur 3 format',
    'Shapath patra format Bihar survey',
    'Bihar bhumi survey form generator',
    'Death certificate affidavit format',
    'Bihar Survey Sahayak'
  ],
  openGraph: {
    title: 'ऑनलाइन जनरेट करें बिहार सर्वे के सभी फॉर्म्स | Bihar Survey Sahayak',
    description: 'वंशावली, बँटवारा, शपथ-पत्र और प्रपत्र-2 जैसे सभी महत्वपूर्ण बिहार लैंड सर्वे फॉर्म्स मिनटों में ऑनलाइन तैयार करें।',
    url: 'https://biharsurveysahayak.online/create-forms', // यहाँ अपने पेज का सही URL डालें
    siteName: 'Bihar Survey Sahayak',
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bihar Land Survey Form Generator',
    description: 'बिहार भूमि सर्वेक्षण के सभी फॉर्म (वंशावली, प्रपत्र आदि) आसानी से ऑनलाइन भरें और तैयार करें।',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://biharsurveysahayak.online/create-forms',
  },
};

export default function Page() {
  return <FormsClient />;
}