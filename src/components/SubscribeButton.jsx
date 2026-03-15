"use client";
import { useState, useEffect } from 'react';

export default function SubscribeButton({ onSuccess }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWaitingForPermission, setIsWaitingForPermission] = useState(false); // नया स्टेट

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
        setIsWaitingForPermission(true); // बटन का टेक्स्ट बदलें

        const register = await navigator.serviceWorker.register('/sw.js');
        const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
        
        if (!publicVapidKey) {
          alert("VAPID Key नहीं मिली! कृपया Vercel पर चेक करें।");
          setIsWaitingForPermission(false);
          return;
        }

        // यहाँ कोड तब तक रुकेगा जब तक यूज़र Allow या Block नहीं दबाता
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        // अगर Allow कर दिया, तो डेटाबेस में सेव करें
        await fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: { 'Content-Type': 'application/json' }
        });

        setIsSubscribed(true);
        setIsWaitingForPermission(false);
        
        // पॉपअप को बंद करने के लिए onSuccess को कॉल करें
        if (onSuccess) {
          onSuccess();
        } else {
          alert("अब आपको नए सर्वे अपडेट्स की जानकारी तुरंत मिलती रहेगी!");
        }
        
      } catch (error) {
        console.error("Subscription failed:", error);
        setIsWaitingForPermission(false); // बटन को वापस नॉर्मल करें
        
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
      className={`px-5 py-3 rounded-xl font-semibold transition w-full shadow-sm text-center
        ${isSubscribed || isWaitingForPermission
          ? "bg-gray-200 text-gray-700 cursor-default" 
          : "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
        }`}
    >
      {isLoading 
        ? "लोड हो रहा है..." 
        : isSubscribed 
          ? "नोटिफिकेशन्स चालू हैं 🔔" 
          : isWaitingForPermission 
            ? "ब्राउज़र में 'Allow' दबाएं ⏳" // नया लोडिंग टेक्स्ट
            : "नए अपडेट्स के लिए सब्सक्राइब करें 🔔"}
    </button>
  );
}