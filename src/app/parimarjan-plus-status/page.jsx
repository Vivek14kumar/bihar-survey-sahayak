"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import ShareButton from "@/components/ShareButton";
import CompactQuickLinks from "@/components/QuickLinksFooter";

/*export const metadata = {
  title: "परिमार्जन प्लस आवेदन स्थिति जांचें | Bihar Parimarjan Status Check",
  description:
    "परिमार्जन प्लस पोर्टल पर आवेदन की स्थिति कैसे देखें। Application ID डालकर बिहार भूमि रिकॉर्ड सुधार आवेदन का स्टेटस ऑनलाइन चेक करें।",
};*/

export default function ParimarjanStatusPage() {

  const [loading, setLoading] = useState(false);

  const handleRedirect = () => {

    setLoading(true);

    setTimeout(() => {

      window.open(
        "https://parimarjanplus.bihar.gov.in/ParimarjanNew/trackapplication.aspx",
        "_blank"
      );

      setLoading(false);

    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Title */}
      <h1 className="text-3xl font-bold text-center">
        परिमार्जन प्लस आवेदन की स्थिति कैसे देखें
      </h1>

      <p className="text-center text-gray-600 mt-3">
        अगर आपने जमीन के रिकॉर्ड में सुधार के लिए आवेदन किया है,
        तो नीचे दिए गए बटन से अपनी आवेदन स्थिति ऑनलाइन देख सकते हैं।
      </p>

      

      {/* Step Guide */}
      <div className="mt-10 bg-white border rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          स्टेप बाय स्टेप प्रक्रिया
        </h2>

        <ol className="space-y-3 text-gray-700 list-decimal ml-5">

          <li>
            सबसे पहले ऊपर दिए गए <b>“परिमार्जन स्टेटस चेक करें”</b> बटन पर क्लिक करें।
          </li>

          <li>
            इसके बाद परिमार्जन पोर्टल का <b>Application Status</b> पेज खुलेगा।
          </li>

          <li>
            वहां आपको <b>Application ID / आवेदन संख्या</b> दर्ज करनी होगी।
          </li>

          <li>
            नीचे दिखाई दे रहा <b>Captcha Code</b> सही-सही भरें।
          </li>

          <li>
            अब <b>Search</b> या <b>Submit</b> बटन पर क्लिक करें।
          </li>

          <li>
            इसके बाद आपकी आवेदन स्थिति स्क्रीन पर दिखाई दे जाएगी।
          </li>

        </ol>

      </div>

      {/* Status Types */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-3">
          आवेदन की स्थिति में क्या लिखा हो सकता है
        </h2>

        <ul className="list-disc ml-5 space-y-2 text-gray-700">

          <li><b>Application Received</b> – आवेदन प्राप्त हो गया है</li>

          <li><b>Under Verification</b> – आवेदन की जांच चल रही है</li>

          <li><b>Pending for Correction</b> – कुछ जानकारी सुधारने की जरूरत है</li>

          <li><b>Approved</b> – आवेदन स्वीकृत हो गया है</li>

          <li><b>Rejected</b> – आवेदन अस्वीकृत हो गया है</li>

        </ul>

      </div>
      
      {/* Redirect Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">

        <p className="text-lg font-semibold">
          🔎 आवेदन की स्थिति देखने के लिए
        </p>

        <button
          onClick={handleRedirect}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 mx-auto"
        >
          {loading ? "लोड हो रहा है..." : "परिमार्जन स्टेटस चेक करें"}
          <ExternalLink size={18} />
        </button>

      </div>

      {/* If ID Missing */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-3">
          Application ID नहीं मिल रहा तो क्या करें
        </h2>

        <ul className="list-disc ml-5 space-y-2 text-gray-700">

          <li>आवेदन की रसीद (Receipt) देखें</li>

          <li>जिस CSC / साइबर कैफे से आवेदन किया था वहां पूछें</li>

          <li>आवेदन के समय आया SMS चेक करें</li>

        </ul>

      </div>
      <div className="flex justify-center mt-4 mb-4">
        <ShareButton/>
      </div>

      <CompactQuickLinks/>

      {/* Disclaimer */}
      <div className="mt-10 text-sm text-gray-500 text-center">

        यह पेज केवल जानकारी देने के लिए बनाया गया है।  
        आवेदन की स्थिति देखने के लिए आपको आधिकारिक पोर्टल पर भेजा जाएगा।
        यह सेवा <b>Bihar Revenue and Land Reforms Department</b> द्वारा संचालित है।

      </div>

    </div>
  );
}