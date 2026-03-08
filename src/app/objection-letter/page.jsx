"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer } from "lucide-react";

export default function ObjectionLetter() {
  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const [showWatermark, setShowWatermark] = useState(true);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  useEffect(() => {
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleSecurityKeyDown = (e) => {
    if (
      (e.ctrlKey && ["c", "u", "s", "a", "p"].includes(e.key.toLowerCase())) ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")
    ) {
      e.preventDefault();
    }
  };

  const handleCopy = (e) => {
    e.preventDefault();
  };

  document.addEventListener("contextmenu", handleContextMenu);
  document.addEventListener("keydown", handleSecurityKeyDown);
  document.addEventListener("copy", handleCopy);

  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
    document.removeEventListener("keydown", handleSecurityKeyDown);
    document.removeEventListener("copy", handleCopy);
  };
}, []);

  useEffect(() => {
  const today = new Date();
  
  const formattedDate = today.toLocaleDateString("hi-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  setFormData((prev) => ({
    ...prev,
    date: formattedDate,
  }));
}, []);

  // 1. DATA STATE (Objection Letter specific)
  const [formData, setFormData] = useState({
    campNo: "", block: "", district: "",khataNo: "", khesraNo: "",
    userName: "", fatherName: "",  relationType: "पिता", village: "", thana: "",
    objectionType: "रकवा (Area) की त्रुटि", mobile: "", aadhar: "",
    date: "",evidences: []
  });

  const validateForm = () => {
    const requiredFields = [
      { key: "userName", label: "आपका नाम" },
      { key: "fatherName", label: "पिता का नाम" },
      { key: "village", label: "ग्राम" },
      { key: "block", label: "प्रखंड" },
      { key: "district", label: "जिला" },
      { key: "khesraNo", label: "खेसरा नंबर" },
      { key: "mobile", label: "मोबाइल नंबर" },
      {key: "aadhar", label: "आधार नंबर"},
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
    if (!/^\d{4}\s\d{4}\s\d{4}$/.test(formData.aadhar)) {
  alert("सही 12 अंकों का आधार नंबर दर्ज करें।");
  return false;
}
    return true;
  };

  // Scaling logic for mobile
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

  const handleEvidenceChange = (value) => {
  setFormData((prev) => {
    const alreadySelected = prev.evidences.includes(value);

    if (alreadySelected) {
      return {
        ...prev,
        evidences: prev.evidences.filter((item) => item !== value),
      };
    } else {
      return {
        ...prev,
        evidences: [...prev.evidences, value],
      };
    }
  });
};

  // Razorpay Loader
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
        body: JSON.stringify({ type: "objectionLetter" })
      });

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Objection Letter Premium Print ₹3",
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

  /*const handlePaidPrint = () => {
    window.print();
    setShowWatermark(false);
  }*/
  const validateEvidences = () => {
  if (formData.evidences.length === 0) {
    alert("कृपया कम से कम एक संलग्न साक्ष्य चुनें।");
    return false;
  }
  return true;
};
  const handlePaidPrint = async () => {
    // 1️⃣ Normal Form Validation
  if (!validateForm()) return;

  // 2️⃣ Evidence Validation
  if (!validateEvidences()) return;

  // 3️⃣ First Confirmation
  const firstConfirm = window.confirm(
    "कृपया आगे बढ़ने से पहले फॉर्म को ध्यान से देख लें。\n\nक्या आपने सभी जानकारी सही से भर दी है?"
  );

  if (!firstConfirm) return;

  // 4️⃣ Legal Responsibility Confirmation
  const secondConfirm = window.confirm(
    "मैंने फॉर्म को ध्यान से देख लिया है。\n\nयदि कोई जानकारी गलत है तो उसकी पूरी जिम्मेदारी मेरी होगी。\n\nक्या आप आगे बढ़ना चाहते हैं?"
  );

  if (!secondConfirm) return;
    const executePrint = async () => {
      window.print();
      await fetch("/api/objection-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "objection_letter" }),
      });
    };
    openRazorpay(executePrint);
  };

  // 2. HINDI TRANSLITERATION LOGIC
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

  const formatAadhaar = (value) => {
  return value.replace(/\D/g, "")
              .slice(0, 12)
              .replace(/(\d{4})(?=\d)/g, "$1 ");
};


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 no-print-bg overflow-x-hidden font-hindi">
      <style jsx global>{`
        @font-face {
          font-family: 'Hindi';
          src: url('/fonts/NotoSansDevanagari-Regular.ttf') format('truetype');
        }
        .font-hindi { font-family: 'Hindi', sans-serif; }
        @page { size: A4 portrait; margin: 10mm; }
        @media print {
          body { background: white !important; }
          .print-hidden { display: none !important; }
          .no-print-bg { background: none !important; padding: 0 !important; }
          .origin-top { transform: scale(1) !important; width: 100% !important; }
          input::placeholder { color: transparent; }
        }
      `}</style>

      {/* Control Buttons */}
      <div className="w-full max-w-4xl flex justify-center mb-6 print-hidden">
        <button 
          onClick={handlePaidPrint}
          className="flex flex-col items-center justify-center gap-1 px-10 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-xl hover:scale-105 transition-all font-bold"
        >
          <div className="flex items-center gap-3">
            <Printer size={22} />
            <span>Print Objection Letter ₹3</span>
          </div>
          <span className="text-xs opacity-90">बिना वॉटरमार्क PDF प्रिंट करें – ₹3</span>
        </button>
      </div>

      {/* Letter Document */}
      <div 
        className="origin-top transition-transform duration-300 shadow-2xl print:shadow-none print:transform-none"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="max-w-4xl w-[210mm] mx-auto p-16 bg-white border border-gray-300 relative min-h-[297mm] print:border-none">
          
          {/* Watermark */}
          {showWatermark && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-10">
              <div className="grid grid-cols-3 gap-16 w-full h-full place-items-center rotate-[-30deg]">
                {Array.from({ length: 45 }).map((_, i) => (
                  <span key={i} className="text-2xl font-black text-gray-500 whitespace-nowrap">BIHAR SURVEY SAHAYAK</span>
                ))}
              </div>
            </div>
          )}

          {/* Transliteration Dropdown */}
          {suggestions.length > 0 && currentField && (
            <div className="fixed bg-white border-2 border-blue-600 rounded shadow-2xl z-[9999] min-w-[150px] top-[25%] left-1/2 -translate-x-1/2">
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => selectSuggestion(s)}
                  className={`px-4 py-2 cursor-pointer border-b last:border-0 ${i === activeIndex ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`}>
                  {s}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1 mb-8">
            <p>सेवा में,</p>
            <p className="ml-10 font-bold">सहायक बंदोबस्त पदाधिकारी / शिविर प्रभारी (A.S.O.),</p>
            <p className="ml-10">
              शिविर संख्या: &nbsp;
              <input className=" outline-none w-20 " placeholder="00" value={formData.campNo} onChange={(e) => setFormData({...formData, campNo: e.target.value})} />
            </p>
            <p className="ml-10">
              प्रखंड: &nbsp;
              <input className=" outline-none w-40" placeholder="प्रखंड लिखें" value={formData.block} onFocus={() => setCurrentField('block')} onChange={(e) => handleInputChange('block', e.target.value)} onKeyDown={handleKeyDown}/>
            </p>
            <p className="ml-10">
              जिला: &nbsp;
              <input className="outline-none w-40 " placeholder="जिला लिखें" value={formData.district} onFocus={() => setCurrentField('district')} onChange={(e) => handleInputChange('district', e.target.value)} onKeyDown={handleKeyDown}/>
            </p>
          </div>

          <div className="font-bold leading-snug ">
            विषय: भू-सर्वेक्षण के दौरान खाता संख्या 
            <input 
              className="outline-none w-14 text-center"
              placeholder="खाता"
              value={formData.khataNo}
              onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setFormData({...formData, khataNo: value});
          }}
            /> 
            एवं खेसरा संख्या 
            <input 
              className="outline-none w-14 text-center"
              placeholder="खेसरा"
              value={formData.khesraNo}
              onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setFormData({...formData, khesraNo: value});
          }}
            /> 
            में हुई 
            {/* SCREEN VIEW - Select Visible */}
          <span className="print:hidden">
            <select 
              className="bg-transparent font-bold outline-none text-center mb-2"
              value={formData.objectionType}
              onChange={(e) => 
                setFormData({...formData, objectionType: e.target.value})
              }
            >
              <option>रकवा (Area) की त्रुटि</option>
              <option>नाम/उत्तराधिकारी की त्रुटि</option>
              <option>सीमांकन (Boundary) विवाद</option>
              <option>स्वामित्व (रैयती/सरकारी) विवाद</option>
            </select>
          </span>
            
          {/* PRINT VIEW - Only Selected Text */}
          <span className="hidden print:inline font-bold">
           &nbsp; {formData.objectionType} &nbsp;
          </span>
            के सुधार हेतु आपत्ति पत्र।
          </div>

          <div className=" leading-relaxed">
            <p>महाशय,</p>
            <p className="indent-12 mt-4">
              संविनय निवेदन है कि मैं 
              <input className=" outline-none w-55 text-center font-bold" placeholder="नाम लिखें" value={formData.userName} onFocus={() => setCurrentField('userName')} onChange={(e) => handleInputChange('userName', e.target.value)} onKeyDown={handleKeyDown}/> 
              {/* SCREEN VIEW */}
              <span className="print:hidden">
                <select
                  className="outline-none bg-transparent"
                  value={formData.relationType}
                  onChange={(e) =>
                    setFormData({ ...formData, relationType: e.target.value })
                  }
                >
                  <option value="पिता">पिता</option>
                  <option value="पति">पति</option>
                </select>
              </span>
                
              {/* PRINT VIEW */}
              <span className="hidden print:inline ">
                {formData.relationType}
              </span>
              <input className=" outline-none w-54 text-center font-bold" placeholder="पिता का नाम" value={formData.fatherName} onFocus={() => setCurrentField('fatherName')} onChange={(e) => handleInputChange('fatherName', e.target.value)} onKeyDown={handleKeyDown}/> 
              ग्राम 
              <input className=" outline-none w-46 text-center font-bold " placeholder="ग्राम" value={formData.village} onFocus={() => setCurrentField('village')} onChange={(e) => handleInputChange('village', e.target.value)} onKeyDown={handleKeyDown}/> 
              थाना 
              <input className=" outline-none w-38 text-center font-bold" placeholder="थाना" value={formData.thana} onFocus={() => setCurrentField('thana')} onChange={(e) => handleInputChange('thana', e.target.value)} onKeyDown={handleKeyDown}/> 
              का स्थाई निवासी हूँ।
            </p>
            <p className="mt-6">
              बिहार विशेष सर्वेक्षण के दौरान आपके कार्यालय द्वारा निर्गत किए गए ड्राफ्ट रिकॉर्ड (खानापूरी पर्चा/खेवट) का मैंने अवलोकन किया। अवलोकन के पश्चात, मुझे निम्नलिखित त्रुटि/विसंगति प्राप्त हुई है, जिसके सुधार हेतु मैं यह आपत्ति दर्ज कर रहा हूँ:
            </p>
            
            <div className="mt-2">
              <span className="font-bold">आपत्ति का प्रकार: {formData.objectionType} </span>
            </div>

            <p className="mt-2 font-bold underline">संलग्न साक्ष्य:</p>

            {/* SCREEN VIEW - Checkbox visible */}
            <div className="mt-3 space-y-2 print:hidden">
              {[
                "पंजी-2 (Jamabandi/LPC) एवं रसीद की छायाप्रति।",
                "वंशावली (Vanshavali) एवं आधार कार्ड।",
                "पुराना खतियान / केवाला की कॉपी।",
              ].map((item, index) => (
                <label key={index} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4"
                    checked={formData.evidences.includes(item)}
                    onChange={() => handleEvidenceChange(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            
            {/* PRINT VIEW - Only Selected Items */}
            <ul className="hidden print:block list-disc ml-10 mt-3 space-y-1">
              {formData.evidences.length > 0 ? (
                formData.evidences.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>कोई साक्ष्य संलग्न नहीं किया गया है।</li>
              )}
            </ul>
            <p className="mt-6">अनुरोध:</p>
            <p className="indent-12">
              अतः श्रीमान से करबद्ध प्रार्थना है कि उक्त भूमि का पुनः भौतिक सत्यापन (Spot Verification) कराया जाए और संलग्न दस्तावेजों के आधार पर रिकॉर्ड में सुधार करने की कृपा की जाए, ताकि भविष्य में किसी भी प्रकार के कानूनी विवाद से बचा जा सके।
            </p>
          </div>
            

          <div className="mt-4 flex justify-end">
           
            <div className="space-y-2">
              <p className="mt-4 font-bold text-lg">विश्वासभाजन,</p>
              <p className="mb-6">(हस्ताक्षर)</p>
              <p className="flex items-center gap-2">
                नाम: <input className=" outline-none w-56 font-bold" placeholder="नाम लिखें" value={formData.userName} onFocus={() => setCurrentField('userName')} onChange={(e) => handleInputChange('userName', e.target.value)} onKeyDown={handleKeyDown}/>
              </p>
               <p className="flex items-center gap-2">
                मोबाइल न०: <input className=" outline-none w-32 font-bold" placeholder="मोबाइल नंबर" value={formData.mobile} onFocus={() => setCurrentField('mobile')} onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({...formData, mobile: value});
                }}/>
              </p> <p className="flex items-center gap-2">
                आधार न०: <input className=" outline-none w-32 font-bold" placeholder="आधार नंबर" value={formData.aadhar} onFocus={() => setCurrentField('aadhar')} onChange={(e) => {
                  const formatted = formatAadhaar(e.target.value);
                  setFormData({ ...formData, aadhar: formatted });
                }} />
              </p>
              <p>दिनांक: {formData.date}</p>
            </div>
            
          </div>
        </div>
      </div>
      {/* Control Buttons */}
      <div className="w-full max-w-4xl flex justify-center mt-2 print-hidden">
        <button 
          onClick={handlePaidPrint}
          className="flex flex-col items-center justify-center gap-1 px-10 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-xl hover:scale-105 transition-all font-bold"
        >
          <div className="flex items-center gap-3">
            <Printer size={22} />
            <span>Print Objection Letter ₹3</span>
          </div>
          <span className="text-xs opacity-90">बिना वॉटरमार्क PDF प्रिंट करें – ₹3</span>
        </button>
      </div>
    </div>
    
  );
}