"use client";
import { useState, useEffect } from "react";
import { X, BellRing } from "lucide-react";
import SubscribeButton from "./SubscribeButton";

export default function SubscribePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Check local storage for the date they dismissed it
    const dismissedTime = localStorage.getItem("surveyPopupDismissedDate");
    const isAlreadySubscribed = localStorage.getItem("surveySubscribed");

    // If we already know they subscribed, stop right here.
    if (isAlreadySubscribed === "true") return;

    // 2. If they dismissed it, check if 1 day has passed
    let shouldShow = true;
    if (dismissedTime) {
      // Calculate days passed since they clicked "No Thanks"
      const daysPassed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      
      // If it has been LESS than 1 day, keep the popup hidden
      if (daysPassed < 1) {
        shouldShow = false; 
      }
    }

    if (!shouldShow) return; // Exit if we shouldn't show it yet

    async function checkSubscription() {
      // 3. Double-check the actual browser PushManager just to be 100% sure
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
      // 4. If they are NOT subscribed and it has been more than 1 day
      if (!isSubscribed) {
        // Wait 5 seconds so they can see your website first
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 9000);

        return () => clearTimeout(timer);
      }
    });
  }, []);

  // When they click the "X" or "No thanks"
  const handleClose = () => {
    // Save the exact timestamp of right now
    localStorage.setItem("surveyPopupDismissedDate", Date.now().toString());
    setIsOpen(false);
  };

  // When they click inside the subscribe area
  const handleSubscribeClick = () => {
    localStorage.setItem("surveySubscribed", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      
      {/* POPUP BOX */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-slate-200 bg-black/20 hover:bg-black/40 p-2 rounded-full transition z-10"
        >
          <X size={20} />
        </button>

        {/* Top Decoration */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
          
          <div className="bg-white/20 p-4 rounded-full inline-flex mb-3 shadow-inner">
            <BellRing className="text-white animate-bounce" size={36} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            सर्वे अपडेट्स पाएं!
          </h3>
          <p className="text-indigo-100 font-medium text-sm">
            Get Instant Survey Updates!
          </p>
        </div>

        {/* Content */}
        <div className="p-8 text-center bg-slate-50">
          
          <div className="mb-6 space-y-2">
            <p className="text-slate-700 font-medium text-lg leading-snug">
              बिहार भूमि सर्वे का नया फॉर्म, नियम या जरूरी खबर आते ही अपने फोन पर नोटिफिकेशन पाएं।
            </p>
            <p className="text-slate-500 text-sm">
              Get notified on your phone as soon as new forms, rules, or important news are released.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div onClick={handleSubscribeClick} className="w-full">
               <SubscribeButton />
            </div>

            <button 
              onClick={handleClose}
              className="text-slate-400 font-semibold text-sm hover:text-slate-600 transition underline-offset-4 hover:underline"
            >
              नहीं, मुझे अपडेट्स नहीं चाहिए / No Thanks
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
}