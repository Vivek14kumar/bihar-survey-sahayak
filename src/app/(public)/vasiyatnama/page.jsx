"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download, Crown, RotateCcw } from "lucide-react";

// ⚡ हिंदी डेट कन्वर्टर
const getFormattedHindiDate = (dateString) => {
  if (!dateString) return '';
  const months = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
};

const formatRakbaDisplay = (acre, decimal) => {
  const a = parseFloat(acre) || 0;
  const d = parseFloat(decimal) || 0;
  let res = [];
  if (a > 0) res.push(`${a} एकड़`);
  if (d > 0) res.push(`${d} डिसमिल`);
  return res.length > 0 ? res.join(' ') : '......';
};

const calculateTotalRakba = (plots) => {
  let totalD = 0;
  plots.forEach(plot => {
    const a = parseFloat(plot.rakbaAcre) || 0;
    const d = parseFloat(plot.rakbaDecimal) || 0;
    totalD += (a * 100) + d;
  });
  if (totalD === 0) return '......';
  
  const finalAcre = Math.floor(totalD / 100);
  const finalDecimal = +(totalD % 100).toFixed(3);
  return formatRakbaDisplay(finalAcre, finalDecimal);
};

// --- Auto Hindi Input Component (Same as before) ---
const HindiInput = ({ label, name, value, onChange, placeholder, isTextarea = false, type = "text", required = false, errorMsg = "", helpText = "", disabled = false, disableHindi = false }) => {
  const [localText, setLocalText] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const cacheRef = useRef({});
  const debounceRef = useRef(null);

  useEffect(() => { setLocalText(value || ''); }, [value]);

  const fetchSuggestions = async (word) => {
    if (!word || word.length < 1) return;
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

  const handleInputChange = (e) => {
    if (disabled) return;
    const val = e.target.value;
    setLocalText(val);
    onChange(e);

    if (disableHindi || type === "number" || name === "aadhaar") {
      setSuggestions([]);
      return;
    }

    const words = val.split(" ");
    const lastWord = words[words.length - 1];
    const hasAlphabets = /[a-zA-Z]/.test(lastWord);

    if (lastWord.trim() && hasAlphabets) {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 300);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (selectedWord) => {
    const words = localText.split(" ");
    words[words.length - 1] = selectedWord;
    const finalValue = words.join(" ") + " ";
    setLocalText(finalValue);
    onChange({ target: { name, value: finalValue } });
    setSuggestions([]);
  };

  const handleKeyDown = async (e) => {
    if (disabled || disableHindi || type === "number" || name === "aadhaar") return;

    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        return;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
        return;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectSuggestion(suggestions[activeIndex]);
        return;
      }
    }

    if (e.key === ' ' || e.key === 'Enter') {
      const words = localText.split(' ');
      const lastWord = words[words.length - 1];
      const hasAlphabets = /[a-zA-Z]/.test(lastWord);

      if (lastWord.trim() !== '' && hasAlphabets) {
        try {
          const res = await fetch(`https://inputtools.google.com/request?text=${lastWord}&itc=hi-t-i0-und&num=1`);
          const data = await res.json();
          if (data[0] === 'SUCCESS') {
            const hindiWord = data[1][0][1][0];
            words[words.length - 1] = hindiWord;
            const newText = words.join(' ') + ' ';
            setLocalText(newText);
            onChange({ target: { name, value: newText } });
            setSuggestions([]);
          }
        } catch (error) {}
      }
    }
  };

  const inputClass = `w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${errorMsg ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${disabled ? 'bg-gray-200 text-gray-600 cursor-not-allowed border-gray-200' : 'bg-white'}`;

  return (
    <div className="mb-4 relative">
      <label className={`block mb-1 text-sm font-bold ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>
        {label} {required && !disabled && <span className="text-red-500">*</span>}
      </label>
      {helpText && <p className="text-[11px] text-gray-500 mb-1 leading-tight">{helpText}</p>}
      
      {isTextarea ? (
        <textarea name={name} value={localText} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={disabled} className={inputClass} rows="2" />
      ) : (
        <input type={type} name={name} value={localText} onChange={handleInputChange} onKeyDown={handleKeyDown} placeholder={placeholder} disabled={disabled} className={inputClass} maxLength={name === "aadhaar" ? 12 : undefined} min={type === "number" ? "0" : undefined} />
      )}
      
      {suggestions.length > 0 && !disabled && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded shadow-xl mt-1 max-h-48 overflow-y-auto left-0">
          {suggestions.map((word, index) => (
            <li key={index} onClick={() => selectSuggestion(word)} className={`p-2 cursor-pointer text-sm border-b last:border-b-0 ${index === activeIndex ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}>
              {word}
            </li>
          ))}
        </ul>
      )}
      {errorMsg && !disabled && <p className="text-xs text-red-600 mt-1 font-semibold flex items-center">⚠️ {errorMsg}</p>}
    </div>
  );
};

// --- Main Vasiyatnama Component ---
export default function VasiyatnamaGenerator() {
  const [isStampPaper, setIsStampPaper] = useState(false); 
  const [isDownloading, setIsDownloading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const documentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const observerRef = useRef(null);

  // 1. Common Data
  const [commonData, setCommonData] = useState({
    date: new Date().toISOString().split('T')[0], 
    healthReason: 'old_age_illness', // 'old_age_illness' or 'healthy_uncertain'
    customConditions: ''
  });

  // 2. Testator (वसीयतकर्ता / लेख्यकारी)
  const [testator, setTestator] = useState({
    name: '', age: '', relation: 'पिता', relativeName: '', caste: '', profession: 'कृषि/गृहस्थी',
    village: '', panchayat: '', thana: '', anchal: '', district: '', pincode: '', mobile: '', aadhaar: ''
  });

  // 3. Beneficiaries (वारिस / लेख्यधारीगण)
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: '', age: '', relation: 'पिता', relativeName: '', caste: '', profession: 'कृषि/गृहस्थी', relationWithTestator: 'पुत्र' }
  ]);

  // 4. Properties (संपत्ति / अनुसूची)
  const initialPlot = { id: Date.now(), jamabandi: '', khata: '', khesra: '', rakbaAcre: '', rakbaDecimal: '', boundaries: { north: '', south: '', east: '', west: '' } };
  const [plots, setPlots] = useState([{ ...initialPlot }]);

  const [applicantMobile, setApplicantMobile] = useState("");
  const [witnessCount, setWitnessCount] = useState(2);

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);

  // Razorpay Loader & Observer
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

  // --- Handlers ---
  const handleCommonChange = (e) => setCommonData({ ...commonData, [e.target.name]: e.target.value });
  
  const handleTestatorChange = (e) => {
    setTestator({ ...testator, [e.target.name]: e.target.value });
    if(errors[`testator_${e.target.name}`]) setErrors({...errors, [`testator_${e.target.name}`]: null});
  };

  const handleBeneficiaryChange = (id, field, value) => {
    setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    if(errors[`beneficiary_${id}_${field}`]) setErrors({...errors, [`beneficiary_${id}_${field}`]: null});
  };
  const addBeneficiary = () => setBeneficiaries([...beneficiaries, { id: Date.now(), name: '', age: '', relation: 'पिता', relativeName: '', caste: testator.caste, profession: 'कृषि/गृहस्थी', relationWithTestator: 'पुत्र' }]);
  const removeBeneficiary = (id) => { if (beneficiaries.length > 1) setBeneficiaries(beneficiaries.filter(b => b.id !== id)); };

  const handlePlotChange = (id, field, e) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, [field]: e.target.value } : p));
    if(errors[`plot_${id}_${field}`]) setErrors({...errors, [`plot_${id}_${field}`]: null});
    if((field === 'rakbaAcre' || field === 'rakbaDecimal') && errors[`plot_${id}_rakba`]) setErrors(errs => ({...errs, [`plot_${id}_rakba`]: null}));
  };
  const handleBoundaryChange = (id, direction, e) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, boundaries: { ...p.boundaries, [direction]: e.target.value } } : p));
  };
  const addPlot = () => setPlots([...plots, { ...initialPlot, id: Date.now() }]);
  const removePlot = (id) => { if (plots.length > 1) setPlots(plots.filter(p => p.id !== id)); };

  // Validation
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!testator.name) { newErrors.testator_name = "नाम ज़रूरी है"; isValid = false; }
    if (!testator.village) { newErrors.testator_village = "गाँव ज़रूरी है"; isValid = false; }

    beneficiaries.forEach((b, idx) => {
      if (!b.name) { newErrors[`beneficiary_${b.id}_name`] = "नाम ज़रूरी है"; isValid = false; }
      if (!b.relationWithTestator) { newErrors[`beneficiary_${b.id}_relationWithTestator`] = "रिश्ता ज़रूरी है"; isValid = false; }
    });

    plots.forEach((p, idx) => {
      if (!p.khata) { newErrors[`plot_${p.id}_khata`] = "खाता भरें"; isValid = false; }
      if (!p.khesra) { newErrors[`plot_${p.id}_khesra`] = "खेसरा भरें"; isValid = false; }
      if (!p.rakbaAcre && !p.rakbaDecimal) { newErrors[`plot_${p.id}_rakba`] = "रकबा भरें"; isValid = false; }
    });

    setErrors(newErrors);
    if (!isValid) {
      alert("ध्यान दें: लाल रंग वाले सभी ज़रूरी बॉक्स भरें।");
      document.getElementById("form-container")?.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return isValid;
  };

  // Local Storage Logic
  useEffect(() => {
    const saved = localStorage.getItem('vasiyatFormData');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.commonData) setCommonData(p.commonData);
        if (p.testator) setTestator(p.testator);
        if (p.beneficiaries) setBeneficiaries(p.beneficiaries);
        if (p.plots) setPlots(p.plots);
        if (p.witnessCount) setWitnessCount(p.witnessCount);
        if (p.isStampPaper !== undefined) setIsStampPaper(p.isStampPaper);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (testator.name !== '' || testator.village !== '') {
      localStorage.setItem('vasiyatFormData', JSON.stringify({ commonData, testator, beneficiaries, plots, witnessCount, isStampPaper }));
    }
  }, [commonData, testator, beneficiaries, plots, witnessCount, isStampPaper]);

  const handleReset = () => {
    if (!window.confirm("क्या आप वाकई फॉर्म का सारा डेटा मिटाना चाहते हैं?")) return;
    localStorage.removeItem('vasiyatFormData');
    setCommonData({ date: new Date().toISOString().split('T')[0], healthReason: 'old_age_illness', customConditions: '' });
    setTestator({ name: '', age: '', relation: 'पिता', relativeName: '', caste: '', profession: 'कृषि/गृहस्थी', village: '', panchayat: '', thana: '', anchal: '', district: '', pincode: '', mobile: '', aadhaar: '' });
    setBeneficiaries([{ id: 1, name: '', age: '', relation: 'पिता', relativeName: '', caste: '', profession: 'कृषि/गृहस्थी', relationWithTestator: 'पुत्र' }]);
    setPlots([{ ...initialPlot, id: Date.now() }]);
    setWitnessCount(2);
    setErrors({});
    document.getElementById("form-container")?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Razorpay & PDF logic (Same as Batwara, just changing endpoints/names)
  const openRazorpay = async (callbackAction) => {
    if (!validateForm()) return;
    if (!applicantMobile) { alert("कृपया मोबाइल नंबर दर्ज करें।"); return; }
    if (!window.Razorpay) { alert("लोड हो रहा है..."); return; }

    try {
      const orderRes = await fetch("/api/create-razorpay-order", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "vasiyatnama" }) 
      });
      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount, 
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Vasiyatnama Premium Print",
        order_id: orderData.id,
        prefill: { name: testator.name || "User", email: "guest@biharsurveysahayak.com", contact: applicantMobile },
        handler: async function (response) {
          if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
          setShowWatermark(false); 
          await fetch("/api/verify-payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(response) });
          setTimeout(() => { callbackAction(); }, 1000); 
        },
        theme: { color: "#1d4ed8" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) { alert("भुगतान प्रारंभ नहीं हो सका।"); }
  };

  const handlePrint = useReactToPrint({
    contentRef: documentRef, documentTitle: 'Vasiyatnama_Document',
    onBeforeGetContent: () => { setIsDownloading(true); return new Promise((resolve) => setTimeout(resolve, 200)); },
    onAfterPrint: () => { setIsDownloading(false); },
  });

  const downloadPDF = async (isPremium = false) => {
    if (!validateForm()) return;
    setIsDownloading(true);
    const stampEl = document.getElementById('stamp-layer');
    if (isPremium) {
      if (stampEl) stampEl.style.display = 'none'; 
      if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
      setShowWatermark(false); 
    }

    const element = document.getElementById('legal-document-area');
    const originalWidth = element.style.width; const originalMaxWidth = element.style.maxWidth; const originalMargin = element.style.margin;
    element.style.width = '700px'; element.style.maxWidth = '700px'; element.style.margin = '0 auto';

    // Color Hack logic...
    const originalStyles = [];
    const elementsToSanitize = [document.documentElement, document.body, element, ...element.querySelectorAll('*')];
    elementsToSanitize.forEach((el) => {
      if (!el) return;
      const comp = window.getComputedStyle(el);
      const bg = comp.backgroundColor || ''; const color = comp.color || ''; const border = comp.borderColor || '';
      let needsFix = false; const fix = {};
      if (bg.includes('lab') || bg.includes('oklch') || bg.includes('color(')) { fix.bg = (bg.includes(' 0)')) ? 'transparent' : '#ffffff'; needsFix = true; }
      if (color.includes('lab') || color.includes('oklch') || color.includes('color(')) { fix.color = '#000000'; needsFix = true; }
      if (border.includes('lab') || border.includes('oklch') || border.includes('color(')) { fix.border = 'transparent'; needsFix = true; }
      if (needsFix) {
        originalStyles.push({ el, oldBg: el.style.getPropertyValue('background-color'), oldColor: el.style.getPropertyValue('color'), oldBorder: el.style.getPropertyValue('border-color') });
        if (fix.bg) el.style.setProperty('background-color', fix.bg, 'important');
        if (fix.color) el.style.setProperty('color', fix.color, 'important');
        if (fix.border) el.style.setProperty('border-color', fix.border, 'important');
      }
    });

    setTimeout(async () => {
      try {
        const html2pdfModule = await import('html2pdf.js');
        const html2pdf = html2pdfModule.default ? html2pdfModule.default : html2pdfModule;
        const opt = {
          margin: [0.5, 0.5, 0.8, 0.5], filename: isPremium ? 'Premium_Vasiyatnama.pdf' : 'Free_Vasiyatnama.pdf', 
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false, windowWidth: 800 }, 
          jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(element).toPdf().save();
      } catch (error) { alert("PDF जनरेट करने में समस्या।"); } 
      finally {
        originalStyles.forEach(({ el, oldBg, oldColor, oldBorder }) => {
          if (oldBg) el.style.setProperty('background-color', oldBg); else el.style.removeProperty('background-color');
          if (oldColor) el.style.setProperty('color', oldColor); else el.style.removeProperty('color');
          if (oldBorder) el.style.setProperty('border-color', oldBorder); else el.style.removeProperty('border-color');
        });
        element.style.width = originalWidth; element.style.maxWidth = originalMaxWidth; element.style.margin = originalMargin;
        if (isPremium) { setShowWatermark(true); if (stampEl) stampEl.style.display = 'flex'; }
        setIsDownloading(false);
      }
    }, 500);
  };

  // --- Dynamic Text Helpers for Vasiyatnama ---
  const isPlural = beneficiaries.length > 1;
  const lekhyadhariText = isPlural ? "लेख्यधारीगण" : "लेख्यधारी";
  
  // Beneficiaries list text generation:
  const beneficiariesListText = beneficiaries.map((b, idx) => {
    return `${b.name || '.......'} उम्र ${b.age || '..'} वर्ष ${b.relation || 'पिता'} ${b.relativeName || '.......'} (जीवित) जाति ${b.caste || '.......'} पेशा ${b.profession || '.......'}`;
  }).join(" वो "); // 'वो' is used as 'and' in local legal Hindi

  // Relation text: "लेख्यधारीगण लेख्यकारी के [नाती/बेटे] हैं..."
  const relationsArray = [...new Set(beneficiaries.map(b => b.relationWithTestator))];
  const relationString = relationsArray.join(" एवं ") || "वारिस";

  return (
    <div className="p-2 md:p-6 max-w-[1400px] mx-auto bg-gray-100 flex flex-col lg:flex-row gap-6 font-sans">
      
      {/* LEFT SIDE: Input Form */}
      <div id="form-container" className="w-full lg:w-1/3 bg-white p-4 md:p-6 shadow-xl rounded-xl h-auto lg:h-[88vh] overflow-y-auto border-t-[6px] border-blue-600 scroll-smooth">
        
        <div className="text-center mb-6 border-b pb-4 relative">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight">ऑनलाइन वसीयतनामा</h2>
          <p className="text-sm text-gray-500 mt-2">सभी प्रकार की परिस्थितियों के लिए मान्य इच्छा-पत्र</p>
          <button onClick={handleReset} className="mt-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1 mx-auto">
            <span className="text-base"><RotateCcw size={12}/></span> नया फॉर्म भरें (Reset)
          </button>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-3xl border border-orange-200 mb-6 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-orange-800 text-sm md:text-base">स्टाम्प पेपर पर प्रिंट करें?</h3>
            <p className="text-[11px] md:text-xs text-orange-700 mt-1">स्टाम्प के लिए ऊपर खाली जगह छूट जाएगी</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isStampPaper} onChange={() => setIsStampPaper(!isStampPaper)} />
            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
          </label>
        </div>

        {/* Section 1: लेख्यकारी (Testator) */}
        <div className="bg-blue-50 p-4 md:p-5 rounded-3xl mb-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-blue-200 pb-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <h3 className="font-bold text-blue-900 text-lg">लेख्यकारी (जो वसीयत कर रहा है)</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-2">
             <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-800 mb-1">वसीयत लिखने की तारीख <span className="text-red-500">*</span></label>
              <input type="date" name="date" value={commonData.date} onChange={handleCommonChange} className="w-full border border-gray-300 p-3 rounded text-sm bg-white" />
             </div>
             
             <div className="col-span-2">
               <label className="block text-sm font-bold text-gray-800 mb-1">आवेदक का मोबाइल नंबर <span className="text-red-500">*</span></label>
               <input type="tel" maxLength={10} value={applicantMobile} onChange={(e) => setApplicantMobile(e.target.value.replace(/\D/g, "").replace(/^[0-5]+/, ""))} placeholder="10 अंकों का नंबर" className="w-full border p-3 rounded text-sm bg-white" />
             </div>

             <div className="col-span-2 mt-2">
                <HindiInput label="वसीयतकर्ता का पूरा नाम" name="name" value={testator.name} onChange={handleTestatorChange} required={true} errorMsg={errors.testator_name} />
             </div>
             
             <div className="relative">
                <label className="block mb-1 text-sm font-bold text-gray-800">संबंध</label>
                <select name="relation" value={testator.relation} onChange={handleTestatorChange} className="w-full border p-3 rounded text-sm bg-white">
                  <option value="पिता">पिता</option>
                  <option value="पति">पति</option>
                </select>
             </div>
             <HindiInput label="पिता / पति का नाम" name="relativeName" value={testator.relativeName} onChange={handleTestatorChange} />
             <HindiInput label="उम्र (वर्ष)" name="age" type="number" value={testator.age} onChange={handleTestatorChange} />
             <HindiInput label="आधार कार्ड नं." name="aadhaar" type="number" disableHindi={true} value={testator.aadhaar} onChange={handleTestatorChange} />
             <HindiInput label="जाति" name="caste" value={testator.caste} onChange={handleTestatorChange} />
             <HindiInput label="पेशा (Occupation)" name="profession" value={testator.profession} onChange={handleTestatorChange} />
             
             <div className="col-span-2 mt-2 font-bold text-sm border-b pb-1">निवासी (Address):</div>
             <HindiInput label="मौजा/ग्राम" name="village" value={testator.village} onChange={handleTestatorChange} required={true} errorMsg={errors.testator_village} />
             <HindiInput label="पंचायत" name="panchayat" value={testator.panchayat} onChange={handleTestatorChange} />
             <HindiInput label="थाना" name="thana" value={testator.thana} onChange={handleTestatorChange} />
             <HindiInput label="अंचल/प्रखंड" name="anchal" value={testator.anchal} onChange={handleTestatorChange} />
             <HindiInput label="जिला" name="district" value={testator.district} onChange={handleTestatorChange} />
             <HindiInput label="पिन कोड" name="pincode" type="number" disableHindi={true} value={testator.pincode} onChange={handleTestatorChange} />
             
             <div className="col-span-2 mt-2">
                <label className="block mb-1 text-sm font-bold text-gray-800">वसीयत करने का मुख्य कारण (स्थिति)</label>
                <select name="healthReason" value={commonData.healthReason} onChange={handleCommonChange} className="w-full border p-3 rounded text-sm bg-white text-gray-700">
                  <option value="old_age_illness">वृद्धावस्था और अस्वस्थता (सामान्यतः उपयोग होता है)</option>
                  <option value="healthy_uncertain">शारीरिक रूप से स्वस्थ, परन्तु जीवन अनिश्चित है</option>
                </select>
             </div>
          </div>
        </div>

        {/* Section 2: लेख्यधारीगण (Beneficiaries) */}
        <div className="bg-purple-50 p-4 md:p-5 rounded-3xl mb-6 border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-purple-300 pb-2">
            <span className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <h3 className="font-bold text-purple-900 text-lg">लेख्यधारी (जिनके नाम वसीयत हो रही है)</h3>
          </div>
          
          {beneficiaries.map((b, index) => (
             <div key={b.id} className="p-3 bg-white rounded-xl border border-purple-200 mb-3 relative shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold text-purple-800 text-sm">वारिस #{index + 1}</p>
                  {beneficiaries.length > 1 && <button onClick={() => removeBeneficiary(b.id)} className="text-red-500 text-xs font-bold hover:underline">हटाएं ✕</button>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <HindiInput label="पूरा नाम" name="name" value={b.name} onChange={(e) => handleBeneficiaryChange(b.id, 'name', e.target.value)} required={true} errorMsg={errors[`beneficiary_${b.id}_name`]} />
                  </div>
                  <div className="relative">
                    <label className="block mb-1 text-sm font-bold text-gray-800">संबंध</label>
                    <select value={b.relation} onChange={(e) => handleBeneficiaryChange(b.id, 'relation', e.target.value)} className="w-full border p-3 rounded text-sm bg-white">
                      <option value="पिता">पिता</option>
                      <option value="पति">पति</option>
                    </select>
                  </div>
                  <HindiInput label="पिता/पति का नाम" name="relativeName" value={b.relativeName} onChange={(e) => handleBeneficiaryChange(b.id, 'relativeName', e.target.value)} />
                  <HindiInput label="उम्र (वर्ष)" name="age" type="number" value={b.age} onChange={(e) => handleBeneficiaryChange(b.id, 'age', e.target.value)} />
                  <div className="relative">
                    <label className="block mb-1 text-sm font-bold text-gray-800">वसीयतकर्ता से रिश्ता <span className="text-red-500">*</span></label>
                    <select value={b.relationWithTestator} onChange={(e) => handleBeneficiaryChange(b.id, 'relationWithTestator', e.target.value)} className="w-full border p-3 rounded text-sm bg-white border-blue-400">
                      <option value="पुत्र">पुत्र (बेटा)</option>
                      <option value="पुत्री">पुत्री (बेटी)</option>
                      <option value="पत्नी">पत्नी</option>
                      <option value="नाती">नाती</option>
                      <option value="पोता">पोता</option>
                      <option value="भतीजा">भतीजा</option>
                      <option value="भाई">भाई</option>
                      <option value="अन्य रिश्तेदार">अन्य रिश्तेदार</option>
                    </select>
                  </div>
                  <HindiInput label="जाति" name="caste" value={b.caste} onChange={(e) => handleBeneficiaryChange(b.id, 'caste', e.target.value)} />
                  <HindiInput label="पेशा" name="profession" value={b.profession} onChange={(e) => handleBeneficiaryChange(b.id, 'profession', e.target.value)} />
                </div>
             </div>
          ))}
          <button onClick={addBeneficiary} className="w-full mt-2 bg-purple-200 text-purple-800 border border-purple-300 py-2 rounded-xl font-bold hover:bg-purple-300 transition-all text-sm">
            + एक और वारिस जोड़ें
          </button>
        </div>

        {/* Section 3: अनुसूची (संपत्ति) */}
        <div className=" p-4 md:p-5 bg-green-50 rounded-3xl mb-6 border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-green-300 pb-2">
            <span className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <h3 className="font-bold text-green-900 text-lg">अनुसूची (संपत्ति का विवरण)</h3>
          </div>
          <p className="text-xs text-green-700 mb-4 font-medium">जो मकान या जमीन वसीयत की जा रही है, उसका विवरण दें।</p>
          
          {plots.map((plot, index) => (
             <div key={plot.id} className="p-3 bg-white rounded-xl border border-green-200 mt-3 relative shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold text-green-700 uppercase">प्लॉट/जमीन #{index + 1}</p>
                  {plots.length > 1 && <button onClick={() => removePlot(plot.id)} className="text-red-500 text-xs font-bold hover:underline">हटाएं</button>}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-2">
                  <HindiInput label="जमाबन्दी नं." name="jamabandi" value={plot.jamabandi} disableHindi={true} onChange={(e) => handlePlotChange(plot.id, 'jamabandi', e)} />
                  <HindiInput label="खाता नं." name="khata" value={plot.khata} disableHindi={true} onChange={(e) => handlePlotChange(plot.id, 'khata', e)} required={true} errorMsg={errors[`plot_${plot.id}_khata`]} />
                  <HindiInput label="खेसरा नं." name="khesra" value={plot.khesra} disableHindi={true} onChange={(e) => handlePlotChange(plot.id, 'khesra', e)} required={true} errorMsg={errors[`plot_${plot.id}_khesra`]} />
                </div>
                
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-bold text-gray-700">रकबा (Area) <span className="text-red-500 ml-1">*</span></label>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1"><HindiInput label="" name="rakbaAcre" type="number" value={plot.rakbaAcre} onChange={(e) => handlePlotChange(plot.id, 'rakbaAcre', e)} placeholder="एकड़" /></div>
                    <div className="flex-1"><HindiInput label="" name="rakbaDecimal" type="number" value={plot.rakbaDecimal} onChange={(e) => handlePlotChange(plot.id, 'rakbaDecimal', e)} placeholder="डिसमिल" /></div>
                  </div>
                  {errors[`plot_${plot.id}_rakba`] && <p className="text-xs text-red-600 font-semibold -mt-2">⚠️ रकबा भरें</p>}
                </div>

                <div className="mt-3">
                  <label className="block mb-2 text-sm font-bold border-b pb-1 text-gray-700">चौहद्दी (Boundaries)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <HindiInput label="उत्तर" name="north" value={plot.boundaries.north} onChange={(e) => handleBoundaryChange(plot.id, 'north', e)} placeholder="नाम..." />
                    <HindiInput label="दक्षिण" name="south" value={plot.boundaries.south} onChange={(e) => handleBoundaryChange(plot.id, 'south', e)} placeholder="नाम..." />
                    <HindiInput label="पूरब" name="east" value={plot.boundaries.east} onChange={(e) => handleBoundaryChange(plot.id, 'east', e)} placeholder="नाम..." />
                    <HindiInput label="पश्चिम" name="west" value={plot.boundaries.west} onChange={(e) => handleBoundaryChange(plot.id, 'west', e)} placeholder="नाम..." />
                  </div>
                </div>
             </div>
          ))}
          <button onClick={addPlot} className="w-full mt-3 bg-green-200 text-green-800 border border-green-300 py-2 rounded-xl font-bold hover:bg-green-300 transition-all text-sm">
            + एक और संपत्ति जोड़ें
          </button>
        </div>

        {/* गवाह और शर्तें */}
        <div className="bg-gray-50 p-4 rounded-3xl mb-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm md:text-base mb-3">गवाहों (Witnesses) की संख्या</h3>
          <div className="flex items-center gap-4">
            <button onClick={() => setWitnessCount(prev => Math.max(2, prev - 1))} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold">- कम करें</button>
            <span className="font-extrabold text-xl">{witnessCount}</span>
            <button onClick={() => setWitnessCount(prev => Math.min(5, prev + 1))} className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold">+ और जोड़ें</button>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-3xl mb-5 border border-yellow-200 shadow-sm">
           <HindiInput label="अन्य विशेष शर्तें (Optional)" name="customConditions" value={commonData.customConditions} onChange={handleCommonChange} isTextarea={true} helpText="कोई खास बात जो ड्राफ्ट में जोड़नी हो" placeholder="अपनी शर्तें यहाँ लिखें..." />
        </div>

        {/* Mobile Action Buttons */}
        <div className="visible lg:invisible sticky bottom-0 z-20 bg-white rounded-3xl shadow-[0_-4px_14px_rgba(0,0,0,0.08)] px-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { if(validateForm() && window.confirm("घोषणा: डेटा सही है?")) openRazorpay(()=>downloadPDF(true)); }} disabled={isDownloading} className="relative flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3 rounded-3xl font-bold text-[13px] shadow-[0_6px_16px_rgba(234,179,8,0.45)]">
              <span className="absolute -top-2 right-1 text-[10px] bg-gray-900 text-white px-2 py-[2px] rounded-full shadow-md animate-pulse">सीमित ऑफर</span>
              <div className="flex items-center gap-1"><Crown size={16} /><span>प्रीमियम डाउनलोड</span></div>
              <div className="flex items-center gap-2 my-0.5">
                <div className="relative flex items-center justify-center opacity-80"><span className="text-[14px] font-bold">₹99</span><span className="absolute text-red-600 text-[18px] font-black">✕</span></div>
                <span className="text-[18px] font-black leading-none">₹39</span>
              </div>
              <span className="text-[10px] font-bold opacity-90">Blur हटेगा</span>
            </button>
            <button onClick={() => { if(validateForm() && window.confirm("घोषणा: डेटा सही है?")) { downloadPDF(false); } }} disabled={isDownloading} className="flex flex-col items-center justify-center gap-1 bg-green-200 border border-green-300 text-gray-800 py-3 rounded-3xl font-bold text-[13px]">
              <Download size={18} /><span>फ्री डाउनलोड</span><span className="text-xs font-semibold">(With Watermark)</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Document Preview */}
      <div className="w-full lg:w-2/3 rounded-lg overflow-x-auto overflow-y-auto lg:h-[88vh] flex justify-center bg-white border shadow-sm">
        <div className="p-8 md:p-14 relative" style={{ backgroundColor:'white', zoom: scale }}>
          
          <style media="print">
            {`
              @page { size: A4 portrait; margin: 20mm; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              @media print {
                #watermark-layer { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; }
              }
            `}
          </style>

          <div ref={documentRef} id="legal-document-area" className="text-black leading-relaxed" style={{ fontSize: '15px', color: '#000', fontFamily: "'Arial', 'Helvetica', sans-serif", backgroundColor: '#fff' }}>
            
            {showWatermark && (
              <div id="watermark-layer" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, pointerEvents: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg width='450' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='38' font-weight='900' font-family='Arial, sans-serif' fill='rgba(40, 29, 29, 0.11)' text-anchor='middle' transform='rotate(-40, 225, 225)'%3Eबिहार सर्वे सहायक%3C/text%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }}>
                <div style={{ position: 'absolute', top:'.5%', left: '50%', transform: 'translate(-50%, 100px)', zIndex: 10, textAlign: 'center', backgroundColor: 'rgba(255, 0, 0, 0.63)', color: 'white', padding: '6px 8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                  कानूनी उपयोग एवं Blur हटाने हेतु प्रीमियम प्रिंट करें
                </div>
              </div>
            )}

            {isStampPaper && (
              <div style={{ height: '3.5in' }}>
                <div id="stamp-layer" className="print:hidden flex flex-col justify-center items-center relative overflow-hidden rounded-md" style={{ height: '100%', width: '100%', backgroundColor: '#eaf4ea', border: '3px dashed #4caf50', color: '#2e7d32' }}>
                  <div style={{ position: 'absolute', opacity: 0.08, fontSize: '120px', transform: 'rotate(-30deg)', fontWeight: '900' }}>e-Stamp</div>
                  <h1 style={{ fontSize: '28px', fontWeight: '900', zIndex: 1 }}>भारत सरकार / GOVT. OF INDIA</h1>
                  <h2 style={{ fontSize: '20px', marginTop: '5px', zIndex: 1, letterSpacing: '2px' }}>ई-स्टाम्प / e-Stamp</h2>
                  <div style={{ backgroundColor: '#fff', padding: '10px 50px', border: '2px solid #2e7d32', borderRadius: '8px', marginTop: '20px', zIndex: 1 }}>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>₹ 100/1000</h3>
                  </div>
                  <p style={{ marginTop: '25px', fontSize: '13px', color: '#fff', backgroundColor: '#d32f2f', padding: '6px 16px', borderRadius: '20px', zIndex: 1, fontWeight: 'bold' }}>
                    (यह जगह खाली प्रिंट होगी। इसे असली स्टाम्प पेपर पर प्रिंट करें)
                  </p>
                </div>
              </div>
            )}
          
            {/* --- LEGAL DRAFT START (Exactly matching your Images) --- */}
            <div style={{ filter: showWatermark ? 'blur(1px)' : 'none', transition: 'filter 0.5s ease', pointerEvents: showWatermark ? 'none' : 'auto', userSelect: showWatermark ? 'none' : 'auto' }}>
              
              <div style={{ border: '2px solid black', display: 'inline-block', borderRadius: '50px', padding: '5px 40px', margin: '0 auto 30px auto', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>इच्छा - पत्र</h1>
              </div>

              <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                <strong>1. लेख्यकारी (वसीयतकर्ता) का नाम - </strong> 
                {testator.name || '.......................'} उम्र {testator.age || '....'} वर्ष 
                {testator.relation || ' पिता'} {testator.relativeName || '.......................'} 
                जाति {testator.caste || '.......................'} पेशा {testator.profession || '.......................'} 
                निवास स्थान सा0 मौजा {testator.village || '.......................'} 
                पंचायत {testator.panchayat || '.......................'} 
                थाना {testator.thana || '.......................'} 
                जिला {testator.district || '.......................'} 
                राज्य बिहार राष्ट्रीयता भारतीय । मो0 {applicantMobile || '.......................'}
              </p>

              <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                <strong>2. {lekhyadhariText} का नाम - </strong>
                {beneficiariesListText} निवास स्थान सा0 मौजा {testator.village || '.......................'} 
                पंचायत {testator.panchayat || '.......................'} 
                थाना {testator.thana || '.......................'} 
                जिला {testator.district || '.......................'} 
                राज्य बिहार राष्ट्रीयता भारतीय ।
              </p>

              <p style={{ marginBottom: '25px', lineHeight: '1.8' }}>
                <strong>3. विलेख का प्रकार - </strong> इच्छा पत्र (will)
              </p>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', display: 'inline-block', borderBottom: '2px solid red' }}>अनुसूची (मकान / जमीन)</h2>
              </div>

              <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                <strong>4.</strong> लेख्यकारी के हिस्सा के मोताबीक कुल सम्पति एराजी कास्तकारी कायमी वो डीह बसगीत बेलगानी वो खरीदगी सम्पति ववाके मौजा {testator.village || '.......................'} पंचायत {testator.panchayat || '.......................'} थाना - {testator.thana || '.......................'} , थाना वो अंचल कार्यालय {testator.anchal || '.......................'} , जिला {testator.district || '.......................'} , राज्य बिहार।
              </p>

              {/* Property Table instead of raw text for clarity, but legally sound */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', border: '1px solid #000', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '6px' }}>खाता</th>
                    <th style={{ border: '1px solid #000', padding: '6px' }}>खेसरा</th>
                    <th style={{ border: '1px solid #000', padding: '6px' }}>रकबा</th>
                    <th style={{ border: '1px solid #000', padding: '6px' }}>जमाबन्दी</th>
                    <th style={{ border: '1px solid #000', padding: '6px' }}>चौहद्दी</th>
                  </tr>
                </thead>
                <tbody>
                  {plots.map((plot, idx) => (
                    <tr key={idx}>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{plot.khata || '...'}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{plot.khesra || '...'}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{formatRakbaDisplay(plot.rakbaAcre, plot.rakbaDecimal)}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{plot.jamabandi || '...'}</td>
                      <td style={{ border: '1px solid #000', padding: '6px', fontSize: '12px' }}>
                        उ.- {plot.boundaries.north || '...'}, द.- {plot.boundaries.south || '...'}<br/>
                        पू.- {plot.boundaries.east || '...'}, प.- {plot.boundaries.west || '...'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                यह कि लेख्य संपत्ति लेख्यकारी की स्वयं मौरूसी वो खरीदगी सम्पति है जिसपर लेख्यकारी स्वामी के रुप में निर्विवाद रुप से शांतिपूर्वक दखल कब्जे में हैं और जिसे वसीयत करने का पूर्ण अधिकार लेख्यकारी को प्राप्त है।
              </p>

              {commonData.healthReason === 'old_age_illness' ? (
                <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                  यह कि लेख्यकारी की उम्र लगभग {testator.age || '....'} वर्ष की हो गई है और लेख्यकारी हमेशा अस्वस्थ रहतें चले आ रहें है। जीवन का कोई भरोसा नहीं है कि कब और कहाँ यह प्राण इस नस्वर शरीर को छोड़कर परलोक सिधार जाये। ऐसी स्थिति में लेख्यकारी ने यह निर्णय लिया है कि अपनी सम्पत्ति की व्यवस्था अपने जीवन काल में ही कर लें। ताकि उत्तराधिकारियों के बीच स्वत्व में किसी प्रकार की झंझट न पड़े तथा सम्पत्ति व्यर्थ के विवाद से नष्ट न हो जाये।
                </p>
              ) : (
                <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                  यह कि लेख्यकारी पूर्ण रूप से स्वस्थ चित्त अवस्था में है, परन्तु जीवन का कोई भरोसा नहीं है कि कब और कहाँ यह प्राण इस नस्वर शरीर को छोड़कर परलोक सिधार जाये। ऐसी स्थिति में लेख्यकारी ने यह निर्णय लिया है कि अपनी सम्पत्ति की व्यवस्था अपने जीवन काल में ही कर लें ताकि भविष्य में उत्तराधिकारियों के बीच सम्पत्ति को लेकर कोई विवाद उत्पन्न न हो।
                </p>
              )}

              <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                {lekhyadhariText} लेख्यकारी के <strong>{relationString}</strong> हैं जो हमेशा लेख्यकारी का सेवा सुश्रुषा एवं देख भाल किया करतें है जिनकी सेवा -सुश्रुषा से प्रसन्न होकर लेख्य संपति पर स्वत्व {lekhyadhariText} को अपने जीवन काल के बाद देने का निर्णय लिया है, फलतः अपनी इच्छा की पूर्ति की दृष्टि से लेख्यकारी ने अपनी स्वेच्छा से बिना किसी के बहकावे, धमकाये तथा अपने पूर्ण स्वस्थ्य मानसिक स्थिति में शरीर की स्वस्थ्य अवस्था में भली-भांति सोंच समझकर तथा अपने रिश्तेदारों, कानूनी सलाहकारों तथा शुभ-चिंतकों से परामर्श कर अपना उक्त कंडिका-4 में वर्णित सम्पत्ति सभी उपलब्ध सुख-सुविधा तथा अन्य सम्बद्ध सामानों सहित {lekhyadhariText} के पक्ष में वसीयत करता हूँ और घोषणा करता हूँ कि मैं जब तक जीवित रहूंगा तब तक वसीयत की संपत्ति का स्वयं स्वामी एवं दखलकार रहूँगा। और मेरी मृत्यु के पश्चात मालिक एवं दखलकार {lekhyadhariText} हीं होंगे।
              </p>

              <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                यह कि यह वसीयत मेरी अंतिम वसीयत है। इसके पहले मैंने लेख्य संपत्ति के निस्वत अन्य कोई वसीयत नहीं किया है।
              </p>

              <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                लेख्यधारी मेरी मृत्यु के पश्चात् इस इच्छा पत्र को प्रोवेट इत्यादि आवश्यकतानुसार करायेंगे।
              </p>

              {commonData.customConditions && (
                <p style={{ marginBottom: '15px', lineHeight: '1.8', textAlign: 'justify' }}>
                  <strong>विशेष शर्तें:</strong> {commonData.customConditions}
                </p>
              )}

              <p style={{ marginBottom: '40px', lineHeight: '1.8', textAlign: 'justify' }}>
                यह वसीयतनामा लिख दिया है कि प्रमाण रहे और समय पर काम आये। अतएव उपरोक्त शर्तो के साक्ष्य स्वरूप मैने बिना किसी दबाव के तथा अपने पूर्ण होशो हवास में निम्नलिखित गवाहों के समक्ष वसीयतनामा लिख दिया।
              </p>

              {/* Signatures Area */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '50px', pageBreakInside: 'avoid' }}>
                <div>
                  <p style={{ fontWeight: 'bold', fontSize: '16px' }}>लेखन दिनांक: {getFormattedHindiDate(commonData.date) || '.......................'}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '120px', height: '140px', border: '1px solid black', margin: '0 auto 10px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '12px' }}>
                    अंगूठे का निशान<br/>(LTI / RTI)
                  </div>
                  <p style={{ fontWeight: 'bold', fontSize: '16px', borderTop: '1px solid black', paddingTop: '5px' }}>वसीयतकर्ता का हस्ताक्षर</p>
                </div>
              </div>

              {/* Witnesses Loop */}
              <div style={{ marginTop: '50px', borderTop: '2px solid black', paddingTop: '30px', pageBreakInside: 'avoid' }}>
                <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '30px' }}>गवाहों के हस्ताक्षर एवं विवरण:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {Array.from({ length: witnessCount }).map((_, i) => (
                    <div key={i} style={{ width: '45%', marginBottom: '40px' }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>गवाह नं. {i + 1}</p>
                      <p style={{ display: 'flex', marginBottom: '15px' }}><span style={{ width: '50px' }}>नाम:</span> <span style={{ flex: 1, borderBottom: '1px dotted black' }}></span></p>
                      <p style={{ display: 'flex', marginBottom: '15px' }}><span style={{ width: '50px' }}>पिता:</span> <span style={{ flex: 1, borderBottom: '1px dotted black' }}></span></p>
                      <p style={{ display: 'flex', marginBottom: '30px' }}><span style={{ width: '50px' }}>पता/मो0:</span> <span style={{ flex: 1, borderBottom: '1px dotted black' }}></span></p>
                      <p style={{ textAlign: 'center', borderTop: '1px solid black', width: '80%', margin: '0 auto', paddingTop: '5px' }}>हस्ताक्षर</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="invisible md:visible sticky bottom-0 z-20 bg-white rounded-3xl shadow-[0_-4px_14px_rgba(0,0,0,0.08)] px-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { if(validateForm() && window.confirm("घोषणा: डेटा सही है?")) openRazorpay(()=>downloadPDF(true)); }} disabled={isDownloading} className="relative flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3 rounded-3xl font-bold text-[13px] shadow-[0_6px_16px_rgba(234,179,8,0.45)]">
              <span className="absolute -top-2 right-1 text-[10px] bg-gray-900 text-white px-2 py-[2px] rounded-full shadow-md animate-pulse">सीमित ऑफर</span>
              <div className="flex items-center gap-1"><Crown size={16} /><span>प्रीमियम प्रिंट</span></div>
              <div className="flex items-center gap-2 my-0.5">
                <div className="relative flex items-center justify-center opacity-80"><span className="text-[14px] font-bold">₹99</span><span className="absolute text-red-600 text-[18px] font-black">✕</span></div>
                <span className="text-[18px] font-black leading-none">₹39</span>
              </div>
              <span className="text-[10px] font-bold opacity-90">Blur हटेगा</span>
            </button>
            <button onClick={() => { if(validateForm() && window.confirm("घोषणा: डेटा सही है?")) { downloadPDF(false); } }} disabled={isDownloading} className="flex flex-col items-center justify-center gap-1 bg-green-200 border border-green-300 text-gray-800 py-3 rounded-3xl font-bold text-[13px]">
              <Printer size={18} /><span>फ्री प्रिंट</span><span className="text-xs font-semibold">(With Watermark)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}