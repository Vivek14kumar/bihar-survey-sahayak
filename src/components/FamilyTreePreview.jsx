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

  // Prevent SSR issue
  if (!mounted) {
    return (
      <div style={{ padding: 20 }}>
        PDF प्रीव्यू लोड हो रहा है...
      </div>
    );
  }

  // 🚨 VERY IMPORTANT SAFETY CHECK
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        परिवार डेटा उपलब्ध नहीं है
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>

      {/* Download Button */}
      <div style={{ textAlign: "right", marginBottom: 10 }}>
        <PDFDownloadLink
          document={<AutoFamilyTreePDF data={data} />}
          fileName="vanshavali.pdf"
        >
          {({ loading }) =>
            loading ? (
              "PDF तैयार हो रहा है..."
            ) : (
              <button
                style={{
                  background: "#1e40af",
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FileDown size={16} />
                PDF डाउनलोड करें
              </button>
            )
          }
        </PDFDownloadLink>
      </div>

      {/* PDF Preview */}
      <PDFViewer
        width="100%"
        height="600"
        style={{ border: "1px solid #ccc" }}
      >
        <AutoFamilyTreePDF data={data} />
      </PDFViewer>

    </div>
  );
}
