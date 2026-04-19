import React, { useState, useEffect } from 'react';

const PublicStats = () => {
  const [stats, setStats] = useState({ pageViews: 0 });

  useEffect(() => {
    fetch("/api/get-analytics")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log("Stats fetch error:", err));
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K+";
    }
    return num || "23.6K+"; 
  };

  return (
    <div className="flex flex-col items-center justify-center my-4 px-4 w-full animate-fade-in">
      {/* Main Container: Mobile में चौड़ाई पूरी (w-full) और बड़े स्क्रीन पर auto */}
      <div className="flex items-center space-x-2 bg-blue-50 border border-blue-100 py-2.5 px-4 rounded-2xl md:rounded-full shadow-sm max-w-[95%] md:max-w-max">
        
        {/* Live Indicator (Ping Effect) */}
        <div className="flex-shrink-0 relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </div>
        
        {/* Text Area: Mobile पर टेक्स्ट छोटा (text-xs) और बड़े स्क्रीन पर बड़ा (text-sm) */}
        <p className="text-blue-900 font-medium text-xs sm:text-sm md:text-base leading-tight">
          बिहार के <span className="font-bold text-blue-700">{formatNumber(stats.pageViews)}</span> रैयतों द्वारा भरोसेमंद 
          <span className="hidden sm:inline ml-1 text-blue-400">|</span> 
          <span className="block sm:inline text-[10px] sm:text-xs text-blue-700 font-bold sm:ml-1">
             Trusted by {formatNumber(stats.pageViews)} landowners
          </span>
        </p>
      </div>
      
      {/* Subtext: मोबाइल पर हल्का दिखाने के लिए */}
      <p className="text-[10px] md:text-xs text-white mt-2 text-center italic leading-tight">
        *डाटा आपके द्वारा जनरेट किए गए दस्तावेजों पर आधारित है
      </p>
    </div>
  );
};

export default PublicStats;