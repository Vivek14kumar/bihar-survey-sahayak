import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 sm:p-10 border border-slate-100">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            Terms & Conditions / नियम एवं शर्तें
          </h1>
          <p className="text-slate-500">Last Updated: May 2026</p>
        </div>

        <div className="space-y-10 text-gray-700 leading-relaxed">

          {/* Section 1 */}
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <h2 className="font-bold text-xl text-slate-800 mb-4 border-b pb-2">
              1. Role of the Platform / प्लेटफ़ॉर्म की भूमिका
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-3">
                  <span className="font-semibold text-indigo-700">English:</span> Bihar Survey Sahayak is strictly a digital intermediary, SaaS tool, and directory service. 
                  <mark className="bg-yellow-200 px-1 font-semibold rounded"> We are NOT a government entity, nor are we affiliated with any land survey office.</mark> We do not employ or manage the Amins (surveyors) listed on this platform.
                </p>
              </div>
              <div>
                <p className="mb-3 text-slate-600">
                  <span className="font-semibold text-indigo-700">हिंदी:</span> बिहार सर्वे सहायक पूरी तरह से एक डिजिटल मध्यस्थ (Intermediary) और डायरेक्टरी सेवा है।
                  <mark className="bg-yellow-200 px-1 font-semibold rounded"> हम कोई सरकारी संस्था नहीं हैं और न ही किसी भूमि सर्वेक्षण कार्यालय से संबद्ध हैं।</mark> हम इस प्लेटफ़ॉर्म पर सूचीबद्ध अमीन को रोजगार या प्रबंधित नहीं करते हैं।
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-bold text-xl text-slate-800 mb-4 border-b pb-2">
              2. User Responsibilities (Amins, Cyber Cafes & Citizens) / उपयोगकर्ता की जिम्मेदारियां
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-slate-800">For Amins:</strong> You declare that all KYC documents (Government IDs, Certificates, Mukhiya Letters) provided for verification are 100% true. Uploading forged documents is a criminal offense leading to a permanent ban.</li>
                <li><strong className="text-slate-800">For Cyber Cafes:</strong> When using the platform to generate forms for clients, you are responsible for ensuring the accuracy of the data entered.</li>
                <li><strong className="text-slate-800">For Citizens:</strong> You must verify the credentials of any Amin you contact through our platform independently before hiring them.</li>
              </ul>
              <ul className="list-disc pl-5 space-y-2 text-slate-600">
                <li><strong className="text-slate-800">अमीन के लिए:</strong> आप घोषणा करते हैं कि सत्यापन के लिए दिए गए सभी KYC दस्तावेज़ (आईडी, प्रमाण पत्र) 100% सत्य हैं। जाली दस्तावेज़ अपलोड करना एक आपराधिक कार्य है।</li>
                <li><strong className="text-slate-800">साइबर कैफे के लिए:</strong> ग्राहकों के लिए फॉर्म जनरेट करते समय, दर्ज किए गए डेटा की सटीकता सुनिश्चित करने की जिम्मेदारी आपकी होगी।</li>
                <li><strong className="text-slate-800">नागरिकों के लिए:</strong> प्लेटफ़ॉर्म के माध्यम से संपर्क किए गए किसी भी अमीन को काम पर रखने से पहले आपको उनके क्रेडेंशियल्स को स्वयं सत्यापित करना होगा।</li>
              </ul>
            </div>
          </section>

          {/* Section 3 - CRITICAL LEGAL SHIELD */}
          <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h2 className="font-bold text-xl text-red-800 mb-4 border-b border-red-200 pb-2">
              3. Liability Disclaimer / दायित्व की सीमा (Legal Shield)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-red-900">
              <div>
                <p>
                  <span className="font-semibold underline">English:</span> The founders, developers, and platform of Bihar Survey Sahayak shall 
                  <strong className="font-extrabold text-red-600"> NOT be held legally or financially responsible for any property disputes, incorrect land measurements, legal notices, or financial losses</strong> arising from the services provided by any Amin or the use of generated PDF forms. Any financial transactions between a citizen and an Amin happen entirely outside our platform.
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold underline">हिंदी:</span> बिहार सर्वे सहायक के संस्थापक और प्लेटफ़ॉर्म किसी भी अमीन द्वारा प्रदान की गई सेवाओं या जनरेट किए गए फॉर्म के उपयोग से उत्पन्न होने वाले 
                  <strong className="font-extrabold text-red-600"> किसी भी संपत्ति विवाद, गलत भूमि माप, कानूनी नोटिस या वित्तीय नुकसान के लिए कानूनी या वित्तीय रूप से जिम्मेदार नहीं होंगे।</strong> नागरिक और अमीन के बीच कोई भी वित्तीय लेनदेन पूरी तरह से हमारे प्लेटफ़ॉर्म के बाहर होता है।
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-bold text-xl text-slate-800 mb-4 border-b pb-2">
              4. Wallet Credits, Subscriptions & Refund Policy / वॉलेट, सदस्यता और धनवापसी नीति
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-2">
                  <strong className="text-slate-800">Wallet Credits & Forms:</strong> Payments added to the internal platform wallet (for generating forms like Vanshawali, Batwara, etc.) are solely for digital platform usage. 
                </p>
                <p>
                  <strong className="text-slate-800">Strictly Non-Refundable:</strong> <mark className="bg-slate-200 px-1 font-semibold">All subscription fees for Amin profile creation and wallet top-ups are final and non-refundable.</mark> If an account is suspended due to fraud or user reports, no refund will be provided.
                </p>
              </div>
              <div className="text-slate-600">
                <p className="mb-2">
                  <strong className="text-slate-800">वॉलेट और फॉर्म:</strong> प्लेटफ़ॉर्म वॉलेट (वंशावली, बटवारा आदि फॉर्म जनरेट करने के लिए) में जोड़े गए भुगतान पूरी तरह से डिजिटल प्लेटफ़ॉर्म उपयोग के लिए हैं।
                </p>
                <p>
                  <strong className="text-slate-800">धनवापसी नहीं (Non-Refundable):</strong> <mark className="bg-slate-200 px-1 font-semibold">अमीन प्रोफ़ाइल बनाने और वॉलेट टॉप-अप के लिए दिए गए सभी शुल्क अंतिम हैं और वापस नहीं किए जाएंगे।</mark> धोखाधड़ी के कारण खाता निलंबित होने पर कोई रिफंड नहीं दिया जाएगा।
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-bold text-xl text-slate-800 mb-4 border-b pb-2">
              5. Privacy & Jurisdiction / गोपनीयता एवं अधिकार क्षेत्र
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-2">
                  By creating a profile, Amins grant us the right to display their professional details publicly. Uploaded sensitive KYC documents are kept secure strictly for internal verification.
                </p>
                <p className="font-semibold text-indigo-700">
                  Jurisdiction: These Terms shall be governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the courts located in Patna, Bihar.
                </p>
              </div>
              <div className="text-slate-600">
                <p className="mb-2">
                  प्रोफ़ाइल बनाकर, अमीन हमें अपने पेशेवर विवरण सार्वजनिक रूप से प्रदर्शित करने का अधिकार देते हैं। अपलोड किए गए संवेदनशील KYC दस्तावेज़ केवल आंतरिक सत्यापन के लिए सुरक्षित रखे जाते हैं।
                </p>
                <p className="font-semibold text-indigo-700">
                  अधिकार क्षेत्र: ये शर्तें भारत के कानूनों द्वारा शासित होंगी। कोई भी कानूनी विवाद पटना, बिहार में स्थित अदालतों के विशेष अधिकार क्षेत्र के अधीन होगा।
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}