"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Printer, Download, RotateCcw, Plus, X, Upload, User, Camera, Trash2, SwitchCamera } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const INITIAL_TREE_DATA = {
  id: "root_1",
  name: "",
  photo: null, 
  children: [],
};

// LocalStorage में फोटो सेव न करने का फंक्शन
const stripPhotosFromTree = (node) => {
  const { photo, ...rest } = node;
  if (rest.children && rest.children.length > 0) {
    rest.children = rest.children.map(stripPhotosFromTree);
  }
  return rest;
};

function VanshavaliContent() {
  //const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    applicants: [{ name: "", relName: "" }],
    treeData: INITIAL_TREE_DATA,
    date: new Date().toISOString().split("T")[0],
  });

  const searchParams = useSearchParams();
  const promoToken = searchParams.get("token");
  
  // Agar URL me '?token=BIHARFREE' hoga, to ye true ho jayega
  const isFreeAccess = promoToken === "BSSPVF750";
  const [isActionCompleted, setIsActionCompleted] = useState(false);

  const [applicantMobile, setApplicantMobile] = useState("");
  const [layoutMode, setLayoutMode] = useState("landscape");

  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Webcam State & Refs
  const [webcamState, setWebcamState] = useState({ isOpen: false, nodeId: null });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment"); // डिफ़ॉल्ट बैक कैमरा

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
    const treeWithoutPhotos = stripPhotosFromTree(formData.treeData);
    localStorage.setItem("vanshavali_tree_data", JSON.stringify(treeWithoutPhotos));
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
        treeData: { id: `root_${Date.now()}`, name: "", photo: null, children: [] },
      }));
      setApplicantMobile("");
      setSuggestions([]);
      //setIsActionCompleted(false);
    }
  };

  // ----------------------------------------
  // VALIDATION & WATERMARK LOGIC
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
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
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
      setIsProcessing(false);
      setIsActionCompleted(true);
    },
  });

  const executeDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
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
      setIsProcessing(false);
      setShowWatermark(true);
      setIsActionCompleted(true);
    }
  };

  const processAction = async (actionType) => {
    if (!validateForm()) return;
    // ----- FREE LINK BYPASS CODE -----
    if (isFreeAccess) {
      setIsProcessing(true);
      setShowWatermark(false); // Free link wale user ke liye watermark hatayein
      
      alert("🎁 Free Access System: Aapke liye ye download bilkul muft hai!");
      
      setTimeout(async () => {
        if (actionType === "print") executePrint();
        if (actionType === "download") await executeDownloadPDF();
      }, 800);
      return; // Razorpay gateway ko open nahi hone dega
    }
    if (!window.Razorpay) {
      alert("भुगतान प्रणाली लोड हो रही है... कृपया प्रतीक्षा करें।");
      return;
    }
    const confirmReview = window.confirm(
      "Payment करने से पहले कृपया वंशावली (PREVIEW) को ध्यान से देख लें।\n\nक्या आपने सभी जानकारी सही से भर दी है?"
    );
    if (!confirmReview) return;

    const confirmResponsibility = window.confirm(
      "मैंने वंशावली को ध्यान से देख लिया है।\n\nयदि कोई जानकारी गलत है तो उसकी पूरी जिम्मेदारी मेरी होगी।\n\nक्या आप डाउनलोड जारी रखना चाहते हैं?"
    );
    if (!confirmResponsibility) return;

    setIsProcessing(true);

    try {
      const orderRes = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "vanshavali-photo" }),
      });
      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Photo Vanshavali",
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
          setShowWatermark(false);

          try {
            await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            await fetch("/api/track-vanshawali", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "vanshavali-photo" }),
            });
          } catch (e) {
            console.log(e);
          }

          setTimeout(async () => {
            if (actionType === "print") executePrint();
            if (actionType === "download") await executeDownloadPDF();
          }, 800);
        },
        modal: { ondismiss: function () { setIsProcessing(false); } },
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
  // WEBCAM LIVE CAPTURE LOGIC
  // ----------------------------------------
  const openWebcam = async (nodeId) => {
    setWebcamState({ isOpen: true, nodeId });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facingMode } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("कैमरा चालू नहीं हो सका। कृपया परमिशन चेक करें या सुनिश्चित करें कि कैमरा कनेक्टेड है।");
      setWebcamState({ isOpen: false, nodeId: null });
    }
  };

  const toggleCamera = async () => {
  // कैमरा बंद करें
  if (videoRef.current && videoRef.current.srcObject) {
    videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
  }

  // मोड बदलें (बैक से फ्रंट या फ्रंट से बैक)
  const newMode = facingMode === "environment" ? "user" : "environment";
  setFacingMode(newMode);

  // नया कैमरा खोलें
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: newMode } 
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (err) {
    alert("कैमरा स्विच नहीं हो सका।");
  }
};

  const closeWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setWebcamState({ isOpen: false, nodeId: null });
  };

  const capturePhotoFromWebcam = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Image Quality 0.8 to keep size optimized
      const base64Data = canvas.toDataURL("image/jpeg", 0.8);
      
      setFormData((prev) => ({
        ...prev,
        treeData: updateTreePhoto(prev.treeData, webcamState.nodeId, base64Data),
      }));
      
      closeWebcam();
    }
  };

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ----------------------------------------
  // TREE UPDATES & AUTO-SUGGESTION
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
      const res = await fetch(`https://inputtools.google.com/request?text=${word}&itc=hi-t-i0-und&num=5`);
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
    if (node.children) return { ...node, children: node.children.map((c) => updateTreeNode(c, id, newName)) };
    return node;
  };

  const updateTreePhoto = (node, id, photoData) => {
    if (node.id === id) return { ...node, photo: photoData };
    if (node.children) return { ...node, children: node.children.map((c) => updateTreePhoto(c, id, photoData)) };
    return node;
  };

  const handlePhotoUpload = (id, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        treeData: updateTreePhoto(prev.treeData, id, reader.result),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (id) => {
    setFormData((prev) => ({
      ...prev,
      treeData: updateTreePhoto(prev.treeData, id, null),
    }));
  };

  const addChildNode = (node, parentId, currentDepth = 1) => {
    if (node.id === parentId) {
      if (currentDepth >= MAX_TREE_DEPTH) {
        alert(`आप अधिकतम ${MAX_TREE_DEPTH} पीढ़ियाँ ही जोड़ सकते हैं।`);
        return node;
      }
      return {
        ...node,
        children: [...node.children, { id: `node_${Date.now()}`, name: "", photo: null, children: [] }],
      };
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
    setFormData((prev) => ({ ...prev, treeData: updateTreeNode(prev.treeData, id, finalVal) }));
    setSuggestions([]);
    setActiveIndex(0);
  };

  const handleTreeKeyDown = (e, id, currentName) => {
    if (suggestions.length > 0 && currentField === `tree_${id}`) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
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
        <div className="inline-flex flex-col items-center bg-white border border-gray-200 rounded-lg p-3 shadow-sm relative z-10 mx-1">
          
          {/* Passport Size Photo Box (User-Friendly UI) */}
          <div className="flex flex-col items-center w-full mb-3">
            <div className="w-[60px] h-[75px] bg-gray-50 border-2 border-dashed border-gray-300 rounded overflow-hidden flex flex-col items-center justify-center mb-2 relative">
              {node.photo ? (
                <img 
                  src={node.photo} 
                  className="w-full h-full object-cover object-center" 
                  alt="uploaded" 
                />
              ) : (
                <>
                  <User className="text-gray-300 mb-1" size={24} strokeWidth={1.5} />
                  <span className="text-[9px] text-gray-400 font-medium text-center leading-tight">
                    पासपोर्ट<br/>फोटो
                  </span>
                </>
              )}
            </div>
            
            {/* Action Buttons: Gallery, Live Camera, Delete */}
            <div className="flex gap-1.5">
              <label 
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 p-1.5 rounded cursor-pointer transition-colors flex items-center justify-center" 
                title="गैलरी से फाइल चुनें"
              >
                <Upload size={14} strokeWidth={2.5} />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handlePhotoUpload(node.id, e.target.files[0]);
                  }} 
                />
              </label>

              <button 
                onClick={() => openWebcam(node.id)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 p-1.5 rounded transition-colors flex items-center justify-center" 
                title="लाइव कैमरा से फोटो खींचें"
              >
                <Camera size={14} strokeWidth={2.5} />
              </button>

              {node.photo && (
                <button 
                  onClick={() => handleRemovePhoto(node.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-1.5 rounded transition-colors flex items-center justify-center" 
                  title="फोटो हटाएं"
                >
                  <Trash2 size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>

          {/* Name Input */}
          <div className="relative">
            <input
              type="text"
              placeholder={depth === 1 ? "मुख्य पूर्वज" : "वंशज का नाम"}
              className={`border p-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-base font-bold text-center shadow-inner ${
                depth === 1 ? "w-44 bg-blue-50 border-blue-300" : "w-36 bg-white border-gray-300"
              }`}
              value={node.name}
              onFocus={() => setCurrentField(`tree_${node.id}`)}
              onBlur={() => setTimeout(() => { if (currentField === `tree_${node.id}`) setSuggestions([]); }, 200)}
              onChange={(e) => handleTreeInputChange(node.id, e.target.value)}
              onKeyDown={(e) => handleTreeKeyDown(e, node.id, node.name)}
            />
            
            {currentField === `tree_${node.id}` && suggestions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0 text-left flex flex-col">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onMouseDown={(e) => { e.preventDefault(); selectTreeSuggestion(node.id, s, node.name); }}
                    className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${
                      i === activeIndex ? "bg-blue-100 text-blue-800 font-bold" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{s}</span>
                    {i === activeIndex && <span className="text-[10px] opacity-60 uppercase">Space</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add / Remove Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setFormData((prev) => ({ ...prev, treeData: addChildNode(prev.treeData, node.id, depth) }))}
              className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold hover:bg-blue-200 transition-colors"
              title="संतान जोड़ें"
            >
              <Plus size={14} className="mr-1" /> वंशज
            </button>

            {depth > 1 && (
              <button
                onClick={() => setFormData((prev) => ({ ...prev, treeData: removeNode(prev.treeData, node.id) }))}
                className="flex items-center justify-center bg-red-100 text-red-600 w-6 h-6 rounded text-xs font-bold hover:bg-red-200 transition-colors"
                title="हटाएं"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <ul>{node.children.map((child) => renderTreeInput(child, depth + 1))}</ul>
        )}
      </li>
    );
  };

  const renderTreePreview = (node) => {
    return (
      <li key={node.id}>
        <div className="node-box flex flex-col items-center gap-1.5">
          {/* Passport Size Preview Box */}
          {node.photo ? (
            <img 
              src={node.photo} 
              alt="Profile" 
              className="w-[45px] h-[60px] object-cover object-center rounded border border-gray-400 shadow-sm bg-white"
            />
          ) : (
            <div className="w-[45px] h-[60px] bg-gray-50 rounded border border-gray-300 flex flex-col items-center justify-center text-gray-300 shadow-sm">
               <User size={20} strokeWidth={1.5} />
            </div>
          )}
          <span className="font-bold text-[14px] leading-none">{node.name || "________________"}</span>
        </div>
        {node.children && node.children.length > 0 && (
          <ul>{node.children.map((child) => renderTreePreview(child))}</ul>
        )}
      </li>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto bg-gray-50 flex flex-col gap-8 font-sans min-h-screen relative">
      
      {/* ---------------- WEBCAM MODAL ---------------- */}
      {webcamState.isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg">लाइव फोटो खींचें</h3>
              <button onClick={closeWebcam} className="p-1 hover:bg-red-50 text-red-500 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="w-full aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden mb-5 relative shadow-inner">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover transform scale-x-[-1]" 
                // scale-x-[-1] creates a mirror effect so it feels natural like a phone selfie camera
              ></video>
              <div className="absolute inset-0 border-4 border-white/20 rounded-xl pointer-events-none"></div>
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
              {/* कैमरा स्विच बटन (सिर्फ मोबाइल पर दिखेगा) */}
              <button 
                onClick={toggleCamera} 
                className="md:hidden flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 h-14 rounded-full hover:bg-blue-100 active:scale-95 transition-all shadow-md"
                title="कैमरा बदलें"
              >
                <SwitchCamera size={22} strokeWidth={2.5} />
                <span className="text-[11px] font-bold text-left leading-tight">
                  Back/Front<br/>Camera
                </span>
              </button>

              {/* फोटो कैप्चर बटन */}
              <button 
                onClick={capturePhotoFromWebcam} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-14 rounded-full font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all flex-1 md:flex-none"
              >
                <Camera size={24} />
                <span className="text-[16px]">फोटो खींचें</span>
              </button>
            </div>
            
            {/* Hidden canvas to process the image */}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </div>
        </div>
      )}
      {/* ---------------- END WEBCAM MODAL ---------------- */}

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
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          border-radius: 8px;
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
        {/* Top Header Section (Eye-Catching & Mobile Friendly) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-6 border-b border-gray-200 pb-5">
          
          {/* Heading Box */}
          <div className="flex items-center gap-3">
            {/* 3D Icon Box */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2.5 rounded-xl shadow-[0_4px_10px_rgba(37,99,235,0.3)] flex-shrink-0">
              <Camera size={24} strokeWidth={2} />
            </div>
            
            {/* Text Area */}
            <div className="flex flex-col">
              <h3 className="font-extrabold text-gray-800 text-xl md:text-2xl leading-tight tracking-tight flex items-center gap-2">
                फोटो वाली वंशावली
                <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-md border border-amber-200 font-bold uppercase tracking-wider hidden sm:inline-block">
                  Premium
                </span>
              </h3>
              <p className="text-[12px] md:text-sm text-emerald-600 font-semibold mt-0.5">
                सर्वे और सरकारी कार्यों के लिए 
              </p>
            </div>
          </div>

          {/* Mobile Number Input Box */}
          <div className="w-full md:w-auto bg-gray-50 p-2 rounded-xl border border-gray-200">
            <label className="block text-[11px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">
              आवेदक का मोबाइल नंबर <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all w-full sm:w-64">
              <span className="bg-gray-100 px-3 py-2 text-gray-600 text-sm font-bold border-r border-gray-300 select-none">
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
                className="w-full px-3 py-2 text-sm font-semibold outline-none text-gray-800 placeholder-gray-400"
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
            className="flex items-center justify-center gap-2 bg-red-400 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-60"
          >
            <RotateCcw size={18} />
            <span>RESET</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4 ml-auto">
            
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-3 py-2">
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

            {/*<button
              onClick={() => processAction("print")}
              disabled={isProcessing || isActionCompleted}
              className={`relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all 
                ${isActionCompleted 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:shadow-lg disabled:opacity-70"
                }`}
            >
              {showWatermark && !isFreeAccess && !isActionCompleted && (
                <span className="absolute -top-3 -right-2 text-[11px] bg-black text-white px-2 py-[2px] rounded-full shadow-lg">₹30</span>
              )}
              <Printer size={18} />
              <span>
                {isProcessing ? "लोडिंग..." : isActionCompleted ? "प्रिंट हो गया ✔" : "प्रिंट करें"}
              </span>
            </button>*/}

            <button
              onClick={() => processAction("download")}
              disabled={isProcessing || isGeneratingPDF || isActionCompleted}
              className={`relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all 
                ${isActionCompleted 
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-yellow-400 to-amber-500 text-black hover:shadow-lg disabled:opacity-70"
                }`}
            >
              {showWatermark && !isFreeAccess && !isActionCompleted && (
                <span className="absolute -top-3 -right-2 text-[11px] bg-black text-white px-2 py-[2px] rounded-full shadow-lg">₹30</span>
              )}
              <Download size={18} />
              <span>
                {isProcessing || isGeneratingPDF ? "लोडिंग..." : isActionCompleted ? "डाउनलोड हो गया ✔" : "PDF डाउनलोड"}
              </span>
            </button>

            {/* --- ⚠️ सिर्फ टेस्टिंग के लिए (Live करने से पहले हटा दें) ⚠️ --- */}
             {/*<button onClick={() => { setShowWatermark(false); if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; } setTimeout(() => { executePrint(); }, 1000); }} className="col-span-2 mt-2 bg-gray-200 text-gray-800 py-2 rounded-xl text-xs font-bold"> 🛠️ Developer Bypass Payment (Test) </button> */}
          </div>
        </div>
      </div>

      {/* Bottom Section: Document Preview */}
      <div className="w-full bg-gray-100 shadow-inner rounded-xl p-4 font-hindi print:bg-transparent print:shadow-none print:p-0 overflow-hidden">
        <div className="w-full md:overflow-x-hidden overflow-x-auto pb-6 custom-scrollbar">
          
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
                  position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='450' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='38' font-weight='900' font-family='Arial, sans-serif' fill='rgba(54, 40, 40, 0.08)' text-anchor='middle' transform='rotate(-40, 225, 225)'%3EBIHAR SURVEY SAHAYAK%3C/text%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                }}
              ></div>
            )}

            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 style={{ textAlign: "center", fontSize: "26px", fontWeight: "bold", textDecoration: "underline", marginBottom: "30px" }}>
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

export default function VanshavaliManual() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-blue-600 font-bold">वंशावली पेज लोड हो रहा है... (Loading...)</p>
      </div>
    }>
      <VanshavaliContent />
    </Suspense>
  );
}