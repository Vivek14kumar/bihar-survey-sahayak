"use client";
import { useState, useEffect } from 'react';
import { BellRing, CheckCircle2, Loader2, MousePointerClick } from 'lucide-react';

export default function SubscribeButton({ onSuccess }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForPermission, setIsWaitingForPermission] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const register = await navigator.serviceWorker.register('/sw.js');
          const subscription = await register.pushManager.getSubscription();
          
          if (subscription) {
            setIsSubscribed(true);
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
      setIsLoading(false);
    }
    checkSubscription();
  }, []);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        setIsWaitingForPermission(true);

        const register = await navigator.serviceWorker.register('/sw.js');
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
        
        if (!publicVapidKey) {
          alert("VAPID Key नहीं मिली! कृपया Vercel पर चेक करें।");
          setIsWaitingForPermission(false);
          return;
        }

        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        await fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: { 'Content-Type': 'application/json' }
        });

        setIsSubscribed(true);
        setIsWaitingForPermission(false);
        
        if (onSuccess) {
          onSuccess();
        } else {
          alert("अब आपको नए सर्वे अपडेट्स की जानकारी तुरंत मिलती रहेगी!");
        }
        
      } catch (error) {
        console.error("Subscription failed:", error);
        setIsWaitingForPermission(false);
        
        if (Notification.permission === 'denied') {
          alert("आपने नोटिफिकेशन्स ब्लॉक कर दिए हैं। कृपया ब्राउज़र सेटिंग्स में जाकर परमिशन दें।");
        } else {
          alert("कुछ गलत हो गया: " + error.message);
        }
      }
    } else {
      alert("आपका ब्राउज़र नोटिफिकेशन्स सपोर्ट नहीं करता है।");
    }
  };

  return (
    <button 
      onClick={subscribeToNotifications}
      disabled={isSubscribed || isLoading || isWaitingForPermission}
      className={`group relative w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-[15px] sm:text-base transition-all duration-300 overflow-hidden outline-none focus:ring-2 focus:ring-offset-2
        ${isLoading 
          ? "bg-slate-50 border border-slate-100 text-slate-400 shadow-none cursor-wait" 
          : isSubscribed 
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-none cursor-default" 
            : isWaitingForPermission
              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 cursor-wait animate-pulse focus:ring-amber-500"
              // 🔥 यहाँ हाई-कन्वर्जन ऑरेंज-रोज़ ग्रेडिएंट लगाया गया है
              : "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] focus:ring-orange-500"
        }`}
    >
      {/* 🌟 Animated Sheen Effect for Default State */}
      {!isLoading && !isSubscribed && !isWaitingForPermission && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
      )}

      {/* 🌀 Content Rendering Based on State */}
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>लोड हो रहा है...</span>
        </>
      ) : isSubscribed ? (
        <>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>नोटिफिकेशन्स चालू हैं</span>
        </>
      ) : isWaitingForPermission ? (
        <>
          <MousePointerClick className="w-5 h-5 animate-bounce" />
          <span>ब्राउज़र में 'Allow' दबाएं ⏳</span>
        </>
      ) : (
        <>
          <BellRing className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm" />
          <span className="drop-shadow-sm">
            सब्सक्राइब करें <span className="mx-1 text-white/70 font-medium text-[13px] sm:text-sm">| Subscribe</span>
          </span>
        </>
      )}

      {/* 🔮 Animation Definitions */}
      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </button>
  );
}