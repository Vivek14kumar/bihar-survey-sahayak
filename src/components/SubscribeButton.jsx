"use client";
import { useState, useEffect } from 'react';

// 1. ADD 'onSuccess' PROP HERE
export default function SubscribeButton({ onSuccess }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        const register = await navigator.serviceWorker.register('/sw.js');
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
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
        alert("अब आपको नए सर्वे अपडेट्स की जानकारी तुरंत मिलती रहेगी!");
        
        // 2. TELL THE POPUP WE ARE DONE SO IT CAN CLOSE!
        if (onSuccess) {
          onSuccess();
        }
        
      } catch (error) {
        console.error("Subscription failed:", error);
        if (Notification.permission === 'denied') {
          alert("आपने नोटिफिकेशन्स ब्लॉक कर दिए हैं। कृपया ब्राउज़र सेटिंग्स में जाकर इसे चालू करें।");
        }
      }
    } else {
      alert("आपका ब्राउज़र नोटिफिकेशन्स सपोर्ट नहीं करता है।");
    }
  };

  return (
    <button 
      onClick={subscribeToNotifications}
      disabled={isSubscribed || isLoading}
      className={`px-5 py-3 rounded-xl font-semibold transition w-full shadow-sm
        ${isSubscribed 
          ? "bg-gray-200 text-gray-700 cursor-default" 
          : "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
        }`}
    >
      {isLoading ? "लोड हो रहा है..." : (isSubscribed ? "नोटिफिकेशन्स चालू हैं 🔔" : "नए अपडेट्स के लिए सब्सक्राइब करें 🔔")}
    </button>
  );
}