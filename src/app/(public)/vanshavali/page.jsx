import VanshavaliClient from "./vanshavali-client";

export const metadata = {
  title: "वंशावली जनरेटर (Vanshavali Maker) | Bihar Survey Sahayak",
  description: "बिहार भूमि सर्वेक्षण के लिए आधिकारिक प्रारूप में वंशावली (Family Tree) पीडीएफ बनाएं। आसान हिंदी टाइपिंग और तुरंत डाउनलोड सुविधा।",
  keywords: "Vanshavali form pdf, Bihar survey vanshavali format, online vanshavali maker, family tree generator bihar, वंशावली फॉर्म पीडीएफ",
  alternates: {
    canonical: "https://biharsurveysahayak.online/vanshavali",
  },
};

export default function VanshavaliPage() {
  return <VanshavaliClient />;
}