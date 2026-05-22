"use client";

import { useState, useEffect } from "react";
import { X, BellRing, CheckCircle2, Sparkles } from "lucide-react";
import SubscribeButton from "./SubscribeButton";

export default function SubscribePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissedTime = localStorage.getItem("surveyPopupDismissedDate");
    const isAlreadySubscribed = localStorage.getItem("surveySubscribed");

    if (isAlreadySubscribed === "true") return;

    let shouldShow = true;
    if (dismissedTime) {
      const daysPassed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysPassed < 1) {
        shouldShow = false; 
      }
    }

    if (!shouldShow) return;

    async function checkSubscription() {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const register = await navigator.serviceWorker.getRegistration();
          if (register) {
            const subscription = await register.pushManager.getSubscription();
            if (subscription) {
              localStorage.setItem("surveySubscribed", "true");
              return true; 
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
      return false; 
    }

    checkSubscription().then((isSubscribed) => {
      if (!isSubscribed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 9000);

        return () => clearTimeout(timer);
      }
    });
  }, []);

  const handleClose = () => {
    localStorage.setItem("surveyPopupDismissedDate", Date.now().toString());
    setIsOpen(false);
  };

  // This runs exactly when the SubscribeButton finishes its job!
  const handleSuccessfulSubscription = () => {
    localStorage.setItem("surveySubscribed", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-300">
      
      <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] max-w-[420px] w-full relative overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
        
        {/* 🌈 Subtle Premium Top Border Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600"></div>

        {/* ❌ Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-10 text-center relative">
          
          {/* ✨ Ambient Background Glow */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* 🔔 Premium Animated Icon Area */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 animate-pulse"></div>
            <div className="relative w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl rotate-3 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white">
              <BellRing size={32} className="-rotate-3" />
              <Sparkles size={16} className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" />
            </div>
          </div>

          {/* 📝 Headings */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
            सर्वे की <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ताज़ा खबर</span> पाएं
          </h3>
          <p className="text-slate-500 font-medium mb-6 text-sm sm:text-base leading-relaxed">
            नए फॉर्म, नियम या ज़रूरी अपडेट्स आते ही सबसे पहले अपने फोन पर नोटिफिकेशन प्राप्त करें।
          </p>

          {/* 🛡 Trust Badges (Crucial for conversions 100% फ्री) */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={14} /> तुरंत अलर्ट
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={14} /> सही खबर 
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={14} /> कोई स्पैम नहीं
            </span>
          </div>

          {/* ⚡ Action Area */}
          <div className="flex flex-col gap-4 relative z-10">
            
            {/* The actual logic remains exactly the same */}
            <div className="transform hover:scale-[1.02] transition-transform">
              <SubscribeButton onSuccess={handleSuccessfulSubscription} />
            </div>

            <button 
              onClick={handleClose}
              className="text-slate-400 font-semibold text-[13px] hover:text-slate-600 transition-colors"
            >
              नहीं, मुझे अपडेट्स नहीं चाहिए
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}