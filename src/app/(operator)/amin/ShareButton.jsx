"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShareButton({ aminName }) {
  const [currentUrl, setCurrentUrl] = useState("");

  // Get the current page URL only after the component mounts on the client
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const handleShare = () => {
    // 1. Prepare the professional Hindi message *${aminName}* (अमीन)
    const message = `भूमि सर्वेक्षण से जुड़ी किसी भी प्रकार की समस्या या सलाह के लिए से संपर्क करें:\n\n🔗 ${currentUrl}`;
    
    // 2. Format it for WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // 3. Open WhatsApp in a new tab/app
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-black/20 text-white shadow-sm transition-all active:scale-95"
      aria-label="Share on WhatsApp"
    >
      <Share2 size={16} className="md:w-5 md:h-5" />
      <span className="text-xs md:text-sm font-bold tracking-wider">SHARE</span>
    </button>
  );
}