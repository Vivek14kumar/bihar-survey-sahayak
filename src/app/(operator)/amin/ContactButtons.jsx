"use client";

import { Phone } from "lucide-react";

export default function ContactButtons({
  mobileNumber,
  whatsappNumber,
  slug,
}) {
  
  // Custom handler for Call button
  const handleCallClick = async (e) => {
    e.preventDefault(); 
    
    try {
      await fetch("/api/amins/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, type: "call" }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      // Open the phone dialer after the fetch is sent
      window.location.href = `tel:${mobileNumber}`;
    }
  };

  // Custom handler for WhatsApp button
  const handleWhatsAppClick = async (e) => {
    e.preventDefault();
    const targetUrl = `https://wa.me/91${whatsappNumber}?text=नमस्ते, मैंने Bihar Survey Sahayak पर आपकी प्रोफाइल देखी है।`;

    try {
      await fetch("/api/amins/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT: Sending "whatsApp" with a capital A to match your DB schema
        body: JSON.stringify({ slug, type: "whatsApp" }), 
      });
    } catch (error) {
      console.error(error);
    } finally {
      // Open WhatsApp in a new tab after the fetch is sent
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-white/40 p-2 md:p-3 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.18)] flex gap-2 md:gap-4">

      {/* CALL BUTTON */}
      <a
        href={`tel:${mobileNumber}`} // Keeping href for accessibility/SEO, but preventing default on click
        onClick={handleCallClick}
        className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full py-3.5 md:py-4 flex items-center justify-center gap-2 font-bold text-sm md:text-base active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30"
      >
        <Phone size={18} className="md:w-5 md:h-5" />
        कॉल करें
      </a>

      {/* WHATSAPP BUTTON */}
      <a
        href={`https://wa.me/91${whatsappNumber}`} // Keeping href for accessibility
        onClick={handleWhatsAppClick}
        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-600 hover:to-green-700 text-white rounded-full py-3.5 md:py-4 flex items-center justify-center gap-2 font-bold text-sm md:text-base active:scale-[0.98] transition-all shadow-lg shadow-green-500/30"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
          alt="WhatsApp"
          className="w-5 h-5 md:w-6 md:h-6"
        />
        WhatsApp
      </a>

    </div>
  );
}