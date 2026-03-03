"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer } from "lucide-react";

export default function CancellationJamabandhi() {
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

  // 1. DATA STATE - ADDED MISSING KEYS TO FIX CONSOLE ERROR
  const [formData, setFormData] = useState({
    anchala: "", block: "", district: "", khataNo: "", khesraNo: "",
    userName: "", fatherName: "", relationType: "पिता", village: "", thana: "",
    // Added these two missing keys:
    wrongJamabandiName: "", 
    wrongJamabandiFather: "",
    objectionType: "रकवा (Area) की त्रुटि", mobile: "", aadhar: "",
    date: "", evidences: [], 
    tableData: {
      anchal: "", revenueThana: "", jamabandiNo: "", ryotDetails: "",
      khata: "", khesra: "", rakba: "", 
      north: "", south: "", east: "", west: ""
    }
  });

  const validateForm = () => {
    const requiredFields = [
      { key: "userName", label: "आपका नाम" },
      { key: "fatherName", label: "पिता का नाम" },
      { key: "village", label: "ग्राम" },
      { key: "block", label: "प्रखंड" },
      { key: "district", label: "जिला" },
      { key: "mobile", label: "मोबाइल नंबर" },
      { key: "aadhar", label: "आधार नंबर" },
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
        body: JSON.stringify({ type: "objection_letter" })
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

  const validateEvidences = () => {
    if (formData.evidences.length === 0) {
      alert("कृपया कम से कम एक संलग्न साक्ष्य चुनें।");
      return false;
    }
    return true;
  };

 /* const handlePaidPrint = () => {
    window.print();
    setShowWatermark(false);
  }*/
  const handlePaidPrint = async () => {
    if (!validateForm()) return;
    if (!validateEvidences()) return;

    const firstConfirm = window.confirm(
      "कृपया आगे बढ़ने से पहले फॉर्म को ध्यान से देख लें。\n\nक्या आपने सभी जानकारी सही से भर दी है?"
    );

    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "मैंने फॉर्म को ध्यान से देख लिया है。\n\nयदि कोई जानकारी गलत है तो उसकी पूरी जिम्मेदारी मेरी होगी。\n\nक्या आप आगे बढ़ना चाहते हैं?"
    );

    if (!secondConfirm) return;
    const executePrint = async () => {
      window.print();
      await fetch("/api/track-cancellation-jamabandhi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "objection_letter" }),
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

  const handleInputChange = (field, value, isTable = false) => {
    if (isTable) {
      setFormData(prev => ({
        ...prev,
        tableData: { ...prev.tableData, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

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
    const { field, isTable } = currentField;

    setFormData(prev => {
      const currentValue = isTable ? prev.tableData[field] : prev[field];
      const words = currentValue.trim().split(" ");
      words[words.length - 1] = selectedWord;
      const finalValue = words.join(" ") + " ";

      if (isTable) {
        return { ...prev, tableData: { ...prev.tableData, [field]: finalValue } };
      }
      return { ...prev, [field]: finalValue };
    });
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

      <div 
        className="origin-top transition-transform duration-300 shadow-2xl print:shadow-none print:transform-none"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="max-w-4xl w-[210mm] mx-auto p-16 bg-white border border-gray-300 relative min-h-[297mm] print:border-none">
          
          {showWatermark && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-10">
              <div className="grid grid-cols-3 gap-16 w-full h-full place-items-center rotate-[-30deg]">
                {Array.from({ length: 45 }).map((_, i) => (
                  <span key={i} className="text-2xl font-black text-gray-500 whitespace-nowrap">BIHAR SURVEY SAHAYAK</span>
                ))}
              </div>
            </div>
          )}

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
            <p className="ml-10 font-bold">अंचल आधिकारी,</p>
            <p className="ml-10">
              अंचल : &nbsp;
              <input className=" outline-none w-40 border-b border-dotted border-black px-1" placeholder="अंचल लिखे" value={formData.anchala} onFocus={() => setCurrentField({ field: 'anchala', isTable: false })} onChange={(e) => handleInputChange('anchala', e.target.value)} onKeyDown={handleKeyDown} />
            </p>
            <p className="ml-10">
              प्रखंड: &nbsp;
              <input className=" outline-none w-40 border-b border-dotted border-black px-1" placeholder="प्रखंड लिखें" value={formData.block} onFocus={() => setCurrentField({ field: 'block', isTable: false })} onChange={(e) => handleInputChange('block', e.target.value)} onKeyDown={handleKeyDown}/>
            </p>
            <p className="ml-10">
              जिला: &nbsp;
              <input className="outline-none w-40 border-b border-dotted border-black px-1" placeholder="जिला लिखें" value={formData.district} onFocus={() => setCurrentField({ field: 'district', isTable: false })} onChange={(e) => handleInputChange('district', e.target.value)} onKeyDown={handleKeyDown}/>
            </p>
          </div>

          <div className="font-bold  underline mb-2">
            विषय: जमाबन्दी के रद्दकरन हेतु याचिका  
          </div>

          <div className="leading-relaxed text-black">
            <p>महाशय,</p>
            <p className="indent-12 mt-2 leading-6">
              संविनय निवेदन है कि मैं 
              <input 
                className="border-b border-dotted border-black outline-none w-52 text-center font-bold bg-transparent mx-1" 
                placeholder="नाम लिखें" 
                value={formData.userName} 
                onFocus={() => setCurrentField({ field: 'userName', isTable: false })} 
                onChange={(e) => handleInputChange('userName', e.target.value)} 
                onKeyDown={handleKeyDown}
              /> 
              <span className="print:hidden">
                <select
                  className="outline-none bg-gray-50 border border-gray-300 rounded px-1"
                  value={formData.relationType}
                  onChange={(e) => setFormData({ ...formData, relationType: e.target.value })}
                >
                  <option value="पिता">पिता</option>
                  <option value="पति">पति</option>
                </select>
              </span>
              <span className="hidden print:inline mx-1">{formData.relationType}</span>
              <input 
                className="border-b border-dotted border-black outline-none w-52 text-center font-bold bg-transparent " 
                placeholder="पिता/पति का नाम" 
                value={formData.fatherName} 
                onFocus={() => setCurrentField({ field: 'fatherName', isTable: false })} 
                onChange={(e) => handleInputChange('fatherName', e.target.value)} 
                onKeyDown={handleKeyDown}
              /> 
              ग्राम 
              <input 
                className="border-b border-dotted border-black outline-none w-40 text-center font-bold bg-transparent " 
                placeholder="ग्राम" 
                value={formData.village} 
                onFocus={() => setCurrentField({ field: 'village', isTable: false })} 
                onChange={(e) => handleInputChange('village', e.target.value)} 
                onKeyDown={handleKeyDown}
              /> 
              थाना 
              <input 
                className="border-b border-dotted border-black outline-none w-36 text-center font-bold bg-transparent mx-1" 
                placeholder="थाना" 
                value={formData.thana} 
                onFocus={() => setCurrentField({ field: 'thana', isTable: false })} 
                onChange={(e) => handleInputChange('thana', e.target.value)} 
                onKeyDown={handleKeyDown}
              /> 
              अंचल 
              <input 
                className="border-b border-dotted border-black outline-none w-36 text-center font-bold bg-transparent mx-1" 
                placeholder="अंचल" 
                value={formData.anchala} 
                onFocus={() => setCurrentField({ field: 'anchala', isTable: false })} 
                onChange={(e) => handleInputChange('anchala', e.target.value)} 
                onKeyDown={handleKeyDown}
              /> 
              <br />जिला 
              <input 
                className="border-b border-dotted border-black outline-none w-36 text-center font-bold bg-transparent mx-1" 
                placeholder="जिला" 
                value={formData.district} 
                onFocus={() => setCurrentField({ field: 'district', isTable: false })} 
                onChange={(e) => handleInputChange('district', e.target.value)} 
                onKeyDown={handleKeyDown}
              /> 
              का स्थाई निवासी हूँ। निम्नलिखित भूमि में मेरा हित है, परन्तु गलत रूप से इसकी जमाबन्दी 
              <input 
                className="border-b border-dotted border-black outline-none w-52 text-center font-bold bg-transparent mx-1" 
                placeholder="जमाबन्दी किसके नाम है" 
                value={formData.wrongJamabandiName} 
                onFocus={() => setCurrentField({ field: 'wrongJamabandiName', isTable: false })} 
                onChange={(e) => handleInputChange('wrongJamabandiName', e.target.value)} 
                onKeyDown={handleKeyDown}
              />
              नाम पे० / जौजे 
              <input 
                className="border-b border-dotted border-black outline-none w-52 text-center font-bold bg-transparent mx-1" 
                placeholder="पिता/पति का नाम" 
                value={formData.wrongJamabandiFather} 
                onFocus={() => setCurrentField({ field: 'wrongJamabandiFather', isTable: false })} 
                onChange={(e) => handleInputChange('wrongJamabandiFather', e.target.value)} 
                onKeyDown={handleKeyDown}
              />
              से खोल दी गई है।
            </p>

            <table className="w-full border-collapse border border-black mt-6 text-[11px] text-center">
              <thead>
                <tr>
                  <th className="border border-black p-1" rowSpan="2">क्रम संख्या</th>
                  <th className="border border-black p-1" rowSpan="2">अंचल का नाम</th>
                  <th className="border border-black p-1" rowSpan="2">राजस्व/ग्राम थाना संख्या</th>
                  <th className="border border-black p-1" rowSpan="2">जमाबन्दी संख्या</th>
                  <th className="border border-black p-1" rowSpan="2">जमाबन्दी रैयत का नाम एवं पता</th>
                  <th className="border border-black p-1" colSpan="4">भूमि के ब्यौरे</th>
                </tr>
                <tr>
                  <th className="border border-black p-1">खाता</th>
                  <th className="border border-black p-1">खेसरा</th>
                  <th className="border border-black p-1">रकबा</th>
                  <th className="border border-black p-1">चौहद्दी</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1">1</td>
                  <td className="border border-black p-1"><textarea className="w-full text-center outline-none bg-transparent resize-none text-[10px]" value={formData.tableData.anchal}  rows="2" placeholder="अंचल का नाम " onFocus={() => setCurrentField({ field: 'anchal', isTable: true })} onChange={(e) => handleInputChange('anchal', e.target.value, true)} onKeyDown={handleKeyDown}/></td>
                  <td className="border border-black p-1"><textarea className="w-full text-center outline-none bg-transparent resize-none text-[10px]" value={formData.tableData.revenueThana} rows="3" placeholder="राजस्व/ग्राम थाना संख्या" onFocus={() => setCurrentField({ field: 'revenueThana', isTable: true })} onChange={(e) => handleInputChange('revenueThana', e.target.value, true)} onKeyDown={handleKeyDown}/></td>
                  <td className="border border-black p-1"><input className="w-full text-center outline-none bg-transparent" value={formData.tableData.jamabandiNo} placeholder="जमाबन्दी संख्या" onFocus={() => setCurrentField({ field: 'jamabandiNo', isTable: true })} onChange={(e) => handleInputChange('jamabandiNo', e.target.value, true)}/></td>
                  <td className="border border-black p-1"><textarea className="w-full text-center outline-none bg-transparent resize-none text-[10px]" rows="3"placeholder="जमाबन्दी रैयत का नाम एवं पता " value={formData.tableData.ryotDetails} onFocus={() => setCurrentField({ field: 'ryotDetails', isTable: true })} onChange={(e) => handleInputChange('ryotDetails', e.target.value, true)} onKeyDown={handleKeyDown}/></td>
                  <td className="border border-black p-1"><input className="w-full text-center outline-none bg-transparent" value={formData.tableData.khata} placeholder="खाता" onChange={(e) => handleInputChange('khata', e.target.value, true)}/></td>
                  <td className="border border-black p-1"><input className="w-full text-center outline-none bg-transparent" value={formData.tableData.khesra} placeholder="खेसरा" onChange={(e) => handleInputChange('khesra', e.target.value, true)}/></td>
                  <td className="border border-black p-1"><input className="w-full text-center outline-none bg-transparent" value={formData.tableData.rakba} placeholder="रकवा " onChange={(e) => handleInputChange('rakba', e.target.value, true)}/></td>
                  <td className="border border-black p-0">
                    <div className="flex flex-col text-[12px]">
                      {['north', 'south', 'east', 'west'].map((dir, idx) => {
                        const labels = { north: 'ऊ०-', south: 'द०-', east: 'पु०-', west: 'प०-' };
                        return (
                          <div key={dir} className={`flex items-center px-1 h-5 ${idx < 3 ? 'border-b border-black/10' : ''}`}>
                            <span className="text-[11px] font-bold text-gray-700 w-5">{labels[dir]}</span>
                            <input 
                              className="flex-1 outline-none bg-transparent"
                              placeholder="चौहद्दी लीखे"
                              value={formData.tableData[dir]}
                              onFocus={() => setCurrentField({ field: dir, isTable: true })}
                              onChange={(e) => handleInputChange(dir, e.target.value, true)}
                              onKeyDown={handleKeyDown}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-2">उपयोक्त भूमि में अपना हित दर्शानेवाले दस्तावेजों की छाया प्रति उसके साथ संलग्न कर रहा/रही हूँ| </p>
            <p className="mt-2 font-bold underline">संलग्न साक्ष्य:</p>

            <div className="mt-2 space-y-2 print:hidden">
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
            
            <ul className="hidden print:block list-disc ml-10 mt-3 space-y-1">
              {formData.evidences.length > 0 ? (
                formData.evidences.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>कोई साक्ष्य संलग्न नहीं किया गया है।</li>
              )}
            </ul>
            <p className="mt-4">अनुरोध:</p>
            <p className="indent-12 font-bold">
              अतः श्रीमान से करबद्ध प्रार्थना है कि उक्त भूमि की जमाबंदी रद की जाए |</p>
          </div>
            
          <div className="mt-6 flex justify-end">
            <div className="space-y-2">
              <p className="font-bold text-lg">विश्वासभाजन,</p>
              
              <p className="mb-6">(हस्ताक्षर)</p>
              <p className="flex items-center gap-2">
                नाम: <input className=" outline-none w-56 font-bold bg-transparent" placeholder="नाम लिखें" value={formData.userName} onFocus={() => setCurrentField({ field: 'userName', isTable: false })} onChange={(e) => handleInputChange('userName', e.target.value)} onKeyDown={handleKeyDown}/>
              </p>
              <p className="flex items-center gap-2">
                मोबाइल न०: <input className=" outline-none w-32 font-bold bg-transparent" placeholder="मोबाइल नंबर" value={formData.mobile} onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setFormData({...formData, mobile: value});
                }}/>
              </p> 
              <p className="flex items-center gap-2">
                आधार न०: <input className=" outline-none w-44 font-bold bg-transparent" placeholder="आधार नंबर" value={formData.aadhar} onChange={(e) => {
                  const formatted = formatAadhaar(e.target.value);
                  setFormData({ ...formData, aadhar: formatted });
                }} />
              </p>
              <p>दिनांक: {formData.date}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl flex justify-center mt-6 print-hidden">
        <button 
          onClick={handlePaidPrint}
          className="flex flex-col items-center justify-center gap-1 px-10 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-xl hover:scale-105 transition-all font-bold"
        >
          <div className="flex items-center gap-3">
            <Printer size={22} />
            <span>Print Objection Letter ₹3</span>
          </div>
        </button>
      </div>
    </div>
  );
}