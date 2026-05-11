export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-slate-100">

        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          अस्वीकरण (Disclaimer)
        </h1>

        <p className="text-gray-600 mb-6">
          अंतिम अद्यतन: {new Date().getFullYear()}
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-semibold text-lg mb-2">
              1. गैर-सरकारी प्लेटफ़ॉर्म
            </h2>
            <p>
              बिहार सर्वे सहायाक एक निजी डिजिटल तकनीकी प्लेटफ़ॉर्म है।
              यह किसी भी सरकारी विभाग, बिहार भूमि सर्वेक्षण कार्यालय,
              राजस्व विभाग, या किसी अन्य आधिकारिक निकाय से संबद्ध,
              मान्यता प्राप्त या अधिकृत नहीं है।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              2. केवल सहायक उपकरण
            </h2>
            <p>
              यह प्लेटफ़ॉर्म केवल उपयोगकर्ताओं को वंशावली दस्तावेज़
              तैयार करने में तकनीकी सहायता प्रदान करता है।
              यह कोई आधिकारिक प्रमाणपत्र, सरकारी दस्तावेज़
              या कानूनी वैधता की गारंटी प्रदान नहीं करता।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              3. जानकारी की जिम्मेदारी
            </h2>
            <p>
              उपयोगकर्ता द्वारा दर्ज की गई सभी जानकारी की पूर्ण
              जिम्मेदारी उपयोगकर्ता की होगी। गलत, अपूर्ण या भ्रामक
              जानकारी के कारण उत्पन्न किसी भी कानूनी, प्रशासनिक
              या वित्तीय परिणाम के लिए कंपनी उत्तरदायी नहीं होगी।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              4. सरकारी सत्यापन आवश्यक
            </h2>
            <p>
              उपयोगकर्ता को सलाह दी जाती है कि तैयार किए गए दस्तावेज़ों
              को संबंधित सर्वे शिविर, अमीन, पर्यवेक्षक या
              आधिकारिक प्राधिकरण से सत्यापित अवश्य करें।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              5. दायित्व की सीमा
            </h2>
            <p>
              कंपनी किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक,
              विशेष या परिणामी नुकसान, दस्तावेज़ अस्वीकृति,
              सरकारी आपत्ति या कानूनी विवाद के लिए उत्तरदायी नहीं होगी।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">
              6. सेवा में परिवर्तन
            </h2>
            <p>
              कंपनी बिना पूर्व सूचना के किसी भी समय
              सेवा में संशोधन, निलंबन या समाप्ति का अधिकार सुरक्षित रखती है।
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
