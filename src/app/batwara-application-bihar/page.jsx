"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, FileText, Crown, CheckCircle } from "lucide-react";

const getTodayHindiDate = () => {
  const months = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  const today = new Date();
  return `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
};

const calculateShare = (acreStr, decimalStr, numParties) => {
  const a = parseFloat(acreStr) || 0;
  const d = parseFloat(decimalStr) || 0;
  const totalDecimals = (a * 100) + d;
  if (totalDecimals === 0) return { acre: '', decimal: '' };

  const shareDecimals = totalDecimals / numParties;
  const shareA = Math.floor(shareDecimals / 100);
  const shareD = +(shareDecimals % 100).toFixed(3); 

  return {
    acre: shareA > 0 ? shareA.toString() : '',
    decimal: shareD > 0 ? shareD.toString() : ''
  };
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

// --- Auto Hindi Input Component ---
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
    if (lastWord.trim()) {
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

      if (lastWord.trim() !== '') {
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
            <li
              key={index}
              onClick={() => selectSuggestion(word)}
              className={`p-2 cursor-pointer text-sm border-b last:border-b-0 ${index === activeIndex ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              {word}
            </li>
          ))}
        </ul>
      )}

      {errorMsg && !disabled && <p className="text-xs text-red-600 mt-1 font-semibold flex items-center">⚠️ {errorMsg}</p>}
    </div>
  );
};

// --- Main Legal Panchnama Component ---
export default function LegalPanchnama() {
  const [isStampPaper, setIsStampPaper] = useState(false); 
  const [isDownloading, setIsDownloading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const documentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const observerRef = useRef(null);

  const [commonData, setCommonData] = useState({
    date: getTodayHindiDate(), place: '', moolRaiyat: '', village: '', thanaNo: '', anchal: '', district: '', customConditions: ''
  });

  // ⚡ PlotVillage & PlotThana added to Initial States ⚡
  const initialTotalPlot = { id: Date.now(), khata: '', khesra: '', plotVillage: '', plotThana: '', rakbaAcre: '', rakbaDecimal: '', boundaries: { north: '', south: '', east: '', west: '' } };
  const [totalPlots, setTotalPlots] = useState([{ ...initialTotalPlot }]);

  const initialPlot = { 
    khata: '', khesra: '', plotVillage: '', plotThana: '',
    rakbaAcre: '', rakbaDecimal: '', 
    boundaries: { north: '', south: '', east: '', west: '' },
    isAutoDivide: false, 
    totalRakbaAcre: '', totalRakbaDecimal: '' 
  };
  
  const [parties, setParties] = useState([
    { id: 1, title: 'प्रथम', name: '', age: '', aadhaar: '', plots: [{ ...initialPlot, id: Date.now() + 1 }] },
    { id: 2, title: 'द्वितीय', name: '', age: '', aadhaar: '', plots: [{ ...initialPlot, id: Date.now() + 2 }] }
  ]);

  const [selectedDocs, setSelectedDocs] = useState({
    aadhaar: true, witnessId: true, vanshavali: true, khatiyan: true, receipt: true, prapatra2: true
  });

  // ⚡ Razorpay & Watermark States ⚡
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);

  // Razorpay Loader
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);
  
  // 🛡️ DOM Protection: Updated to prevent false positives during payment
useEffect(() => {
  // If watermark is already disabled (paid), don't start the observer at all
  if (!showWatermark) {
    if (observerRef.current) observerRef.current.disconnect();
    return;
  }

  const observer = new MutationObserver((mutations) => {
    // Crucial: Check showWatermark again inside the callback
    if (!showWatermark) return; 

    for (const mutation of mutations) {
      const isRemoval = mutation.type === 'childList' && 
                        Array.from(mutation.removedNodes).some(node => node.id === 'watermark-layer');
      
      const isStyleChange = mutation.type === 'attributes' && 
                            mutation.target.id === 'watermark-layer';

      if (isRemoval || isStyleChange) {
        // Double check state one last time before crashing the page
        alert("⚠️ सुरक्षा चेतावनी: वाटरमार्क के साथ छेड़छाड़ वर्जित है।");
        window.location.reload();
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  observerRef.current = observer;

  return () => observer.disconnect();
}, [showWatermark]); // Effect responds to the state change
  
  const docOptions = [
    { key: 'aadhaar', label: 'आधार कार्ड की छायाप्रति (Photocopy)' },
    { key: 'witnessId', label: 'गवाहों के आधार कार्ड/पहचान पत्र' },
    { key: 'vanshavali', label: 'स्वघोषित पारिवारिक वंशावली' },
    { key: 'khatiyan', label: 'जमीन के मूल कागजात (खतियान/केवाला)' },
    { key: 'receipt', label: 'अद्यतन (नई) लगान रसीद' },
    { key: 'prapatra2', label: 'प्रपत्र-2 (Prapatra-2)' }
  ];

  const numberTitles = ['प्रथम', 'द्वितीय', 'तृतीय', 'चतुर्थ', 'पंचम', 'षष्ठम'];

  const handleCommonChange = (e) => {
    setCommonData({ ...commonData, [e.target.name]: e.target.value });
    if(errors[e.target.name]) setErrors({...errors, [e.target.name]: null});
  };

  const handleTotalPlotChange = (id, field, e) => {
    const val = e.target.value;
    setTotalPlots(prev => prev.map(plot => plot.id === id ? { ...plot, [field]: val } : plot));

    // ⚡ NEW: टाइप करते ही एरर हटा दें ⚡
    const plotIndex = totalPlots.findIndex(p => p.id === id);
    if(errors[`total_plot_${plotIndex}_${field}`]) {
      setErrors(errs => ({...errs, [`total_plot_${plotIndex}_${field}`]: null}));
    }
    // रकबा का एरर हटाने के लिए
    if((field === 'rakbaAcre' || field === 'rakbaDecimal') && errors[`total_plot_${plotIndex}_rakba`]) {
      setErrors(errs => ({...errs, [`total_plot_${plotIndex}_rakba`]: null}));
    }
  };

  const handleTotalBoundaryChange = (id, direction, e) => {
    const val = e.target.value;
    setTotalPlots(prev => prev.map(plot => plot.id === id ? { ...plot, boundaries: { ...plot.boundaries, [direction]: val } } : plot));
  };

  const addTotalPlot = () => setTotalPlots([...totalPlots, { ...initialTotalPlot, id: Date.now() }]);
  const removeTotalPlot = (id) => setTotalPlots(prev => prev.filter(p => p.id !== id));
  
  const handlePartyChange = (partyId, e) => {
    const updatedParties = parties.map(party => party.id === partyId ? { ...party, [e.target.name]: e.target.value } : party);
    setParties(updatedParties);
    if(errors[`party_${partyId}_${e.target.name}`]) setErrors({...errors, [`party_${partyId}_${e.target.name}`]: null});
  };

  const handlePlotChange = (partyId, plotId, field, e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setParties(prev => {
      const newParties = JSON.parse(JSON.stringify(prev));
      const partyIndex = newParties.findIndex(p => p.id === partyId);
      const plotIndex = newParties[partyIndex].plots.findIndex(p => p.id === plotId);

      newParties[partyIndex].plots[plotIndex][field] = val;
      const currentPlot = newParties[partyIndex].plots[plotIndex];

      if(errors[`party_${partyId}_plot_${plotIndex}_${field}`]) {
        setErrors(errs => ({...errs, [`party_${partyId}_plot_${plotIndex}_${field}`]: null}));
      }

      if (partyId === 1 && currentPlot.isAutoDivide) {
        const numParties = newParties.length;
        const shares = calculateShare(currentPlot.totalRakbaAcre, currentPlot.totalRakbaDecimal, numParties);
        
        currentPlot.rakbaAcre = shares.acre;
        currentPlot.rakbaDecimal = shares.decimal;

        for (let i = 1; i < numParties; i++) {
          if (!newParties[i].plots[plotIndex]) {
            newParties[i].plots[plotIndex] = { ...initialPlot, id: Date.now() + Math.random() };
          }
          const targetPlot = newParties[i].plots[plotIndex];
          targetPlot.khata = currentPlot.khata;
          targetPlot.khesra = currentPlot.khesra;
          targetPlot.plotVillage = currentPlot.plotVillage; // ⚡ Auto-divide village
          targetPlot.plotThana = currentPlot.plotThana;     // ⚡ Auto-divide thana
          targetPlot.rakbaAcre = shares.acre;
          targetPlot.rakbaDecimal = shares.decimal;
        }
      }
      return newParties;
    });
  };

  const handleBoundaryChange = (partyId, plotId, direction, e) => {
    const val = e.target.value;
    setParties(prev => {
      const newParties = JSON.parse(JSON.stringify(prev));
      const partyIndex = newParties.findIndex(p => p.id === partyId);
      const plotIndex = newParties[partyIndex].plots.findIndex(p => p.id === plotId);

      newParties[partyIndex].plots[plotIndex].boundaries[direction] = val;
      const currentPlot = newParties[partyIndex].plots[plotIndex];

      if (partyId === 1 && currentPlot.isAutoDivide) {
        for (let i = 1; i < newParties.length; i++) {
           if (newParties[i].plots[plotIndex]) {
              newParties[i].plots[plotIndex].boundaries[direction] = val;
           }
        }
      }
      return newParties;
    });
  };

  const addPlot = (partyId) => {
    const updatedParties = parties.map(party => {
      if (party.id === partyId) {
        return { ...party, plots: [...party.plots, { ...initialPlot, id: Date.now() }] };
      }
      return party;
    });
    setParties(updatedParties);
  };

  const removePlot = (partyId, plotId) => {
    setParties(prev => {
      const newParties = JSON.parse(JSON.stringify(prev));
      const partyIndex = newParties.findIndex(p => p.id === partyId);
      if (newParties[partyIndex].plots.length > 1) {
         newParties[partyIndex].plots = newParties[partyIndex].plots.filter(p => p.id !== plotId);
      }
      return newParties;
    });
  };

  const addParty = () => {
    if (parties.length < 6) {
      const newId = parties.length + 1;
      const numPartiesAfterAdd = parties.length + 1;
      
      const newPlots = parties[0].plots.map(p1Plot => {
         if (p1Plot.isAutoDivide) {
            const shares = calculateShare(p1Plot.totalRakbaAcre, p1Plot.totalRakbaDecimal, numPartiesAfterAdd);
            return { ...initialPlot, id: Date.now() + Math.random(), khata: p1Plot.khata, khesra: p1Plot.khesra, plotVillage: p1Plot.plotVillage, plotThana: p1Plot.plotThana, rakbaAcre: shares.acre, rakbaDecimal: shares.decimal, boundaries: { ...p1Plot.boundaries } }
         }
         return { ...initialPlot, id: Date.now() + Math.random() };
      });

      const updatedParties = parties.map(party => {
         const updatedPartyPlots = party.plots.map((plot, pIndex) => {
            const p1Plot = parties[0].plots[pIndex];
            if (p1Plot && p1Plot.isAutoDivide) {
               const shares = calculateShare(p1Plot.totalRakbaAcre, p1Plot.totalRakbaDecimal, numPartiesAfterAdd);
               return { ...plot, rakbaAcre: shares.acre, rakbaDecimal: shares.decimal };
            }
            return plot;
         });
         return { ...party, plots: updatedPartyPlots };
      });

      setParties([...updatedParties, { id: newId, title: numberTitles[newId - 1], name: '', age: '', aadhaar: '', plots: newPlots }]);
    } else { alert("अधिकतम 6 हिस्सेदार ही जोड़े जा सकते हैं।"); }
  };

  const removeParty = (id) => {
    if (parties.length > 2) {
      const numPartiesAfterRemove = parties.length - 1;
      const updatedParties = parties.filter(p => p.id !== id).map((party, index) => {
         const updatedPlots = party.plots.map((plot, pIndex) => {
            const p1Plot = parties[0].plots[pIndex];
            if (p1Plot && p1Plot.isAutoDivide) {
               const shares = calculateShare(p1Plot.totalRakbaAcre, p1Plot.totalRakbaDecimal, numPartiesAfterRemove);
               return { ...plot, rakbaAcre: shares.acre, rakbaDecimal: shares.decimal };
            }
            return plot;
         });
         return { ...party, id: index + 1, title: numberTitles[index], plots: updatedPlots };
      });
      setParties(updatedParties);
    } else { alert("कम से कम 2 हिस्सेदार होना अनिवार्य है।"); }
  };

  const handleDocChange = (key) => setSelectedDocs(prev => ({ ...prev, [key]: !prev[key] }));

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // 1. पारिवारिक जानकारी (Section 1)
    if (!commonData.moolRaiyat || String(commonData.moolRaiyat).trim() === "") { newErrors.moolRaiyat = "दादा/पिता का नाम ज़रूरी है"; isValid = false; }
    if (!commonData.village || String(commonData.village).trim() === "") { newErrors.village = "गाँव का नाम भरें"; isValid = false; }

    // ⚡ 2. कुल पैतृक संपत्ति (Section 2) - अब अनिवार्य (Mandatory) है ⚡
    totalPlots.forEach((plot, index) => {
      if (!plot.khata || String(plot.khata).trim() === "") { newErrors[`total_plot_${index}_khata`] = "खाता भरें"; isValid = false; }
      if (!plot.khesra || String(plot.khesra).trim() === "") { newErrors[`total_plot_${index}_khesra`] = "खेसरा भरें"; isValid = false; }
      const hasArea = plot.rakbaAcre || plot.rakbaDecimal;
      if (!hasArea) { newErrors[`total_plot_${index}_rakba`] = "रकबा भरें"; isValid = false; }
    });

    // 3. हिस्सेदारों का विवरण (Section 3)
    parties.forEach(party => {
      if (!party.name || String(party.name).trim() === "") { newErrors[`party_${party.id}_name`] = "नाम लिखना ज़रूरी है"; isValid = false; }
      party.plots.forEach((plot, index) => {
         if (!plot.khata || String(plot.khata).trim() === "") { newErrors[`party_${party.id}_plot_${index}_khata`] = "खाता भरें"; isValid = false; }
         if (!plot.khesra || String(plot.khesra).trim() === "") { newErrors[`party_${party.id}_plot_${index}_khesra`] = "खेसरा भरें"; isValid = false; }
         const hasArea = plot.rakbaAcre || plot.rakbaDecimal || plot.totalRakbaAcre || plot.totalRakbaDecimal;
         if (!hasArea) { newErrors[`party_${party.id}_plot_${index}_rakba`] = "रकबा भरें"; isValid = false; }
      });
    });

    setErrors(newErrors);
    if (!isValid) {
      alert("ध्यान दें: लाल रंग वाले सभी ज़रूरी बॉक्स भरें।");
      const formContainer = document.getElementById("form-container");
      if(formContainer) formContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return isValid;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 850) {
        const newScale = window.innerWidth / 880; 
        setScale(newScale);
      } else {
        setScale(1);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openRazorpay = async (callbackAction) => {
    if (!validateForm()) return; // फॉर्म सही होने पर ही पेमेंट होगा

    if (!window.Razorpay) {
      alert("भुगतान प्रणाली लोड हो रही है... कृपया प्रतीक्षा करें।");
      return;
    }

    try {
      // (यहाँ आपका बैकएंड API कॉल होगा जो आपने दिया था)
      const orderRes = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "batwara" }) 
      });

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount, // मान लीजिये ₹20 (2000 paise)
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Premium Print (No Watermark)",
        order_id: orderData.id,
        handler: async function (response) {
  // 1. Kill the observer instance directly via Ref
  if (observerRef.current) {
    observerRef.current.disconnect();
    observerRef.current = null; // Clear it out
  }

  // 2. Update state so the UI hides the watermark
  setShowWatermark(false); 

   // पेमेंट सफल होने पर

          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

  // 3. Start background tasks (don't "await" them if they aren't critical for the print)
  /*fetch("/api/verify-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(response),
  });*/

  fetch("/api/batwara", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "batwara" })
  });

  // 4. Wait for React to finish the DOM update
  // 1000ms is the "Sweet Spot" for mobile browsers in Bihar (slower CPUs)
  setTimeout(() => { 
    callbackAction(); 
  }, 1000); 
},
        theme: { color: "#1d4ed8" }, // हरा रंग
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("भुगतान प्रारंभ नहीं हो सका। कृपया पुनः प्रयास करें।");
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: documentRef, 
    documentTitle: 'Batwara_Application',
    onBeforeGetContent: () => {
      setIsDownloading(true); 
      return new Promise((resolve) => setTimeout(resolve, 200)); 
    },
    onAfterPrint: () => {
      setIsDownloading(false); 
    },
  });

  const downloadPDF = async () => {
    if (!validateForm()) return;
    setIsDownloading(true);
    
    const element = document.getElementById('legal-panchnama-document');
    const originalStyles = [];
    const allElements = [element, ...element.querySelectorAll('*')];
    
    allElements.forEach((el) => {
      const comp = window.getComputedStyle(el);
      const bg = comp.backgroundColor || '';
      const color = comp.color || '';
      const border = comp.borderColor || '';
      let needsFix = false;
      const fix = {};
      
      if (bg.includes('lab') || bg.includes('oklch') || bg.includes('color(')) {
        fix.bg = (bg.includes('/ 0)') || bg.includes(', 0)')) ? 'transparent' : '#ffffff';
        needsFix = true;
      }
      if (color.includes('lab') || color.includes('oklch') || color.includes('color(')) {
        fix.color = '#000000';
        needsFix = true;
      }
      if (border.includes('lab') || border.includes('oklch') || border.includes('color(')) {
        fix.border = '#cccccc';
        needsFix = true;
      }
      
      if (needsFix) {
        originalStyles.push({
          el, oldBg: el.style.getPropertyValue('background-color'), oldBgPriority: el.style.getPropertyPriority('background-color'),
          oldColor: el.style.getPropertyValue('color'), oldColorPriority: el.style.getPropertyPriority('color'),
          oldBorder: el.style.getPropertyValue('border-color'), oldBorderPriority: el.style.getPropertyPriority('border-color')
        });
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
          margin: [0.5, 0.5, 0.8, 0.5], filename: 'Batwara_Panchnama.pdf', image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false }, jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i); pdf.setFontSize(10); pdf.setTextColor(100); 
            const text = `Page ${i} of ${totalPages}`;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / 72;
            pdf.text(text, (pageWidth - textWidth) / 2, pageHeight - 0.4);
          }
        }).save();
      } catch (error) {
        console.error(error); alert("PDF जनरेट करने में समस्या।");
      } finally {
        originalStyles.forEach(({ el, oldBg, oldBgPriority, oldColor, oldColorPriority, oldBorder, oldBorderPriority }) => {
          el.style.setProperty('background-color', oldBg, oldBgPriority); el.style.setProperty('color', oldColor, oldColorPriority); el.style.setProperty('border-color', oldBorder, oldBorderPriority);
        });
        setIsDownloading(false);
      }
    }, 300);
  };

  const downloadWord = () => {
    if (!validateForm()) return;
    setIsDownloading(true);
    setTimeout(() => {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Panchnama</title></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + document.getElementById('legal-panchnama-document').innerHTML + footer;
      const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = 'Batwara_Panchnama.doc';
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 300);
  };

  // 🛡️ DOM Protection: कोई F12 से वाटरमार्क नहीं हटा पाएगा 🛡️
  /*useEffect(() => {
    if (!showWatermark) return; 

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // 1. अगर किसी ने वाटरमार्क वाले div को Delete (Remove) कर दिया
        if (mutation.type === 'childList') {
          for (const node of mutation.removedNodes) {
            if (node.id === 'watermark-layer' && showWatermark === true) {
              alert("⚠️ सुरक्षा चेतावनी: वाटरमार्क हटाने का प्रयास न करें। आपका फॉर्म रीसेट किया जा रहा है।");
              window.location.reload(); 
            }
          }
        }
        // 2. अगर किसी ने CSS में display:none, opacity:0 या background:none करके छिपाने की कोशिश की
        if (mutation.type === 'attributes' && mutation.target.id === 'watermark-layer') {
          const target = mutation.target;
          if (
            target.style.display === 'none' || 
            target.style.opacity === '0' || 
            target.style.visibility === 'hidden' ||
            target.style.backgroundImage === 'none' ||
            target.style.backgroundImage === ''
          ) {
            alert("⚠️ सुरक्षा चेतावनी: वाटरमार्क छिपाना वर्जित है।");
            window.location.reload();
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [showWatermark]);*/
  
  const hasTotalPropertyData = totalPlots.some(p => p.khata || p.khesra || p.rakbaAcre || p.rakbaDecimal);

  // ⚡ NEW: चेक करें कि क्या किसी भी प्लॉट में दूसरा गाँव या थाना भरा गया है? ⚡
  const hasOtherVillages = totalPlots.some(p => p.plotVillage || p.plotThana) || parties.some(party => party.plots.some(p => p.plotVillage || p.plotThana));

  return (
    <div className="p-2 md:p-6 max-w-[1400px] mx-auto bg-gray-100 flex flex-col lg:flex-row gap-6 font-sans">
      
      {/* LEFT SIDE: Input Form */}
      <div id="form-container" className="w-full lg:w-1/3 bg-white p-4 md:p-6 shadow-xl rounded-xl h-auto lg:h-[88vh] overflow-y-auto border-t-[6px] border-blue-600 scroll-smooth">
        
        <div className="text-center mb-6 border-b pb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight">ऑनलाइन बंटवारा पंचनामा</h2>
          <p className="text-sm text-gray-500 mt-2">अपना पुश्तैनी बंटवारा फॉर्म तैयार करें</p>
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

        {/* Section 1: पारिवारिक जानकारी */}
        <div className="bg-blue-50 p-4 md:p-5 rounded-3xl mb-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-blue-200 pb-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <h3 className="font-bold text-blue-900 text-lg">पारिवारिक जानकारी (मुख्य)</h3>
          </div>
          <p className="text-xs text-blue-700 mb-3">उस गाँव/थाने का नाम लिखें जहाँ आपका मुख्य घर या सबसे ज़्यादा ज़मीन है।</p>
          <HindiInput label="मूल रैयत (दादा/पिता) का नाम" name="moolRaiyat" value={commonData.moolRaiyat} onChange={handleCommonChange} required={true} errorMsg={errors.moolRaiyat} helpText="जिनके नाम से खतियान है" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <HindiInput label="मुख्य गाँव/मौजा का नाम" name="village" value={commonData.village} onChange={handleCommonChange} required={true} errorMsg={errors.village} />
            <HindiInput label="मुख्य थाना नंबर" name="thanaNo" value={commonData.thanaNo} onChange={handleCommonChange} type="number" helpText="खतियान में देखकर भरें" />
            <HindiInput label="अंचल (Block)" name="anchal" value={commonData.anchal} onChange={handleCommonChange} />
            <HindiInput label="जिला" name="district" value={commonData.district} onChange={handleCommonChange} />
          </div>
        </div>

        {/* Section 2: कुल पैतृक संपत्ति */}
        <div className=" p-4 md:p-5 bg-blue-50 rounded-3xl mb-6 border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-purple-300 pb-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <h3 className="font-bold text-blue-900 text-lg">कुल पैतृक संपत्ति (Total Property)</h3>
          </div>
          {/* ⚡ इसे 'ऐच्छिक' से बदलकर 'अनिवार्य' कर दिया गया है ⚡ */}
          <p className="text-xs text-blue-700 mb-4 font-medium">वह पूरी ज़मीन जिसका आप लोग बँटवारा कर रहे हैं, उसका विवरण यहाँ डालें। (यह भरना अनिवार्य है)</p>
          
          {totalPlots.map((plot, index) => (
             <div key={plot.id} className="p-3 rounded mt-3   relative">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold text-blue-700 uppercase flex items-center">ज़मीन का विवरण #{index + 1}</p>
                  {totalPlots.length > 1 && (
                    <button onClick={() => removeTotalPlot(plot.id)} className="text-red-500 text-xs font-bold hover:underline">हटाएं</button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-2">
                   <HindiInput label="गाँव/मौजा (यदि अलग हो)" name="plotVillage" value={plot.plotVillage} onChange={(e) => handleTotalPlotChange(plot.id, 'plotVillage', e)} placeholder="नाम..." helpText="मुख्य गाँव से अलग हो तभी भरें" />
                   <HindiInput label="थाना नं. (यदि अलग हो)" name="plotThana" value={plot.plotThana} type="number" disableHindi={true} onChange={(e) => handleTotalPlotChange(plot.id, 'plotThana', e)} placeholder="नंबर..." helpText="अलग हो तभी भरें" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-2">
                  {/* ⚡ required={true} लगा दिया गया है ताकि लाल स्टार (*) दिखे ⚡ */}
                  <HindiInput label="खाता नं." name="khata" value={plot.khata} disableHindi={true} onChange={(e) => handleTotalPlotChange(plot.id, 'khata', e)} required={true} errorMsg={errors[`total_plot_${index}_khata`]} />
                  <HindiInput label="खेसरा नं." name="khesra" value={plot.khesra} disableHindi={true} onChange={(e) => handleTotalPlotChange(plot.id, 'khesra', e)} required={true} errorMsg={errors[`total_plot_${index}_khesra`]} />
                </div>
                
                <div className="mb-3">
                  {/* ⚡ रकबा के ऊपर लाल स्टार (*) ⚡ */}
                  <label className="block mb-1 text-sm font-bold text-gray-700">
                    कुल रकबा <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="flex-1">
                        <HindiInput label="" name="rakbaAcre" type="number" value={plot.rakbaAcre} onChange={(e) => handleTotalPlotChange(plot.id, 'rakbaAcre', e)} placeholder="एकड़" />
                    </div>
                    <div className="flex-1">
                        <HindiInput label="" name="rakbaDecimal" type="number" value={plot.rakbaDecimal} onChange={(e) => handleTotalPlotChange(plot.id, 'rakbaDecimal', e)} placeholder="डिसमिल" />
                    </div>
                  </div>
                  {/* ⚡ रकबा का लाल एरर मैसेज ⚡ */}
                  {errors[`total_plot_${index}_rakba`] && <p className="text-xs text-red-600 font-semibold flex items-center -mt-2">⚠️ रकबा (एकड़ या डिसमिल) भरें</p>}
                </div>

                <div className="mt-3">
                  <label className="block mb-2 text-sm font-bold border-b pb-1 text-gray-700 border-gray-300">चौहद्दी (Boundaries)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <HindiInput label="उत्तर" name="north" value={plot.boundaries.north} onChange={(e) => handleTotalBoundaryChange(plot.id, 'north', e)} placeholder="नाम..." />
                    <HindiInput label="दक्षिण" name="south" value={plot.boundaries.south} onChange={(e) => handleTotalBoundaryChange(plot.id, 'south', e)} placeholder="नाम..." />
                    <HindiInput label="पूरब" name="east" value={plot.boundaries.east} onChange={(e) => handleTotalBoundaryChange(plot.id, 'east', e)} placeholder="नाम..." />
                    <HindiInput label="पश्चिम" name="west" value={plot.boundaries.west} onChange={(e) => handleTotalBoundaryChange(plot.id, 'west', e)} placeholder="नाम..." />
                  </div>
                </div>
             </div>
          ))}
          <button onClick={addTotalPlot} className="w-full mt-3 bg-purple-100 text-purple-800 border border-purple-300 py-2 rounded-3xl font-bold hover:bg-purple-200 transition-all text-sm">
            + एक और कुल ज़मीन/प्लॉट जोड़ें
          </button>
        </div>

        {/* Section 3: हिस्सेदारों का विवरण */}
        <div className="mb-6 border-t-2">
          <div className="flex items-center gap-2 mb-4 mt-3">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <h3 className="font-bold text-gray-800 text-lg">हिस्सेदारों का विवरण (किसको क्या मिला)</h3>
          </div>

          {parties.map((party) => (
            <div key={party.id} className={`bg-white p-4 md:p-5 rounded-3xl mb-5 border-2 shadow-md relative ${party.id === 1 ? 'border-gray-200' : 'border-gray-200'}`}>
              <h4 className="font-extrabold text-gray-800 mb-4 text-lg border-b-2 border-dashed border-gray-300 pb-2">{party.title} पक्ष (हिस्सेदार {party.id})</h4>
              {parties.length > 2 && (
                <button onClick={() => removeParty(party.id)} className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-2xl text-xs font-bold hover:bg-red-200 transition-colors">हटाएं ✕</button>
              )}
              
              <HindiInput label="हिस्सेदार का नाम" name="name" value={party.name} onChange={(e) => handlePartyChange(party.id, e)} required={true} errorMsg={errors[`party_${party.id}_name`]} />
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <HindiInput label="उम्र (वर्ष में)" name="age" type="number" value={party.age} onChange={(e) => handlePartyChange(party.id, e)} />
                <HindiInput label="आधार कार्ड नंबर" name="aadhaar" type="number" value={party.aadhaar} onChange={(e) => handlePartyChange(party.id, e)} placeholder="12 अंक" />
              </div>
              
              {party.plots.map((plot, index) => {
                const isMaster = party.id === 1;
                const p1Plot = parties[0].plots[index];
                const isAutoSynced = !isMaster && p1Plot?.isAutoDivide;

                return (
                  <div key={plot.id} className={`p-3 rounded rounded-3xl mt-3 border relative ${isAutoSynced ? 'bg-gray-100 border-gray-300' : 'bg-blue-50/50 border-blue-200'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-blue-800 uppercase flex items-center">
                        ज़मीन का विवरण #{index + 1}
                        {isAutoSynced && <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] lowercase">Auto Linked</span>}
                      </p>
                      {!isAutoSynced && party.plots.length > 1 && (
                        <button onClick={() => removePlot(party.id, plot.id)} className="text-red-500 text-xs font-bold hover:underline">हटाएं</button>
                      )}
                    </div>

                    {isMaster && (
                      <label className={`flex items-start gap-3 p-3 rounded-3xl  cursor-pointer mb-4 transition-all ${plot.isAutoDivide ? 'bg-green-100 border-green-400' : 'bg-gray-200 border-gray-300 hover:bg-gray-300'}`}>
                        <input type="checkbox" name="isAutoDivide" checked={plot.isAutoDivide} onChange={(e) => handlePlotChange(party.id, plot.id, 'isAutoDivide', e)} className="w-5 h-5 mt-0.5 text-green-600 accent-green-600 rounded" />
                        <div>
                          <span className="text-sm font-bold text-green-900 block">इस खेत को सभी भाइयों में बराबर बांटें</span>
                          <span className="text-[11px] text-green-700 leading-tight block mt-0.5">टिक करने पर आपको बाकी भाइयों के फॉर्म में कुछ नहीं भरना पड़ेगा।</span>
                        </div>
                      </label>
                    )}
                    
                    {/* ⚡ NEW: 2 Separate Inputs for Village and Thana ⚡ */}
                    <div className="grid grid-cols-2 gap-3 mb-2">
                       <HindiInput label="गाँव/मौजा (यदि अलग हो)" name="plotVillage" value={plot.plotVillage} onChange={(e) => handlePlotChange(party.id, plot.id, 'plotVillage', e)} disabled={isAutoSynced} placeholder="नाम..." helpText="मुख्य गाँव से अलग हो तभी भरें" />
                       <HindiInput label="थाना नं. (यदि अलग हो)" name="plotThana" value={plot.plotThana} type="number" disableHindi={true} onChange={(e) => handlePlotChange(party.id, plot.id, 'plotThana', e)} disabled={isAutoSynced} placeholder="नंबर..." helpText="अलग हो तभी भरें" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <HindiInput label="खाता नं." name="khata" value={plot.khata} disableHindi={true} onChange={(e) => handlePlotChange(party.id, plot.id, 'khata', e)} disabled={isAutoSynced} required={!isAutoSynced} errorMsg={errors[`party_${party.id}_plot_${index}_khata`]} />
                      <HindiInput label="खेसरा नं." name="khesra" value={plot.khesra} disableHindi={true} onChange={(e) => handlePlotChange(party.id, plot.id, 'khesra', e)} disabled={isAutoSynced} required={!isAutoSynced} errorMsg={errors[`party_${party.id}_plot_${index}_khesra`]} />
                    </div>

                    <div className="mb-3">
                      <label className={`block mb-1 text-sm font-bold ${isAutoSynced ? 'text-gray-500' : 'text-gray-700'}`}>
                        {isMaster && plot.isAutoDivide ? "कुल रकबा (Total Area)" : (isAutoSynced ? "इनका हिस्सा (Auto)" : "रकबा (इनका हिस्सा)")}
                        {!isAutoSynced && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                           <HindiInput label="" name={isMaster && plot.isAutoDivide ? "totalRakbaAcre" : "rakbaAcre"} type="number" value={isMaster && plot.isAutoDivide ? plot.totalRakbaAcre : plot.rakbaAcre} onChange={(e) => handlePlotChange(party.id, plot.id, isMaster && plot.isAutoDivide ? 'totalRakbaAcre' : 'rakbaAcre', e)} disabled={isAutoSynced} placeholder="एकड़" helpText="एकड़" />
                        </div>
                        <div className="flex-1">
                           <HindiInput label="" name={isMaster && plot.isAutoDivide ? "totalRakbaDecimal" : "rakbaDecimal"} type="number" value={isMaster && plot.isAutoDivide ? plot.totalRakbaDecimal : plot.rakbaDecimal} onChange={(e) => handlePlotChange(party.id, plot.id, isMaster && plot.isAutoDivide ? 'totalRakbaDecimal' : 'rakbaDecimal', e)} disabled={isAutoSynced} placeholder="डिसमिल" helpText="डिसमिल" />
                        </div>
                      </div>
                      {errors[`party_${party.id}_plot_${index}_rakba`] && !isAutoSynced && <p className="text-xs text-red-600 font-semibold flex items-center -mt-2">⚠️ रकबा (एकड़ या डिसमिल) भरें</p>}
                      
                      {isMaster && plot.isAutoDivide && (plot.rakbaAcre || plot.rakbaDecimal) && (
                         <p className="text-xs text-green-700 font-extrabold -mt-1 bg-green-50 p-1.5 rounded inline-block border border-green-200 shadow-sm">
                           ➔ हर भाई को मिलेगा: {formatRakbaDisplay(plot.rakbaAcre, plot.rakbaDecimal)}
                         </p>
                      )}
                    </div>

                    <div className="mt-3">
                      <label className={`block mb-2 text-sm font-bold border-b pb-1 ${isAutoSynced ? 'text-gray-500 border-gray-300' : 'text-gray-700 border-gray-300'}`}>चौहद्दी (Boundaries)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <HindiInput label="उत्तर" name="north" value={plot.boundaries.north} onChange={(e) => handleBoundaryChange(party.id, plot.id, 'north', e)} disabled={isAutoSynced} placeholder="नाम..." />
                        <HindiInput label="दक्षिण" name="south" value={plot.boundaries.south} onChange={(e) => handleBoundaryChange(party.id, plot.id, 'south', e)} disabled={isAutoSynced} placeholder="नाम..." />
                        <HindiInput label="पूरब" name="east" value={plot.boundaries.east} onChange={(e) => handleBoundaryChange(party.id, plot.id, 'east', e)} disabled={isAutoSynced} placeholder="नाम..." />
                        <HindiInput label="पश्चिम" name="west" value={plot.boundaries.west} onChange={(e) => handleBoundaryChange(party.id, plot.id, 'west', e)} disabled={isAutoSynced} placeholder="नाम..." />
                      </div>
                    </div>
                  </div>
                );
              })}

              <button onClick={() => addPlot(party.id)} className="w-full mt-3 bg-purple-100 text-purple-800 border border-purple-300 py-2 rounded rounded-2xl font-bold hover:bg-purple-200 transition-all text-sm">
                + इनके लिए एक और खेत/प्लॉट जोड़ें
              </button>
            </div>
          ))}

          <button onClick={addParty} className="w-full bg-blue-50 text-blue-800 border-2 border-dashed border-blue-700 py-3 rounded-3xl font-bold hover:bg-blue-100 transition-all text-sm md:text-base flex items-center justify-center gap-2">
            <span className="text-xl">+</span> एक और हिस्सेदार (भाई) जोड़ें
          </button>
        </div>

        {/* Section 4 & Documents */}
        <div className="bg-yellow-50 p-4 rounded-3xl mb-5 border border-yellow-200 shadow-sm">
           <HindiInput label="अन्य विशेष/कानूनी शर्तें" name="customConditions" value={commonData.customConditions} onChange={handleCommonChange} isTextarea={true} helpText="रास्ते या कुएं की सहमति" placeholder="अपनी शर्तें यहाँ लिखें..." />
        </div>

        <div className="bg-gray-50 p-4 rounded-3xl mb-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-red-600 text-sm md:text-base">संलग्न कागज़ात (चेक करें)</h3>
          <span className='text-xs '>इनमे से जो कागजात नही है उसे हटा दे (Untick) </span>
          <div className="flex flex-col gap-3 border-t-1 mt-2">
            {docOptions.map(doc => (
              <label key={doc.key} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-gray-100 rounded transition-colors">
                <input type="checkbox" checked={selectedDocs[doc.key]} onChange={() => handleDocChange(doc.key)} className="w-5 h-5 text-blue-600 rounded cursor-pointer accent-blue-600" />
                <span className="text-sm font-medium text-gray-700 select-none">{doc.label}</span>
              </label>
            ))}
          </div>
        </div>
          <div className="visible lg:invisible sticky bottom-0 z-20 bg-white  rounded-3xl shadow-[0_-4px_14px_rgba(0,0,0,0.08)] px-3 py-3">

  <div className="grid grid-cols-2 gap-3">

    {/* PREMIUM BUTTON */}
    <button
      onClick={() => openRazorpay(handlePrint)}
      disabled={isDownloading}
      className="relative flex flex-col items-center justify-center gap-1 
      bg-gradient-to-r from-yellow-400 to-amber-500 text-black 
      py-3 rounded-3xl font-bold text-[13px] 
      hover:from-yellow-500 hover:to-amber-600 
      shadow-[0_6px_16px_rgba(234,179,8,0.45)] 
      transition disabled:bg-gray-400"
    >
      {/* Shape badge 
      <span className="absolute -top-2 right-2 text-[12px] bg-black text-white px-2 py-[2px] rounded-full">
        ₹20
      </span>*/}

      <Crown size={18} />
      <span>प्रीमियम</span>
      <span className="text-xs font-semibold">Print Without Watermark</span>
    </button>


    {/* FREE BUTTON */}
    <button
      onClick={async () => {
        if (!validateForm()) return;

        try {
          fetch("/api/batwara", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "batwara", isFree: true })
          });
        } catch (e) {}

        handlePrint();
      }}
      disabled={isDownloading}
      className="flex flex-col items-center justify-center gap-1 
      bg-green-200 border border-green-300 text-gray-800 
      py-3 rounded-3xl font-bold text-[13px] 
      hover:bg-green-300 transition"
    >
      <Printer size={18} />
      <span>फ्री प्रिंट</span>
      <span className="text-xs font-semibold">Free (With Watermark)</span>
    </button>

  </div>

</div>
          
      </div>

      {/* RIGHT SIDE: Document Preview */}
      <div className="w-full lg:w-2/3 p-2 md:p-6 rounded-lg overflow-x-auto overflow-y-auto h-auto lg:h-[88vh] flex justify-center " style={{backgroundColor: 'white'}}>
        <div className=" p-8 md:p-14 relative" style={{ backgroundColor:'white', transform: `scale(${scale})`}}>
          
          {/* ⚡ PRINT CSS ⚡ */}
          <style media="print">
            {`
              @page {
                size: A4 portrait; 
                margin: 20mm 20mm 20mm 20mm; 
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              #print-footer { display: none; }
              
              @media print {
                #print-footer {
                  display: flex !important;
                  position: fixed;
                  bottom: 0;
                  left: 0;
                  width: 100%;
                  background-color: white;
                }
                /* 🚀 प्रिंट करते समय वाटरमार्क स्क्रीन पर 'Fixed' हो जाएगा, जिससे हर पन्ने पर छपेगा 🚀 */
                #watermark-layer {
                  position: fixed !important;
                  top: 0 !important;
                  left: 0 !important;
                  width: 100vw !important;
                  height: 100vh !important;
                }
              }
            `}
          </style>

          <div ref={documentRef} id="legal-panchnama-document" className="text-black leading-relaxed" style={{ fontSize: '15px', color: '#000', fontFamily: "'Arial', 'Helvetica', sans-serif", backgroundColor: '#fff' }}>
            
            {/* ⚡ THE UNREMOVABLE FULL-PAGE REPEATING WATERMARK ⚡ */}
            {showWatermark && (
              <div id="watermark-layer" style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 9999,
                pointerEvents: 'none',
                // 🚀 जादू: यह SVG वॉलपेपर की तरह पूरे पेज पर अनंत तक रिपीट होगा 🚀
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='450' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='38' font-weight='900' font-family='Arial, sans-serif' fill='rgba(54, 40, 40, 0.11)' text-anchor='middle' transform='rotate(-40, 225, 225)'%3Eबिहार सर्वे सहायक बिहारसर्वेसहायक %3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}>
              </div>
            )}

            {isStampPaper && (
              <div style={{ height: '3.5in' }}>
                <div className="print:hidden flex flex-col justify-center items-center relative overflow-hidden rounded-md" style={{ height: '100%', width: '100%', backgroundColor: '#eaf4ea', border: '3px dashed #4caf50', color: '#2e7d32' }}>
                  <div style={{ position: 'absolute', opacity: 0.08, fontSize: '120px', transform: 'rotate(-30deg)', whiteSpace: 'nowrap', fontWeight: '900' }}>e-Stamp</div>
                  <h1 style={{ fontSize: '28px', fontWeight: '900', zIndex: 1 }}>भारत सरकार / GOVT. OF INDIA</h1>
                  <h2 style={{ fontSize: '20px', marginTop: '5px', zIndex: 1, letterSpacing: '2px' }}>ई-स्टाम्प / e-Stamp</h2>
                  <div style={{ backgroundColor: '#fff', padding: '10px 50px', border: '2px solid #2e7d32', borderRadius: '8px', marginTop: '20px', zIndex: 1, boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '36px', fontWeight: '900', margin: 0 }}>₹ 100</h3>
                  </div>
                  <p style={{ marginTop: '25px', fontSize: '13px', color: '#fff', backgroundColor: '#d32f2f', padding: '6px 16px', borderRadius: '20px', zIndex: 1, fontWeight: 'bold' }}>
                    (यह जगह खाली प्रिंट होगी। इसे अपने असली स्टाम्प पेपर पर प्रिंट करें)
                  </p>
                </div>
              </div>
            )}

            <h2 style={{ textAlign: 'center', fontSize: '26px', fontWeight: '900', textDecoration: 'underline', marginBottom: '30px', letterSpacing: '0.5px' }}>आपसी सहमति से पारिवारिक भूमि बंटवारा </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontWeight: 'bold' }}>
              <p>दिनांक: {commonData.date || '...................'}</p>
              <p>स्थान: {commonData.village || '...................'}</p>
            </div>

            <p style={{ marginBottom: '25px', textAlign: 'justify', lineHeight: '1.8' }}>आज दिनांक <strong>{commonData.date || '...................'}</strong> को स्थान <strong>{commonData.village || '...................'}</strong> पर, हम निम्नलिखित पक्षकार बिना किसी दबाव, प्रलोभन, जोर-जबर्दस्ती या नशे के, पूर्ण रूप से स्वस्थ चित्त (Sound Mind) में, अपनी स्वेच्छा से गवाहों (पंचों) के समक्ष यह पारिवारिक बंटवारा निष्पादित (Execute) कर रहे हैं:</p>

            <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', pageBreakInside: 'avoid', borderRadius: '4px' }}>
              {parties.map((party) => (
                <p key={`intro-${party.id}`} style={{ marginBottom: '12px' }}>
                  <strong>{party.title} पक्ष:</strong> श्री {party.name || '...................'}, उम्र- {party.age || '......'} वर्ष, <strong>आधार क्र.- {party.aadhaar || '................'}</strong>, निवासी- ग्राम {commonData.village || '...................'}, थाना {commonData.anchal || '...................'}, जिला {commonData.district || '...................'}।
                </p>
              ))}
            </div>
              
            <h3 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '19px', borderBottom: '2px solid #333', paddingBottom: '5px', pageBreakInside: 'avoid' }}>1. बंटवारे की पृष्ठभूमि और कानूनी शर्तें:</h3>
            <ol style={{ paddingLeft: '25px', marginBottom: '35px', textAlign: 'justify', lineHeight: '1.7' }}>
              <li style={{ marginBottom: '12px' }}>
                <strong>पैतृक संपत्ति:</strong> हम सभी पक्षकार आपस में सगे संबंधी हैं। हमारे पूर्वज <strong>{commonData.moolRaiyat || '...................'}</strong> के नाम से ग्राम <strong>{commonData.village || '...........'}</strong>, थाना नंबर <strong>{commonData.thanaNo || '...........'}</strong>, अंचल <strong>{commonData.anchal || '...........'}</strong>, जिला <strong>{commonData.district || '...........'}</strong>{hasOtherVillages ? ' (तथा अन्य मौजों/थानों)' : ''} में पैतृक भूमि स्थित है, जिसका उपभोग हम संयुक्त रूप से करते आ रहे थे।
              </li>
              <li style={{ marginBottom: '12px' }}><strong>बंटवारे का कारण:</strong> परिवार के विस्तार, शांतिपूर्ण उपभोग और वर्तमान <strong>बिहार विशेष भूमि सर्वेक्षण (Land Survey)</strong> तथा अंचल कार्यालय में <strong>दाखिल-खारिज (Mutation)</strong> के कार्यों को सुचारु रूप से संपन्न करने हेतु हम सभी पक्षकार अपनी पूर्ण आपसी सहमति से संपत्ति का बंटवारा कर रहे हैं।</li>
              <li style={{ marginBottom: '12px' }}><strong>स्वामित्व और अधिकार:</strong> इस पंचनामे के लागू होने के पश्चात, जो संपत्ति जिस पक्ष के हिस्से में आई है, वह उस पर पूर्ण रूप से अपना मालिकाना हक (स्वामित्व) रखेगा। उसे उस भूमि को बेचने, दान करने या निर्माण करने का पूर्ण अधिकार होगा।</li>
              <li style={{ marginBottom: '12px' }}><strong>भविष्य के विवाद:</strong> भविष्य में यदि कोई भी पक्ष या उनके वारिस इस बंटवारे के खिलाफ न्यायालय में कोई दावा, आपत्ति या मुकदमा करते हैं, तो वह इस कानूनी पंचनामे के आधार पर पूर्णतः झूठा और अमान्य (Null and Void) माना जाएगा।</li>
              {commonData.customConditions && (<li style={{ marginBottom: '12px' }}><strong>विशेष शर्तें:</strong> {commonData.customConditions}</li>)}
            </ol>

            {hasTotalPropertyData && (
              <div style={{ marginBottom: '35px', pageBreakInside: 'avoid' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '12px', fontSize: '19px', borderBottom: '2px solid #333', paddingBottom: '5px' }}>2. कुल पैतृक संपत्ति का पूर्ण विवरण:</h3>
                <p style={{ marginBottom: '15px', fontSize: '15px' }}>वह संपूर्ण पैतृक संपत्ति जिसका वर्तमान में बँटवारा किया जा रहा है, उसका विवरण निम्नलिखित है:</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', border: '2px solid #555' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>क्र.</th>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>खाता नं.</th>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>खेसरा नं.</th>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>कुल रकबा</th>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>चौहद्दी</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totalPlots.map((plot, index) => (
                      <tr key={`total-plot-${plot.id}`}>
                        <td style={{ border: '1px solid #999', padding: '8px' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #999', padding: '8px' }}>
                          {plot.khata || '......'}
                          {/* ⚡ NEW: Village & Thana Print for Total Plots ⚡ */}
                          {(plot.plotVillage || plot.plotThana) && (
                            <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', fontWeight: 'bold' }}>
                              {plot.plotVillage && <span>ग्राम: {plot.plotVillage}<br/></span>}
                              {plot.plotThana && <span>थाना: {plot.plotThana}</span>}
                            </div>
                          )}
                        </td>
                        <td style={{ border: '1px solid #999', padding: '8px' }}>{plot.khesra || '......'}</td>
                        <td style={{ border: '1px solid #999', padding: '8px', fontWeight: 'bold' }}>
                           {formatRakbaDisplay(plot.rakbaAcre, plot.rakbaDecimal)}
                        </td>
                        <td style={{ border: '1px solid #999', padding: '8px', lineHeight: '1.4' }}>
                          उ.- {plot.boundaries.north || '......'}, द.- {plot.boundaries.south || '......'}<br/>
                          पू.- {plot.boundaries.east || '......'}, प.- {plot.boundaries.west || '......'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ border: '1px solid #999', padding: '8px', textAlign: 'right', fontWeight: 'bold', backgroundColor: '#fdfdfd' }}>महा-कुल रकबा (Grand Total):</td>
                      <td colSpan="2" style={{ border: '1px solid #999', padding: '8px', fontWeight: 'bold', color: '#166534', backgroundColor: '#fdfdfd' }}>
                        {calculateTotalRakba(totalPlots)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            <h3 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '19px', borderBottom: '2px solid #333', paddingBottom: '5px', pageBreakInside: 'avoid' }}>{hasTotalPropertyData ? '3.' : '2.'} संपत्ति के बंटवारे का विवरण (हिस्सेदारों के अनुसार):</h3>
            
            {parties.map((party) => (
              <div key={`details-${party.id}`} style={{ marginBottom: '25px', padding: '15px', border: '1px solid #666', borderRadius: '4px', pageBreakInside: 'avoid' }}>
                <p style={{ marginBottom: '15px', fontSize: '16px' }}><strong>{party.title} पक्ष (श्री {party.name || '...................'}) के पूर्ण अधिकार में आई संपत्ति का विवरण:</strong></p>
                
                <table style={{ width: '100%', marginBottom: '12px', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>क्र.</th>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>खाता नं.</th>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>खेसरा नं.</th>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>रकबा</th>
                      <th style={{ border: '1px solid #999', padding: '8px', textAlign: 'left', borderBottom: '2px solid #333'}}>चौहद्दी</th>
                    </tr>
                  </thead>
                  <tbody>
                    {party.plots.map((plot, index) => (
                      <tr key={`plot-${plot.id}`}>
                        <td style={{ border: '1px solid #999', padding: '8px' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #999', padding: '8px' }}>
                          {plot.khata || '......'}
                          {/* ⚡ NEW: Village & Thana Print for Party Plots ⚡ */}
                          {(plot.plotVillage || plot.plotThana) && (
                            <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', fontWeight: 'bold' }}>
                              {plot.plotVillage && <span>ग्राम: {plot.plotVillage}<br/></span>}
                              {plot.plotThana && <span>थाना: {plot.plotThana}</span>}
                            </div>
                          )}
                        </td>
                        <td style={{ border: '1px solid #999', padding: '8px' }}>{plot.khesra || '......'}</td>
                        <td style={{ border: '1px solid #999', padding: '8px', fontWeight: 'bold' }}>
                           {formatRakbaDisplay(plot.rakbaAcre, plot.rakbaDecimal)}
                        </td>
                        <td style={{ border: '1px solid #999', padding: '8px', lineHeight: '1.4' }}>
                          उ.- {plot.boundaries.north || '......'}, द.- {plot.boundaries.south || '......'}<br/>
                          पू.- {plot.boundaries.east || '......'}, प.- {plot.boundaries.west || '......'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" style={{ border: '1px solid #999', padding: '8px', textAlign: 'right', fontWeight: 'bold', backgroundColor: '#fdfdfd' }}>
                        इस हिस्सेदार का कुल रकबा:
                      </td>
                      <td colSpan="2" style={{ border: '1px solid #999', padding: '8px', fontWeight: 'bold',  backgroundColor: '#fdfdfd' }}>
                        {calculateTotalRakba(party.plots)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ))}

            <p style={{ marginTop: '35px', marginBottom: '35px', textAlign: 'justify', fontWeight: 'bold', fontSize: '16px', pageBreakInside: 'avoid' }}>अतः यह आपसी सहमति बंटवारा पंचनामा हमने अपनी राजी-खुशी से लिख दिया है ताकि सनद (साक्ष्य) रहे और वक़्त पर काम आवे।</p>

            <h3 style={{ fontWeight: 'bold', marginBottom: '25px', fontSize: '18px', padding: '8px', borderBottom: '1px solid #ccc', pageBreakInside: 'avoid' }}>पक्षकारों के हस्ताक्षर, फोटो एवं अंगूठे के निशान:</h3>
            <div style={{ width: '100%' }}>
              {parties.map((party) => (
                 <div key={`sig-${party.id}`} style={{ display: 'inline-block', width: '46%', marginBottom: '40px', verticalAlign: 'top', border: '1px solid #aaa', padding: '15px', boxSizing: 'border-box', marginRight: party.id % 2 !== 0 ? '6%' : '0', pageBreakInside: 'avoid', borderRadius: '4px' }}>
                   <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{party.title} पक्ष: {party.name || '...................'}</p>
                   <p style={{ fontSize: '12px', marginBottom: '20px', color: '#555' }}>आधार नं: {party.aadhaar || '................'}</p>
                   <div style={{ display: 'table', width: '100%', marginBottom: '25px' }}>
                      <div style={{ display: 'table-cell', width: '80px', height: '110px', border: '1px dashed #666', verticalAlign: 'middle', textAlign: 'center', fontSize: '12px', color: '#777' }}>पासपोर्ट<br/>फोटो<br/>चिपकाएं</div>
                      <div style={{ display: 'table-cell', width: '15px' }}></div>
                      <div style={{ display: 'table-cell', width: '90px', height: '110px', border: '1px dashed #666', verticalAlign: 'bottom', textAlign: 'center', fontSize: '12px', color: '#777' }}>अंगूठे का निशान</div>
                   </div>
                   <p style={{ borderTop: '1px solid #000', paddingTop: '8px', paddingBottom: '18px', textAlign: 'center', fontWeight: 'bold' }}>हस्ताक्षर (Sign)</p>
                 </div>
              ))}
            </div>

            <div style={{ clear: 'both', marginTop: '10px', borderTop: '2px solid #333', paddingTop: '25px', pageBreakInside: 'avoid' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '25px', fontSize: '18px' }}>गवाहों (Witnesses) के विवरण एवं हस्ताक्षर:</p>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', paddingRight: '25px', verticalAlign: 'top' }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>गवाह न. 1</p>
                      <p style={{ marginBottom: '12px' }}>नाम: ___________________________</p>
                      <p style={{ marginBottom: '12px' }}>पिता: ___________________________</p>
                      <p style={{ marginBottom: '35px' }}>मोबाईल नं: ________________________</p>
                      <p style={{ borderTop: '1px solid #000', paddingTop: '8px', width: '220px', textAlign: 'center', fontWeight: 'bold' }}>गवाह के हस्ताक्षर</p>
                    </td>
                    <td style={{ width: '50%', verticalAlign: 'top', paddingLeft: '10px' }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '12px' }}>गवाह न. 2</p>
                      <p style={{ marginBottom: '12px' }}>नाम: ___________________________</p>
                      <p style={{ marginBottom: '12px' }}>पिता: ___________________________</p>
                      <p style={{ marginBottom: '35px' }}>मोबाईल नं: ________________________</p>
                      <p style={{ borderTop: '1px solid #000', paddingTop: '8px', width: '220px', textAlign: 'center', fontWeight: 'bold' }}>गवाह के हस्ताक्षर</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {Object.values(selectedDocs).some(val => val === true) && (
              <div style={{ clear: 'both', marginTop: '50px', borderTop: '2px solid #333', paddingTop: '25px', pageBreakInside: 'avoid' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '18px', padding: '8px',  borderBottom: '1px solid #ccc' }}>संलग्न दस्तावेजों की सूची:</h3>
                <ul style={{ listStyleType: 'square', paddingLeft: '30px', lineHeight: '2.0', fontSize: '15px' }}>
                  {docOptions.map(doc => ( selectedDocs[doc.key] && <li key={`preview-${doc.key}`}><strong>{doc.label}</strong></li> ))}
                </ul>
              </div>
            )}
          </div>
          <div className="sticky bottom-0 z-20 bg-white  rounded-3xl shadow-[0_-4px_14px_rgba(0,0,0,0.08)] px-3 py-3">

  <div className="grid grid-cols-2 gap-3">

    {/* PREMIUM BUTTON */}
    <button
      onClick={() => openRazorpay(handlePrint)}
      disabled={isDownloading}
      className="relative flex flex-col items-center justify-center gap-1 
      bg-gradient-to-r from-yellow-400 to-amber-500 text-black 
      py-3 rounded-3xl font-bold text-[13px] 
      hover:from-yellow-500 hover:to-amber-600 
      shadow-[0_6px_16px_rgba(234,179,8,0.45)] 
      transition disabled:bg-gray-400"
    >
      {/* Shape badge 
      <span className="absolute -top-2 right-2 text-[12px] bg-black text-white px-2 py-[2px] rounded-full">
        ₹20
      </span>*/}

      <Crown size={18} />
      <span>प्रीमियम</span>
      <span className="text-xs font-semibold">Print Without Watermark</span>
    </button>


    {/* FREE BUTTON */}
    <button
      onClick={async () => {
        if (!validateForm()) return;

        try {
          fetch("/api/batwara", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "batwara", isFree: true })
          });
        } catch (e) {}

        handlePrint();
      }}
      disabled={isDownloading}
      className="flex flex-col items-center justify-center gap-1 
      bg-green-200 border border-green-300 text-gray-800 
      py-3 rounded-3xl font-bold text-[13px] 
      hover:bg-green-300 transition"
    >
      <Printer size={18} />
      <span>फ्री प्रिंट</span>
      <span className="text-xs font-semibold">Free (With Watermark)</span>
    </button>

  </div>

</div>
        </div>
      </div>
    </div>
  );
}