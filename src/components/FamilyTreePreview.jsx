"use client";

import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import AutoFamilyTreePDF from "./TreePDF";

export default function FamilyTreePreview({ data }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generatePreview = async () => {
      if (!data) return;

      const blob = await pdf(
        <AutoFamilyTreePDF data={data} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    };

    generatePreview();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [data]);

  if (!data) {
    return (
      <div className="p-4 text-center text-red-600">
        परिवार डेटा उपलब्ध नहीं है
      </div>
    );
  }

  return (
    <div className="relative w-full border border-gray-300 rounded-lg overflow-hidden">

  {/* Watermark Overlay */}
  <div className="absolute inset-0 z-10 pointer-events-auto bg-[repeating-linear-gradient(-30deg,rgba(0,0,0,0.05)_0px,rgba(0,0,0,0.05)_2px,transparent_2px,transparent_120px)] flex items-center justify-center">
  
  <div className="rotate-[-30deg] text-6xl font-bold text-gray-500 opacity-20 select-none">
    BIHAR SURVEY SAHAYAK
  </div>

</div>

  {pdfUrl ? (
    <iframe
      src={pdfUrl}
      width="100%"
      height="670px"
      className="w-full"
    />
  ) : (
    <div className="p-4 text-center text-gray-600">
      PDF प्रीव्यू लोड हो रहा है...
    </div>
  )}

</div>
  );
}