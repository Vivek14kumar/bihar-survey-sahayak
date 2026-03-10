"use client";

import { Share2 } from "lucide-react";

export default function ShareButton() {
  const share = () => {
    // Dynamic text that includes a call to action
    const text = 
      "🚩 *बिहार भूमि सर्वे 2026 सहायता* 🚩\n\n" +
      "अब आप घर बैठे बिहार भूमि सर्वे के सभी फॉर्म (प्रपत्र-2, वंशावली, शपथ पत्र) ऑनलाइन भर सकते हैं।\n\n" +
      "यहाँ क्लिक करें: https://biharsurveysahayak.online\n\n" +
      "अपने गाँव के ग्रुप में शेयर करें ताकि सबकी मदद हो सके। 🙏";

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={share}
      className="group relative flex items-center justify-center gap-3 bg-green-500 hover:bg-green-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
    >
      {/* Subtle pulse effect for the icon */}
      <span className="relative flex h-6 w-6">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
        <Share2 className="relative h-6 w-6" />
      </span>
      
      <span>WhatsApp पर शेयर करें</span>
      
      {/* Tooltip-like hint on hover */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        गाँव के ग्रुप में भेजें
      </div>
    </button>
  );
}