"use client";

import { useState } from "react";
import Link from "next/link";
import { locations } from "@/app/data/locations";
import { MapPin, ArrowRight, Compass, Search } from "lucide-react";

// Dictionary mapping for Bihar Districts (English to Hindi)
const districtTranslations = {
  "araria": "अररिया",
  "arwal": "अरवल",
  "aurangabad": "औरंगाबाद",
  "banka": "बांका",
  "begusarai": "बेगूसराय",
  "bhagalpur": "भागलपुर",
  "bhojpur": "भोजपुर",
  "buxar": "बक्सर",
  "darbhanga": "दरभंगा",
  "east champaran": "पूर्वी चंपारण",
  "gaya": "गया",
  "gopalganj": "गोपालगंज",
  "jamui": "जमुई",
  "jehanabad": "जहानाबाद",
  "kaimur": "कैमूर",
  "katihar": "कटिहार",
  "khagaria": "खगड़िया",
  "kishanganj": "किशनगंज",
  "lakhisarai": "लखीसराय",
  "madhepura": "मधेपुरा",
  "madhubani": "मधुबनी",
  "munger": "मुंगेर",
  "muzaffarpur": "मुज़फ्फरपुर",
  "nalanda": "नालंदा",
  "nawada": "नवादा",
  "patna": "पटना",
  "purnia": "पूर्णिया",
  "rohtas": "रोहतास",
  "saharsa": "सहरसा",
  "samastipur": "समस्तीपुर",
  "saran": "सारण",
  "sheikhpura": "शेखपुरा",
  "sheohar": "शिवहर",
  "sitamarhi": "सीतामढ़ी",
  "siwan": "सीवान",
  "supaul": "सुपौल",
  "vaishali": "वैशाली",
  "west champaran": "पश्चिम चंपारण"
};

export default function DistrictSection() {
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique districts, sort them, and prepare the data objects
  const allDistricts = [...new Set(locations.map((l) => l.district.toLowerCase()))]
    .sort()
    .map(district => {
      const engName = district.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      const hindiName = districtTranslations[district] || engName;
      return {
        id: district,
        slug: district.replace(" ", "-"),
        engName,
        hindiName
      };
    });

  // Filter based on search input (checks both English and Hindi names)
  const filteredDistricts = allDistricts.filter((d) => 
    d.engName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.hindiName.includes(searchTerm)
  );

  return (
    <section className="mt-12 md:mt-20 max-w-6xl mx-auto px-4 pb-16">
      
      {/* Header Section */}
      <div className="text-center mb-8 md:mb-10">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-green-50 border border-blue-200 text-blue-800 px-5 py-2 rounded-full text-xs md:text-sm font-bold shadow-sm mb-4">
          <Compass className="w-4 h-4 text-blue-600" />
          जिला अनुसार सर्वे फॉर्म
        </div>

        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          अपने <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">जिले</span> का चयन करें
        </h2>

        <p className="text-sm md:text-base text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
          बिहार भूमि सर्वे के लिए अपने संबंधित जिले का चुनाव करें और आगे की प्रक्रिया पूरी करें।
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-10 relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-all duration-300"
          placeholder="अपना जिला खोजें (उदा: Patna या पटना)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* District Grid */}
      {filteredDistricts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {filteredDistricts.map((district, i) => (
            <Link
              key={i}
              href={`/survey/${district.slug}`}
              className="group relative bg-white border border-gray-200 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

              <div className="flex items-center gap-2 md:gap-3 z-10 w-full">
                <div className="flex-shrink-0 p-1.5 md:p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-base text-gray-800 group-hover:text-blue-700 truncate transition-colors">
                    {district.hindiName}
                  </h3>
                  <p className="text-[10px] md:text-xs text-gray-500 font-medium truncate">
                    {district.engName}
                  </p>
                </div>

                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-gray-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">कोई जिला नहीं मिला। कृपया पुनः प्रयास करें।</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-semibold"
          >
            सभी जिले देखें
          </button>
        </div>
      )}
    </section>
  );
}