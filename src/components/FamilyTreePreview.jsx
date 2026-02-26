"use client";

import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf"; // New library for viewing
import AutoFamilyTreePDF from "./TreePDF";

// Initialize PDF Worker (Required for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function FamilyTreePreview({ data, isPaid = false }) {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const generatePreview = async () => {
      if (!data) return;
      const blob = await pdf(<AutoFamilyTreePDF data={data} />).toBlob();
      setPdfBlob(blob);
      setPdfUrl(URL.createObjectURL(blob));
    };
    generatePreview();
    return () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); };
  }, [data]);

  if (!data) return <div className="p-4 text-red-600 text-center font-bold">डेटा उपलब्ध नहीं है</div>;

  return (
    <div className="relative w-full border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
      
      {/* 1. SECURE WATERMARK (Always on top) */}
      <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="rotate-[-35deg] text-4xl md:text-7xl font-bold text-black opacity-10 select-none whitespace-nowrap">
          PREVIEW ONLY • NOT FOR DOWNLOAD<br/>
          BIHAR SURVEY SAHAYAK
        </div>
      </div>

      {pdfUrl ? (
        <>
          {/* DESKTOP VIEW: Iframe with a "Shield" overlay to prevent right-click/save */}
          <div className="hidden md:block relative">
            <div className="absolute inset-0 z-40 bg-transparent" onContextMenu={(e) => e.preventDefault()}></div>
            <iframe src={`${pdfUrl}#toolbar=0`} width="100%" height="670px" className="w-full" />
          </div>

          {/* MOBILE VIEW: Render as Image (Canvas) */}
          {/* This prevents the "Open in New Tab" download issue */}
          <div className="md:hidden flex justify-center p-2 bg-white pointer-events-none select-none">
            <Document file={pdfBlob}>
              <Page 
                pageNumber={1} 
                width={window.innerWidth - 40} 
                renderTextLayer={false} 
                renderAnnotationLayer={false} 
              />
            </Document>
          </div>

          
        </>
      ) : (
        <div className="p-10 text-center italic">प्रीव्यू तैयार हो रहा है...</div>
      )}
    </div>
  );
}