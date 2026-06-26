import VanshavaliPhoto from './VanshavaliPhoto';

export const metadata = {
  title: 'फोटो वाली वंशावली बनाएं | Photo Vanshavali Maker - Bihar Survey Sahayak',
  description: 'MS Word की झंझट खत्म! मात्र 2 मिनट में मोबाइल से फोटो वाली वंशावली (Family Tree) बनाएं और PDF डाउनलोड करें। बिहार भूमि सर्वे, कोर्ट और पंचायत के लिए मान्य।',
  keywords: [
    'photo wali vanshavali',
    'vanshavali maker with photo',
    'bihar bhumi survey vanshavali form',
    'online family tree generator',
    'वंशावली कैसे बनाएं',
    'digital vanshavali maker',
    'csc vanshavali pdf',
    'Bihar Survey Sahayak',
    'vansh vriksh generator'
  ],
  authors: [{ name: 'Bihar Survey Sahayak' }],
  openGraph: {
    title: 'फोटो वाली वंशावली जनरेटर (Photo Vanshavali Maker)',
    description: 'मात्र 2 मिनट में अपने मोबाइल से फोटो वाली वंशावली बनाएं और PDF डाउनलोड करें। कैफे वालों के लिए सबसे बेस्ट टूल।',
    url: 'https://biharsurveysahayaka.online/vanshavali-photo',
    siteName: 'Bihar Survey Sahayak',
    images: [
      {
        url: 'https://biharsurveysahayaka.online/images/vanshavali-photo-banner.jpg', // यहाँ अपने किसी पोस्टर/इमेज का लिंक डाल दें
        width: 1200,
        height: 630,
        alt: 'Photo Wali Vanshavali Maker Banner',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'फोटो वाली वंशावली बनाएं | Photo Vanshavali Maker',
    description: 'मात्र 2 मिनट में अपने मोबाइल से फोटो वाली वंशावली बनाएं और PDF डाउनलोड करें।',
    images: ['https://biharsurveysahayaka.online/images/vanshavali-photo-banner.jpg'],
  },
  alternates: {
    canonical: 'https://biharsurveysahayaka.online/vanshavali-photo',
  },
};

export default function VanshavaliPage() {
  return <VanshavaliPhoto />;
}