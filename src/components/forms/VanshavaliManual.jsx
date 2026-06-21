"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer, Download, RotateCcw } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const INITIAL_TREE_DATA = {
  id: "root_1",
  name: "",
  children: [],
};

// Added isGenerating and onGenerate as props for the wallet system
export default function VanshavaliManual({ isGenerating, onGenerate }) {
  const [formData, setFormData] = useState({
    applicants: [{ name: "", relName: "" }],
    treeData: INITIAL_TREE_DATA,
    date: new Date().toISOString().split("T")[0],
  });

  
  const [layoutMode, setLayoutMode] = useState("landscape");

  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Local processing state for print/download delays
  const [isProcessingLocal, setIsProcessingLocal] = useState(false); 
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const printRef = useRef(null);
  const observerRef = useRef(null);

  const MAX_TREE_DEPTH = 20;

  // ----------------------------------------
  // LOCAL STORAGE LOGIC
  // ----------------------------------------
  useEffect(() => {
    const savedTree = localStorage.getItem("vanshavali_tree_data");
   
    const savedLayout = localStorage.getItem("vanshavali_layout_mode");

    if (savedTree) {
      try {
        setFormData((prev) => ({
          ...prev,
          treeData: JSON.parse(savedTree),
        }));
      } catch (e) {
        console.error("Error parsing tree data", e);
      }
    }
    
    if (savedLayout) setLayoutMode(savedLayout);
  }, []);

  useEffect(() => {
    localStorage.setItem("vanshavali_tree_data", JSON.stringify(formData.treeData));
  }, [formData.treeData]);

  

  useEffect(() => {
    localStorage.setItem("vanshavali_layout_mode", layoutMode);
  }, [layoutMode]);

  const handleReset = () => {
    if (window.confirm("क्या आप वाकई सारा डेटा मिटाना चाहते हैं? यह वापस नहीं लाया जा सकेगा।")) {
      localStorage.removeItem("vanshavali_tree_data");
      
      setFormData((prev) => ({
        ...prev,
        treeData: { id: `root_${Date.now()}`, name: "", children: [] },
      }));
      
      setSuggestions([]);
    }
  };

  // ----------------------------------------
  // VALIDATION LOGIC
  // ----------------------------------------
  const isAnyNodeEmpty = (node) => {
    if (!node.name || !node.name.trim()) return true;
    if (node.children && node.children.length > 0) {
      return node.children.some((child) => isAnyNodeEmpty(child));
    }
    return false;
  };

  const validateForm = () => {
    
    if (isAnyNodeEmpty(formData.treeData)) {
      alert("कृपया वंशवृक्ष के सभी सदस्यों के नाम भरें या जो बॉक्स खाली हैं उन्हें हटा दें (✕ दबाकर)।");
      return false;
    }
    return true;
  };

  // ----------------------------------------
  // WATERMARK SECURITY OBSERVER
  // ----------------------------------------
  useEffect(() => {
    if (!showWatermark) {
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }
    const observer = new MutationObserver((mutations) => {
      if (!showWatermark) return;
      for (const mutation of mutations) {
        const isRemoval =
          mutation.type === "childList" &&
          Array.from(mutation.removedNodes).some(
            (node) => node.id === "watermark-layer"
          );
        const isStyleChange =
          mutation.type === "attributes" &&
          mutation.target.id === "watermark-layer";
        if (isRemoval || isStyleChange) {
          alert("⚠️ सुरक्षा चेतावनी: वाटरमार्क के साथ छेड़छाड़ वर्जित है।");
          window.location.reload();
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [showWatermark]);

  // ----------------------------------------
  // PRINT & DOWNLOAD LOGIC
  // ----------------------------------------
  const executePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "वंशावली",
    onAfterPrint: () => {
      setShowWatermark(true);
      setIsProcessingLocal(false);
    },
  });

  const executeDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const element = printRef.current;
      
      const canvasWidth = element.scrollWidth;
      const canvasHeight = element.scrollHeight;

      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        width: canvasWidth,
        height: canvasHeight,
        style: { transform: "scale(1)", transformOrigin: "top left" },
      });

      const pdf = new jsPDF({
        orientation: layoutMode,
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 10;
      const maxPdfWidth = pdfWidth - (margin * 2);
      const maxPdfHeight = pdfHeight - (margin * 2);
      
      const ratio = Math.min(maxPdfWidth / canvasWidth, maxPdfHeight / canvasHeight);
      
      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);
      pdf.save("Vanshavali_Sahayak.pdf");
      
    } catch (error) {
      console.error("PDF Error:", error);
      alert("PDF जनरेट करने में समस्या।");
    } finally {
      setIsGeneratingPDF(false);
      setIsProcessingLocal(false);
      setShowWatermark(true);
    }
  };

  // ----------------------------------------
  // WALLET DEDUCTION LOGIC
  // ----------------------------------------
  const handleAction = async (actionType) => {
    if (!validateForm()) return;

    if (!window.confirm("क्या आपने जानकारी सही से भर दी है? वॉलेट से राशि काट ली जाएगी।")) {
      return;
    }

    setIsProcessingLocal(true);

    try {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      // Call the parent component's wallet logic
      // Passing primary ancestor name and applicant mobile for tracking
      const success = await onGenerate(formData.treeData.name || "Unknown");

      if (success) {
        setShowWatermark(false); // Remove watermark after successful deduction

        // Delay to allow React to remove the watermark from the DOM
        setTimeout(async () => {
          if (actionType === "print") {
            executePrint(); 
          } else if (actionType === "download") {
            await executeDownloadPDF(); 
          }
        }, 800);
      } else {
        // Deduction failed, reset state
        setIsProcessingLocal(false);
        setShowWatermark(true);
      }
    } catch (error) {
      console.error("Wallet Action Error:", error);
      alert("वॉलेट से भुगतान में समस्या आई। कृपया पुनः प्रयास करें।");
      setIsProcessingLocal(false);
      setShowWatermark(true);
    }
  };

  // ----------------------------------------
  // AUTO-SUGGESTION & TREE UPDATES
  // ----------------------------------------
  const fetchSuggestions = async (word) => {
    if (!word || word.length < 2) {
      setSuggestions([]);
      return;
    }
    if (cacheRef.current[word]) {
      setSuggestions(cacheRef.current[word]);
      setActiveIndex(0);
      return;
    }
    try {
      const res = await fetch(
        `https://inputtools.google.com/request?text=${word}&itc=hi-t-i0-und&num=5`
      );
      const data = await res.json();
      if (data[0] === "SUCCESS") {
        const result = data[1][0][1];
        cacheRef.current[word] = result;
        setSuggestions(result);
        setActiveIndex(0);
      }
    } catch {
      setSuggestions([]);
    }
  };

  const updateTreeNode = (node, id, newName) => {
    if (node.id === id) return { ...node, name: newName };
    if (node.children)
      return {
        ...node,
        children: node.children.map((c) => updateTreeNode(c, id, newName)),
      };
    return node;
  };

  const addChildNode = (node, parentId, currentDepth = 1) => {
    if (node.id === parentId) {
      if (currentDepth >= MAX_TREE_DEPTH) {
        alert(`आप अधिकतम ${MAX_TREE_DEPTH} पीढ़ियाँ ही जोड़ सकते हैं।`);
        return node;
      }
      return {
        ...node,
        children: [
          ...node.children,
          { id: `node_${Date.now()}`, name: "", children: [] },
        ],
      };
    }
    if (node.children)
      return {
        ...node,
        children: node.children.map((c) =>
          addChildNode(c, parentId, currentDepth + 1)
        ),
      };
    return node;
  };

  const removeNode = (node, idToRemove) => {
    if (node.children) {
      const filtered = node.children.filter((c) => c.id !== idToRemove);
      return {
        ...node,
        children: filtered.map((c) => removeNode(c, idToRemove)),
      };
    }
    return node;
  };

  const handleTreeInputChange = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      treeData: updateTreeNode(prev.treeData, id, value),
    }));
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.trim()) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 200);
    } else {
      setSuggestions([]);
    }
  };

  const selectTreeSuggestion = (id, selectedWord, currentName) => {
    const words = currentName.split(" ");
    words[words.length - 1] = selectedWord;
    const finalVal = words.join(" ") + " ";
    setFormData((prev) => ({
      ...prev,
      treeData: updateTreeNode(prev.treeData, id, finalVal),
    }));
    setSuggestions([]);
    setActiveIndex(0);
  };

  const handleTreeKeyDown = (e, id, currentName) => {
    if (suggestions.length > 0 && currentField === `tree_${id}`) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        selectTreeSuggestion(id, suggestions[activeIndex], currentName);
      }
    }
  };

  // ----------------------------------------
  // RENDER UI
  // ----------------------------------------
  const renderTreeInput = (node, depth = 1) => {
    return (
      <li key={node.id}>
        <div className="inline-flex flex-col items-center bg-white border border-gray-200 rounded-lg p-2 shadow-sm relative z-10 mx-1">
          <div className="relative">
            <input
              type="text"
              placeholder={depth === 1 ? "मुख्य पूर्वज" : "वंशज का नाम"}
              className={`border p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-bold text-center shadow-inner ${
                depth === 1
                  ? "w-44 bg-blue-50 border-blue-300"
                  : "w-36 bg-white border-gray-300"
              }`}
              value={node.name}
              onFocus={() => setCurrentField(`tree_${node.id}`)}
              onBlur={() =>
                setTimeout(() => {
                  if (currentField === `tree_${node.id}`) setSuggestions([]);
                }, 200)
              }
              onChange={(e) => handleTreeInputChange(node.id, e.target.value)}
              onKeyDown={(e) => handleTreeKeyDown(e, node.id, node.name)}
            />
            
            {currentField === `tree_${node.id}` && suggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0 text-left flex flex-col">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectTreeSuggestion(node.id, s, node.name);
                    }}
                    className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${
                      i === activeIndex
                        ? "bg-blue-100 text-blue-800 font-bold"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{s}</span>
                    {i === activeIndex && (
                      <span className="text-[10px] opacity-60 uppercase">Space</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  treeData: addChildNode(prev.treeData, node.id, depth),
                }))
              }
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold hover:bg-blue-200 transition-colors"
              title="संतान जोड़ें"
            >
              + वंशज
            </button>

            {depth > 1 && (
              <button
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    treeData: removeNode(prev.treeData, node.id),
                  }))
                }
                className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold hover:bg-red-200 transition-colors"
                title="हटाएं"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <ul>
            {node.children.map((child) => renderTreeInput(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  const renderTreePreview = (node) => {
    return (
      <li key={node.id}>
        <div className="node-box">{node.name || "________________"}</div>
        {node.children && node.children.length > 0 && (
          <ul>{node.children.map((child) => renderTreePreview(child))}</ul>
        )}
      </li>
    );
  };

  const isButtonDisabled = isGenerating || isProcessingLocal;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 flex flex-col gap-8 font-sans min-h-screen">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: A4 ${layoutMode};
            margin: 10mm;
          }
        }
      `}} />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap");
        .font-hindi { font-family: "Noto Sans Devanagari", sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

        .css-tree { width: 100%; display: flex; justify-content: center; }
        .css-tree ul { padding-top: 15px; position: relative; display: flex; justify-content: center; padding-left: 0; margin: 0; }
        .css-tree li { text-align: center; list-style-type: none; position: relative; padding: 15px 4px 0 4px; flex: 1; }
        .css-tree li::before, .css-tree li::after { content: ""; position: absolute; top: 0; right: 50%; border-top: 1.5px solid #333; width: 50%; height: 15px; }
        .css-tree li::after { right: auto; left: 50%; border-left: 1.5px solid #333; }
        .css-tree li:only-child::after, .css-tree li:only-child::before { display: none; }
        .css-tree li:only-child { padding-top: 0; }
        .css-tree li:first-child::before, .css-tree li:last-child::after { border: 0 none; }
        .css-tree li:last-child::before { border-right: 1.5px solid #333; border-radius: 0 4px 0 0; }
        .css-tree li:first-child::after { border-radius: 4px 0 0 0; }
        .css-tree ul ul::before { content: ""; position: absolute; top: 0; left: 50%; border-left: 1.5px solid #333; width: 0; height: 15px; }
        .css-tree .node-box { border: 1.5px solid #333; padding: 6px 12px; font-size: 14px; font-weight: bold; display: inline-block; border-radius: 6px; background-color: #fff; position: relative; z-index: 1; white-space: nowrap; }

        @media print {
          body { background: white; margin: 0; padding: 0; }
          .css-tree { transform: scale(0.95); transform-origin: top center; }
          #watermark-layer { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; }
        }
      `}</style>

      {/* Top Section: Form Input */}
      <div
        id="form-container"
        className="w-full bg-white p-5 md:p-8 shadow-md rounded-xl border-t-[6px] border-blue-600 print:hidden"
      >
        <div className="flex items-center gap-2 mb-6 border-b border-green-300 pb-3">
          <h3 className="font-bold text-green-900 text-xl">
            वंशावली (Family Tree) डेटा भरें
          </h3>
          
        </div>

        <div className="w-full h-100 overflow-x-auto pb-6 custom-scrollbar bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="css-tree min-w-max">
            <ul>{renderTreeInput(formData.treeData)}</ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col lg:flex-row gap-6 justify-between items-center w-full">
          
          <button
            onClick={handleReset}
            disabled={isButtonDisabled}
            className="flex items-center justify-center gap-2 bg-red-400 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-red-600  transition-all disabled:opacity-60"
          >
            <RotateCcw size={18} />
            <span>RESET</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4 ml-auto">
            <button
              onClick={() => handleAction("print")}
              disabled={isButtonDisabled}
              className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              
              <Printer size={18} />
              <span>{isButtonDisabled ? "लोडिंग..." : "प्रिंट करें"}</span>
            </button>

            <button
              onClick={() => handleAction("download")}
              disabled={isButtonDisabled || isGeneratingPDF}
              className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              
              <Download size={18} />
              <span>{isButtonDisabled || isGeneratingPDF ? "लोडिंग..." : "PDF डाउनलोड"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Document Preview */}
      <div className="w-full bg-gray-100 shadow-inner rounded-xl p-4 font-hindi print:bg-transparent print:shadow-none print:p-0 overflow-hidden">
        <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
          <div
            ref={printRef}
            className="bg-white mx-auto  relative shadow-lg print:shadow-none"
            style={{
              minWidth: layoutMode === "landscape" ? "297mm" : "210mm",
              minHeight: layoutMode === "landscape" ? "210mm" : "297mm",
              padding: "10mm",
              color: "#000",
              boxSizing: "border-box",
            }}
          >
            {showWatermark && !isGeneratingPDF && (
              <div
                id="watermark-layer"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 0,
                  pointerEvents: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='450' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='38' font-weight='900' font-family='Arial, sans-serif' fill='rgba(54, 40, 40, 0.08)' text-anchor='middle' transform='rotate(-40, 225, 225)'%3EBIHAR SURVEY SAHAYAK%3C/text%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                }}
              ></div>
            )}

            <div className="relative z-10 w-full flex flex-col items-center">
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "26px",
                  fontWeight: "bold",
                  textDecoration: "underline",
                  marginBottom: "30px",
                }}
              >
                वंशावली (वंशवृक्ष)
              </h2>

              <div className="css-tree">
                <ul>{renderTreePreview(formData.treeData)}</ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}