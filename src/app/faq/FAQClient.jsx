"use client";

import { useState } from "react";
import Script from "next/script";

export default function FAQClient() {
  const [language, setLanguage] = useState("hi");

  const faqs = {
    en: [
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
        question: "Is the Vanshawali PDF download free?",
        answer:
          "Yes, you can easily generate and download your Vanshawali PDF from our platform.",
      },
      {
        question: "Can I create Vanshawali in Hindi?",
        answer:
          "Yes, our platform supports Hindi input, so you can create your family tree in Hindi.",
      },
    ],
    hi: [
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
        question: "क्या वंशावली PDF डाउनलोड करना मुफ्त है?",
        answer:
          "हाँ, आप आसानी से अपनी वंशावली बना और PDF डाउनलोड कर सकते हैं।",
      },
      {
        question: "क्या मैं हिंदी में वंशावली बना सकता हूँ?",
        answer:
          "हाँ, हमारी वेबसाइट हिंदी इनपुट का समर्थन करती है जिससे आप हिंदी में वंशावली बना सकते हैं।",
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
