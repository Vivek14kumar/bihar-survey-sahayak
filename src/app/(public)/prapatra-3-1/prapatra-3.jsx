"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer, FileText, User, MapPin, Landmark, Download, Crown, Network } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export default function PrapatraVanshavaliTree() {
  const [formData, setFormData] = useState({
    campAnchal: "",
    campDistrict: "",
    applicants: [
    { id: 1, name: "", rel: "पुत्र", relName: "" },
    { id: 2, name: "", rel: "पुत्र", relName: "" }
    ],
    app1Name: "", app1Rel: "पुत्र", app1RelName: "",
    app2Name: "", app2Rel: "पुत्र", app2RelName: "",
    app3Name1: "", app3Name2: "", app3RelName: "",
    addressName: "",
    village: "",
    thana: "",
    anchal: "",
    district: "",
    caste: "",
    propertyOwnerName: "", 
    propertyFatherName: "", 
    propertyVillage: "",   
    revenueVillage: "",
    propertyAnchal: "",
    jamabandiNo: "",
    khataNo: "",
    khesraNo: "",
    rakbaAcre: "",     // नया: एकड़ के लिए
    rakbaDecimal: "",  // नया: डिसमिल के लिए
    lagan: "",
    basisOfRight: "उत्तराधिकार",
    
    // --- NEW: Structured Tree Data Instead of Text ---
    treeData: {
      id: "root_1",
      name: "", // मुख्य पूर्वज
      children: []
    },
    
    date: new Date().toISOString().split("T")[0],
  });

  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);
  
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const printRef = useRef(null);
  const observerRef = useRef(null);

  const addApplicant = () => {
  if (formData.applicants.length < 4) {
    setFormData({
      ...formData,
      applicants: [...formData.applicants, { id: Date.now(), name: "", rel: "पुत्र", relName: "" }]
    });
  }
};

const removeApplicant = (index) => {
  if (formData.applicants.length > 2) {
    const newApplicants = formData.applicants.filter((_, i) => i !== index);
    setFormData({ ...formData, applicants: newApplicants });
  }
};

const updateApplicant = (index, field, value) => {
  const newApplicants = [...formData.applicants];
  newApplicants[index][field] = value;
  setFormData({ ...formData, applicants: newApplicants });
  
  // हिंदी सजेशन के लिए (अगर आप इस्तेमाल कर रहे हैं)
  if (field === "name" || field === "relName") {
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.trim()) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 200);
    }
  }
};

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
        const isRemoval = mutation.type === 'childList' && Array.from(mutation.removedNodes).some(node => node.id === 'watermark-layer');
        const isStyleChange = mutation.type === 'attributes' && mutation.target.id === 'watermark-layer';
        if (isRemoval || isStyleChange) {
          alert("⚠️ सुरक्षा चेतावनी: वाटरमार्क के साथ छेड़छाड़ वर्जित है।");
          window.location.reload();
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [showWatermark]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 850) { setScale(window.innerWidth / 880); } 
      else { setScale(1); }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validateForm = () => {
    // यहाँ से 'app1Name' हटा दिया गया है
    const requiredFields = ["campAnchal", "village", "khataNo"];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert("कृपया सभी महत्वपूर्ण जानकारी (अंचल, गाँव, खाता आदि) भरें।");
        const formContainer = document.getElementById("form-container");
        if(formContainer) formContainer.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    }
    
    // नए स्ट्रक्चर के अनुसार पहले आवेदक का नाम चेक करें
    if (!formData.applicants[0] || formData.applicants[0].name.trim() === "") {
      alert("कृपया कम से कम पहले आवेदक का नाम भरें।");
      const formContainer = document.getElementById("form-container");
      if(formContainer) formContainer.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const executePrint = useReactToPrint({ contentRef: printRef, documentTitle: "प्रपत्र_3_1_वंशावली" });

  const executeDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); 
      const dataUrl = await toPng(printRef.current, {
        quality: 1.0, pixelRatio: 2, backgroundColor: '#ffffff',
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (printRef.current.offsetHeight * pdfWidth) / printRef.current.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("Prapatra_3_1.pdf");
    } catch (error) {
      console.error("PDF Error:", error);
      alert("PDF जनरेट करने में समस्या।");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const processAction = async (actionType) => {
    if (!validateForm()) return;

    if (!showWatermark) {
      if (actionType === 'print') executePrint();
      if (actionType === 'download') executeDownloadPDF();
      return;
    }

    if (!window.Razorpay) {
      alert("भुगतान प्रणाली लोड हो रही है... कृपया प्रतीक्षा करें।");
      return;
    }

    try {
      const orderRes = await fetch("/api/create-razorpay-order", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ type: "prapatra3" }) // Changed to match your backend exactly
});

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Premium Prapatra 3(1) (No Watermark)",
        order_id: orderData.id,
        handler: async function (response) {
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }

          setShowWatermark(false); 

          try {
            await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
          } catch (e) { console.log(e); }

          try {
            await fetch("/api/prapatra3", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "prapatra3" })
            });
          } catch (e) { console.log(e); }

          setTimeout(() => { 
            if (actionType === 'print') executePrint();
            if (actionType === 'download') executeDownloadPDF();
          }, 800); 
        },
        theme: { color: "#1d4ed8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("भुगतान प्रारंभ नहीं हो सका। कृपया पुनः प्रयास करें।");
    }
  };

  const fetchSuggestions = async (word) => {
    if (!word || word.length < 2) { setSuggestions([]); return; }
    if (cacheRef.current[word]) { setSuggestions(cacheRef.current[word]); setActiveIndex(0); return; }
    try {
      const res = await fetch(`https://inputtools.google.com/request?text=${word}&itc=hi-t-i0-und&num=5`);
      const data = await res.json();
      if (data[0] === "SUCCESS") {
        const result = data[1][0][1]; cacheRef.current[word] = result; setSuggestions(result); setActiveIndex(0);
      }
    } catch { setSuggestions([]); }
  };

  // --- TREE STATE UPDATE FUNCTIONS WITH LEVEL LIMIT ---
  const MAX_TREE_DEPTH = 4; // Maximum 4 levels allowed

  const updateTreeNode = (node, id, newName) => {
    if (node.id === id) return { ...node, name: newName };
    if (node.children) return { ...node, children: node.children.map(c => updateTreeNode(c, id, newName)) };
    return node;
  };

  const addChildNode = (node, parentId, currentDepth = 1) => {
    if (node.id === parentId) {
      if (currentDepth >= MAX_TREE_DEPTH) {
        alert(`आप अधिकतम ${MAX_TREE_DEPTH} पीढ़ियाँ ही जोड़ सकते हैं।`);
        return node;
      }
      return { ...node, children: [...node.children, { id: `node_${Date.now()}`, name: "", children: [] }] };
    }
    if (node.children) return { ...node, children: node.children.map(c => addChildNode(c, parentId, currentDepth + 1)) };
    return node;
  };

  const removeNode = (node, idToRemove) => {
    if (node.children) {
      const filtered = node.children.filter(c => c.id !== idToRemove);
      return { ...node, children: filtered.map(c => removeNode(c, idToRemove)) };
    }
    return node;
  };

  const handleTreeInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, treeData: updateTreeNode(prev.treeData, id, value) }));
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.trim()) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 200);
    } else { setSuggestions([]); }
  };

  const selectTreeSuggestion = (id, selectedWord, currentName) => {
    const words = currentName.split(" ");
    words[words.length - 1] = selectedWord;
    const finalVal = words.join(" ") + " ";
    setFormData(prev => ({ ...prev, treeData: updateTreeNode(prev.treeData, id, finalVal) }));
    setSuggestions([]); setActiveIndex(0);
  };

  const handleTreeKeyDown = (e, id, currentName) => {
    if (suggestions.length > 0 && currentField === `tree_${id}`) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev)); } 
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex(prev => (prev > 0 ? prev - 1 : 0)); } 
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); selectTreeSuggestion(id, suggestions[activeIndex], currentName); }
    }
  };

  const handleInputChange = (field, value, disableHindi = false) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (disableHindi) { setSuggestions([]); return; }
    const words = value.split(/[\s\n]+/);
    const lastWord = words[words.length - 1];
    if (lastWord.trim()) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 200);
    } else { setSuggestions([]); }
  };

  const selectSuggestion = (selectedWord, fieldName) => {
    setFormData((prev) => {
      const words = prev[fieldName].split(/([\s\n]+)/); 
      words[words.length - 1] = selectedWord;
      return { ...prev, [fieldName]: words.join("") + " " }; 
    });
    setSuggestions([]); setActiveIndex(0);
  };

  const handleKeyDown = (e, fieldName) => {
    if (suggestions.length > 0 && currentField === fieldName) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev)); } 
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0)); } 
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); selectSuggestion(suggestions[activeIndex], fieldName); }
    }
  };

  const renderInput = ({ label, name, placeholder, type = "text", width = "w-full", disableHindi = false, helpText }) => (
    <div className={`relative mb-3 ${width}`}>
      <label className="block mb-1 text-sm font-bold text-gray-800">{label}</label>
      {helpText && <p className="text-[11px] text-gray-500 mb-1 leading-tight">{helpText}</p>}
      <input
        type={type} placeholder={placeholder}
        className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors bg-white shadow-sm"
        value={formData[name]}
        onFocus={() => setCurrentField(name)}
        onBlur={() => setTimeout(() => { if (currentField === name) setSuggestions([]) }, 200)}
        onChange={(e) => handleInputChange(name, e.target.value, disableHindi || type === "number")}
        onKeyDown={(e) => handleKeyDown(e, name)}
      />
      {currentField === name && suggestions.length > 0 && !disableHindi && type !== "number" && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0">
          {suggestions.map((s, i) => (
            <li key={i} onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s, name); }} className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${i === activeIndex ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}>
              <span>{s}</span>{i === activeIndex && <span className="text-[10px] opacity-60 uppercase">Space</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderTreeInput = (node, depth = 1) => {
    return (
      <div key={node.id} className="relative mb-3 transition-all" style={{ marginLeft: `${(depth - 1) * 22}px`, borderLeft: depth > 1 ? '2px dashed #93c5fd' : 'none', paddingLeft: depth > 1 ? '15px' : '0' }}>
        <div className="flex gap-2 items-center relative">
          {depth > 1 && <span className="absolute -left-[15px] top-1/2 w-4 border-t-2 border-dashed border-blue-300"></span>}
          
          <div className="relative">
            <input
              type="text"
              placeholder={depth === 1 ? "मुख्य पूर्वज (स्व. राम)" : "वंशज का नाम"}
              className={`border p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold shadow-sm ${depth === 1 ? 'w-48 bg-blue-50 border-blue-300' : 'w-40 bg-white border-gray-300'}`}
              value={node.name}
              onFocus={() => setCurrentField(`tree_${node.id}`)}
              onBlur={() => setTimeout(() => { if (currentField === `tree_${node.id}`) setSuggestions([]) }, 200)}
              onChange={(e) => handleTreeInputChange(node.id, e.target.value)}
              onKeyDown={(e) => handleTreeKeyDown(e, node.id, node.name)}
            />
            {currentField === `tree_${node.id}` && suggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0">
                {suggestions.map((s, i) => (
                  <li key={i} onMouseDown={(e) => { e.preventDefault(); selectTreeSuggestion(node.id, s, node.name); }} className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${i === activeIndex ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}>
                    <span>{s}</span>{i === activeIndex && <span className="text-[10px] opacity-60 uppercase">Space</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={() => setFormData(prev => ({...prev, treeData: addChildNode(prev.treeData, node.id, depth)}))} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors shrink-0" title="संतान जोड़ें">
            + वंशज
          </button>
          
          {depth > 1 && (
            <button onClick={() => setFormData(prev => ({...prev, treeData: removeNode(prev.treeData, node.id)}))} className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors shrink-0" title="हटाएं">✕</button>
          )}
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="mt-3">
            {node.children.map(child => renderTreeInput(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderTreePreview = (node) => {
    return (
      <li key={node.id}>
        <div className="node-box">{node.name || "________________"}</div>
        {node.children && node.children.length > 0 && (
          <ul>
            {node.children.map(child => renderTreePreview(child))}
          </ul>
        )}
      </li>
    );
  };
// 1. टाइप करते समय इनपुट हैंडल करने के लिए (डबल टाइपिंग फिक्स)
  const handleApplicantInputChange = (index, field, value) => {
    setFormData((prev) => {
      const newApplicants = [...prev.applicants];
      newApplicants[index] = { ...newApplicants[index], [field]: value };
      return { ...prev, applicants: newApplicants };
    });

    const words = value.split(/[\s\n]+/);
    const lastWord = words[words.length - 1];
    if (lastWord.trim()) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 200);
    } else { 
      setSuggestions([]); 
    }
  };

  // 2. सजेशन सेलेक्ट (Click/Space/Enter) करने के लिए 
  const selectApplicantSuggestion = (selectedWord, index, fieldName) => {
    setFormData((prev) => {
      const newApplicants = [...prev.applicants];
      newApplicants[index] = { ...newApplicants[index] }; 
      
      const words = newApplicants[index][fieldName].split(/([\s\n]+)/); 
      words[words.length - 1] = selectedWord;
      
      newApplicants[index][fieldName] = words.join("") + " "; 
      return { ...prev, applicants: newApplicants };
    });
    setSuggestions([]); 
    setActiveIndex(0);
  };

  // 3. कीबोर्ड का Space और Arrow Keys कंट्रोल करने के लिए
  const handleApplicantKeyDown = (e, index, fieldName, currentFieldName) => {
    if (suggestions.length > 0 && currentField === currentFieldName) {
      if (e.key === "ArrowDown") { 
        e.preventDefault(); 
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev)); 
      } 
      else if (e.key === "ArrowUp") { 
        e.preventDefault(); 
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0)); 
      } 
      else if (e.key === " " || e.key === "Enter") { 
        e.preventDefault(); 
        // यहाँ क्रम को सही किया गया है (selectedWord, index, fieldName)
        selectApplicantSuggestion(suggestions[activeIndex], index, fieldName); 
      }
    }
  };

  return (
    <div className="p-2 md:p-6 max-w-[1400px] mx-auto bg-gray-100 flex flex-col lg:flex-row gap-6 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');
        .font-hindi { font-family: 'Noto Sans Devanagari', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        /* 🚀 BEAUTIFUL CSS TREE LOGIC (COMPACT SIZE) 🚀 */
        .css-tree { width: 100%; display: flex; justify-content: center; overflow-x: visible; }
        .css-tree ul { padding-top: 15px; position: relative; display: flex; justify-content: center; padding-left: 0; margin:0; }
        .css-tree li { text-align: center; list-style-type: none; position: relative; padding: 15px 2px 0 2px; flex: 1; }
        .css-tree li::before, .css-tree li::after { content: ''; position: absolute; top: 0; right: 50%; border-top: 1.5px solid #333; width: 50%; height: 15px; }
        .css-tree li::after { right: auto; left: 50%; border-left: 1.5px solid #333; }
        .css-tree li:only-child::after, .css-tree li:only-child::before { display: none; }
        .css-tree li:only-child { padding-top: 0; }
        .css-tree li:first-child::before, .css-tree li:last-child::after { border: 0 none; }
        .css-tree li:last-child::before { border-right: 1.5px solid #333; border-radius: 0 4px 0 0; }
        .css-tree li:first-child::after { border-radius: 4px 0 0 0; }
        .css-tree ul ul::before { content: ''; position: absolute; top: 0; left: 50%; border-left: 1.5px solid #333; width: 0; height: 15px; }
        .css-tree .node-box { border: 1.5px solid #333; padding: 4px 8px; font-size: 12px; font-weight: bold; display: inline-block; border-radius: 4px; background-color: #fff; position: relative; z-index: 1; white-space: nowrap; box-shadow: 1px 1px 0px rgba(0,0,0,0.1); max-width: 120px; overflow: hidden; text-overflow: ellipsis; }

        @media print {
          body { background: white; margin: 0; padding: 0; }
          @page { size: A4 portrait; margin: 15mm 15mm; }
          #watermark-layer { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; }
        }
      `}</style>

      {/* LEFT SIDE: Input Form */}
      <div id="form-container" className="w-full lg:w-1/3 bg-white p-4 md:p-6 shadow-xl rounded-xl h-auto lg:h-[88vh] overflow-y-auto border-t-[6px] border-blue-600 scroll-smooth print:hidden relative">
        
        <div className="text-center mb-6 border-b pb-4">
          <h2 className="text-2xl md:text-2xl font-extrabold text-blue-800 tracking-tight">प्रपत्र 3 (1) वंशावली</h2>
          <p className="text-sm text-gray-500 mt-2">स्वयं की वंशावली समर्पित करने के लिए</p>
        </div>

        {/* Section 1 */}
        <div className="bg-blue-50 p-4 md:p-5 rounded-3xl mb-5 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-blue-200 pb-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <h3 className="font-bold text-blue-900 text-lg">शिविर प्रभारी का विवरण</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {renderInput({ label: "अंचल", name: "campAnchal", placeholder: "अंचल का नाम" })}
            {renderInput({ label: "जिला", name: "campDistrict", placeholder: "जिले का नाम" })}
          </div>
        </div>

        {/* Section 2 */}
<div className="bg-orange-50 p-4 md:p-5 rounded-3xl mb-5 border border-orange-200 shadow-sm">
  <div className="flex items-center justify-between mb-4 border-b border-orange-300 pb-2">
    <div className="flex items-center gap-2">
      <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
      <h3 className="font-bold text-orange-900 text-lg">आवेदक(ओं) का विवरण</h3>
    </div>
    
  </div>

  {/* आवेदकों की लिस्ट */}
{formData.applicants.map((app, index) => (
  <div key={index} className="bg-white p-3 rounded-xl border border-orange-100 mb-3 relative">
    
    {/* हटाएँ बटन */}
    {index > 1 && (
      <button 
        onClick={() => removeApplicant(index)} 
        className="absolute top-2 right-2 text-red-500 text-[10px] font-bold bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors z-10"
      >
        हटाएं ✕
      </button>
    )}
    
    <label className="block mb-1 text-sm font-bold text-gray-800">
      आवेदक {index + 1} का नाम
    </label>
    
    {/* 1. नाम का इनपुट (ऑटो हिंदी के साथ) */}
    <div className="relative mb-3">
      <input
        type="text"
        className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none"
        placeholder="नाम लिखें"
        value={app.name}
        onFocus={() => setCurrentField(`app_${index}_name`)}
        onBlur={() => setTimeout(() => { if (currentField === `app_${index}_name`) setSuggestions([]) }, 200)}
        onChange={(e) => handleApplicantInputChange(index, "name", e.target.value)}
        onKeyDown={(e) => handleApplicantKeyDown(e, index, "name", `app_${index}_name`)}
      />
      {currentField === `app_${index}_name` && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0">
          {suggestions.map((s, i) => (
            <li key={i} onMouseDown={(e) => { e.preventDefault(); selectApplicantSuggestion(s, index, "name"); }} className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${i === activeIndex ? 'bg-orange-100 text-orange-800 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}>
              <span>{s}</span>{i === activeIndex && <span className="text-[10px] opacity-60 uppercase">Space</span>}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="flex gap-3">
      {/* संबंध */}
      <div className="w-1/3">
        <select 
          className="w-full border border-gray-300 p-3 rounded-xl text-sm bg-white outline-none"
          value={app.rel}
          onChange={(e) => handleApplicantInputChange(index, "rel", e.target.value)}
        >
          <option>पुत्र</option>
          <option>पुत्री</option>
          <option>पत्नी</option>
        </select>
      </div>
      
      {/* 2. पिता/पति का नाम (ऑटो हिंदी के साथ) */}
      <div className="w-2/3 relative">
        <input
          type="text"
          placeholder="पिता/पति का नाम"
          className="w-full border border-gray-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          value={app.relName}
          onFocus={() => setCurrentField(`app_${index}_relName`)}
          onBlur={() => setTimeout(() => { if (currentField === `app_${index}_relName`) setSuggestions([]) }, 200)}
          onChange={(e) => handleApplicantInputChange(index, "relName", e.target.value)}
          onKeyDown={(e) => handleApplicantKeyDown(e, index, "relName", `app_${index}_relName`)}
        />
        {currentField === `app_${index}_relName` && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0">
            {suggestions.map((s, i) => (
              <li key={i} onMouseDown={(e) => { e.preventDefault(); selectApplicantSuggestion(s, index, "relName"); }} className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${i === activeIndex ? 'bg-orange-100 text-orange-800 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}>
                <span>{s}</span>{i === activeIndex && <span className="text-[10px] opacity-60 uppercase">Space</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
))}

{/* जोड़ें बटन */}
<div className="flex justify-center mt-2 mb-4">
  <button 
    onClick={addApplicant} 
    disabled={formData.applicants.length >= 4} 
    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
  >
    <span>+</span> और आवेदक जोड़ें
  </button>
</div>

  {/* Dynamic Point Numbering (iv, v) */}
  <div className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm mt-4">
    <h4 className="text-xs font-bold text-gray-600 mb-2">
      बिंदु ({
        formData.applicants.length === 1 ? 'ii' : 
        formData.applicants.length === 2 ? 'iii' : 
        formData.applicants.length === 3 ? 'iv' : 'v'
      }) का विवरण
    </h4>
    <div className="grid grid-cols-2 gap-3">
      {renderInput({ label: "श्री/श्रीमती 1", name: "app3Name1" })}
      {renderInput({ label: "श्री/श्रीमती 2", name: "app3Name2" })}
    </div>
    {renderInput({ label: "पुत्री(यों), पत्नी (का नाम)", name: "app3RelName" })}
  </div>
</div>

        {/* Section 3 */}
        <div className="bg-purple-50 p-4 md:p-5 rounded-3xl mb-5 border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-purple-300 pb-2">
            <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <h3 className="font-bold text-purple-900 text-lg">आवेदक का पता</h3>
          </div>
          {renderInput({ label: "मुख्य आवेदक का नाम (श्री/श्रीमती)", name: "addressName", placeholder: "नाम लिखें" })}
          <div className="grid grid-cols-2 gap-3">
            {renderInput({ label: "ग्राम", name: "village" })}
            {renderInput({ label: "थाना", name: "thana" })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {renderInput({ label: "अंचल", name: "anchal" })}
            {renderInput({ label: "जिला", name: "district" })}
          </div>
          {renderInput({ label: "जाति (Caste)", name: "caste", width: "w-full" })}
        </div>

        {/* Section 4 */}
        <div className="bg-yellow-50 p-4 md:p-5 rounded-3xl mb-5 border border-yellow-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-yellow-300 pb-2">
            <span className="bg-yellow-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <h3 className="font-bold text-yellow-900 text-lg">मूल भूमि का विवरण</h3>
          </div>
          {renderInput({ label: "स्व......... (जिसके नाम से ज़मीन है)", name: "propertyOwnerName" })}
          <div className="grid grid-cols-2 gap-3">
            {renderInput({ label: "पिता:-", name: "propertyFatherName" })}
            {renderInput({ label: "ग्राम", name: "propertyVillage" })}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-2 border-t border-yellow-300 pt-3">
            {renderInput({ label: "राजस्व ग्राम", name: "revenueVillage" })}
            {renderInput({ label: "अंचल", name: "propertyAnchal" })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {renderInput({ label: "जमाबंदी नं.", name: "jamabandiNo", disableHindi: true })}
            {renderInput({ label: "खाता नं.", name: "khataNo", disableHindi: true })}
          </div>
          
          {/* --- NEW SPLIT RAKBA INPUTS HERE --- */}
          <div className="grid grid-cols-1  gap-2">
            {renderInput({ label: "खेसरा नं.", name: "khesraNo", disableHindi: true })}
            <div className="flex gap-2">
              {renderInput({ label: "एकड़", name: "rakbaAcre", type: "number", disableHindi: true })}
              {renderInput({ label: "डिसमिल", name: "rakbaDecimal", type: "number", disableHindi: true })}
            </div>
            {renderInput({ label: "लगान", name: "lagan", disableHindi: true })}
          </div>
          
          <div className="w-full relative mb-3 mt-2">
            <label className="block mb-1 text-sm font-bold text-gray-800">अधिकार का आधार</label>
            <select className="w-full border border-gray-300 p-3 rounded-xl text-sm bg-white" value={formData.basisOfRight} onChange={(e)=>setFormData({...formData, basisOfRight: e.target.value})}>
              <option>उत्तराधिकार</option><option>बंटवारा</option>
            </select>
          </div>
        </div>

        {/* Section 5: NEW TREE BUILDER */}
        <div className="bg-green-50 p-4 md:p-5 rounded-3xl mb-24 border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-green-300 pb-2">
            <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">5</span>
            <h3 className="font-bold text-green-900 text-lg">वंशवृक्ष (Family Tree) बनाएं</h3>
          </div>
          <p className="text-xs text-green-800 font-semibold mb-4 bg-green-100 p-2 rounded-lg">
            'Button' पर क्लिक करके से पहले पपत्र 3 को प्रिंट या डाउनलोड कर ले ।
          </p>
          {/*<div className="bg-white p-3 rounded-xl border border-green-200 overflow-x-auto">
            {renderTreeInput(formData.treeData)}
          </div>*/}
          <Link
            href="/#tools"
            className="block mx-auto text-center p-4 bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-2xl font-bold text-[13px] hover:shadow-lg transition-all w-fit"
          >
            यहाँ से बनाये
          </Link>
        </div>

        {/* --- STICKY BOTTOM BUTTONS --- */}
        <div className="sticky bottom-0 left-0 w-full z-20 bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] px-3 py-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => processAction('print')} className="relative flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3.5 rounded-2xl font-bold text-[13px] hover:shadow-lg transition-all">
              {showWatermark && <span className="absolute -top-2 right-2 text-[11px] bg-black text-white px-2 py-[2px] rounded-full shadow-lg">₹5</span>}
              <Printer size={20} /><span>प्रिंट करें</span>
            </button>
            <button onClick={() => processAction('download')} disabled={isGeneratingPDF} className="relative flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3.5 rounded-2xl font-bold text-[13px] hover:shadow-lg transition-all disabled:opacity-70">
              {showWatermark && <span className="absolute -top-2 right-2 text-[11px] bg-black text-white px-2 py-[2px] rounded-full shadow-lg">₹5</span>}
              <Download size={20} /><span>{isGeneratingPDF ? 'लोडिंग...' : 'PDF डाउनलोड'}</span>
            </button>

            {/* --- ⚠️ सिर्फ टेस्टिंग के लिए (Live करने से पहले हटा दें) ⚠️ --- */}
            {/* <button onClick={() => { setShowWatermark(false); if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; } setTimeout(() => { executePrint(); }, 1000); }} className="col-span-2 mt-2 bg-gray-200 text-gray-800 py-2 rounded-xl text-xs font-bold"> 🛠️ Developer Bypass Payment (Test) </button> */}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Document Preview */}
      <div className="w-full lg:w-2/3 p-2 md:p-6 rounded-xl overflow-x-auto overflow-y-auto h-auto lg:h-[88vh] flex justify-center bg-white shadow-xl font-hindi print:bg-transparent print:shadow-none print:p-0">
        <div className="p-8 md:p-10 relative" style={{ backgroundColor:'white', transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          
          {/* ACTUAl PRINT DOCUMENT */}
          <div 
            ref={printRef}
            className="text-black leading-relaxed relative bg-white" 
            style={{ fontSize: '15px', color: '#000', width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
          >
            
            {showWatermark && !isGeneratingPDF && (
              <div id="watermark-layer" style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='450' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='38' font-weight='900' font-family='Arial, sans-serif' fill='rgba(54, 40, 40, 0.08)' text-anchor='middle' transform='rotate(-40, 225, 225)'%3EBIHAR SURVEY SAHAYAK%3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}></div>
            )}

            <div className="relative z-10" style={{ padding: '0mm 15mm' }}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>प्रपत्र 3 (1)</div>
              <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 'bold', textDecoration: 'underline', marginTop: '5px', marginBottom: '5px' }}>
                वंशावली
              </h2>
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '25px' }}>
                [अधिनियम की धारा 5 (1)]
              </div>
              
              <div style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                <p><span style={{ fontWeight: 'bold' }}>सेवा में,</span></p>
                <p style={{ paddingLeft: '45px' }}>
                  शिविर प्रभारी<br/>
                  अंचल <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.campAnchal || "______________"}</span><br/>
                  जिला <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.campDistrict || "______________"}</span>
                </p>
              </div>

              <div style={{ display: 'flex', marginBottom: '15px' }}>
                <span style={{ minWidth: '60px' }}>विषयः-</span>
                <span>स्वयं की वंशावली समर्पित करने के संबंध में।</span>
              </div>
              <p style={{ marginBottom: '10px' }}>महाशय,</p>
              <p style={{ paddingLeft: '45px', marginBottom: '10px' }}>उपरोक्त विषय के सम्बन्ध में सूचित करते हुए कहना है कि मैं / हमलोग</p>
              
              <div style={{ paddingLeft: '45px', marginBottom: '15px', lineHeight: '2' }}>
  {/* 1. डायनामिक आवेदकों की लिस्ट (i, ii, iii...) */}
  {formData.applicants.map((app, idx) => {
    const romanNumerals = ["i", "ii", "iii", "iv", "v"];
    return (
      <p key={idx}>
        ({romanNumerals[idx]}) &nbsp;&nbsp;&nbsp; श्री / श्रीमती 
        <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>
          {app.name || "________________"}
        </span> 
        &nbsp; {app.rel} / पत्नी श्री &nbsp;
        <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>
          {app.relName || "________________"}
        </span>
      </p>
    );
  })}

  {/* 2. अगला पॉइंट (आवेदकों की संख्या + 1) */}
  <p>
    ({
      formData.applicants.length === 1 ? 'ii' : 
      formData.applicants.length === 2 ? 'iii' : 
      formData.applicants.length === 3 ? 'iv' : 'v'
    }) &nbsp; श्री / श्रीमती <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.app3Name1 || "________________"}</span> 
    &nbsp; श्री / श्रीमती <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.app3Name2 || "________________"}</span><br/>
    
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; पुत्री(यों), पत्नी <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.app3RelName || "________________"}</span> निवासी <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.village || "________________"}</span> ग्राम <br/>
    
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; थाना <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.thana || "_________"}</span> अंचल:- <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.anchal || "_________"}</span> जिला <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.district || "_________"}</span> जाति <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.caste || "_________"}</span><br/>
    
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ने भूमि जिसका विवरण आवेदन के साथ संलग्न प्रपत्र ।। में अंकित है स्व <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.propertyOwnerName || "_________"}</span><br/>
    
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; पिता:- <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.propertyFatherName || "_________"}</span> ग्राम <span style={{ borderBottom: '1px dashed #666', padding: '0 8px', fontWeight: 'bold' }}>{formData.propertyVillage || "_________"}</span>
  </p>
</div>

              <p style={{ textAlign: 'justify', lineHeight: '2', marginBottom: '0' }}>
                जो राजस्व ग्राम:- <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.revenueVillage || "_________"}</span> 
                अंचल:- <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.propertyAnchal || "_________"}</span> के 
                जमाबंदी क्रमांक संख्या <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.jamabandiNo || "___"}</span>
                में प्रविष्ट थे, की .......................................... /खतियान में अंकित खाता
                संख्या <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.khataNo || "___"}</span> 
                खेसरा संख्या <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.khesraNo || "___"}</span> 
                
                {/* --- NEW SPLIT RAKBA DISPLAY --- */}
                रकबा <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>
                  {formData.rakbaAcre ? `${formData.rakbaAcre} एकड़` : ""} {formData.rakbaDecimal ? `${formData.rakbaDecimal} डिसमिल` : ""}
                  {(!formData.rakbaAcre && !formData.rakbaDecimal) ? "___" : ""}
                </span>
                
                लगान <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.lagan || "___"}</span> को 
                <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.basisOfRight}</span> के आधार पर हित अर्जित किया है।
              </p>

              <p style={{ textAlign: 'justify', lineHeight: '1.8', marginBottom: '0', marginTop:'16px' }}>
                मैं / हमलोगों निम्न वंशावली / वंशवृक्ष से उत्तराधिकारी के आधार पर हित आर्जित
                किया हूँ/ हैं। वंशावली / वंशवृक्ष (मुल खतियान / पंजी- ।। के अनुसार)<br/>
                <span style={{textAlign:'center'}}>(नीचे वंश वृक्ष टेबल फार्म बनायें)</span>
              </p>

              {/* 🚀 COMPACT VISUAL TREE RENDERER 🚀 
              <div className="css-tree" style={{ minHeight: '80px', marginBottom: '10px', marginTop: '0', border:'1px solid #ccc', borderRadius:'4px', paddingBottom:'10px', overflowX: 'hidden' }}>
                <ul>
                  {renderTreePreview(formData.treeData)}
                </ul>
              </div>*/}

              <p style={{ textAlign: 'justify', lineHeight: '1.5', marginBottom: '8px', textIndent: '45px' }}>
                मैं/ हमलोगों का उल्लेखित भूमि पर शान्तिपूर्ण दखल कब्जा है तथा भूमि स्वत्ववाद एवं 
                विवाद से मुक्त है। मैं/ हमलोगों की वंशावली, खतियान / जमाबंदी पंजी के अनुसार निम्नरूपेण है।
              </p>
              <p style={{ textAlign: 'justify', lineHeight: '1.5', marginBottom: '15px' }}>
                अतः अनुरोध है कि प्रपत्र में अंकित वंशावली के आधार पर तथा प्रश्नगत भूमि में उत्तरधिकार के 
                आधार पर मेरे/हमलोगों के नाम पर सर्वेक्षण प्रक्रिया से तैयार होने वाले अभिलेख में खाता 
                खोलकर सम्बन्धित खेसरों को उसमें प्रविष्ट करने की कृपा की जाय।<br/>
                अनुलग्नक-याचिकार्त्ता / (ओ) का वंशवृक्ष
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingBottom: '10px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ marginBottom: '30px' }}>विश्वासभाजन</p>
                  <p>याचिकाकर्त्ता (ओं) का हस्ताक्षर</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}