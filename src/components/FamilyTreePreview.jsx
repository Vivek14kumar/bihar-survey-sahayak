"use client";

import { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import AutoFamilyTreePDF from "./TreePDF";
import { FileDown } from "lucide-react";

export default function FamilyTreePreview({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-4 text-center text-gray-600">
        PDF प्रीव्यू लोड हो रहा है...
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-4 text-center text-red-600">
        परिवार डेटा उपलब्ध नहीं है
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4">

      {/* Download Button */}
      <div className="flex justify-end">
        <PDFDownloadLink
          document={<AutoFamilyTreePDF data={data} />}
          fileName="vanshavali.pdf"
        >
          {({ loading }) => (
            <button
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg transition"
            >
              <FileDown size={16} />
              {loading ? "PDF तैयार हो रहा है..." : "PDF डाउनलोड करें"}
            </button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Responsive PDF Preview */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-full overflow-auto border border-gray-300 rounded-lg">
          <PDFViewer
            width="100%"
            height="calc(100vh - 200px)" // dynamically fill viewport minus padding/header
            style={{ minHeight: 400 }}
          >
            <AutoFamilyTreePDF data={data} />
          </PDFViewer>
        </div>
      </div>

      {/* Note for mobile users */}
      <p className="text-sm text-gray-500 text-center mt-2">
        स्क्रीन को स्क्रॉल करके और ज़ूम करके पूरा PDF देखें
      </p>
    </div>
  );
}
