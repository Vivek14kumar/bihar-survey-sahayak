export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-slate-100">

        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          नियम एवं शर्तें (Terms & Conditions)
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-semibold text-lg mb-2">1. सेवा की स्वीकृति</h2>
            <p>
              प्लेटफ़ॉर्म का उपयोग करने पर उपयोगकर्ता इन शर्तों को पूर्ण रूप से स्वीकार करता है।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">2. निजी प्लेटफ़ॉर्म</h2>
            <p>
              यह एक निजी SaaS सेवा है। यह किसी भी सरकारी विभाग,
              भूमि सर्वेक्षण कार्यालय या आधिकारिक निकाय से संबद्ध नहीं है।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">3. उपयोगकर्ता की जिम्मेदारी</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>प्रदान की गई जानकारी की सत्यता की जिम्मेदारी उपयोगकर्ता की होगी।</li>
              <li>गलत या भ्रामक जानकारी देने पर सेवा निलंबित की जा सकती है।</li>
              <li>उपयोगकर्ता स्वयं अपने दस्तावेज़ों की कानूनी वैधता सुनिश्चित करेगा।</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">4. भुगतान एवं सदस्यता</h2>
            <p>
              कुछ सुविधाएँ सशुल्क हैं। भुगतान होने के पश्चात सामान्यतः धनवापसी नहीं की जाएगी,
              जब तक कि कंपनी द्वारा विशेष रूप से स्वीकृत न हो।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">5. दायित्व की सीमा</h2>
            <p>
              कंपनी किसी भी प्रत्यक्ष या अप्रत्यक्ष नुकसान,
              कानूनी विवाद या सरकारी अस्वीकृति के लिए उत्तरदायी नहीं होगी।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">6. खाता समाप्ति</h2>
            <p>
              नियमों के उल्लंघन की स्थिति में कंपनी बिना पूर्व सूचना के सेवा समाप्त कर सकती है।
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
