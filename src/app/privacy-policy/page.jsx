export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-slate-100">

        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <p className="text-gray-500 mb-6 border-b pb-4">
          Last Updated: February {new Date().getFullYear()}
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          
          <section>
            <h2 className="font-bold text-xl text-indigo-600 mb-2 border-l-4 border-indigo-600 pl-3">1. प्रस्तावना (Introduction)</h2>
            <p>
              बिहार सर्वे सहायक (Bihar Survey Sahayak) एक निजी डिजिटल प्लेटफ़ॉर्म है। हम उपयोगकर्ताओं
              की व्यक्तिगत जानकारी की गोपनीयता एवं सुरक्षा के प्रति पूरी तरह प्रतिबद्ध हैं। यह नीति बताती है कि हम आपकी जानकारी कैसे एकत्र और सुरक्षित करते हैं।
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl text-indigo-600 mb-2 border-l-4 border-indigo-600 pl-3">2. जानकारी का संग्रह (Data Collection)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Personal Data:</strong> नाम, पिता/पति का नाम, पता, और वंशावली के लिए आवश्यक पारिवारिक विवरण।</li>
              <li><strong>Payment Info:</strong> हम आपका कार्ड या बैंक विवरण स्टोर नहीं करते। भुगतान सुरक्षित रूप से Razorpay/PhonePe जैसे तृतीय-पक्ष गेटवे के माध्यम से संसाधित किया जाता है।</li>
              <li><strong>Log Files:</strong> हम IP एड्रेस, ब्राउज़र प्रकार, और विज़िट के समय जैसी तकनीकी जानकारी एकत्र करते हैं ताकि सेवा को बेहतर बनाया जा सके।</li>
            </ul>
          </section>

          {/* CRITICAL FOR ADSENSE */}
          <section className="bg-indigo-50 p-4 rounded-xl">
            <h2 className="font-bold text-lg mb-2 text-indigo-800">3. कुकीज़ और विज्ञापन (Cookies & Ads)</h2>
            <p className="text-sm">
              हम विज़िटर की प्राथमिकताओं को स्टोर करने के लिए कुकीज़ का उपयोग करते हैं। Google जैसे तृतीय-पक्ष विक्रेता हमारी साइट पर विज्ञापन दिखाने के लिए कुकीज़ का उपयोग कर सकते हैं। आप अपने ब्राउज़र की सेटिंग में जाकर कुकीज़ को डिसेबल कर सकते हैं।
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl text-indigo-600 mb-2 border-l-4 border-indigo-600 pl-3">4. डेटा का उपयोग (Usage of Data)</h2>
            <p>
              एकत्रित जानकारी का उपयोग केवल वंशावली (Vanshawali) और अन्य सर्वे फॉर्म PDF निर्माण के लिए किया जाता है। हम आपका डेटा किसी भी मार्केटिंग कंपनी को **विक्रय (Sell)** नहीं करते हैं।
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl text-indigo-600 mb-2 border-l-4 border-indigo-600 pl-3">5. डेटा सुरक्षा (Security)</h2>
            <p>
              हम आपकी जानकारी को सुरक्षित रखने के लिए SSL एन्क्रिप्शन और उद्योग मानक सुरक्षा उपायों का उपयोग करते हैं। आपका संवेदनशील डेटा हमारे डेटाबेस में सुरक्षित रहता है।
            </p>
          </section>

          <section>
            <h2 className="font-bold text-xl text-indigo-600 mb-2 border-l-4 border-indigo-600 pl-3">6. संपर्क करें (Contact)</h2>
            <p>
              यदि आपके पास इस नीति के बारे में कोई प्रश्न हैं, तो आप हमें <strong>support@yourdomain.com</strong> पर ईमेल कर सकते हैं।
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}