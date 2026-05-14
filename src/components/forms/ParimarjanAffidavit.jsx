"use client";

import React, { useState, useEffect, useRef } from "react";
import { Printer, Download, Crown, Loader2 } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export default function ParimarjanAffidavit({ isGenerating, onGenerate }) {
  const [currentField, setCurrentField] = useState(null); 
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scale, setScale] = useState(1);

  const [showWatermark, setShowWatermark] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const debounceRef = useRef(null);
  const cacheRef = useRef({});
  const documentRef = useRef(null);
  const observerRef = useRef(null);

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

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && ["c", "u", "s", "a", "p"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")
      ) {
        e.preventDefault();
      }
    };
    const handleCopy = (e) => e.preventDefault();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

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

  useEffect(() => {
    if (!showWatermark) {
      if (observerRef.current) observerRef.current.disconnect();
      return;
    }

    const observer = new MutationObserver((mutations) => {
      if (!showWatermark) return; 
      for (const mutation of mutations) {
        const isRemoval = mutation.type === 'childList' && 
                          Array.from(mutation.removedNodes).some(node => node.id === 'watermark-layer');
        const isStyleChange = mutation.type === 'attributes' && 
                              mutation.target.id === 'watermark-layer';

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

  const handlePrint = useReactToPrint({
    contentRef: documentRef, 
    documentTitle: 'Parimarjan_Affidavit',
    onAfterPrint: () => setShowWatermark(true),
  });

  const downloadPDF = async (isPremium = false) => {
    setIsDownloading(true);
    const element = documentRef.current;
    
    const originalTransform = element.style.transform;
    element.style.transform = 'scale(1)';

    if (isPremium) {
      setShowWatermark(false);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }

    setTimeout(async () => {
      try {
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default ? html2pdfModule.default : html2pdfModule;
        
        const opt = {
          margin: [10, 10, 10, 10], 
          filename: isPremium ? 'Premium_Parimarjan_Affidavit.pdf' : 'Free_Parimarjan_Affidavit.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error("PDF Error:", error);
        alert("PDF जनरेट करने में समस्या।");
      } finally {
        element.style.transform = originalTransform;
        setShowWatermark(true);
        setIsDownloading(false);
      }
    }, 500);
  };

  const handleSecureAction = async (actionType) => {
    if (!validateForm()) return;

    const confirmReview = window.confirm("कृपया आगे बढ़ने से पहले फॉर्म को ध्यान से देख लें।\n\nक्या आपने सभी जानकारी सही से भर दी है?");
    if (!confirmReview) return;

    try {
      if (onGenerate) await onGenerate(actionType); 

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      setShowWatermark(false);

      setTimeout(() => {
        if (actionType === 'print') handlePrint();
        if (actionType === 'download') downloadPDF(true);
      }, 800);

    } catch (err) {
      console.error("Wallet Error:", err);
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center  overflow-x-hidden print:bg-white print:p-0">
      
      {/* Wrapper */}
      <div 
        className="origin-top transition-transform duration-300 ease-in-out shadow-2xl print:shadow-none print:transform-none bg-white print:w-full"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Document Area */}
        <div ref={documentRef} className="max-w-4xl w-[210mm] mx-auto p-12 bg-white border border-gray-300 relative min-h-[297mm] print:w-full print:border-none print:p-0 print:m-0">
          
          {/* IMPORTANT: CSS placed strictly inside the ref guarantees it reaches the react-to-print iframe */}
          <style>{`
            @media print {
              @page { 
                size: A4 portrait; 
                margin: 10mm; /* Printer handles margins; container should be 100% wide */
              }
              body { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
              }
              /* Hide placeholders during print */
              input::placeholder { color: transparent !important; }
              /* Force inputs to retain border visibility if needed */
              input { border-bottom-color: #000 !important; }
              /* Hide the suggestion box entirely */
              .suggestion-dropdown { display: none !important; }
            }
          `}</style>

          {showWatermark && (
            <div id="watermark-layer" className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-16 w-full h-full place-items-center rotate-[-30deg]">
                {Array.from({ length: 60 }).map((_, i) => (
                  <span key={i} className="text-3xl font-extrabold text-gray-500 whitespace-nowrap">
                    BIHAR SURVEY SAHAYAK
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Suggestion Dropdown */}
          {suggestions.length > 0 && currentField && (
            <div className="suggestion-dropdown fixed bg-white border-2 border-blue-600 rounded shadow-2xl z-[9999] min-w-[150px] top-[20%] left-1/2 -translate-x-1/2 print:hidden">
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => selectSuggestion(s)}
                  className={`px-4 py-2 cursor-pointer border-b last:border-0 ${i === activeIndex ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`}>
                  {s}
                </div>
              ))}
            </div>
          )}

          {/* Form Content - Z-index elevated above watermark */}
          <div className="relative z-10 text-center mb-16">
            <h1 className="text-2xl font-bold underline mb-2">स्व-अभिप्रमाणित शपथ पत्र</h1>
          </div>

          <div className="relative z-10 text-black">
            <p className="indent-10 text-justify px-8 leading-loose print:px-2">
              मैं <input 
                className="border-b border-dotted border-black outline-none w-64 text-center bg-transparent px-1 font-bold placeholder:text-sm print:max-w-fit"
                value={formData.name}
                onFocus={() => setCurrentField('name')}
                onChange={(e) => handleInputChange('name', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="नाम लिखें"
              />  
              पिता/पति <input 
                className="border-b border-dotted border-black outline-none w-64 text-center bg-transparent px-1 font-bold placeholder:text-sm print:max-w-fit"
                value={formData.fatherName}
                onFocus={() => setCurrentField('fatherName')}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="पिता/पति का नाम"
              />

              मौजा- <input 
                className="border-b border-dotted border-black outline-none w-55 text-center bg-transparent px-1 font-bold placeholder:text-sm print:max-w-fit"
                value={formData.mauja}
                onFocus={() => setCurrentField('mauja')}
                onChange={(e) => handleInputChange('mauja', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="मौजा का नाम"
              />
              थाना नं०- <input 
                className="border-b border-dotted border-black outline-none w-24 text-center bg-transparent px-1 font-bold placeholder:text-sm print:max-w-fit"
                value={formData.thanaNo}
                type="number"
                onChange={(e) => setFormData({...formData, thanaNo: e.target.value})}
                placeholder="थाना नं०"
              />  
              हल्का- <input 
                className="border-b border-dotted border-black outline-none w-40 text-center bg-transparent px-1 font-bold placeholder:text-sm print:max-w-fit"
                value={formData.halka}
                type="number"
                onFocus={() => setCurrentField('halka')}
                onChange={(e) => setFormData({...formData,halka: e.target.value})}
                onKeyDown={handleKeyDown}
                placeholder="हल्का नं०"
              /> 
              <br />
            
              अंचल- <input 
                className="border-b border-dotted border-black outline-none w-40 text-center bg-transparent px-1 font-bold placeholder:text-sm print:max-w-fit"
                value={formData.anchal}
                onFocus={() => setCurrentField('anchal')}
                onChange={(e) => handleInputChange('anchal', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="अंचल लिखें"
              /> 
              जिला- <input 
                className="border-b border-dotted border-black outline-none w-40 text-center bg-transparent px-1 font-bold placeholder:text-sm print:max-w-fit"
                value={formData.district}
                onFocus={() => setCurrentField('district')}
                onChange={(e) => handleInputChange('district', e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="जिला लिखें"
              /> 
              का निवासी हूँ। राजस्व एवं भूमि सुधार विभाग द्वारा डिजिटाईज्ड कर ऑनलाइन उपलब्ध कराए गए मेरी जमाबंदी जिला 
              <input className="border-b border-dotted border-black outline-none w-32 text-center font-bold bg-transparent placeholder:text-sm print:max-w-fit" placeholder="जिला लिखें" value={formData.regDistrict} onFocus={() => setCurrentField('regDistrict')} onChange={(e) => handleInputChange('regDistrict', e.target.value)} onKeyDown={handleKeyDown} />
              <br /> अंचल <input className="border-b border-dotted border-black outline-none w-34 text-center font-bold bg-transparent placeholder:text-sm print:max-w-fit" placeholder="अंचल लिखें " value={formData.regAnchal} onFocus={() => setCurrentField('regAnchal')} onChange={(e) => handleInputChange('regAnchal', e.target.value)} onKeyDown={handleKeyDown} />
              हल्का <input className="border-b border-dotted border-black outline-none w-14 text-center font-bold bg-transparent placeholder:text-sm print:max-w-fit" placeholder="हल्का न० " type="number" value={formData.regHalka} onFocus={() => setCurrentField('regHalka')} onChange={(e) => setFormData({...formData, regHalka: e.target.value})} />
              मौजा <input className="border-b border-dotted border-black outline-none w-42 text-center font-bold bg-transparent placeholder:text-sm print:max-w-fit" placeholder="मौजा " value={formData.regMauja} onFocus={() => setCurrentField('regMauja')} onChange={(e) => handleInputChange('regMauja', e.target.value)} onKeyDown={handleKeyDown} />
              थाना न० <input className="border-b border-dotted border-black outline-none w-24 text-center font-bold bg-transparent placeholder:text-sm print:max-w-fit" placeholder="थाना न० " value={formData.regThana} onChange={(e) => setFormData({...formData, regThana: e.target.value})} />
              में कुछ अशुद्धियाँ भॉल्यूम संख्या <input className="border-b border-dotted border-black outline-none w-20 text-center bg-transparent font-bold placeholder:text-sm print:max-w-fit" placeholder="लिखें" value={formData.volumeNo} onChange={(e) => setFormData({...formData, volumeNo: e.target.value})} />
              पृष्ठ संख्या <input className="border-b border-dotted border-black outline-none w-20 text-center font-bold bg-transparent placeholder:text-sm print:max-w-fit" placeholder="लिखें " value={formData.pageNo} onChange={(e) => setFormData({...formData, pageNo: e.target.value})} />
              जमाबंदी न० <input className="border-b border-dotted border-black outline-none w-32 text-center font-bold bg-transparent placeholder:text-sm print:max-w-fit" placeholder="लिखे " value={formData.jamabandiNo} onChange={(e) => setFormData({...formData, jamabandiNo: e.target.value})} />
              में कुछ अशुद्धियाँ दृष्टिगोचर है जिनमें सुधार हेतु मेरे द्वारा परिमार्जनप्लस के माध्यम से आवेदन किया जा रहा है।
            </p>

            <div className="pt-6">
              <p className="mb-6 indent-16 px-8 leading-loose print:px-2">
                शपथ पूर्वक बयान करता हूँ कि मेरे द्वारा परिमार्जनप्लस के माध्यम से जमाबंदी ऑनलाइन
                करने हेतु दी गई विवरणी सही है तथा उक्त जमीन पर मेरा स्वामित्व है।
              </p>
              <p className='font-bold text-lg pl-4 px-8 indent-16 leading-loose print:px-2'>
                अगर भविष्य में जाँच / सत्यापन / शिकायत के क्रम में प्रमाणित होता है कि मेरे द्वारा
                गलत विवरणी दी गई है तो मेरे ऊपर विधि सम्मत कानूनी कार्रवाई की जा सकती है।
              </p>
            </div>
          </div>

          <div className="mt-24 flex flex-col items-end px-10 relative z-10 print:px-2">
            <div className="text-left space-y-4 w-90">
              <p className="flex items-center">
                <span className="font-bold w-40">शपथ कर्त्ता का नाम :-</span> 
                <input 
                  className="border-b border-black outline-none flex-1 bg-transparent font-bold text-center" 
                  value={formData.footerName}
                  placeholder="नाम लिखें"
                  onFocus={() => setCurrentField('footerName')}
                  onChange={(e) => handleInputChange('footerName', e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </p>
              <p className="flex items-center">
                <span className="font-bold w-40">मोबाईल नं०:-</span> 
                <input 
                  className="border-b border-black outline-none flex-1 bg-transparent font-bold text-center" 
                  placeholder="मोबाईल नं० लिखें"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                />
              </p>
              <div className="mt-4">
                <p className="font-bold text-lg">हस्ताक्षर :-</p>
              </div>
            </div>
          </div>
        </div>
        {/* --- BUTTONS SECTION --- */}
      <div className="w-full max-w-4xl flex justify-center p-4 print-hidden">
        
          
            <button 
              onClick={() => handleSecureAction('print')} 
              disabled={isDownloading || isGenerating}
              className="flex  items-center justify-center gap-1 px-10 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl shadow-xl hover:scale-105 transition-all font-bold disabled:opacity-70 disabled:hover:scale-100"
            >
              {(isDownloading || isGenerating) ? <Loader2 size={20} className="animate-spin" /> : <Printer size={20} />}
              <span>{(isDownloading || isGenerating) ? 'Loading...' : 'Print'}</span>
            </button>
          
        
      </div>
      </div>
    </div>
  );
}