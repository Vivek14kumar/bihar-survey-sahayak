// app/forms/layout.jsx (या आपका जो भी फोल्डर हो)
import PaperFormatClient from "./PaperFormatPage";

export const metadata = {
  title: 'Bihar Land Survey Forms PDF Download | Bihar Survey Sahayak',
  description: 'बिहार भूमि सर्वेक्षण (Bihar Land Survey) से जुड़े सभी आवश्यक फॉर्म (PDF) डाउनलोड करें। वंशावली, बँटवारा, रैयती फॉर्म और अन्य सभी प्रपत्र (Documents) यहाँ एक ही जगह फ्री में उपलब्ध हैं।',
  keywords: [
    'Prapatra 2 pdf downlaod',
    'Bihar land survey PDF download',
    'Bihar survey forms PDF',
    'Vanshawali form PDF download',
    'Batwara form PDF Bihar',
    'Bihar bhumi survey documents',
    'Survey form PDF in Hindi',
    'Bihar Survey Sahayak pdf forms'
  ],
  openGraph: {
    title: 'Bihar Land Survey Forms Collection | Download PDFs',
    description: 'बिहार भूमि सर्वेक्षण के सभी आवश्यक फॉर्म (PDF) आसानी से देखें और सिंगल क्लिक में डाउनलोड करें।',
    url: 'https://biharsurveysahayak.online/forms', // यहाँ अपने पेज का सही URL डालें
    siteName: 'Bihar Survey Sahayak',
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download All Bihar Land Survey Forms PDF',
    description: 'बिहार भूमि सर्वेक्षण के सभी पीडीएफ फॉर्म डाउनलोड करें। वंशावली और बँटवारा फॉर्म उपलब्ध हैं।',
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
    canonical: 'https://biharsurveysahayak.online/forms',
  },
};

export default function  Page() {
  return <>{<PaperFormatClient />}</>;
}