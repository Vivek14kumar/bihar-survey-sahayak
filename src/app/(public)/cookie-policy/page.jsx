export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-8 border border-slate-100">

        <h1 className="text-3xl font-bold text-slate-800 mb-6">
          कुकी नीति (Cookie Policy)
        </h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">

          <section>
            <h2 className="font-semibold text-lg mb-2">1. कुकी क्या हैं?</h2>
            <p>
              कुकी छोटे डेटा फ़ाइल होते हैं जो आपके ब्राउज़र में संग्रहित किए जाते हैं।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">2. हम कुकी का उपयोग क्यों करते हैं?</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>उपयोगकर्ता अनुभव सुधारने हेतु</li>
              <li>सत्र प्रबंधन हेतु</li>
              <li>एनालिटिक्स हेतु</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">3. Local Storage</h2>
            <p>
              वंशावली डेटा आपके ब्राउज़र में Local Storage में सुरक्षित किया जाता है।
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-2">4. कुकी नियंत्रण</h2>
            <p>
              उपयोगकर्ता अपने ब्राउज़र सेटिंग्स के माध्यम से कुकी को नियंत्रित या हटाने का विकल्प रखते हैं।
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
