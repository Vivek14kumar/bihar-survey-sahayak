"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function MobilePopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    // Check if popup already shown in this browser session
    const alreadyShown = sessionStorage.getItem("mobilePopupShown");

    if (isMobile && !alreadyShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        sessionStorage.setItem("mobilePopupShown", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-indigo-600 to-emerald-500 text-white rounded-3xl shadow-2xl p-6 max-w-lg w-full text-center relative">
        
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <div className="text-6xl mb-4">💻</div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Better Experience on Laptop / Desktop
        </h2>

        <p className="text-lg sm:text-xl mb-4">
          मोबाइल पर सर्वोत्तम अनुभव नहीं है।  
          कृपया लैपटॉप या डेस्कटॉप पर खोलें।  
          <br />
          For the best results, please use a Laptop or Desktop.
        </p>

        <button
          onClick={() => setShowPopup(false)}
          className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
        >
          OK / ठीक है
        </button>
      </div>
    </div>
  );
}