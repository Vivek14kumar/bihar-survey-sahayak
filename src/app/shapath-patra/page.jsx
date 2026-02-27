"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer } from "lucide-react";

export default function ParimarjanAffidavit() {
  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const [showWatermark, setShowWatermark] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  // 1. DATA STATE for Affidavit Fields
  const [formData, setFormData] = useState({
    name: "", fatherName: "", thanaNo: "", halka: "", mauja: "",
    anchal: "", district: "", regDistrict: "", regAnchal: "",
    regHalka: "", regMauja: "", regThana: "", volumeNo: "",
    pageNo: "", jamabandiNo: "", footerName: "", mobile: "", place: ""
  });

  const validateForm = () => {
    const requiredFields = [
      { key: "name", label: "नाम" },
      { key: "fatherName", label: "पिता/पति का नाम" },
      { key: "mauja", label: "मौजा" },
      { key: "anchal", label: "अंचल" },
      { key: "district", label: "जिला" },
      { key: "footerName", label: "शपथ कर्त्ता का नाम" },
      { key: "mobile", label: "मोबाइल नंबर" },
    ];

    for (let field of requiredFields) {
      if (!formData[field.key] || formData[field.key].trim() === "") {
        alert(`${field.label} भरना अनिवार्य है।`);
        return false;
      }
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      alert("सही 10 अंकों का मोबाइल नंबर दर्ज करें।");
      return false;
    }
    return true;
  };

  // Handle Responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 850) {
        const newScale = window.innerWidth / 950;
        setScale(newScale);
      } else {
        setScale(1);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load Razorpay
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  const openRazorpay = async (callbackAction) => {
    if (!window.Razorpay) {
      alert("भुगतान प्रणाली लोड हो रही है...");
      return;
    }

    try {
      const orderRes = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "affidavit" })
      });

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Affidavit Premium Print ₹3",
        order_id: orderData.id,
        handler: async function (response) {
          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          setShowWatermark(false);
          callbackAction();
        },
        theme: { color: "#1d4ed8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("भुगतान प्रारंभ नहीं हो सका।");
    }
  };

  const handlePaidPrint = async () => {
    if (!validateForm()) return;
    const executePrint = async () => {
      window.print();
      await fetch("/api/track-affidavit-print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "affidavit" }),
      });
    };
    openRazorpay(executePrint);
  };

  const fetchSuggestions = async (word) => {
    if (!word || word.length < 2) return;
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
    } catch { setSuggestions([]); }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.trim()) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 300);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (selectedWord) => {
    if (!currentField) return;
    const currentValue = formData[currentField];
    const words = currentValue.split(" ");
    words[words.length - 1] = selectedWord;
    const finalValue = words.join(" ") + " ";
    setFormData(prev => ({ ...prev, [currentField]: finalValue }));
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 no-print-bg overflow-x-hidden">
      {/* Top Print Button */}
      <div className="w-full max-w-4xl flex justify-center mb-6 print:hidden">
        <button 
          onClick={handlePaidPrint}
          className="flex flex-col items-center justify-center gap-1 px-10 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-xl hover:scale-105 transition-all duration-300 font-bold text-lg"
        >
          <div className="flex items-center gap-3">
            <Printer size={22} />
            <span>Print Without Watermark ₹3</span>
          </div>
          <span className="text-xs opacity-90 font-medium">बिना वॉटरमार्क PDF प्रिंट करें – ₹3</span>
        </button>
      </div>

      {/* Affidavit Document */}
      <div 
        className="origin-top transition-transform duration-300 ease-in-out shadow-2xl print:shadow-none"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="max-w-4xl w-[210mm] mx-auto p-12 bg-white border border-gray-300 relative min-h-[297mm] print:border-none print:p-8">
          {showWatermark && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-10">
              <div className="grid grid-cols-3 gap-16 w-full h-full place-items-center rotate-[-30deg]">
                {Array.from({ length: 60 }).map((_, i) => (
                  <span key={i} className="text-3xl font-extrabold text-gray-500 whitespace-nowrap">
                    BIHAR SURVEY SAHAYAK
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && currentField && (
            <div className="fixed bg-white border-2 border-blue-600 rounded shadow-2xl z-[9999] min-w-[150px] top-[20%] left-1/2 -translate-x-1/2">
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => selectSuggestion(s)}
                  className={`px-4 py-2 cursor-pointer border-b last:border-0 ${i === activeIndex ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`}>
                  {s}
                </div>
              ))}
            </div>
          )}

          <div className="text-center mb-16">
            <h1 className="text-2xl font-bold underline mb-2">स्व-अभिप्रमाणित शपथ पत्र</h1>
          </div>

          <div className="text-black leading-relaxed">
            <p className="indent-10 text-justify px-8">
              मैं <input className="border-b border-dotted border-black outline-none w-64 text-center bg-transparent px-1 font-bold" value={formData.name} onFocus={() => setCurrentField('name')} onChange={(e) => handleInputChange('name', e.target.value)} onKeyDown={handleKeyDown} placeholder="नाम लिखें" />  
              पिता/पति <input className="border-b border-dotted border-black outline-none w-64 text-center bg-transparent px-1 font-bold" value={formData.fatherName} onFocus={() => setCurrentField('fatherName')} onChange={(e) => handleInputChange('fatherName', e.target.value)} onKeyDown={handleKeyDown} placeholder="पिता/पति का नाम" />
              मौजा- <input className="border-b border-dotted border-black outline-none w-55 text-center bg-transparent px-1 font-bold" value={formData.mauja} onFocus={() => setCurrentField('mauja')} onChange={(e) => handleInputChange('mauja', e.target.value)} onKeyDown={handleKeyDown} placeholder="मौजा का नाम" />
              थाना नं०- <input className="border-b border-dotted border-black outline-none w-24 text-center bg-transparent px-1 font-bold" value={formData.thanaNo} onChange={(e) => setFormData({...formData, thanaNo: e.target.value})} placeholder="थाना नं०" />  
              हल्का- <input className="border-b border-dotted border-black outline-none w-40 text-center bg-transparent px-1 font-bold" value={formData.halka} onFocus={() => setCurrentField('halka')} onChange={(e) => handleInputChange('halka', e.target.value)} onKeyDown={handleKeyDown} placeholder="हल्का नं०" /> 
              <br />
              अंचल- <input className="border-b border-dotted border-black outline-none w-40 text-center bg-transparent px-1 font-bold" value={formData.anchal} onFocus={() => setCurrentField('anchal')} onChange={(e) => handleInputChange('anchal', e.target.value)} onKeyDown={handleKeyDown} placeholder="अंचल लिखें" /> 
              जिला- <input className="border-b border-dotted border-black outline-none w-40 text-center bg-transparent px-1 font-bold" value={formData.district} onFocus={() => setCurrentField('district')} onChange={(e) => handleInputChange('district', e.target.value)} onKeyDown={handleKeyDown} placeholder="जिला लिखें" /> 
              का निवासी हूँ। राजस्व एवं भूमि सुधार विभाग द्वारा डिजिटाईज्ड कर ऑनलाइन उपलब्ध कराए गए मेरी जमाबंदी जिला 
              <input className="border-b border-dotted border-black outline-none w-32 text-center font-bold" placeholder="जिला लिखें" value={formData.regDistrict} onFocus={() => setCurrentField('regDistrict')} onChange={(e) => handleInputChange('regDistrict', e.target.value)} onKeyDown={handleKeyDown} />
              <br /> अंचल <input className="border-b border-dotted border-black outline-none w-34 text-center font-bold" placeholder="अंचल लिखें " value={formData.regAnchal} onFocus={() => setCurrentField('regAnchal')} onChange={(e) => handleInputChange('regAnchal', e.target.value)} onKeyDown={handleKeyDown} />
              हल्का <input className="border-b border-dotted border-black outline-none w-14 text-center font-bold" placeholder="हल्का न० " value={formData.regHalka} onFocus={() => setCurrentField('regHalka')} onChange={(e) => handleInputChange('regHalka', e.target.value)} onKeyDown={handleKeyDown} />
              मौजा <input className="border-b border-dotted border-black outline-none w-42 text-center font-bold" placeholder="मौजा " value={formData.regMauja} onFocus={() => setCurrentField('regMauja')} onChange={(e) => handleInputChange('regMauja', e.target.value)} onKeyDown={handleKeyDown} />
              थाना न० <input className="border-b border-dotted border-black outline-none w-24 text-center font-bold" placeholder="थाना न० " value={formData.regThana} onChange={(e) => setFormData({...formData, regThana: e.target.value})} />
              में कुछ अशुद्धियाँ भॉल्यूम संख्या <input className="border-b border-dotted border-black outline-none w-20 text-center font-bold" placeholder="लिखें" value={formData.volumeNo} onChange={(e) => setFormData({...formData, volumeNo: e.target.value})} />
              पृष्ठ संख्या <input className="border-b border-dotted border-black outline-none w-20 text-center font-bold" placeholder="लिखें " value={formData.pageNo} onChange={(e) => setFormData({...formData, pageNo: e.target.value})} />
              जमाबंदी न० <input className="border-b border-dotted border-black outline-none w-32 text-center font-bold" placeholder="लिखे " value={formData.jamabandiNo} onChange={(e) => setFormData({...formData, jamabandiNo: e.target.value})} />
              में कुछ अशुद्धियाँ दृष्टिगोचर है जिनमें सुधार हेतु मेरे द्वारा परिमार्जनप्लस के माध्यम से आवेदन किया जा रहा है।
            </p>

            <div className="pt-6">
              <p className="mb-6 indent-16 px-8">
                शपथ पूर्वक बयान करता हूँ कि मेरे द्वारा परिमार्जनप्लस के माध्यम से जमाबंदी ऑनलाइन करने हेतु दी गई विवरणी सही है तथा उक्त जमीन पर मेरा स्वामित्व है।
              </p>
              <p className='font-bold text-lg pl-4 px-8 indent-16'>
                अगर भविष्य में जाँच / सत्यापन / शिकायत के क्रम में प्रमाणित होता है कि मेरे द्वारा गलत विवरणी दी गई है तो मेरे ऊपर विधि सम्मत कानूनी कार्रवाई की जा सकती है।
              </p>
            </div>
          </div>

          <div className="mt-24 flex flex-col items-end px-10">
            <div className="text-left space-y-4 w-90">
              <p className="flex items-center">
                <span className="font-bold w-40">शपथ कर्त्ता का नाम :-</span> 
                <input className="border-b border-black outline-none flex-1 font-bold text-center" value={formData.footerName} placeholder="नाम लिखें" onFocus={() => setCurrentField('footerName')} onChange={(e) => handleInputChange('footerName', e.target.value)} onKeyDown={handleKeyDown} />
              </p>
              <p className="flex items-center">
                <span className="font-bold w-40">मोबाईल नं०:-</span> 
                <input className="border-b border-black outline-none flex-1 font-bold text-center" placeholder="मोबाईल नं० लिखें" maxLength={10} value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </p>
              <div className="mt-4">
                <p className="font-bold text-lg">हस्ताक्षर :-</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Print Button */}
      <div className="w-full max-w-4xl flex justify-center mt-6 print:hidden">
        <button onClick={handlePaidPrint} className="flex flex-col items-center justify-center gap-1 px-10 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-xl hover:scale-105 transition-all duration-300 font-bold text-lg">
          <div className="flex items-center gap-3">
            <Printer size={22} />
            <span>Print Without Watermark ₹3</span>
          </div>
          <span className="text-xs opacity-90 font-medium">बिना वॉटरमार्क PDF प्रिंट करें – ₹3</span>
        </button>
      </div>

      <style jsx global>{`
        @page { size: A4 portrait; margin: 10mm; }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .no-print-bg { background: none !important; padding: 0 !important; }
          .origin-top { transform: scale(1) !important; width: 100% !important; }
          .shadow-2xl { box-shadow: none !important; }
          input::placeholder { color: transparent; }
        }
      `}</style>
    </div>
  );
}