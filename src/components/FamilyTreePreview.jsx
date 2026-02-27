"use client";

import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import AutoFamilyTreePDF from "./TreePDF";

export default function FamilyTreePreview({ data }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data) return;

    const generatePdf = async () => {
      try {
        setLoading(true);
        // Generate the PDF Blob directly
        const blob = await pdf(<AutoFamilyTreePDF data={data} isPreview={true} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setLoading(false);
      } catch (err) {
        console.error("PDF Generation Error:", err);
        setLoading(false);
      }
    };

    generatePdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [data]);

  if (!data) return <div className="p-4 text-red-600 text-center">डेटा उपलब्ध नहीं है</div>;

  return (
    <div className="relative w-full border border-gray-300 rounded-lg overflow-hidden bg-gray-50 shadow-inner select-none" onContextMenu={(e) => e.preventDefault()}>
      
      {/* 2. LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-20 bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-blue-600 font-medium italic">आपकी वंशावली तैयार हो रही है...</p>
        </div>
      )}

      {/* 3. MOBILE & DESKTOP: THE SMART EMBED */}
      {!loading && pdfUrl && (
          <div className="relative w-full">
          {/* PDF */}
          <object
            data={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            type="application/pdf"
            className="w-full h-[500px] md:h-[700px] border-none md:pointer-events-none"
          >
          
          {/* Invisible Overlay to Block Interaction */}
          <div
            className="absolute inset-0 z-10"
            onContextMenu={(e) => e.preventDefault()}
          />
            {/* FALLBACK: If the browser refuses to embed, show a "Trust Button" */}
            <div className="p-8 text-center bg-white border-2 border-dashed border-blue-200 m-4 rounded-xl">
              <p className="text-gray-700 mb-4 font-medium">
                आपकी वंशावली तैयार है! Download करने से पहले नीचे बटन दबाकर एक बार देख लें।
              </p>
              <button
                onClick={() => window.open(pdfUrl, '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all transform active:scale-95"
              >
                👁️ वंशावली का प्रीव्यू (Preview) देखें
              </button>
            </div>
          </object>
        </div>
      )}
    </div>
  );
}