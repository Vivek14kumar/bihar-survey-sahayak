"use client"; // ✅ Client Component

import React, { useState } from "react";
import { Search } from "lucide-react";
import AminDirectoryCard from "./AminDirectoryCard";

export default function AminSearchGrid({ initialAmins }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("सभी सेवाएं");

  // Mapping Hindi dropdown options to database keys
  const serviceMapping = {
    "जमीन मापी": "landMeasure",
    "सीमांकन": "demarcation",
    "बंटवारा": "partition",
    "सर्वे सहायता": "surveyHelp",
  };

  // Filter the random amins array locally as the user types or clicks
  const filteredAmins = initialAmins.filter((profile) => {
    
    // Convert search term to lowercase once for better performance
    const searchLower = searchTerm.toLowerCase();

    // 1. Filter by Search Term (Name, Address, OR District/Service Area)
    const matchesSearch =
      profile.ownerNameEn?.toLowerCase().includes(searchLower) ||
      profile.ownerNameHi?.includes(searchTerm) ||
      profile.publicAddress?.toLowerCase().includes(searchLower) ||
      // ADDED: Check if any district inside the serviceAreas array matches the search
      (profile.serviceAreas && profile.serviceAreas.some((area) => 
        area.toLowerCase().includes(searchLower)
      ));

    // 2. Filter by Service Type
    const dbServiceKey = serviceMapping[selectedService];
    const matchesService =
      selectedService === "सभी सेवाएं" || 
      (profile.services && profile.services[dbServiceKey] === true);

    return matchesSearch && matchesService;
  });

  return (
    <>
      {/* ================= FILTERS ================= */}
      <div className="mb-10">
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-4 sm:p-5 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="जिला, क्षेत्र या अमीन नाम खोजें..."
                className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 transition-all"
              />
            </div>

            {/* Service Filter Select */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-400 transition-all"
            >
              <option>सभी सेवाएं</option>
              <option>जमीन मापी</option>
              <option>सीमांकन</option>
              <option>बंटवारा</option>
              <option>सर्वे सहायता</option>
            </select>

            {/* Static Action Button */}
            <div className="h-12 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-900 font-bold text-sm shadow-lg flex items-center justify-center gap-2">
              <Search size={18} />
              Found {filteredAmins.length}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CARDS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 place-items-center">
        {filteredAmins.length > 0 ? (
          filteredAmins.map((profile) => (
            <AminDirectoryCard key={profile._id} profile={profile} />
          ))
        ) : (
          <div className="col-span-full w-full">
            <div className="bg-white rounded-3xl p-10 text-center shadow-lg border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">कोई अमीन नहीं मिला</h3>
              <p className="mt-2 text-slate-500">आपके खोज के अनुसार कोई प्रोफाइल मैच नहीं हुई।</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}