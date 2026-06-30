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

export default function VanshavaliManual() {
  const [formData, setFormData] = useState({
    applicants: [{ name: "", relName: "" }],
    treeData: INITIAL_TREE_DATA,
    date: new Date().toISOString().split("T")[0],
  });

  const [applicantMobile, setApplicantMobile] = useState("");
  const [layoutMode, setLayoutMode] = useState("landscape");

  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false); // पेमेंट या जनरेशन चालू है या नहीं
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

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
    const savedMobile = localStorage.getItem("vanshavali_mobile_data");
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
    if (savedMobile) setApplicantMobile(savedMobile);
    if (savedLayout) setLayoutMode(savedLayout);
  }, []);

  useEffect(() => {
    localStorage.setItem("vanshavali_tree_data", JSON.stringify(formData.treeData));
  }, [formData.treeData]);

  useEffect(() => {
    localStorage.setItem("vanshavali_mobile_data", applicantMobile);
  }, [applicantMobile]);

  useEffect(() => {
    localStorage.setItem("vanshavali_layout_mode", layoutMode);
  }, [layoutMode]);

  const handleReset = () => {
    if (window.confirm("क्या आप वाकई सारा डेटा मिटाना चाहते हैं? यह वापस नहीं लाया जा सकेगा।")) {
      localStorage.removeItem("vanshavali_tree_data");
      localStorage.removeItem("vanshavali_mobile_data");
      
      setFormData((prev) => ({
        ...prev,
        treeData: { id: `root_${Date.now()}`, name: "", children: [] },
      }));
      setApplicantMobile("");
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
    if (applicantMobile.length !== 10) {
      alert("कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।");
      return false;
    }
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
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

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
    // प्रिंट डायलॉग बंद होने के तुरंत बाद वाटरमार्क और बटन वापस लॉक कर दें
    onAfterPrint: () => {
      setShowWatermark(true);
      setIsProcessing(false);
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
      // PDF डाउनलोड होते ही सिस्टम वापस लॉक हो जाएगा
      setIsGeneratingPDF(false);
      setIsProcessing(false);
      setShowWatermark(true);
    }
  };

  const processAction = async (actionType) => {
    if (!validateForm()) return;

    if (!window.Razorpay) {
      alert("भुगतान प्रणाली लोड हो रही है... कृपया प्रतीक्षा करें।");
      return;
    }
    // 2️⃣ First Confirmation (Review Form)
    const confirmReview = window.confirm(
      "Payment करने से पहले कृपया वंशावली (PREVIEW) को ध्यान से देख लें।\n\nक्या आपने सभी जानकारी सही से भर दी है?"
    );

    if (!confirmReview) return;

    // 3️⃣ Legal Responsibility Confirmation
    const confirmResponsibility = window.confirm(
      "मैंने वंशावली को ध्यान से देख लिया है।\n\nयदि कोई जानकारी गलत है तो उसकी पूरी जिम्मेदारी मेरी होगी।\n\nक्या आप डाउनलोड जारी रखना चाहते हैं?"
    );

    if (!confirmResponsibility) return;
    setIsProcessing(true);

    try {
      const orderRes = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "vanshavali" }),
      });

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Manual Vanshavali (No Watermark)",
        order_id: orderData.id,
        prefill: {
          name: "Customer Name",
          contact: applicantMobile,
          email: "customer@example.com",
        },
        handler: async function (response) {
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }

          setShowWatermark(false); // पेमेंट के बाद वाटरमार्क हटाएं

          try {
            await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            await fetch("/api/track-vanshawali", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "vanshavaliManual" }),
            });
          } catch (e) {
            console.log(e);
          }

          // प्रिंट/डाउनलोड प्रोसेस शुरू करें
          setTimeout(async () => {
            if (actionType === "print") {
              executePrint(); // इसके अंदर onAfterPrint में लॉक लॉजिक है
            }
            if (actionType === "download") {
              await executeDownloadPDF(); // इसके finally ब्लॉक में लॉक लॉजिक है
            }
          }, 800);
        },
        modal: {
          ondismiss: function () {
            // अगर यूज़र पेमेंट विंडो बिना पे किये काट देता है
            setIsProcessing(false);
          },
        },
        theme: { color: "#1d4ed8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("भुगतान प्रारंभ नहीं हो सका। कृपया पुनः प्रयास करें।");
      setIsProcessing(false);
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
        .font-hindi {
          font-family: "Noto Sans Devanagari", sans-serif;
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .css-tree {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .css-tree ul {
          padding-top: 15px;
          position: relative;
          display: flex;
          justify-content: center;
          padding-left: 0;
          margin: 0;
        }
        .css-tree li {
          text-align: center;
          list-style-type: none;
          position: relative;
          padding: 15px 4px 0 4px;
          flex: 1;
        }
        .css-tree li::before,
        .css-tree li::after {
          content: "";
          position: absolute;
          top: 0;
          right: 50%;
          border-top: 1.5px solid #333;
          width: 50%;
          height: 15px;
        }
        .css-tree li::after {
          right: auto;
          left: 50%;
          border-left: 1.5px solid #333;
        }
        .css-tree li:only-child::after,
        .css-tree li:only-child::before {
          display: none;
        }
        .css-tree li:only-child {
          padding-top: 0;
        }
        .css-tree li:first-child::before,
        .css-tree li:last-child::after {
          border: 0 none;
        }
        .css-tree li:last-child::before {
          border-right: 1.5px solid #333;
          border-radius: 0 4px 0 0;
        }
        .css-tree li:first-child::after {
          border-radius: 4px 0 0 0;
        }
        .css-tree ul ul::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          border-left: 1.5px solid #333;
          width: 0;
          height: 15px;
        }
        .css-tree .node-box {
          border: 1.5px solid #333;
          padding: 6px 12px;
          font-size: 14px;
          font-weight: bold;
          display: inline-block;
          border-radius: 6px;
          background-color: #fff;
          position: relative;
          z-index: 1;
          white-space: nowrap;
        }

        @media print {
          body {
            background: white;
            margin: 0;
            padding: 0;
          }
          .css-tree {
            transform: scale(0.95);
            transform-origin: top center;
          }
          #watermark-layer {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
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
          <div className="w-full sm:w-auto ml-auto">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">
              आवेदक का मोबाइल नंबर <span className="text-red-500">*</span>
            </label>

            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all w-full sm:w-64">
              <span className="bg-gray-100 px-3 py-2 text-gray-600 text-sm font-medium border-r border-gray-300 select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                value={applicantMobile}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, ""); 
                  val = val.replace(/^[0-5]+/, ""); 
                  setApplicantMobile(val);
                }}
                placeholder="10 अंकों का नंबर"
                className="w-full px-3 py-2 text-sm outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>
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
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 bg-red-400 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-red-600  transition-all disabled:opacity-60"
          >
            <RotateCcw size={18} />
            <span>RESET</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4 ml-auto">
            
            {/*<div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2">
              <label className="text-sm font-bold text-gray-700">पेज लेआउट:</label>
              <select
                value={layoutMode}
                onChange={(e) => setLayoutMode(e.target.value)}
                disabled={isProcessing}
                className="bg-transparent text-sm text-blue-700 font-bold focus:outline-none cursor-pointer disabled:opacity-60"
              >
                <option value="landscape">Landscape (आड़ा)</option>
                <option value="portrait">Portrait (सीधा)</option>
              </select>
            </div>

            <button
              onClick={() => processAction("print")}
              disabled={isProcessing}
              className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {showWatermark && (
                <span className="absolute -top-3 -right-2 text-[11px] bg-black text-white px-2 py-[2px] rounded-full shadow-lg">
                  ₹20
                </span>
              )}
              <Printer size={18} />
              <span>{isProcessing ? "लोडिंग..." : "प्रिंट करें"}</span>
            </button>*/}

            <button
              onClick={() => processAction("download")}
              disabled={isProcessing || isGeneratingPDF}
              className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {showWatermark && (
                <span className="absolute -top-3 -right-2 text-[11px] bg-black text-white px-2 py-[2px] rounded-full shadow-lg">
                  ₹20
                </span>
              )}
              <Download size={18} />
              <span>{isProcessing || isGeneratingPDF ? "लोडिंग..." : "PDF डाउनलोड"}</span>
            </button>
            {/* --- ⚠️ सिर्फ टेस्टिंग के लिए (Live करने से पहले हटा दें) ⚠️ --- */}
             {/*<button onClick={() => { setShowWatermark(false); if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; } setTimeout(() => { executePrint(); }, 1000); }} className="col-span-2 mt-2 bg-gray-200 text-gray-800 py-2 rounded-xl text-xs font-bold"> 🛠️ Developer Bypass Payment (Test) </button> */}
          </div>
        </div>
      </div>

      {/* Bottom Section: Document Preview (A4 Dimensions enforced) */}
      <div className="w-full bg-gray-100 shadow-inner rounded-xl p-4 font-hindi print:bg-transparent print:shadow-none print:p-0 overflow-hidden">
        <div className="w-full md:overflow-x-hidden overflow-x-auto pb-6 custom-scrollbar">
          
          {/* यह बॉक्स एकदम A4 पेज के आकार का दिखेगा */}
          <div
            ref={printRef}
            className="bg-white mx-auto relative shadow-lg print:shadow-none"
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