export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-slate-100">

        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          गोपनीयता नीति (Privacy Policy)
        </h1>

        <p className="text-gray-600 mb-6">
          अंतिम अद्यतन: {new Date().getFullYear()}
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-semibold text-lg mb-2">1. प्रस्तावना</h2>
            <p>
              बिहार सर्वे हेल्पर एक निजी डिजिटल प्लेटफ़ॉर्म है। हम उपयोगकर्ताओं
              की व्यक्तिगत जानकारी की गोपनीयता एवं सुरक्षा के प्रति प्रतिबद्ध हैं।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">2. एकत्रित की जाने वाली जानकारी</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>उपयोगकर्ता द्वारा दर्ज पारिवारिक विवरण</li>
              <li>नाम, संबंध, एवं अन्य प्रविष्ट डेटा</li>
              <li>भुगतान संबंधी जानकारी (सुरक्षित तृतीय-पक्ष माध्यम से)</li>
              <li>तकनीकी जानकारी (ब्राउज़र, डिवाइस, लॉग डेटा)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">3. जानकारी का उपयोग</h2>
            <p>
              एकत्रित जानकारी का उपयोग वंशावली PDF निर्माण, सेवा सुधार,
              तकनीकी सहायता, एवं प्लेटफ़ॉर्म संचालन हेतु किया जाता है।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">4. डेटा भंडारण</h2>
            <p>
              अधिकांश डेटा आपके ब्राउज़र के Local Storage में सुरक्षित रहता है।
              हम आपकी व्यक्तिगत जानकारी किसी तीसरे पक्ष को विक्रय नहीं करते।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">5. डेटा सुरक्षा</h2>
            <p>
              यद्यपि हम उद्योग मानक सुरक्षा उपाय अपनाते हैं, तथापि इंटरनेट आधारित
              सेवाओं में पूर्ण सुरक्षा की गारंटी नहीं दी जा सकती।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">6. नीति में परिवर्तन</h2>
            <p>
              कंपनी समय-समय पर इस नीति में संशोधन कर सकती है। संशोधित नीति
              वेबसाइट पर प्रकाशित होते ही प्रभावी मानी जाएगी।
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
