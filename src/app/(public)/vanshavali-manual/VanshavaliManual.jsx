"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer, Download, RotateCcw, Settings, MapPin, UserCheck, FileText, Phone } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const INITIAL_TREE_DATA = {
  id: "root_1",
  name: "",
  children: [],
};

// 1️⃣ सभी संभावित एड्रेस फील्ड्स का कॉन्फ़िगरेशन
const ADDRESS_FIELD_CONFIG = [
  { key: "pata", label: "पता" },
  { key: "village", label: "ग्राम" },
  { key: "post", label: "पोस्ट" },
  { key: "thana", label: "थाना" },
  { key: "thanaNo", label: "थाना नं०", noSuggest: true },
  { key: "panchayat", label: "पंचायत" },
  { key: "block", label: "प्रखंड" },
  { key: "district", label: "जिला" },
  { key: "state", label: "राज्य" },
];

// डिफ़ॉल्ट रूप से ये फील्ड्स चेक (Select) रहेंगे
const DEFAULT_ADDRESS_FIELDS = ["village", "post", "thana", "thanaNo", "panchayat", "block", "district"];

export default function VanshavaliManual() {
  const [formData, setFormData] = useState({
    treeData: INITIAL_TREE_DATA,
  });

  const [layoutMode, setLayoutMode] = useState("landscape");
  const [paperSize, setPaperSize] = useState("a4");
  const [fontSize, setFontSize] = useState("14px");
  
  const [showTopDetails, setShowTopDetails] = useState(false);
  // 2️⃣ Address State (अब 'pata' और 'state' भी शामिल हैं)
  const [address, setAddress] = useState({
    pata: "", village: "", post: "", thana: "", thanaNo: "", panchayat: "", block: "", district: "", state: ""
  });
  
  // 3️⃣ Selected Fields State
  const [selectedAddressFields, setSelectedAddressFields] = useState(DEFAULT_ADDRESS_FIELDS);

  const [showDeclaration, setShowDeclaration] = useState(true);
  const [authOfficer, setAuthOfficer] = useState("");
  const [customOfficer, setCustomOfficer] = useState("");
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split("T")[0]);
  
  // Payment & Tracking States
  const [applicantMobile, setApplicantMobile] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // पेमेंट या जनरेशन चालू है या नहीं
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [currentAddressField, setCurrentAddressField] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [activeAddressIndex, setActiveAddressIndex] = useState(0);

  const [treeScale, setTreeScale] = useState(1);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const hasAlertedOverflow = useRef(false);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const printRef = useRef(null);
  const treeContainerRef = useRef(null);
  const observerRef = useRef(null);

  const MAX_TREE_DEPTH = 20;

  // ----------------------------------------
  // RAZORPAY SCRIPT LOAD
  // ----------------------------------------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  // ----------------------------------------
  // LOCAL STORAGE
  // ----------------------------------------
  useEffect(() => {
    const savedTree = localStorage.getItem("vanshavali_tree_data");
    const savedLayout = localStorage.getItem("vanshavali_layout_mode");
    const savedPaper = localStorage.getItem("vanshavali_paper_size");
    const savedFontSize = localStorage.getItem("vanshavali_font_size");
    const savedAddress = localStorage.getItem("vanshavali_address");
    const savedOfficer = localStorage.getItem("vanshavali_officer");
    const savedCustomOfficer = localStorage.getItem("vanshavali_custom_officer");
    const savedShowDetails = localStorage.getItem("vanshavali_show_details");
    const savedShowDeclaration = localStorage.getItem("vanshavali_show_declaration");
    const savedSigDate = localStorage.getItem("vanshavali_sig_date");
    const savedMobile = localStorage.getItem("vanshavali_mobile");

    if (savedTree) {
      try { setFormData((prev) => ({ ...prev, treeData: JSON.parse(savedTree) })); } 
      catch (e) { console.error("Error parsing tree data", e); }
    }
    if (savedLayout) setLayoutMode(savedLayout);
    if (savedPaper) setPaperSize(savedPaper);
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedAddress) setAddress(JSON.parse(savedAddress));
    if (savedOfficer) setAuthOfficer(savedOfficer);
    if (savedCustomOfficer) setCustomOfficer(savedCustomOfficer);
    if (savedShowDetails) setShowTopDetails(JSON.parse(savedShowDetails));
    if (savedShowDeclaration !== null) setShowDeclaration(JSON.parse(savedShowDeclaration));
    if (savedSigDate) setSignatureDate(savedSigDate);
    if (savedMobile) setApplicantMobile(savedMobile);
  }, []);

  useEffect(() => {
    localStorage.setItem("vanshavali_tree_data", JSON.stringify(formData.treeData));
    localStorage.setItem("vanshavali_layout_mode", layoutMode);
    localStorage.setItem("vanshavali_paper_size", paperSize);
    localStorage.setItem("vanshavali_font_size", fontSize);
    localStorage.setItem("vanshavali_address", JSON.stringify(address));
    localStorage.setItem("vanshavali_officer", authOfficer);
    localStorage.setItem("vanshavali_custom_officer", customOfficer);
    localStorage.setItem("vanshavali_show_details", JSON.stringify(showTopDetails));
    localStorage.setItem("vanshavali_show_declaration", JSON.stringify(showDeclaration));
    localStorage.setItem("vanshavali_sig_date", signatureDate);
    localStorage.setItem("vanshavali_mobile", applicantMobile);
  }, [formData.treeData, layoutMode, paperSize, fontSize, address, authOfficer, showTopDetails, showDeclaration, signatureDate, applicantMobile]);

  // ----------------------------------------
  // FULL RESET LOGIC
  // ----------------------------------------
  const handleReset = () => {
    if (window.confirm("क्या आप वाकई सारा डेटा मिटाना चाहते हैं? यह वापस नहीं लाया जा सकेगा।")) {
      localStorage.removeItem("vanshavali_tree_data");
      localStorage.removeItem("vanshavali_address");
      localStorage.removeItem("vanshavali_officer");
      localStorage.removeItem("vanshavali_custom_officer");
      localStorage.removeItem("vanshavali_sig_date");
      localStorage.removeItem("vanshavali_mobile");

      setFormData({ treeData: { id: `root_${Date.now()}`, name: "", children: [] } });
      setAddress({ pata: "", village: "", post: "", thana: "", thanaNo: "", panchayat: "", block: "", district: "", state: "" });
      setSelectedAddressFields(DEFAULT_ADDRESS_FIELDS);
      setAuthOfficer("");
      setCustomOfficer("");
      setApplicantMobile("");
      setSignatureDate(new Date().toISOString().split("T")[0]); 
      
      setPaperSize("a4");
      setLayoutMode("landscape");
      setFontSize("14px");

      setSuggestions([]);
      setAddressSuggestions([]);
      setTreeScale(1);
      setIsOverflowing(false);
      hasAlertedOverflow.current = false;
    }
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
          Array.from(mutation.removedNodes).some((node) => node.id === "watermark-layer");
        const isStyleChange =
          mutation.type === "attributes" && mutation.target.id === "watermark-layer";
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

  // ----------------------------------------
  // AUTO-SHRINK & WARNING LOGIC
  // ----------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      if (printRef.current && treeContainerRef.current) {
        const availableWidth = printRef.current.clientWidth - 40; 
        const headerSpace = showTopDetails ? 120 : 80;
        const footerSpace = showDeclaration ? 220 : 50;
        const availableHeight = printRef.current.clientHeight - (headerSpace + footerSpace); 

        const treeUL = treeContainerRef.current.querySelector("ul");
        if (!treeUL) return;

        const treeWidth = treeUL.scrollWidth;
        const treeHeight = treeUL.scrollHeight;

        let newScale = 1;
        
        if (treeWidth > availableWidth || treeHeight > availableHeight) {
          setIsOverflowing(true);
          
          if (!hasAlertedOverflow.current) {
            alert("चेतावनी: आपका वंशवृक्ष पेज से बड़ा हो रहा है! इसे पेज में फिट करने के लिए छोटा (Scale down) किया जा रहा है। बेहतर रिज़ल्ट के लिए A3 पेपर चुनें।");
            hasAlertedOverflow.current = true;
          }

          const scaleX = availableWidth / treeWidth;
          const scaleY = availableHeight / treeHeight;
          newScale = Math.min(scaleX, scaleY);
        } else {
          setIsOverflowing(false);
          hasAlertedOverflow.current = false; 
        }

        setTreeScale(Math.max(newScale, 0.35));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.treeData, paperSize, layoutMode, fontSize, showTopDetails, showDeclaration]);

  // ----------------------------------------
  // ADDRESS HINDI SUGGESTIONS
  // ----------------------------------------
  const fetchAddressSuggestions = async (word) => {
    if (!word || word.length < 2) { setAddressSuggestions([]); return; }
    const cacheKey = 'addr_' + word;
    if (cacheRef.current[cacheKey]) { setAddressSuggestions(cacheRef.current[cacheKey]); setActiveAddressIndex(0); return; }
    try {
      const res = await fetch(`https://inputtools.google.com/request?text=${word}&itc=hi-t-i0-und&num=5`);
      const data = await res.json();
      if (data[0] === "SUCCESS") {
        const result = data[1][0][1];
        cacheRef.current[cacheKey] = result;
        setAddressSuggestions(result);
        setActiveAddressIndex(0);
      }
    } catch { setAddressSuggestions([]); }
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    
    if (lastWord.trim() && /[a-zA-Z]/.test(lastWord)) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchAddressSuggestions(lastWord), 200);
    } else {
      setAddressSuggestions([]);
    }
  };

  const selectAddressSuggestion = (field, selectedWord) => {
    const words = address[field].split(" ");
    words[words.length - 1] = selectedWord;
    setAddress(prev => ({ ...prev, [field]: words.join(" ") + " " }));
    setAddressSuggestions([]);
    setActiveAddressIndex(0);
  };

  const handleAddressKeyDown = (e, field) => {
    if (addressSuggestions.length > 0 && currentAddressField === field) {
      if (e.key === "ArrowDown") { 
        e.preventDefault(); 
        setActiveAddressIndex((prev) => (prev < addressSuggestions.length - 1 ? prev + 1 : prev)); 
      } 
      else if (e.key === "ArrowUp") { 
        e.preventDefault(); 
        setActiveAddressIndex((prev) => (prev > 0 ? prev - 1 : 0)); 
      } 
      else if (e.key === " " || e.key === "Enter") { 
        e.preventDefault(); 
        selectAddressSuggestion(field, addressSuggestions[activeAddressIndex]); 
      }
    }
  };

  const renderAddressInput = (label, field, placeholder) => (
    <div className="relative">
      <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        value={address[field]}
        placeholder={placeholder}
        onFocus={() => setCurrentAddressField(field)}
        onBlur={() => setTimeout(() => { if (currentAddressField === field) setAddressSuggestions([]); }, 200)}
        onChange={(e) => handleAddressChange(field, e.target.value)}
        onKeyDown={(e) => handleAddressKeyDown(e, field)}
      />
      {currentAddressField === field && addressSuggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0 text-left flex flex-col">
          {addressSuggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={(e) => { e.preventDefault(); selectAddressSuggestion(field, s); }}
              className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${i === activeAddressIndex ? "bg-blue-100 text-blue-800 font-bold" : "hover:bg-gray-100 text-gray-700"}`}
            >
              <span>{s}</span>
              {i === activeAddressIndex && <span className="text-[10px] opacity-60 uppercase">Space</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

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
      alert("पेमेंट के लिए कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।");
      return false;
    }
    if (isAnyNodeEmpty(formData.treeData)) {
      alert("कृपया वंशवृक्ष के सभी सदस्यों के नाम भरें या जो बॉक्स खाली हैं उन्हें हटा दें (✕ दबाकर)।");
      return false;
    }
    // Dynamic Address Validation
    if (showTopDetails && selectedAddressFields.length > 0) {
      const isAnyFieldMissing = selectedAddressFields.some(key => !address[key] || !address[key].trim());
      if (isAnyFieldMissing) {
        alert("कृपया पता (Address) के आपके द्वारा चुने गए सभी फील्ड भरें। यदि कोई जानकारी नहीं है, तो उसे खाली छोड़ने के बजाय '-' लिख दें।");
        return false;
      }
    }
    if (showDeclaration) {
  if (!authOfficer) {
    alert("कृपया प्राधिकृत पदाधिकारी (हस्ताक्षर हेतु) का चयन करें।");
    return false;
  }
  if (authOfficer === "अन्य" && !customOfficer.trim()) {
    alert("कृपया पदाधिकारी का पद (Custom Officer Post) टाइप करें।");
    return false;
  }
}
    return true;
  };

  // ----------------------------------------
  // PRINT & DOWNLOAD (LOCKED UNTIL PAYMENT)
  // ----------------------------------------
  const executePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "वंशावली",
    onAfterPrint: () => {
      setShowWatermark(true); // रिसेट वाटरमार्क
      setIsProcessing(false);
    }
  });

  const executeDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const element = printRef.current;
      
      const canvasWidth = element.scrollWidth;
      const canvasHeight = element.scrollHeight;

      const dataUrl = await toPng(element, { quality: 1.0, pixelRatio: 2, backgroundColor: "#ffffff", width: canvasWidth, height: canvasHeight });
      const pdf = new jsPDF({ orientation: layoutMode, unit: "mm", format: paperSize });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);
      pdf.save("Vanshavali_Sahayak.pdf");
      
    } catch (error) {
      alert("PDF जनरेट करने में समस्या।");
    } finally {
      setIsGeneratingPDF(false);
      setIsProcessing(false);
      setShowWatermark(true);
    }
  };

  // ----------------------------------------
  // RAZORPAY PAYMENT PROCESS
  // ----------------------------------------
  const processAction = async (actionType) => {
    if (!validateForm()) return;

    if (!window.Razorpay) {
      alert("भुगतान प्रणाली लोड हो रही है... कृपया प्रतीक्षा करें।");
      return;
    }

    const confirmReview = window.confirm(
      "Payment करने से पहले कृपया वंशावली (PREVIEW) को ध्यान से देख लें।\n\nक्या आपने सभी जानकारी सही से भर दी है?"
    );
    if (!confirmReview) return;

    const confirmResponsibility = window.confirm(
      "मैंने वंशावली को ध्यान से देख लिया है।\n\nयदि कोई जानकारी गलत है तो उसकी पूरी जिम्मेदारी मेरी होगी।\n\nक्या आप भुगतान और डाउनलोड जारी रखना चाहते हैं?"
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
          name: "Customer",
          contact: applicantMobile,
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
              body: JSON.stringify({ type: "vanshavaliManual", mobile: applicantMobile }),
            });
          } catch (e) {
            console.log(e);
          }

          // प्रिंट/डाउनलोड प्रोसेस शुरू करें
          setTimeout(async () => {
            if (actionType === "print") {
              executePrint();
            }
            if (actionType === "download") {
              await executeDownloadPDF();
            }
          }, 800);
        },
        modal: {
          ondismiss: function () {
            // अगर यूज़र पेमेंट विंडो बिना पे किये काट देता है
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
  // TREE LOGIC
  // ----------------------------------------
  const fetchSuggestions = async (word) => {
    if (!word || word.length < 2) { setSuggestions([]); return; }
    if (cacheRef.current[word]) { setSuggestions(cacheRef.current[word]); setActiveIndex(0); return; }
    try {
      const res = await fetch(`https://inputtools.google.com/request?text=${word}&itc=hi-t-i0-und&num=5`);
      const data = await res.json();
      if (data[0] === "SUCCESS") {
        const result = data[1][0][1];
        cacheRef.current[word] = result;
        setSuggestions(result);
        setActiveIndex(0);
      }
    } catch { setSuggestions([]); }
  };

  const updateTreeNode = (node, id, newName) => {
    if (node.id === id) return { ...node, name: newName };
    if (node.children) return { ...node, children: node.children.map((c) => updateTreeNode(c, id, newName)) };
    return node;
  };

  const addChildNode = (node, parentId, currentDepth = 1) => {
    if (node.id === parentId) {
      if (currentDepth >= MAX_TREE_DEPTH) {
        alert(`अधिकतम ${MAX_TREE_DEPTH} पीढ़ियाँ ही जोड़ सकते हैं।`);
        return node;
      }
      return { ...node, children: [...node.children, { id: `node_${Date.now()}`, name: "", children: [] }] };
    }
    if (node.children) return { ...node, children: node.children.map((c) => addChildNode(c, parentId, currentDepth + 1)) };
    return node;
  };

  const removeNode = (node, idToRemove) => {
    if (node.children) {
      const filtered = node.children.filter((c) => c.id !== idToRemove);
      return { ...node, children: filtered.map((c) => removeNode(c, idToRemove)) };
    }
    return node;
  };

  const handleTreeInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, treeData: updateTreeNode(prev.treeData, id, value) }));
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
    setFormData((prev) => ({ ...prev, treeData: updateTreeNode(prev.treeData, id, finalVal) }));
    setSuggestions([]);
    setActiveIndex(0);
  };

  const handleTreeKeyDown = (e, id, currentName) => {
    if (suggestions.length > 0 && currentField === `tree_${id}`) {
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev)); } 
      else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0)); } 
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); selectTreeSuggestion(id, suggestions[activeIndex], currentName); }
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
              className={`border p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-bold text-center shadow-inner ${depth === 1 ? "w-44 bg-blue-50 border-blue-300" : "w-36 bg-white border-gray-300"}`}
              value={node.name}
              onFocus={() => setCurrentField(`tree_${node.id}`)}
              onBlur={() => setTimeout(() => { if (currentField === `tree_${node.id}`) setSuggestions([]); }, 200)}
              onChange={(e) => handleTreeInputChange(node.id, e.target.value)}
              onKeyDown={(e) => handleTreeKeyDown(e, node.id, node.name)}
            />
            {currentField === `tree_${node.id}` && suggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0 text-left flex flex-col">
                {suggestions.map((s, i) => (
                  <div key={i} onMouseDown={(e) => { e.preventDefault(); selectTreeSuggestion(node.id, s, node.name); }} className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${i === activeIndex ? "bg-blue-100 text-blue-800 font-bold" : "hover:bg-gray-100 text-gray-700"}`}>
                    <span>{s}</span>
                    {i === activeIndex && <span className="text-[10px] opacity-60 uppercase">Space</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setFormData((prev) => ({ ...prev, treeData: addChildNode(prev.treeData, node.id, depth) }))} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold hover:bg-blue-200 transition-colors" title="संतान जोड़ें">+ वंशज</button>
            {depth > 1 && (<button onClick={() => setFormData((prev) => ({ ...prev, treeData: removeNode(prev.treeData, node.id) }))} className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold hover:bg-red-200 transition-colors" title="हटाएं">✕</button>)}
          </div>
        </div>
        {node.children && node.children.length > 0 && (<ul>{node.children.map((child) => renderTreeInput(child, depth + 1))}</ul>)}
      </li>
    );
  };

  const renderTreePreview = (node) => {
    return (
      <li key={node.id}>
        <div className="node-box">{node.name || "________________"}</div>
        {node.children && node.children.length > 0 && (<ul>{node.children.map((child) => renderTreePreview(child))}</ul>)}
      </li>
    );
  };

  const getPaperDimensions = () => {
    if (paperSize === "a3") return layoutMode === "landscape" ? { width: 420, height: 297 } : { width: 297, height: 420 };
    return layoutMode === "landscape" ? { width: 297, height: 210 } : { width: 210, height: 297 };
  };
  const dim = getPaperDimensions();

  // Dynamic Checkbox Handler
  const handleFieldToggle = (key) => {
    if (selectedAddressFields.includes(key)) {
      setSelectedAddressFields(selectedAddressFields.filter((k) => k !== key));
    } else {
      setSelectedAddressFields([...selectedAddressFields, key]);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 flex flex-col gap-8 font-sans min-h-screen">
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: ${paperSize === "a3" ? "A3" : "A4"} ${layoutMode}; margin: 0; }
          body { background: white; margin: 0; padding: 0; }
          #print-container { box-shadow: none !important; width: ${dim.width}mm !important; height: ${dim.height}mm !important; margin: 0 !important; }
        }
        .css-tree .node-box { font-size: ${fontSize} !important; }
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
        .css-tree .node-box { border: 1.5px solid #333; padding: 6px 12px; font-weight: bold; display: inline-block; border-radius: 6px; background-color: #fff; position: relative; z-index: 1; white-space: nowrap; }

        @media print {
          #watermark-layer { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; }
        }
      `}</style>

      {/* Top Section: Form Input */}
      <div id="form-container" className="w-full bg-white p-5 md:p-8 shadow-md rounded-xl border-t-[6px] border-blue-600 print:hidden">
        
        {/* OVERFLOW WARNING MESSAGE */}
        {isOverflowing && (
          <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold text-sm md:text-base">चेतावनी: आपका वंशवृक्ष पेज के आकार से बाहर जा रहा है!</p>
              <p className="text-xs md:text-sm mt-1">इसे पेज में फिट करने के लिए ऑटोमैटिक छोटा किया जा रहा है। बेहतर रिज़ल्ट के लिए कृपया नीचे 'पेज सेटिंग्स' से <strong>A3 साइज़</strong> या <strong>Landscape (चौड़ा)</strong> चुनें।</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mb-6 border-b border-green-300 pb-3">
          <h3 className="font-bold text-green-900 text-xl">वंशावली (Family Tree) डेटा भरें</h3>
        </div>

        <div className="w-full h-150 overflow-x-auto pb-6 custom-scrollbar bg-gray-50 rounded-lg p-4 border border-gray-100">
          <div className="css-tree min-w-max">
            <ul>{renderTreeInput(formData.treeData)}</ul>
          </div>
        </div>

        {/* Form Settings */}
        <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center bg-blue-50 p-4 rounded-lg mt-6 border border-blue-100 justify-between">
          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-blue-600" />
              <span className="font-bold text-gray-700">पेज सेटिंग्स:</span>
            </div>
            <select value={paperSize} onChange={e => setPaperSize(e.target.value)} className="p-2 border border-gray-300 rounded-md font-medium text-sm outline-none bg-white">
              <option value="a4">A4 साइज़ (छोटा)</option>
              <option value="a3">A3 साइज़ (बड़ा)</option>
            </select>
            <select value={layoutMode} onChange={e => setLayoutMode(e.target.value)} className="p-2 border border-gray-300 rounded-md font-medium text-sm outline-none bg-white">
              <option value="portrait">Portrait (सीधा)</option>
              <option value="landscape">Landscape (चौड़ा)</option>
            </select>
            <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="p-2 border border-gray-300 rounded-md font-medium text-sm outline-none bg-white">
              <option value="12px">Font: 12px (छोटा)</option>
              <option value="14px">Font: 14px (सामान्य)</option>
              <option value="16px">Font: 16px (बड़ा)</option>
              <option value="18px">Font: 18px (बहुत बड़ा)</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4 items-center w-full md:w-auto border-t md:border-t-0 md:border-l border-blue-200 pt-3 md:pt-0 md:pl-4">
            <label className="flex items-center gap-2 font-bold text-gray-800 cursor-pointer bg-white p-2 rounded border border-gray-300 shadow-sm">
              <input type="checkbox" checked={showTopDetails} onChange={e => setShowTopDetails(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              <MapPin size={16} className="text-red-500"/> पता दिखाएं
            </label>

            <label className="flex items-center gap-2 font-bold text-gray-800 cursor-pointer bg-white p-2 rounded border border-gray-300 shadow-sm">
              <input type="checkbox" checked={showDeclaration} onChange={e => setShowDeclaration(e.target.checked)} className="w-4 h-4 accent-blue-600" />
              <FileText size={16} className="text-green-600"/> घोषणा पत्र दिखाएं
            </label>
          </div>
        </div>

        {/* Dynamic Address Input Fields */}
        {showTopDetails && (
          <div className="mt-4 bg-gray-100 p-5 border border-gray-200 rounded-lg">
            
            {/* Field Selector */}
            <div className="mb-5 pb-4 border-b border-gray-300">
              <span className="block text-sm font-bold text-gray-700 mb-2">आपको पते (Address) में कौन-कौन सी जानकारी चाहिए? उसे चुनें:</span>
              <div className="flex flex-wrap gap-3">
                {ADDRESS_FIELD_CONFIG.map((field) => (
                  <label key={field.key} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border cursor-pointer select-none transition-colors ${selectedAddressFields.includes(field.key) ? "bg-blue-100 border-blue-500 text-blue-800 font-bold" : "bg-white border-gray-300 text-gray-600"}`}>
                    <input type="checkbox" className="hidden" checked={selectedAddressFields.includes(field.key)} onChange={() => handleFieldToggle(field.key)} />
                    {field.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Render Only Selected Fields */}
            {selectedAddressFields.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ADDRESS_FIELD_CONFIG.filter((f) => selectedAddressFields.includes(f.key)).map((field) => {
                  if (field.noSuggest) {
                    return (
                      <div key={field.key}>
                        <label className="block text-sm font-bold text-gray-700 mb-1">{field.label}</label>
                        <input type="text" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" value={address[field.key]} onChange={e => setAddress({...address, [field.key]: e.target.value})} placeholder="नंबर टाइप करें" />
                      </div>
                    );
                  }
                  return <div key={field.key}>{renderAddressInput(field.label, field.key, "Space दबाएं")}</div>;
                })}
              </div>
            ) : (
              <div className="text-center text-red-500 text-sm font-bold">कृपया ऊपर से कोई जानकारी चुनें, अन्यथा 'पता दिखाएं' को बंद कर दें।</div>
            )}
          </div>
        )}

        {/* Declaration Input Fields */}
        {showDeclaration && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-blue-50 p-5 border border-blue-200 rounded-lg">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">प्राधिकृत पदाधिकारी (हस्ताक्षर हेतु)</label>
               <select value={authOfficer} onChange={e => setAuthOfficer(e.target.value)} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                 <option value="">-- चुनें --</option>
                 <option value="वार्ड सदस्य">वार्ड सदस्य</option>
                 <option value="मुखिया">मुखिया</option>
                 <option value="सरपंच">सरपंच</option>
                 <option value="पंचायत समिति">पंचायत समिति</option>
                 <option value="राजस्व कर्मचारी">राजस्व कर्मचारी</option>
                 <option value="अंचलाधिकारी (C.O.)">अंचलाधिकारी (C.O.)</option>
                 <option value="प्रखंड विकास पदाधिकारी (B.D.O.)">प्रखंड विकास पदाधिकारी (B.D.O.)</option>
                 <option value="अन्य">अन्य (Other)</option>
               </select>
                     
               {/* 'अन्य' सेलेक्ट करने पर यह इनपुट दिखेगा */}
               {authOfficer === "अन्य" && (
                 <input 
                   type="text" 
                   className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none mt-2" 
                   value={customOfficer} 
                   onChange={e => setCustomOfficer(e.target.value)} 
                   placeholder="पदाधिकारी का पद यहाँ टाइप करें" 
                 />
               )}
             </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">दिनांक (Date)</label>
              <input type="date" className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={signatureDate} onChange={e => setSignatureDate(e.target.value)} />
            </div>
          </div>
        )}

        {/* Action Buttons & Payment Number */}
        <div className="mt-8 flex flex-col lg:flex-row gap-6 justify-between items-center w-full bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full lg:w-auto">
            <button onClick={handleReset} disabled={isProcessing || isGeneratingPDF} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-400 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-60">
              <RotateCcw size={18} /><span>RESET</span>
            </button>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                maxLength={10} 
                className="w-full pl-10 border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" 
                value={applicantMobile} 
                onChange={e => setApplicantMobile(e.target.value.replace(/\D/g, ''))} 
                placeholder="मोबाइल नंबर दर्ज करें" 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/*<button onClick={() => processAction("print")} disabled={isProcessing || isGeneratingPDF} className="w-full sm:w-auto relative flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-70">
              <Printer size={18} /><span>{isProcessing ? "प्रोसेसिंग..." : "पेमेंट & प्रिंट करें"}</span>
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

      {/* Bottom Section: Document Preview */}
      <div className="w-full bg-gray-200 shadow-inner rounded-xl p-4 font-hindi print:bg-transparent print:shadow-none print:p-0 overflow-auto custom-scrollbar">
        <div className="flex justify-center min-w-max">
          <div 
            id="print-container" 
            ref={printRef} 
            className="bg-white relative shadow-lg print:shadow-none overflow-hidden box-border shrink-0 transition-all duration-500 ease-in-out" 
            style={{ 
              width: `${dim.width}mm`, 
              height: `${dim.height}mm`,
              minWidth: `${dim.width}mm`,
              minHeight: `${dim.height}mm`
            }}
          >
            {showWatermark && !isGeneratingPDF && (
              <div id="watermark-layer" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg width='450' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='38' font-weight='900' font-family='Arial, sans-serif' fill='rgba(54, 40, 40, 0.08)' text-anchor='middle' transform='rotate(-40, 225, 225)'%3EBIHAR SURVEY SAHAYAK%3C/text%3E%3C/svg%3E")`, backgroundRepeat: "repeat" }}></div>
            )}

            <div className="relative z-10 w-full h-max min-h-full flex flex-col justify-between box-border" style={{ padding: "15mm" }}>
              {/**style={{ fontSize: fontSize }} */}
              <div className="w-full flex flex-col items-center text-sm">
                {showTopDetails && (
                  <div className="w-full font-bold leading-relaxed mb-6 text-left" >
                    ग्राम – {address.village || "......................................"}, 
                    पोस्ट - {address.post || "..................................."}, 
                    थाना - {address.thana || "..........................."}, 
                    थाना नं० - {address.thanaNo || ".........."}, 
                    पंचायत - {address.panchayat || ".............................."}, 
                    प्रखंड - {address.block || "........................"}, 
                    जिला – {address.district || "........................"} का/की स्थायी निवासी हूँ|
                  </div>
                )}
                
                <h2 className="text-center font-bold underline mb-8 mt-2 text-2xl" > {/**style={{ fontSize: `calc(${fontSize} + 8px)` }} */}
                  वंशावली (वंशवृक्ष)
                </h2>
                
                {/* AUTO SCALED TREE WRAPPER */}
                <div 
                  className="w-full flex justify-center overflow-visible"
                  style={{ 
                    transform: `scale(${treeScale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <div ref={treeContainerRef} className="css-tree" style={{ width: 'max-content' }}>
                    <ul>{renderTreePreview(formData.treeData)}</ul>
                  </div>
                </div>
              </div>

              {/* DECLARATION SECTION (Now Optional) style={{ fontSize: fontSize }}*/}
              {showDeclaration && (
                <div className="w-full mt-10 pt-4 flex-shrink-0">
                  <p className="text-[14px] font-bold text-justify leading-relaxed mb-12 text-sm" >
                    मैं घोषणा करता हूँ कि आवेदन पत्र में अंकित सभी विवरण सत्य है तथा मेरे द्वारा कोई भी जानकारी छिपाया नहीं गया है| यदि भविष्य में कोई भी तथ्य असत्य/गलत पाया जाता है तो सुसंगत धाराओं के तहत कानूनी कार्रवाई के लिये मैं स्वयं उत्तरदायी होऊँगा/होऊँगी |
                  </p>
                  
                  <div className="flex justify-between items-end font-bold w-full px-4 text-sm" > {/**style={{ fontSize: `calc(${fontSize} + 2px)` }} */}
                    
                    
                    
                    {/* Petitioner Side */}
                    <div className="text-center">
                      
                      याचिकाकर्ता का हस्ताक्षर<br />या अंगूठे का निशान
                      
                        <div className="mt-6 text-left text-sm" > {/**style={{ fontSize: fontSize }} */}
                          मो० नं० - {applicantMobile}
                          <div className="text-sm mt-1">दिनांक: {new Date(signatureDate).toLocaleDateString('en-IN')}</div>
                        </div>
                      
                    </div>

                    {/* Officer/Sarpanch Side */}
                    <div className="text-center w-52">
                      {authOfficer ? (
                        <>
                          <div className="mb-8">हस्ताक्षर एवं मुहर</div>
                          <div className="border-t border-black pt-1 px-2">
                            {authOfficer === "अन्य" ? customOfficer : authOfficer}
                          </div>
                          <div className="text-sm mt-4">दिनांक: ______________________</div>
                        </>
                      ) : (
                        <div className="h-[72px]"></div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}