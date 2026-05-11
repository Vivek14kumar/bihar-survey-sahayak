"use client";

import { useState } from "react";
import Script from "next/script";

export default function FAQClient() {
  const [language, setLanguage] = useState("hi");

  const faqs = {
    en: [
      {
      question: "Is this Vanshawali valid for Bihar Land Survey 2026?",
      answer:
        "Yes, this Vanshawali is designed as per the self-declaration format required for Bihar Land Survey 2026. It can be submitted along with Prapatra-2 at your local survey camp.",
    },
      {
        question: "What is Vanshawali?",
        answer:
          "Vanshawali is a traditional family lineage record that shows your ancestors and generations in a structured family tree format.",
      },
      {
        question: "How can I create my family tree online?",
        answer:
          "You can create your family tree online by entering your family details in our Vanshawali generator and downloading the PDF instantly.",
      },
     
      {
        question: "Can I create Vanshawali in Hindi?",
        answer:
          "Yes, our platform supports Hindi input, so you can create your family tree in Hindi.",
      },
      
    {
      question: "What is the fee for downloading the PDF?",
      answer:
        "The preview is free. To download the final high-quality PDF without a watermark for official use, there is a nominal service fee of ₹10.",
    },
    {
      question: "How do I create a Vanshawali for the survey?",
      answer:
        "Simply enter the names of your family members, their relations, and whether they are deceased. Our tool automatically generates a professional family tree diagram for you.",
    },
    {
      question: "Will my data be saved on your server?",
      answer:
        "No. We prioritize your privacy. Your family data is stored only in your browser's local storage and is not saved on our servers.",
    },
    ],
    hi: [
      {
      question: "क्या यह वंशावली बिहार भूमि सर्वे 2026 के लिए मान्य है?",
      answer:
        "हाँ, यह वंशावली बिहार भूमि सर्वे 2026 के लिए आवश्यक स्व-घोषणा प्रारूप में तैयार की गई है। इसे आप अपने स्थानीय सर्वे कैंप में प्रपत्र-2 के साथ जमा कर सकते हैं।",
    },
      {
        question: "वंशावली क्या है?",
        answer:
          "वंशावली एक पारंपरिक पारिवारिक रिकॉर्ड है जो आपके पूर्वजों और पीढ़ियों को परिवार वृक्ष के रूप में दर्शाता है।",
      },
      {
        question: "ऑनलाइन परिवार वृक्ष कैसे बनाएं?",
        answer:
          "आप हमारी वेबसाइट पर अपने परिवार की जानकारी दर्ज करके आसानी से वंशावली बना सकते हैं और तुरंत PDF डाउनलोड कर सकते हैं।",
      },
      {
        question: "क्या मैं हिंदी में वंशावली बना सकता हूँ?",
        answer:
          "हाँ, हमारी वेबसाइट हिंदी इनपुट का समर्थन करती है जिससे आप हिंदी में वंशावली बना सकते हैं।",
      },
      
    {
      question: "PDF डाउनलोड करने का शुल्क क्या है?",
      answer:
        "वंशावली का प्रीव्यू देखना बिल्कुल मुफ्त है। आधिकारिक कार्यों के लिए बिना वॉटरमार्क वाली हाई-क्वालिटी PDF डाउनलोड करने के लिए ₹10 का मामूली सेवा शुल्क है।",
    },
    {
      question: "सर्वे के लिए वंशावली कैसे बनाएं?",
      answer:
        "बस अपने परिवार के सदस्यों के नाम, उनके संबंध और वे जीवित हैं या नहीं, यह जानकारी दर्ज करें। हमारा टूल आपके लिए स्वचालित रूप से एक पेशेवर वंशावली तैयार कर देता है।",
    },
    {
      question: "क्या मेरा डेटा आपके सर्वर पर सुरक्षित है?",
      answer:
        "हम आपकी गोपनीयता का सम्मान करते हैं। आपका डेटा केवल आपके ब्राउज़र में रहता है और हमारे सर्वर पर सेव नहीं किया जाता है।",
    },
    ],
  };

  const selectedFaqs = faqs[language];

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-6">
          {language === "en"
            ? "Frequently Asked Questions (FAQ)"
            : "अक्सर पूछे जाने वाले प्रश्न (FAQ)"}
        </h1>

        {/* Language Toggle */}
        <div className="flex justify-center mb-10 space-x-4">
          <button
            onClick={() => setLanguage("en")}
            className={`px-5 py-2 rounded-full ${
              language === "en"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            English
          </button>

          <button
            onClick={() => setLanguage("hi")}
            className={`px-5 py-2 rounded-full ${
              language === "hi"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {selectedFaqs.map((faq, index) => (
            <details
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md cursor-pointer"
            >
              <summary className="text-lg font-semibold">
                {faq.question}
              </summary>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Structured Data */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [...faqs.en, ...faqs.hi].map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
