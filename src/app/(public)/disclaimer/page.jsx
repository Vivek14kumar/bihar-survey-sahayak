import React from 'react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 sm:p-10 border border-slate-100">

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4">
            Disclaimer / अस्वीकरण
          </h1>
          <p className="text-slate-500">
            Last Updated / अंतिम अद्यतन: {new Date().getFullYear()}
          </p>
        </div>

        <div className="space-y-10 text-gray-700 leading-relaxed">

          {/* Section 1 - CRITICAL NON-GOVERNMENT SHIELD */}
          <section className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
            <h2 className="font-bold text-xl text-yellow-900 mb-4 border-b border-yellow-200 pb-2">
              1. Non-Government Platform / गैर-सरकारी प्लेटफ़ॉर्म
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-yellow-950">
              <div>
                <p>
                  <span className="font-semibold underline">English:</span> Bihar Survey Sahayak is a private digital SaaS platform. 
                  <mark className="bg-yellow-300 px-1 font-bold rounded"> It is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with any Government Department,</mark> Bihar Land Survey Office, Revenue Department, or any other official state or central body.
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold underline">हिंदी:</span> बिहार सर्वे सहायक एक निजी डिजिटल तकनीकी प्लेटफ़ॉर्म है। 
                  <mark className="bg-yellow-300 px-1 font-bold rounded"> यह किसी भी सरकारी विभाग, बिहार भूमि सर्वेक्षण कार्यालय, राजस्व विभाग, या किसी अन्य आधिकारिक निकाय से संबद्ध, मान्यता प्राप्त या अधिकृत नहीं है।</mark>
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="font-bold text-xl text-slate-800 mb-4 border-b pb-2">
              2. Assistive Tool Only / केवल सहायक उपकरण
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>
                  <span className="font-semibold text-indigo-700">English:</span> This platform strictly provides technical assistance for formatting and generating documents (like Vanshawali, Batwara, etc.). It does not issue official certificates, government documents, nor does it guarantee the legal validity of the generated PDFs.
                </p>
              </div>
              <div className="text-slate-600">
                <p>
                  <span className="font-semibold text-indigo-700">हिंदी:</span> यह प्लेटफ़ॉर्म केवल उपयोगकर्ताओं को वंशावली और बटवारा जैसे दस्तावेज़ तैयार करने में तकनीकी सहायता प्रदान करता है। यह कोई आधिकारिक प्रमाणपत्र, सरकारी दस्तावेज़ या कानूनी वैधता की गारंटी प्रदान नहीं करता।
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="font-bold text-xl text-slate-800 mb-4 border-b pb-2">
              3. Responsibility for Information / जानकारी की जिम्मेदारी
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>
                  <span className="font-semibold text-indigo-700">English:</span> The user assumes full responsibility for all data and information entered into the platform. We are not liable for any legal, administrative, or financial consequences arising from incorrect, incomplete, or misleading data inputted by the user or Cyber Cafe operator.
                </p>
              </div>
              <div className="text-slate-600">
                <p>
                  <span className="font-semibold text-indigo-700">हिंदी:</span> उपयोगकर्ता द्वारा दर्ज की गई सभी जानकारी की पूर्ण जिम्मेदारी उपयोगकर्ता की होगी। गलत, अपूर्ण या भ्रामक जानकारी के कारण उत्पन्न किसी भी कानूनी, प्रशासनिक या वित्तीय परिणाम के लिए कंपनी उत्तरदायी नहीं होगी।
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-bold text-xl text-slate-800 mb-4 border-b pb-2">
              4. Official Verification Required / सरकारी सत्यापन आवश्यक
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>
                  <span className="font-semibold text-indigo-700">English:</span> Users are strongly advised to physically verify the printed documents with the concerned Survey Camp, authorized Amin, Supervisor, or Official Authority before final submission.
                </p>
              </div>
              <div className="text-slate-600">
                <p>
                  <span className="font-semibold text-indigo-700">हिंदी:</span> उपयोगकर्ता को सलाह दी जाती है कि तैयार किए गए दस्तावेज़ों को जमा करने से पहले संबंधित सर्वे शिविर, अमीन, पर्यवेक्षक या आधिकारिक प्राधिकरण से सत्यापित अवश्य करें।
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 - CRITICAL LIABILITY SHIELD */}
          <section className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <h2 className="font-bold text-xl text-red-800 mb-4 border-b border-red-200 pb-2">
              5. Limitation of Liability / दायित्व की सीमा
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-red-900">
              <div>
                <p>
                  <span className="font-semibold underline">English:</span> The company, developers, and founders shall <strong className="font-extrabold text-red-600">NOT be liable for any direct, indirect, incidental, special, or consequential damages, document rejections by authorities, government objections, or legal disputes</strong> arising out of the use of this website.
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold underline">हिंदी:</span> कंपनी, डेवलपर और संस्थापक <strong className="font-extrabold text-red-600">किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक, विशेष या परिणामी नुकसान, अधिकारियों द्वारा दस्तावेज़ अस्वीकृति, सरकारी आपत्ति या कानूनी विवाद के लिए उत्तरदायी नहीं होंगे।</strong>
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-bold text-xl text-slate-800 mb-4 border-b pb-2">
              6. Modification of Services / सेवा में परिवर्तन
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p>
                  <span className="font-semibold text-indigo-700">English:</span> We reserve the right to modify, suspend, or terminate the service (or any part thereof) at any time without prior notice.
                </p>
              </div>
              <div className="text-slate-600">
                <p>
                  <span className="font-semibold text-indigo-700">हिंदी:</span> कंपनी बिना पूर्व सूचना के किसी भी समय सेवा में संशोधन, निलंबन या समाप्ति का अधिकार सुरक्षित रखती है।
                </p>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}