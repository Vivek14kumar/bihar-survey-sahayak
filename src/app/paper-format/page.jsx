"use client";

import { ArrowLeft, FileText, Download, Eye, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaperFormatPage() {
  const router = useRouter();
  const [pdfList, setPdfList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [counts, setCounts] = useState({}); // store preview/download counts

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

  // 👁 Preview Click
  const handlePreview = (pdf) => {
    setSelectedPdf(pdf);
    updateCount(pdf, "preview");
  };

  // ⬇ Download Click
  const handleDownload = (pdf) => {
    updateCount(pdf, "download");
  };

  // 🔥 Update Count API
  const updateCount = async (pdf, type) => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-600 font-medium hover:underline"
          >
            <ArrowLeft size={18} />
            वापस जाएं
          </button>
        </div>

        {/* 🔍 MODERN SEARCH BAR */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search paper format..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
            />
          </div>
        </div>

        {/* PDF GRID */}
        {filteredList.length === 0 ? (
          <div className="text-center text-gray-500">
            No PDF Found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredList.map((pdf, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 hover:shadow-2xl transition duration-300"
              >
                {/* ICON */}
                <div className="flex justify-center mb-4">
                  <div className="bg-indigo-100 p-5 rounded-full">
                    <FileText size={40} className="text-indigo-600" />
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="text-center font-semibold text-gray-800 mb-2 truncate">
                  {pdf}
                </h3>

                {/* 📊 COUNTS 
                <div className="text-xs text-gray-500 text-center mb-3">
                  👁 {counts[pdf]?.preview || 0} Views • ⬇ {counts[pdf]?.download || 0} Downloads
                </div>*/}

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">

                  {/* Preview */}
                  <button
                    onClick={() => handlePreview(pdf)}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-700 text-white py-2 rounded-full flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye size={16} />
                    
                  </button>

                  {/* Download */}
                  <a
                    href={`/pdf/${pdf}`}
                    download
                    onClick={() => handleDownload(pdf)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-full flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    
                  </a>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* PDF MODAL */}
        {selectedPdf && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] h-[90%] rounded-2xl shadow-2xl relative">
              <button
                onClick={() => setSelectedPdf(null)}
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1 rounded-lg"
              >
                Close
              </button>

              <iframe
                src={`/pdf/${selectedPdf}`}
                width="100%"
                height="100%"
                className="rounded-2xl"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
