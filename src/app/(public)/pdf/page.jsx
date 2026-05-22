"use client";

import { ArrowLeft, FileText, Download, Eye, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaperFormatPage() {
  const router = useRouter();
  const [pdfList, setPdfList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [counts, setCounts] = useState({});

  useEffect(() => {
    fetch("/api/get-pdf")
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setPdfList(data.files);
          setFilteredList(data.files);
        }
      });

    fetch("/api/get-counts")
      .then((res) => res.json())
      .then((data) => {
        if (data.counts) {
          setCounts(data.counts);
        }
      });
  }, []);

  // 🔍 Search Filter
  useEffect(() => {
    const filtered = pdfList.filter((pdf) =>
      pdf.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
  }, [searchTerm, pdfList]);

  // 👁 & ⬇ Update Count API
  const updateCount = async (pdf, type) => {
    try {
      await fetch("/api/update-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf, type }),
      });

      setCounts((prev) => ({
        ...prev,
        [pdf]: {
          preview:
            type === "preview"
              ? (prev[pdf]?.preview || 0) + 1
              : prev[pdf]?.preview || 0,
          download:
            type === "download"
              ? (prev[pdf]?.download || 0) + 1
              : prev[pdf]?.download || 0,
        },
      }));
    } catch (error) {
      console.error("Error updating count:", error);
    }
  };

  // Helper to format filenames for a cleaner look
  const formatFileName = (name) => {
    if (!name) return "";
    return name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 py-8 sm:py-12 px-3 sm:px-8 z-0">
      
      {/* 🌟 Soft Ambient Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-indigo-200/30 blur-[80px] sm:blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[20%] -right-[10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-blue-200/30 blur-[80px] sm:blur-[120px] mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 sm:mb-10 gap-4 sm:gap-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-all bg-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md w-max"
          >
            <ArrowLeft size={16} className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" />
            वापस जाएं
          </button>

          <div className="text-left md:text-right">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              दस्तावेज़ <span className="text-indigo-600">संग्रह</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-500 font-medium mt-1">सभी आवश्यक फॉर्म और प्रपत्र यहाँ उपलब्ध हैं</p>
          </div>
        </div>

        {/* 🔍 MODERN SEARCH BAR */}
        <div className="mb-8 sm:mb-12 max-w-3xl mx-auto">
          <div className="relative group shadow-[0_4px_20px_rgb(0,0,0,0.03)] sm:shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full bg-white transition-all duration-300 hover:shadow-[0_8px_30px_rgb(79,70,229,0.08)]">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
              <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <input
              type="text"
              placeholder="फॉर्म का नाम खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 sm:pl-14 pr-12 py-3 sm:py-4 rounded-full bg-transparent border-2 border-slate-100 focus:outline-none focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 text-slate-700 text-sm sm:text-lg placeholder:text-slate-400 transition-all duration-300"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-4 sm:pr-6 flex items-center text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* PDF GRID (Mobile: 2 cols, Tablet: 3 cols, Desktop: 4 cols) */}
        {filteredList.length === 0 ? (
          <div className="text-center py-16 sm:py-24 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-slate-200 border-dashed mx-2 sm:mx-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300 w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">कोई दस्तावेज़ नहीं मिला</h3>
            <p className="text-xs sm:text-sm text-slate-500">कृपया अपनी खोज को बदल कर पुनः प्रयास करें।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredList.map((pdf, index) => (
              <div
                key={index}
                className="group flex flex-col bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative Top Accent */}
                <div className="absolute top-0 left-0 w-full h-1 sm:h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* ICON */}
                <div className="flex justify-start mb-3 sm:mb-6">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-105 transition-all duration-500">
                    <FileText className="text-indigo-500 group-hover:text-white transition-colors duration-500 w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                </div>

                {/* TITLE */}
                <div className="flex-grow">
                  <h3 className="font-bold text-slate-800 text-[13px] sm:text-lg leading-snug mb-1 group-hover:text-indigo-600 transition-colors line-clamp-2 capitalize">
                    {formatFileName(pdf)}
                  </h3>
                  <p className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 sm:mb-6">
                    .PDF Format
                  </p>
                </div>

                {/* ACTION BUTTONS (Responsive gap and text) */}
                <div className="flex flex-row gap-2 sm:gap-3 mt-auto pt-3 border-t border-slate-50">
                  
                  {/* Preview Button (Opens native mobile viewer or new desktop tab) */}
                  <a
                    href={`/pdf/${pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => updateCount(pdf, "preview")}
                    className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-slate-50 text-slate-600 text-[10px] sm:text-sm font-semibold hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span>देखें</span>
                  </a>

                  {/* Download Button */}
                  <a
                    href={`/pdf/${pdf}`}
                    download
                    onClick={() => updateCount(pdf, "download")}
                    className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-slate-50 text-slate-600 text-[10px] sm:text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <Download className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <span>डाउनलोड</span>
                  </a>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}