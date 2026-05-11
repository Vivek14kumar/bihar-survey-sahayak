"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

// Added isGenerating and onGenerate props for internal wallet usage
export default function ObjectionLetter({ isGenerating, onGenerate }) {
  const [currentField, setCurrentField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const [showWatermark, setShowWatermark] = useState(true);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const documentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: documentRef, 
    documentTitle: 'Parimarjan_Affidavit',
    onAfterPrint: () => setShowWatermark(true),
  });

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleSecurityKeyDown = (e) => {
      if (
        (e.ctrlKey && ["c", "u", "s", "a", "p"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")
      ) {
        e.preventDefault();
      }
    };
    const handleCopy = (e) => e.preventDefault();

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

  const [formData, setFormData] = useState({
    campNo: "", block: "", district: "", khataNo: "", khesraNo: "",
    userName: "", fatherName: "", relationType: "पिता", village: "", thana: "",
    objectionType: "रकवा (Area) की त्रुटि", mobile: "", aadhar: "",
    date: "", evidences: []
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
      { key: "aadhar", label: "आधार नंबर"},
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
        setScale(window.innerWidth / 950);
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
        return { ...prev, evidences: prev.evidences.filter((item) => item !== value) };
      } else {
        return { ...prev, evidences: [...prev.evidences, value] };
      }
    });
  };

  const validateEvidences = () => {
    if (formData.evidences.length === 0) {
      alert("कृपया कम से कम एक संलग्न साक्ष्य चुनें।");
      return false;
    }
    return true;
  };

  const handlePaidPrint = async () => {
    if (!validateForm()) return;
    if (!validateEvidences()) return;

    const firstConfirm = window.confirm(
      "कृपया आगे बढ़ने से पहले फॉर्म को ध्यान से देख लें।\n\nक्या आपने सभी जानकारी सही से भर दी है?"
    );
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(
      "मैंने फॉर्म को ध्यान से देख लिया है।\n\nयदि कोई जानकारी गलत है तो उसकी पूरी जिम्मेदारी मेरी होगी।\n\nक्या आप आगे बढ़ना चाहते हैं?"
    );
    if (!secondConfirm) return;

    
    try {
      const isSuccess = await onGenerate();
      if (isSuccess) {
        setShowWatermark(false); 
        setTimeout(async () => {
          handlePrint();
          await fetch("/api/objection-letter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "objection_letter" }),
          });
        }, 500);
      }
    } catch (err) {
      console.error(err);
      alert("सर्वर से संपर्क करने में त्रुटि। कृपया पुनः प्रयास करें।");
    }
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

  const formatAadhaar = (value) => {
    return value.replace(/\D/g, "").slice(0, 12).replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 no-print-bg overflow-x-hidden font-hindi">
      <style>{`
            @media print {
              @page { 
                size: A4 portrait; 
                margin: 10mm; /* Reduced to ensure single page fit */
              }
              body { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
              }
              /* Hide the suggestion box entirely */
              .suggestion-dropdown { display: none !important; }
            }
          `}</style>

      {/* Letter Document */}
      <div 
        className="origin-top transition-transform duration-300 shadow-2xl print:shadow-none print:transform-none"
        style={{ transform: `scale(${scale})` }}
      >
        <div ref={documentRef} className="max-w-4xl w-[210mm] mx-auto p-12 sm:p-16 bg-white border border-gray-300 relative min-h-[297mm] print:min-h-0 print:border-none print:p-0 text-gray-900 text-[1.05rem] print:text-[15px]">
          
          {/* Watermark */}
          {showWatermark && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-10 print:opacity-10">
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

          {/* Document Header Section */}
          <div className="space-y-2 mb-8 print:mb-5 leading-relaxed">
            <p>सेवा में,</p>
            <p className="ml-10 font-bold">सहायक बंदोबस्त पदाधिकारी / शिविर प्रभारी (A.S.O.),</p>
            <p className="ml-10 flex flex-wrap items-center gap-1">
              <span>शिविर संख्या:</span>
              <input className="print:hidden outline-none w-20 border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50 px-1 text-center" placeholder="00" value={formData.campNo} onChange={(e) => setFormData({...formData, campNo: e.target.value})} />
              <span className="hidden print:inline font-bold px-1">{formData.campNo}</span>
            </p>
            <p className="ml-10 flex flex-wrap items-center gap-1">
              <span>प्रखंड:</span>
              <input className="print:hidden outline-none w-40 border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50 px-1" placeholder="प्रखंड लिखें" value={formData.block} onFocus={() => setCurrentField('block')} onChange={(e) => handleInputChange('block', e.target.value)} onKeyDown={handleKeyDown}/>
              <span className="hidden print:inline font-bold px-1">{formData.block}</span>
            </p>
            <p className="ml-10 flex flex-wrap items-center gap-1">
              <span>जिला:</span>
              <input className="print:hidden outline-none w-40 border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50 px-1" placeholder="जिला लिखें" value={formData.district} onFocus={() => setCurrentField('district')} onChange={(e) => handleInputChange('district', e.target.value)} onKeyDown={handleKeyDown}/>
              <span className="hidden print:inline font-bold px-1">{formData.district}</span>
            </p>
          </div>

          {/* Subject Block */}
          <div className="font-bold leading-snug text-justify mb-6 print:mb-4">
            विषय: भू-सर्वेक्षण के दौरान खाता संख्या{" "}
            <input 
              className="print:hidden outline-none w-16 text-center border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50"
              placeholder="खाता"
              value={formData.khataNo}
              onChange={(e) => setFormData({...formData, khataNo: e.target.value.replace(/[^0-9]/g, "")})}
            /> 
            <span className="hidden print:inline px-1 underline underline-offset-[4px] decoration-1">{formData.khataNo}</span>
            {" "}एवं खेसरा संख्या{" "}
            <input 
              className="print:hidden outline-none w-16 text-center border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50"
              placeholder="खेसरा"
              value={formData.khesraNo}
              onChange={(e) => setFormData({...formData, khesraNo: e.target.value.replace(/[^0-9]/g, "")})}
            /> 
            <span className="hidden print:inline px-1 underline underline-offset-[4px] decoration-1">{formData.khesraNo}</span>
            {" "}में हुई{" "}
            <span className="print:hidden">
              <select 
                className="bg-transparent font-bold outline-none text-center mb-2 border-b border-dashed border-gray-400 focus:border-blue-500 mx-1"
                value={formData.objectionType}
                onChange={(e) => setFormData({...formData, objectionType: e.target.value})}
              >
                <option>रकवा (Area) की त्रुटि</option>
                <option>नाम/उत्तराधिकारी की त्रुटि</option>
                <option>सीमांकन (Boundary) विवाद</option>
                <option>स्वामित्व (रैयती/सरकारी) विवाद</option>
              </select>
            </span>
            <span className="hidden print:inline px-1 underline underline-offset-[4px] decoration-1">
              {formData.objectionType}
            </span>
            {" "}के सुधार हेतु आपत्ति पत्र।
          </div>

          {/* Main Content Paragraph */}
          <div className="leading-loose print:leading-relaxed text-justify">
            <p>महाशय,</p>
            <p className="indent-12 mt-2">
              संविनय निवेदन है कि मैं{" "}
              <input className="print:hidden outline-none w-48 text-center font-bold border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50" placeholder="नाम लिखें" value={formData.userName} onFocus={() => setCurrentField('userName')} onChange={(e) => handleInputChange('userName', e.target.value)} onKeyDown={handleKeyDown}/> 
              <span className="hidden print:inline font-bold px-1 underline underline-offset-[6px] decoration-1">{formData.userName}</span>
              {" "}
              <span className="print:hidden">
                <select
                  className="outline-none bg-transparent border-b border-dashed border-gray-400 focus:border-blue-500 mx-1 font-bold"
                  value={formData.relationType}
                  onChange={(e) => setFormData({ ...formData, relationType: e.target.value })}
                >
                  <option value="पिता">पिता</option>
                  <option value="पति">पति</option>
                </select>
              </span>
              <span className="hidden print:inline font-bold px-1">
                {formData.relationType}
              </span>
              {" "}
              <input className="print:hidden outline-none w-48 text-center font-bold border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50" placeholder="पिता का नाम" value={formData.fatherName} onFocus={() => setCurrentField('fatherName')} onChange={(e) => handleInputChange('fatherName', e.target.value)} onKeyDown={handleKeyDown}/> 
              <span className="hidden print:inline font-bold px-1 underline underline-offset-[6px] decoration-1">{formData.fatherName}</span>
              {" "}ग्राम{" "}
              <input className="print:hidden outline-none w-36 text-center font-bold border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50" placeholder="ग्राम" value={formData.village} onFocus={() => setCurrentField('village')} onChange={(e) => handleInputChange('village', e.target.value)} onKeyDown={handleKeyDown}/> 
              <span className="hidden print:inline font-bold px-1 underline underline-offset-[6px] decoration-1">{formData.village}</span>
              {" "}थाना{" "}
              <input className="print:hidden outline-none w-32 text-center font-bold border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50" placeholder="थाना" value={formData.thana} onFocus={() => setCurrentField('thana')} onChange={(e) => handleInputChange('thana', e.target.value)} onKeyDown={handleKeyDown}/> 
              <span className="hidden print:inline font-bold px-1 underline underline-offset-[6px] decoration-1">{formData.thana}</span>
              {" "}का स्थाई निवासी हूँ।
            </p>
            <p className="mt-4 print:mt-3 indent-12">
              बिहार विशेष सर्वेक्षण के दौरान आपके कार्यालय द्वारा निर्गत किए गए ड्राफ्ट रिकॉर्ड (खानापूरी पर्चा/खेवट) का मैंने अवलोकन किया। अवलोकन के पश्चात, मुझे निम्नलिखित त्रुटि/विसंगति प्राप्त हुई है, जिसके सुधार हेतु मैं यह आपत्ति दर्ज कर रहा हूँ:
            </p>
            
            <div className="mt-4 print:mt-3 ml-6">
              <span className="font-bold">आपत्ति का प्रकार: {formData.objectionType} </span>
            </div>

            <p className="mt-6 print:mt-4 font-bold underline underline-offset-4">संलग्न साक्ष्य:</p>

            {/* SCREEN VIEW */}
            <div className="mt-3 space-y-2 print:hidden ml-4">
              {[
                "पंजी-2 (Jamabandi/LPC) एवं रसीद की छायाप्रति।",
                "वंशावली (Vanshavali) एवं आधार कार्ड।",
                "पुराना खतियान / केवाला की कॉपी।",
              ].map((item, index) => (
                <label key={index} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 cursor-pointer"
                    checked={formData.evidences.includes(item)}
                    onChange={() => handleEvidenceChange(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
            
            {/* PRINT VIEW */}
            <ul className="hidden print:block list-disc ml-12 mt-2 space-y-1">
              {formData.evidences.length > 0 ? (
                formData.evidences.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>कोई साक्ष्य संलग्न नहीं किया गया है।</li>
              )}
            </ul>

            <p className="mt-6 print:mt-4 font-bold">अनुरोध:</p>
            <p className="indent-12 mt-1">
              अतः श्रीमान से करबद्ध प्रार्थना है कि उक्त भूमि का पुनः भौतिक सत्यापन (Spot Verification) कराया जाए और संलग्न दस्तावेजों के आधार पर रिकॉर्ड में सुधार करने की कृपा की जाए, ताकि भविष्य में किसी भी प्रकार के कानूनी विवाद से बचा जा सके।
            </p>
          </div>
            
          {/* Signatures */}
          <div className="mt-10 print:mt-6 flex justify-end">
            <div className="space-y-3 print:space-y-2 min-w-[250px]">
              <p className="font-bold text-lg print:text-base">विश्वासभाजन,</p>
              <p className="mb-6 print:mb-4 pt-4 text-gray-500">(हस्ताक्षर)</p>
              
              <p className="flex items-center gap-2">
                <span>नाम:</span>
                <input className="print:hidden outline-none w-full font-bold border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50 px-1" placeholder="नाम लिखें" value={formData.userName} onFocus={() => setCurrentField('userName')} onChange={(e) => handleInputChange('userName', e.target.value)} onKeyDown={handleKeyDown}/>
                <span className="hidden print:inline font-bold px-1">{formData.userName}</span>
              </p>
              
              <p className="flex items-center gap-2">
                <span>मोबाइल न०:</span>
                <input className="print:hidden outline-none w-full font-bold border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50 px-1 tracking-wide" placeholder="मोबाइल नंबर" value={formData.mobile} onFocus={() => setCurrentField('mobile')} onChange={(e) => {
                  setFormData({...formData, mobile: e.target.value.replace(/\D/g, "").slice(0, 10)});
                }}/>
                <span className="hidden print:inline font-bold tracking-wide px-1">{formData.mobile}</span>
              </p> 
              
              <p className="flex items-center gap-2">
                <span>आधार न०:</span>
                <input className="print:hidden outline-none w-full font-bold border-b border-dashed border-gray-400 focus:border-blue-500 bg-gray-50 px-1 tracking-wide" placeholder="आधार नंबर" value={formData.aadhar} onFocus={() => setCurrentField('aadhar')} onChange={(e) => {
                  setFormData({ ...formData, aadhar: formatAadhaar(e.target.value) });
                }} />
                <span className="hidden print:inline font-bold tracking-wide px-1">{formData.aadhar}</span>
              </p>
              
              <p className="pt-2 print:pt-1">दिनांक: {formData.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full max-w-4xl flex justify-center mt-6 print-hidden">
        <button 
          onClick={handlePaidPrint}
          disabled={isGenerating}
          className="flex flex-col items-center justify-center gap-1 px-10 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-xl hover:scale-105 transition-all font-bold disabled:opacity-70 disabled:hover:scale-100"
        >
          <div className="flex items-center gap-3">
            <Printer size={22} />
            <span>{isGenerating ? 'लोड हो रहा है...' : 'प्रिंट करें'}</span>
          </div>
        </button>
      </div>
    </div>
  );
}