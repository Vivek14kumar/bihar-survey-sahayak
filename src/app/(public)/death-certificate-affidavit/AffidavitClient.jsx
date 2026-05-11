"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer, FileText, User, MapPin, Landmark, Calendar, Download, Crown } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export default function AffidavitPremiumUI() {
  const [formData, setFormData] = useState({
    districtOrSubdivision: "",
    userName: "",
    age: "",
    fatherName: "",
    relationType: "पिता",
    village: "",
    post: "",
    thana: "",
    anchal: "",
    district: "",
    pincode: "",
    ancestorRelation: "दादा",
    ancestorName: "",
    mauzaName: "",
    thanaNo: "",
    khataNo: "",
    landType: "खतियानी",
    deathYears: "",
    othershareholders: "नहीं",
    date: new Date().toISOString().split("T")[0],
  });

  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);
  
  // PDF & Payment States
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const printRef = useRef(null);
  const observerRef = useRef(null);

  // --- RAZORPAY LOADER & SECURITY OBSERVER ---
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

  // --- RESPONSIVE SCALE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 850) {
        setScale(window.innerWidth / 880); 
      } else {
        setScale(1);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- FORM VALIDATION ---
  const validateForm = () => {
    const requiredFields = ["userName", "fatherName", "village", "ancestorName", "districtOrSubdivision"];
    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert("कृपया सभी महत्वपूर्ण जानकारी भरें।");
        const formContainer = document.getElementById("form-container");
        if(formContainer) formContainer.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    }
    return true;
  };

  // --- PRINT HANDLER ---
  const executePrint = useReactToPrint({
    contentRef: printRef, 
    documentTitle: "शपथ_पत्र_बिहार_सर्वेक्षण",
  });

  // --- PDF DOWNLOAD HANDLER ---
  const executeDownloadPDF = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 200)); 
      const dataUrl = await toPng(printRef.current, {
        quality: 1.0,
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (printRef.current.offsetHeight * pdfWidth) / printRef.current.offsetWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save("Bihar_Survey_Affidavit.pdf");

    } catch (error) {
      console.error("PDF Error:", error);
      alert("PDF जनरेट करने में समस्या।");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // --- PREMIUM PAYMENT LOGIC (₹5) ---
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
        body: JSON.stringify({ type: "affidavit", amount: 500 }) 
      });

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Premium Affidavit Document (No Watermark)",
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
          
          fetch("/api/death-affidavit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "death-affidavit" })
          });

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

  // --- HINDI TRANSLITERATION LOGIC ---
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

  const handleInputChange = (field, value, disableHindi = false) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (disableHindi) { setSuggestions([]); return; }
    const words = value.split(" ");
    const lastWord = words[words.length - 1];

    if (lastWord.trim()) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 200);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (selectedWord, fieldName) => {
    setFormData((prev) => {
      const currentValue = prev[fieldName];
      const words = currentValue.split(" ");
      words[words.length - 1] = selectedWord;
      return { ...prev, [fieldName]: words.join(" ") + " " }; 
    });
    setSuggestions([]);
    setActiveIndex(0);
  };

  const handleKeyDown = (e, fieldName) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault(); setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault(); setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault(); selectSuggestion(suggestions[activeIndex], fieldName);
      }
    }
  };

  const getFormattedDate = (dateString) => {
    if (!dateString) return "_________";
    const d = new Date(dateString);
    if (isNaN(d)) return "_________";
    return d.toLocaleDateString("hi-IN", { day: "2-digit", month: "long", year: "numeric" });
  };

  // --- REUSABLE INPUT COMPONENT ---
  const renderInput = ({ label, name, placeholder, type = "text", width = "w-full", disableHindi = false, helpText }) => (
    <div className={`relative mb-3 ${width}`}>
      <label className="block mb-1 text-sm font-bold text-gray-800">{label}</label>
      {helpText && <p className="text-[11px] text-gray-500 mb-1 leading-tight">{helpText}</p>}
      <input
        type={type}
        placeholder={placeholder}
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
            <li
              key={i}
              onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s, name); }}
              className={`p-2 cursor-pointer text-sm border-b flex justify-between items-center ${i === activeIndex ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <span>{s}</span>
              {i === activeIndex && <span className="text-[10px] opacity-60 uppercase">Space</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-2 md:p-6 max-w-[1400px] mx-auto bg-gray-100 flex flex-col lg:flex-row gap-6 font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');
        .font-hindi { font-family: 'Noto Sans Devanagari', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @media print {
          body { background: white; margin: 0; padding: 0; }
          @page { size: A4 portrait; margin: 20mm; }
          #watermark-layer {
            position: fixed !important;
            top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important;
          }
        }
      `}</style>

      {/* LEFT SIDE: Input Form */}
      <div id="form-container" className="w-full lg:w-1/3 bg-white p-4 md:p-6 shadow-xl rounded-xl h-auto lg:h-[88vh] overflow-y-auto border-t-[6px] border-blue-600 scroll-smooth print:hidden relative">
        
        <div className="text-center mb-6 border-b pb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight">शपथ पत्र (Affidavit)</h2>
          <p className="text-sm text-gray-500 mt-2">बिहार विशेष भूमि सर्वेक्षण हेतु</p>
        </div>

        {/* Section 1 */}
        <div className="bg-blue-50 p-4 md:p-5 rounded-3xl mb-5 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-blue-200 pb-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <h3 className="font-bold text-blue-900 text-lg">न्यायालय का विवरण</h3>
          </div>
          {renderInput({ label: "जिला/अनुमंडल (कोर्ट का नाम)", name: "districtOrSubdivision", placeholder: "उदा: पटना" })}
        </div>

        {/* Section 2 */}
        <div className="bg-orange-50 p-4 md:p-5 rounded-3xl mb-5 border border-orange-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-orange-300 pb-2">
            <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <h3 className="font-bold text-orange-900 text-lg">व्यक्तिगत जानकारी</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {renderInput({ label: "आपका नाम", name: "userName", placeholder: "नाम लिखें", width: "col-span-2" })}
            {renderInput({ label: "उम्र", name: "age", placeholder: "00", type: "number", disableHindi: true })}
          </div>
          <div className="flex gap-3">
            <div className="w-1/3 relative mb-3">
              <label className="block mb-1 text-sm font-bold text-gray-800">संबंध</label>
              <select className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors bg-white shadow-sm" value={formData.relationType} onChange={(e)=>setFormData({...formData, relationType: e.target.value})}>
                <option>पिता</option>
                <option>पति</option>
              </select>
            </div>
            {renderInput({ label: "पिता/पति का नाम", name: "fatherName", placeholder: "नाम लिखें", width: "w-2/3" })}
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-purple-50 p-4 md:p-5 rounded-3xl mb-5 border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-purple-300 pb-2">
            <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <h3 className="font-bold text-purple-900 text-lg">पता (Address)</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {renderInput({ label: "ग्राम", name: "village" })}
            {renderInput({ label: "पोस्ट", name: "post" })}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {renderInput({ label: "थाना", name: "thana" })}
            {renderInput({ label: "जिला", name: "district" })}
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-yellow-50 p-4 md:p-5 rounded-3xl mb-5 border border-yellow-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-yellow-300 pb-2">
            <span className="bg-yellow-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <h3 className="font-bold text-yellow-900 text-lg">भूमि और पूर्वज</h3>
          </div>
          <div className="flex gap-3">
            <div className="w-1/3 relative mb-3">
              <label className="block mb-1 text-sm font-bold text-gray-800">पूर्वज</label>
              <select className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors bg-white shadow-sm" value={formData.ancestorRelation} onChange={(e)=>setFormData({...formData, ancestorRelation: e.target.value})}>
                <option>दादा</option>
                <option>परदादा</option>
                <option>पिता</option>
              </select>
            </div>
            {renderInput({ label: "पूर्वज का नाम", name: "ancestorName", placeholder: "नाम लिखें", width: "w-2/3" })}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {renderInput({ label: "मौजा", name: "mauzaName" })}
            {renderInput({ label: "थाना न०", name: "thanaNo", disableHindi: true })}
            {renderInput({ label: "खाता न०", name: "khataNo", disableHindi: true })}
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-green-50 p-4 md:p-5 rounded-3xl mb-20 border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-green-300 pb-2">
            <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">5</span>
            <h3 className="font-bold text-green-900 text-lg">अन्य जानकारी</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative mb-3 w-full">
              <label className="block mb-1 text-sm font-bold text-gray-800">शपथ पत्र की तिथि</label>
              <input
                type="date"
                className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors bg-white shadow-sm"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            {renderInput({ label: "मृत्यु को कितने वर्ष हुए", name: "deathYears", placeholder: "उदा: 40", type: "number", disableHindi: true })}
          </div>
        </div>

        {/* --- STICKY BOTTOM BUTTONS (Only Premium Options) --- */}
        <div className="sticky bottom-0 left-0 w-full z-20 bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] px-3 py-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            
            <button
              onClick={() => processAction('print')}
              className="relative flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3.5 rounded-2xl font-bold text-[13px] hover:shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all"
            >
              {showWatermark && <span className="absolute -top-2 right-2 text-[11px] bg-black text-white px-2 py-[2px] rounded-full shadow-lg">₹5</span>}
              <Printer size={20} />
              <span>प्रिंट करें</span>
            </button>

            <button
              onClick={() => processAction('download')}
              disabled={isGeneratingPDF}
              className="relative flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3.5 rounded-2xl font-bold text-[13px] hover:shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all disabled:opacity-70"
            >
              {showWatermark && <span className="absolute -top-2 right-2 text-[11px] bg-black text-white px-2 py-[2px] rounded-full shadow-lg">₹5</span>}
              <Download size={20} />
              <span>{isGeneratingPDF ? 'लोडिंग...' : 'PDF डाउनलोड'}</span>
            </button>

          </div>
        </div>

      </div>

      {/* RIGHT SIDE: Document Preview */}
      <div className="w-full lg:w-2/3 p-2 md:p-6 rounded-xl overflow-x-auto overflow-y-auto h-auto lg:h-[88vh] flex justify-center bg-white shadow-xl font-hindi print:bg-transparent print:shadow-none print:p-0">
        <div className="p-8 md:p-14 relative" style={{ backgroundColor:'white', transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          
          {/* ACTUAl PRINT DOCUMENT */}
          <div 
            ref={printRef}
            className="text-black leading-relaxed relative bg-white" 
            style={{ fontSize: '16px', color: '#000', width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
          >
            
            {/* THE UNREMOVABLE FULL-PAGE REPEATING WATERMARK */}
            {showWatermark && !isGeneratingPDF && (
              <div id="watermark-layer" style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 0, pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='450' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='38' font-weight='900' font-family='Arial, sans-serif' fill='rgba(54, 40, 40, 0.08)' text-anchor='middle' transform='rotate(-40, 225, 225)'%3EBIHAR SURVEY SAHAYAK%3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}></div>
            )}

            <div className="relative z-10" style={{ padding: '10mm' }}>
              <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '40px' }}>
                शपथ पत्र (बिहार विशेष भूमि सर्वेक्षण हेतु)
              </h2>
              
              <p style={{ marginBottom: '30px', fontSize: '18px' }}>
                <span style={{ fontWeight: 'bold' }}>समक्ष:</span> श्रीमान कार्यपालक दंडाधिकारी / नोटरी पब्लिक, 
                <span style={{ fontWeight: 'bold', marginLeft: '8px', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.districtOrSubdivision || "________________"}</span>
              </p>

              <p style={{ textAlign: 'justify', lineHeight: '2' }}>
                मैं/हम, <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.userName || "________________"}</span>, 
                उम्र- लगभग <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.age || "___"}</span> वर्ष, 
                {formData.relationType} का नाम- <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.fatherName || "________________"}</span>,
                निवासी- ग्राम: <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.village || "_________"}</span>, 
                पोस्ट: <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.post || "_________"}</span>, 
                थाना: <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.thana || "_________"}</span>, 
                जिला: <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.district || "_________"}</span>, 
                निम्नलिखित बयान शपथ पूर्वक करता हूँ / करते हैं:
              </p>

              <ol style={{ paddingLeft: '35px', marginTop: '25px', marginBottom: '25px', textAlign: 'justify', lineHeight: '2' }}>
                <li style={{ marginBottom: '15px' }}>यह कि मैं/हम उपरोक्त पते का स्थायी निवासी हूँ / हैं।</li>
                <li style={{ marginBottom: '15px' }}>यह कि मेरे/हमारे {formData.ancestorRelation} स्व. <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.ancestorName || "________________"}</span> के नाम से 
                मौजा- <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.mauzaName || "_________"}</span>, 
                थाना नंबर- <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.thanaNo || "___"}</span>, 
                खाता नं.- <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.khataNo || "___"}</span> में {formData.landType} की भूमि स्थित है।</li>
                
                <li style={{ marginBottom: '15px' }}>यह कि उक्त स्व. {formData.ancestorName || "________________"} का स्वर्गवास आज से लगभग <span style={{ fontWeight: 'bold', borderBottom: '1px dashed #666', padding: '0 8px' }}>{formData.deathYears || "___"}</span> वर्ष पूर्व हो चुका है। उस समय मृत्यु प्रमाण पत्र बनवाने का कोई विशेष प्रचलन नहीं था, जिस कारण उनका मृत्यु प्रमाण पत्र उपलब्ध नहीं है।</li>
                
                <li style={{ marginBottom: '15px' }}>यह कि स्व. {formData.ancestorName || "________________"} के हम ही वैध एवं एकमात्र कानूनी वारिस हैं। उनके निधन के पश्चात् उक्त भूमि पर हमारा ही शांतिपूर्ण दखल-कब्जा चला आ रहा है।</li>
                <li style={{ marginBottom: '15px' }}>यह कि इस शपथ पत्र में कही गई सभी बातें मेरे ज्ञान और विश्वास के अनुसार सत्य हैं, इसमें कोई भी तथ्य छिपाया नहीं गया है।</li>
              </ol>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '100px' }}>
                <div>
                  <p style={{ marginBottom: '10px' }}>दिनांक: <span style={{ fontWeight: 'bold' }}>{getFormattedDate(formData.date)}</span></p>
                  <p>स्थान: <span style={{ fontWeight: 'bold' }}>{formData.district || "_________"}</span></p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ borderTop: '2px solid #000', width: '200px', marginBottom: '8px' }}></div>
                  <p style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>हस्ताक्षर शपथकर्ता</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}