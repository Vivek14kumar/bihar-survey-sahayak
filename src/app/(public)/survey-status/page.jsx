"use client";

import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import CompactQuickLinks from "@/components/QuickLinksFooter";

export default function SurveyStatusPage() {

  const [loading, setLoading] = useState(false);

  const handleRedirect = () => {
    setLoading(true);

    setTimeout(() => {
      window.open(
        "https://dlrs.bihar.gov.in/", // replace with exact status page if needed
        "_blank"
      );
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Title */}
      <h1 className="text-3xl font-bold text-center">
        बिहार भूमि सर्वे आवेदन स्थिति जांचें
      </h1>

      <p className="text-center text-gray-600 mt-3">
        अगर आपने बिहार भूमि सर्वे में आवेदन किया है तो नीचे दिए गए
        बटन से सरकारी वेबसाइट पर जाकर अपनी स्थिति जांच सकते हैं।
      </p>

      {/* Status Box */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">

        <p className="text-lg font-semibold">
          🔍 सर्वे आवेदन की स्थिति देखने के लिए
        </p>

        <button
          onClick={handleRedirect}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto"
        >
          {loading ? "लोड हो रहा है..." : "सर्वे स्टेटस चेक करें"}
          <ExternalLink size={18} />
        </button>

      </div>

      {/* Steps */}
      <div className="mt-10 bg-white border rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          स्टेटस कैसे चेक करें
        </h2>

        <ol className="space-y-2 text-gray-700 list-decimal ml-5">
          <li>ऊपर दिए गए "सर्वे स्टेटस चेक करें" बटन पर क्लिक करें</li>
          <li>सरकारी वेबसाइट खुलेगी</li>
          <li>अपना आवेदन संख्या / विवरण भरें</li>
          <li>अपनी सर्वे स्थिति देखें</li>
        </ol>

      </div>

      <div className="flex justify-center mt-4 mb-4">
        <ShareButton/>
      </div>

      <CompactQuickLinks/>
      
      {/* Disclaimer */}
      <div className="mt-8 text-sm text-gray-500 text-center">

        यह पेज केवल जानकारी देने के लिए है।  
        स्टेटस देखने के लिए आपको सरकारी वेबसाइट पर भेजा जाएगा।

      </div>

    </div>
  );
}