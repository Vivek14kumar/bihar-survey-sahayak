"use client";

import { useEffect, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { pdfjs } from "react-pdf";
import AutoFamilyTreePDF from "./TreePDF";

// ✅ Use CDN worker for client-side only
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
}

export default function FamilyTreePreview({ data }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [images, setImages] = useState([]); // Images for mobile
  const [containerWidth, setContainerWidth] = useState(300);

  // Update container width for mobile responsiveness
  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(window.innerWidth > 768 ? 800 : window.innerWidth - 30);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Generate PDF and images from PDF
  useEffect(() => {
    if (!data) return;

    const generatePreview = async () => {
      try {
        const blob = await pdf(<AutoFamilyTreePDF data={data} />).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        // Mobile: convert PDF pages to images
        const loadingTask = pdfjs.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        const pageImages = [];

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const viewport = page.getViewport({ scale: 2 }); // high res
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;
          pageImages.push(canvas.toDataURL("image/png"));
        }

        setImages(pageImages);
      } catch (err) {
        console.error("PDF Generation Error:", err);
      }
    };

    generatePreview();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [data]);

  if (!data)
    return (
      <div className="p-4 text-red-600 text-center font-bold">
        डेटा उपलब्ध नहीं है
      </div>
    );

  return (
    <div className="relative w-full border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
      {/* WATERMARK */}
      <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="rotate-[-35deg] text-4xl md:text-7xl font-bold text-black opacity-10 select-none whitespace-nowrap">
          BIHAR SURVEY SAHAYAK
        </div>
      </div>

      {/* DESKTOP: PDF iframe */}
      <div className="hidden md:block relative">
        <div
          className="absolute inset-0 z-40 bg-transparent"
          onContextMenu={(e) => e.preventDefault()}
        ></div>
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="670px"
            className="w-full border-none"
          />
        ) : (
          <div className="p-10 text-center italic text-gray-500">
            तैयार हो रहा है...
          </div>
        )}
      </div>

      {/* MOBILE: Images */}
      <div className="md:hidden flex flex-col items-center p-2 bg-white">
        {images.length > 0 ? (
          images.map((img, idx) => (
            <div key={idx} className="relative w-full my-2">
              {/* Watermark */}
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="rotate-[-35deg] text-4xl font-bold text-black opacity-10 select-none whitespace-nowrap">
                  BIHAR SURVEY SAHAYAK
                </div>
              </div>
              <img
                src={img}
                alt={`Family Tree page ${idx + 1}`}
                className="w-full object-contain rounded-lg shadow"
              />
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-blue-600 animate-pulse">
            वंशावली लोड हो रही है...
          </div>
        )}
      </div>
    </div>
  );
}