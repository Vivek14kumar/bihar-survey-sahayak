export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-4xl mx-auto border border-slate-100 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-100 pb-2">
          हमारे बारे में (About Us)
        </h1>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            <span className="font-bold text-green-700">Bihar Survey Sahayak</span> एक आधुनिक डिजिटल प्लेटफॉर्म है जिसे बिहार के नागरिकों की मदद के लिए बनाया गया है। 
            हमारा मुख्य उद्देश्य बिहार जमीन सर्वे (Bihar Land Survey 2024-2026) की प्रक्रिया को सरल और सुलभ बनाना है।
          </p>
          <p>
            अक्सर देखा जाता है कि किसानों और आम लोगों को <strong>Prapatra-2 (प्रपत्र-2)</strong> और <strong>Vanshawali (वंशावली)</strong> जैसे दस्तावेजों को भरने में कठिनाई होती है। 
            हमारे इस टूल की मदद से आप अपनी जानकारी भरकर ऑटो-जेनरेटेड PDF प्राप्त कर सकते हैं।
          </p>
          <div className="bg-green-50 p-4 rounded-lg italic">
            "हमारा लक्ष्य तकनीक (Technology) को बिहार के हर गांव तक पहुँचाना है ताकि जमीन संबंधी कार्यों में पारदर्शिता और आसानी आए।"
          </div>
        </div>
      </div>
    </div>
  );
}