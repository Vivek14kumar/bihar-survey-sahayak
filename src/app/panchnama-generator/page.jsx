"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download, Crown, RotateCcw } from "lucide-react";

// ⚡ नया फंक्शन जो कैलेंडर से चुनी तारीख को हिंदी में बदलेगा
const getFormattedHindiDate = (dateString) => {
  if (!dateString) return '';
  const months = ["जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString;
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
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
    date: new Date().toISOString().split('T')[0], 
    place: '',  caste: '', pincode: '', village: '', thanaNo: '', anchal: '', district: '', customConditions: ''
  });

  const [moolRaiyats, setMoolRaiyats] = useState([
    { id: 1, name: '', relation: 'पिता', relativeName: '' }
  ]);

  const initialTotalPlot = { id: Date.now(), jamabandi: '', khata: '', khesra: '', plotVillage: '', plotThana: '', rakbaAcre: '', rakbaDecimal: '', boundaries: { north: '', south: '', east: '', west: '' } };
  const [totalPlots, setTotalPlots] = useState([{ ...initialTotalPlot }]);

  const initialPlot = { 
    jamabandi: '', khata: '', khesra: '', plotVillage: '', plotThana: '',
    rakbaAcre: '', rakbaDecimal: '', 
    boundaries: { north: '', south: '', east: '', west: '' },
    isAutoDivide: false, 
    totalRakbaAcre: '', totalRakbaDecimal: '' 
  };
  
  const [parties, setParties] = useState([
    { id: 1, title: 'प्रथम', name: '', relation: 'पिता', relativeName: '', age: '', aadhaar: '', plots: [{ ...initialPlot, id: Date.now() + 1 }] },
    { id: 2, title: 'द्वितीय', name: '',relation: 'पिता', relativeName: '', age: '', aadhaar: '', plots: [{ ...initialPlot, id: Date.now() + 2 }] }
  ]);

  // वंशावली हटा दी गई है
  const [selectedDocs, setSelectedDocs] = useState({
    aadhaar: true, witnessId: true, khatiyan: true, receipt: true, prapatra2: true
  });

  const [applicantMobile, setApplicantMobile] = useState("");
  const [witnessCount, setWitnessCount] = useState(4);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showWatermark, setShowWatermark] = useState(true);

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
  
  // वंशावली विकल्प हटा दिया गया है
  const docOptions = [
    { key: 'aadhaar', label: 'आधार कार्ड की छायाप्रति (Photocopy)' },
    { key: 'witnessId', label: 'गवाहों के आधार कार्ड/पहचान पत्र' },
    { key: 'khatiyan', label: 'जमीन के मूल कागजात (खतियान/केवाला)' },
    { key: 'receipt', label: 'अद्यतन (नई) लगान रसीद' },
    { key: 'prapatra2', label: 'प्रपत्र-2 (Prapatra-2)' }
  ];

  const numberTitles = ['प्रथम', 'द्वितीय', 'तृतीय', 'चतुर्थ', 'पंचम', 'षष्ठम'];

  const handleCommonChange = (e) => {
    setCommonData({ ...commonData, [e.target.name]: e.target.value });
    if(errors[e.target.name]) setErrors({...errors, [e.target.name]: null});
  };

  const handleMoolRaiyatChange = (id, field, value) => {
    setMoolRaiyats(prev => prev.map(mr => mr.id === id ? { ...mr, [field]: value } : mr));
    if (errors[`moolRaiyat_${id}_name`]) {
      setErrors(errs => ({ ...errs, [`moolRaiyat_${id}_name`]: null }));
    }
  };

  const addMoolRaiyat = () => {
    if (moolRaiyats.length < 6) {
      setMoolRaiyats([...moolRaiyats, { id: Date.now(), name: '', relation: 'पिता', relativeName: '' }]);
    } else {
      alert("अधिकतम 5 मूल रैयत ही जोड़े जा सकते हैं।");
    }
  };

  const removeMoolRaiyat = (id) => {
    if (moolRaiyats.length > 1) {
      setMoolRaiyats(moolRaiyats.filter(mr => mr.id !== id));
    }
  };

  const handleTotalPlotChange = (id, field, e) => {
    const val = e.target.value;
    setTotalPlots(prev => prev.map(plot => plot.id === id ? { ...plot, [field]: val } : plot));

    const plotIndex = totalPlots.findIndex(p => p.id === id);
    if(errors[`total_plot_${plotIndex}_${field}`]) {
      setErrors(errs => ({...errs, [`total_plot_${plotIndex}_${field}`]: null}));
    }
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

  const handleAutoFillFromKhata = (partyId, plotId, totalPlotIndexStr) => {
    if (totalPlotIndexStr === "") return;
    const tIndex = parseInt(totalPlotIndexStr);
    const sourcePlot = totalPlots[tIndex];

    setParties(prev => {
      const newParties = JSON.parse(JSON.stringify(prev));
      const partyIndex = newParties.findIndex(p => p.id === partyId);
      const plotIndex = newParties[partyIndex].plots.findIndex(p => p.id === plotId);
      const currentPlot = newParties[partyIndex].plots[plotIndex];

      currentPlot.khata = sourcePlot.khata;
      currentPlot.khesra = sourcePlot.khesra;
      currentPlot.jamabandi = sourcePlot.jamabandi;
      currentPlot.plotVillage = sourcePlot.plotVillage;
      currentPlot.plotThana = sourcePlot.plotThana;
      currentPlot.boundaries = { ...sourcePlot.boundaries };

      currentPlot.totalRakbaAcre = sourcePlot.rakbaAcre;
      currentPlot.totalRakbaDecimal = sourcePlot.rakbaDecimal;

      if (partyId === 1 && currentPlot.isAutoDivide) {
        const numParties = newParties.length;
        const shares = calculateShare(sourcePlot.rakbaAcre, sourcePlot.rakbaDecimal, numParties);
        
        currentPlot.rakbaAcre = shares.acre;
        currentPlot.rakbaDecimal = shares.decimal;

        for (let i = 1; i < numParties; i++) {
          if (!newParties[i].plots[plotIndex]) {
            newParties[i].plots[plotIndex] = { id: Date.now() + Math.random(), boundaries: { north: '', south: '', east: '', west: '' } };
          }
          const targetPlot = newParties[i].plots[plotIndex];
          targetPlot.jamabandi = sourcePlot.jamabandi;
          targetPlot.khata = sourcePlot.khata;
          targetPlot.khesra = sourcePlot.khesra;
          targetPlot.plotVillage = sourcePlot.plotVillage;
          targetPlot.plotThana = sourcePlot.plotThana; 
          targetPlot.boundaries = { ...sourcePlot.boundaries }; 
          targetPlot.rakbaAcre = shares.acre; 
          targetPlot.rakbaDecimal = shares.decimal;
        }
      } else {
        currentPlot.rakbaAcre = sourcePlot.rakbaAcre;
        currentPlot.rakbaDecimal = sourcePlot.rakbaDecimal;
      }
      return newParties;
    });

    const pIdx = parties.findIndex(p => p.id === partyId);
    const plIdx = parties[pIdx]?.plots.findIndex(p => p.id === plotId);
    if(errors[`party_${partyId}_plot_${plIdx}_khata`]) {
      setErrors(errs => {
        const newErrs = {...errs};
        delete newErrs[`party_${partyId}_plot_${plIdx}_khata`];
        delete newErrs[`party_${partyId}_plot_${plIdx}_khesra`];
        delete newErrs[`party_${partyId}_plot_${plIdx}_rakba`];
        return newErrs;
      });
    }
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

      if (partyId === 1 && field === 'isAutoDivide') {
         if (val === true) {
            if (!currentPlot.totalRakbaAcre && !currentPlot.totalRakbaDecimal) {
                currentPlot.totalRakbaAcre = currentPlot.rakbaAcre;
                currentPlot.totalRakbaDecimal = currentPlot.rakbaDecimal;
            }
            const numParties = newParties.length;
            const shares = calculateShare(currentPlot.totalRakbaAcre, currentPlot.totalRakbaDecimal, numParties);
            
            currentPlot.rakbaAcre = shares.acre;
            currentPlot.rakbaDecimal = shares.decimal;

            for (let i = 1; i < numParties; i++) {
              if (!newParties[i].plots[plotIndex]) {
                newParties[i].plots[plotIndex] = { id: Date.now() + Math.random(), boundaries: { north: '', south: '', east: '', west: '' } };
              }
              const targetPlot = newParties[i].plots[plotIndex];
              targetPlot.jamabandi = currentPlot.jamabandi;
              targetPlot.khata = currentPlot.khata;
              targetPlot.khesra = currentPlot.khesra;
              targetPlot.plotVillage = currentPlot.plotVillage; 
              targetPlot.plotThana = currentPlot.plotThana;     
              targetPlot.rakbaAcre = shares.acre;
              targetPlot.rakbaDecimal = shares.decimal;
              targetPlot.boundaries = { ...currentPlot.boundaries };
            }
         } else {
            currentPlot.rakbaAcre = currentPlot.totalRakbaAcre || currentPlot.rakbaAcre;
            currentPlot.rakbaDecimal = currentPlot.totalRakbaDecimal || currentPlot.rakbaDecimal;
            
            for (let i = 1; i < newParties.length; i++) {
              if (newParties[i].plots[plotIndex]) {
                const targetPlot = newParties[i].plots[plotIndex];
                targetPlot.jamabandi = '';
                targetPlot.khata = '';
                targetPlot.khesra = '';
                targetPlot.plotVillage = '';
                targetPlot.plotThana = '';
                targetPlot.rakbaAcre = '';
                targetPlot.rakbaDecimal = '';
                targetPlot.boundaries = { north: '', south: '', east: '', west: '' };
              }
            }
         }
      } else if (partyId === 1 && currentPlot.isAutoDivide) {
         const numParties = newParties.length;
         const shares = calculateShare(currentPlot.totalRakbaAcre, currentPlot.totalRakbaDecimal, numParties);
         currentPlot.rakbaAcre = shares.acre;
         currentPlot.rakbaDecimal = shares.decimal;

         for (let i = 1; i < numParties; i++) {
            if (newParties[i].plots[plotIndex]) {
               newParties[i].plots[plotIndex].rakbaAcre = shares.acre;
               newParties[i].plots[plotIndex].rakbaDecimal = shares.decimal;
            }
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
            return { ...initialPlot, id: Date.now() + Math.random(), jamabandi: p1Plot.jamabandi, khata: p1Plot.khata, khesra: p1Plot.khesra, plotVillage: p1Plot.plotVillage, plotThana: p1Plot.plotThana, rakbaAcre: shares.acre, rakbaDecimal: shares.decimal, boundaries: { ...p1Plot.boundaries } }
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

    moolRaiyats.forEach((mr) => {
      if (!mr.name || String(mr.name).trim() === "") { 
        newErrors[`moolRaiyat_${mr.id}_name`] = "मूल रैयत का नाम ज़रूरी है"; 
        isValid = false; 
      }
    });
    if (!commonData.village || String(commonData.village).trim() === "") { newErrors.village = "गाँव का नाम भरें"; isValid = false; }

    totalPlots.forEach((plot, index) => {
      if (!plot.khata || String(plot.khata).trim() === "") { newErrors[`total_plot_${index}_khata`] = "खाता भरें"; isValid = false; }
      if (!plot.khesra || String(plot.khesra).trim() === "") { newErrors[`total_plot_${index}_khesra`] = "खेसरा भरें"; isValid = false; }
      const hasArea = plot.rakbaAcre || plot.rakbaDecimal;
      if (!hasArea) { newErrors[`total_plot_${index}_rakba`] = "रकबा भरें"; isValid = false; }
    });

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
    const savedData = localStorage.getItem('batwaraFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.commonData) setCommonData(parsed.commonData);
        if (parsed.moolRaiyats) setMoolRaiyats(parsed.moolRaiyats);
        if (parsed.totalPlots) setTotalPlots(parsed.totalPlots);
        if (parsed.parties) setParties(parsed.parties);
        if (parsed.selectedDocs) setSelectedDocs(parsed.selectedDocs);
        if (parsed.witnessCount) setWitnessCount(parsed.witnessCount);
        if (parsed.isStampPaper !== undefined) setIsStampPaper(parsed.isStampPaper);
      } catch (e) {
        console.error("Local storage डेटा लोड करने में समस्या:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (commonData.village !== '' || moolRaiyats[0].name !== '') {
      const dataToSave = {
        commonData, moolRaiyats, totalPlots, parties, selectedDocs, witnessCount, isStampPaper
      };
      localStorage.setItem('batwaraFormData', JSON.stringify(dataToSave));
    }
  }, [commonData, moolRaiyats, totalPlots, parties, selectedDocs, witnessCount, isStampPaper]);

  const handleReset = () => {
    const confirmReset = window.confirm("⚠️ चेतावनी: क्या आप वाकई फॉर्म का सारा डेटा मिटाना चाहते हैं? यह वापस नहीं आएगा।");
    if (!confirmReset) return;

    localStorage.removeItem('batwaraFormData');

    setCommonData({
      date: new Date().toISOString().split('T')[0], 
      place: '', caste: '', pincode: '', village: '', thanaNo: '', anchal: '', district: '', customConditions: ''
    });
    setMoolRaiyats([{ id: 1, name: '', relation: 'पिता', relativeName: '' }]);
    
    setTotalPlots([{ id: Date.now(), jamabandi: '', khata: '', khesra: '', plotVillage: '', plotThana: '', rakbaAcre: '', rakbaDecimal: '', boundaries: { north: '', south: '', east: '', west: '' } }]);
    
    const basePlot = { jamabandi: '', khata: '', khesra: '', plotVillage: '', plotThana: '', rakbaAcre: '', rakbaDecimal: '', boundaries: { north: '', south: '', east: '', west: '' }, isAutoDivide: false, totalRakbaAcre: '', totalRakbaDecimal: '' };
    
    setParties([
      { id: 1, title: 'प्रथम', name: '', relation: 'पिता', relativeName: '', age: '', aadhaar: '', plots: [{ ...basePlot, id: Date.now() + 1 }] },
      { id: 2, title: 'द्वितीय', name: '',relation: 'पिता', relativeName: '', age: '', aadhaar: '', plots: [{ ...basePlot, id: Date.now() + 2 }] }
    ]);
    
    // वंशावली हटा दी गई है
    setSelectedDocs({ aadhaar: true, witnessId: true, khatiyan: true, receipt: true, prapatra2: true });
    setWitnessCount(4);
    setIsStampPaper(false);
    setErrors({});
    setApplicantMobile("");
    
    const formContainer = document.getElementById("form-container");
    if(formContainer) formContainer.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!validateForm()) return; 

    if (!applicantMobile) {
      alert("कृपया आवेदक का मोबाइल नंबर दर्ज करें।");
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
        body: JSON.stringify({ type: "batwara" }) 
      });

      const orderData = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: orderData.amount, 
        currency: "INR",
        name: "Bihar Survey Sahayak",
        description: "Premium Print (No Watermark)",
        order_id: orderData.id,
        prefill: {
          name: moolRaiyats[0]?.name || "Guest User",
          email: "guest@biharsurveysahayak.online", 
          contact: applicantMobile, 
        },
        handler: async function (response) {
          if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null; 
          }

          setShowWatermark(false); 

          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          fetch("/api/batwara", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "batwara" })
          });

          setTimeout(() => { 
            callbackAction(); 
          }, 1000); 
        },
        theme: { color: "#1d4ed8" }, 
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

  const downloadPDF = async (isPremium = false) => {
    if (!validateForm()) return;
    setIsDownloading(true);

    const stampEl = document.getElementById('stamp-layer');

    if (isPremium) {
      if (stampEl) {
         stampEl.style.display = 'none'; 
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      setShowWatermark(false); 
    }

    const element = document.getElementById('legal-panchnama-document');
    
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;
    const originalMargin = element.style.margin;

    element.style.width = '700px';
    element.style.maxWidth = '700px';
    element.style.margin = '0 auto';

    const originalStyles = [];
    const elementsToSanitize = [document.documentElement, document.body, element, ...element.querySelectorAll('*')];
    
    elementsToSanitize.forEach((el) => {
      if (!el) return;
      const comp = window.getComputedStyle(el);
      const bg = comp.backgroundColor || '';
      const color = comp.color || '';
      const border = comp.borderColor || '';
      let needsFix = false;
      const fix = {};
      
      if (bg.includes('lab') || bg.includes('oklch') || bg.includes('color(')) {
        fix.bg = (bg.includes('/ 0)') || bg.includes(', 0)') || bg.includes(' 0)')) ? 'transparent' : '#ffffff';
        needsFix = true;
      }
      if (color.includes('lab') || color.includes('oklch') || color.includes('color(')) {
        fix.color = '#000000';
        needsFix = true;
      }
      if (border.includes('lab') || border.includes('oklch') || border.includes('color(')) {
        fix.border = 'transparent';
        needsFix = true;
      }
      
      if (needsFix) {
        originalStyles.push({
          el, 
          oldBg: el.style.getPropertyValue('background-color'), oldBgPriority: el.style.getPropertyPriority('background-color'),
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
          margin: [0.5, 0.5, 0.8, 0.5], 
          filename: isPremium ? 'Premium_Batwara_Panchnama.pdf' : 'Free_Batwara_Draft.pdf', 
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            windowWidth: 800 
          }, 
          jsPDF: { unit: 'in', format: 'legal', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).toPdf().get('pdf').then(function (pdf) {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i); 
            pdf.setFontSize(10); 
            pdf.setTextColor(100); 
            const text = `Page ${i} of ${totalPages}`;
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / 72;
            pdf.text(text, (pageWidth - textWidth) / 2, pageHeight - 0.4);
          }
        }).save();
      } catch (error) {
        console.error("PDF Error:", error); 
        alert("PDF जनरेट करने में समस्या।");
      } finally {
        originalStyles.forEach(({ el, oldBg, oldBgPriority, oldColor, oldColorPriority, oldBorder, oldBorderPriority }) => {
          if (oldBg) el.style.setProperty('background-color', oldBg, oldBgPriority); 
          else el.style.removeProperty('background-color');
          
          if (oldColor) el.style.setProperty('color', oldColor, oldColorPriority); 
          else el.style.removeProperty('color');
          
          if (oldBorder) el.style.setProperty('border-color', oldBorder, oldBorderPriority); 
          else el.style.removeProperty('border-color');
        });
        
        element.style.width = originalWidth;
        element.style.maxWidth = originalMaxWidth;
        element.style.margin = originalMargin;

        if (isPremium) {
          setShowWatermark(true); 
          if (stampEl) {
             stampEl.style.display = 'flex'; 
          }
        }
        
        setIsDownloading(false);
      }
    }, 500);
  };

  const hasTotalPropertyData = totalPlots.some(p =>p.jamabandi || p.khata || p.khesra || p.rakbaAcre || p.rakbaDecimal);
  const fallbackMoolRaiyatName = moolRaiyats[0]?.name || '...........';
  
  return (
    <div className="p-2 md:p-6 max-w-[1400px] mx-auto bg-gray-100 flex flex-col lg:flex-row gap-6 font-sans">
      
      {/* LEFT SIDE: Input Form */}
      <div id="form-container" className="w-full lg:w-1/3 bg-white p-4 md:p-6 shadow-xl rounded-xl h-auto lg:h-[88vh] overflow-y-auto border-t-[6px] border-blue-600 scroll-smooth">
        
        <div className="text-center mb-6 border-b pb-4 relative">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 tracking-tight">ऑनलाइन बंटवारा पंचनामा</h2>
          <p className="text-sm text-gray-500 mt-2">अपना पुश्तैनी बंटवारा फॉर्म तैयार करें</p>
          <button 
            onClick={handleReset} 
            className="mt-4  bg-red-500  text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-1 mx-auto "
          >
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

        {/* Section 1: पारिवारिक जानकारी */}
        <div className="bg-blue-50 p-4 md:p-5 rounded-3xl mb-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-blue-200 pb-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <h3 className="font-bold text-blue-900 text-lg">पारिवारिक जानकारी (मुख्य)</h3>
          </div>
          
          <p className="text-xs text-blue-700 mb-3">उस गाँव/थाने का नाम लिखें जहाँ आपका मुख्य घर या सबसे ज़्यादा ज़मीन है।</p>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-bold text-gray-800">
                बंटवारे की तारीख <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                name="date" 
                value={commonData.date} 
                onChange={handleCommonChange} 
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm" 
              />
            </div>
             <div className='mb-2'>
               <label className="block text-sm font-bold text-gray-800 mb-1.5">
                 आवेदक का मोबाइल नंबर <span className="text-red-500">*</span>
               </label>
               <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 transition-all w-full">
                 <span className="bg-gray-100 px-3 py-2.5 text-gray-600 text-sm font-medium border-r border-gray-300 select-none">
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
                   className="w-full px-3 py-2.5 text-sm outline-none text-gray-800 placeholder-gray-400"
                 />
               </div>
             </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-800 border-b border-blue-200 pb-1">मूल रैयत का विवरण (जिनके नाम से खतियान है)</label>
            {moolRaiyats.map((mr, index) => (
              <div key={mr.id} className="p-3 bg-white rounded-xl border border-blue-200 mb-3 relative shadow-sm">
                {moolRaiyats.length > 1 && (
                  <button onClick={() => removeMoolRaiyat(mr.id)} className="absolute top-2 right-2 text-red-500 text-xs font-bold hover:underline">हटाएं ✕</button>
                )}
                <HindiInput label={`मूल रैयत ${index + 1} का नाम`} name="name" value={mr.name} onChange={(e) => handleMoolRaiyatChange(mr.id, 'name', e.target.value)} required={true} errorMsg={errors[`moolRaiyat_${mr.id}_name`]} helpText="दादा/पिता/परदादा का नाम" />
                
                <div className="grid grid-cols-[110px_1fr] gap-3">
                  <div className="relative mb-2">
                    <label className="block mb-1 text-sm font-bold text-gray-800">संबंध</label>
                    <select
                      value={mr.relation}
                      onChange={(e) => handleMoolRaiyatChange(mr.id, 'relation', e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm transition-colors cursor-pointer"
                    >
                      <option value="पिता">पिता</option>
                      <option value="पति">पति</option>
                    </select>
                  </div>
                  <HindiInput
                    label="पिता / पति का नाम"
                    name="relativeName"
                    value={mr.relativeName}
                    onChange={(e) => handleMoolRaiyatChange(mr.id, 'relativeName', e.target.value)}
                    placeholder="उनका नाम लिखें..."
                  />
                </div>
              </div>
            ))}
            {moolRaiyats.length < 6 ? (
              <button onClick={addMoolRaiyat} className="text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-200 transition-colors">
                + एक और मूल रैयत जोड़ें
              </button>
            ) : (
              <p className="text-xs text-red-500 font-semibold mt-2">
                 अधिकतम सीमा (6 मूल रैयत) पूरी हो चुकी है।
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <HindiInput label="मुख्य गाँव/मौजा का नाम" name="village" value={commonData.village} onChange={handleCommonChange} required={true} errorMsg={errors.village} />
            <HindiInput label="मुख्य थाना नंबर" name="thanaNo" value={commonData.thanaNo} onChange={handleCommonChange} type="number" helpText="खतियान में देखकर भरें" />
            <HindiInput label="अंचल (Block)" name="anchal" value={commonData.anchal} onChange={handleCommonChange} />
            <HindiInput label="जिला" name="district" value={commonData.district} onChange={handleCommonChange} />
            <HindiInput label="जाति (Caste)" name="caste" value={commonData.caste} onChange={handleCommonChange} placeholder="जैसे- राजपूत, यादव..." />
            <HindiInput label="पिन कोड" name="pincode" type="number" value={commonData.pincode} disableHindi={true} onChange={handleCommonChange} placeholder="6 अंक" />
          </div>
        </div>

        {/* Section 2: कुल पैतृक संपत्ति */}
        <div className=" p-4 md:p-5 bg-blue-50 rounded-3xl mb-6 border border-purple-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-purple-300 pb-2">
            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <h3 className="font-bold text-blue-900 text-lg">कुल पैतृक संपत्ति (Total Property)</h3>
          </div>
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

                <div className="grid grid-cols-3 gap-3 mb-2">
                  <HindiInput label="जमाबन्दी नं." name="jamabandi" value={plot.jamabandi} disableHindi={true} onChange={(e) => handleTotalPlotChange(plot.id, 'jamabandi', e)} placeholder="नं." />
                  <HindiInput label="खाता नं." name="khata" value={plot.khata} disableHindi={true} onChange={(e) => handleTotalPlotChange(plot.id, 'khata', e)} required={true} errorMsg={errors[`total_plot_${index}_khata`]} />
                  <HindiInput label="खेसरा नं." name="khesra" value={plot.khesra} disableHindi={true} onChange={(e) => handleTotalPlotChange(plot.id, 'khesra', e)} required={true} errorMsg={errors[`total_plot_${index}_khesra`]} />
                </div>
                
                <div className="mb-3">
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
              <div className="grid grid-cols-[110px_1fr] gap-3">
                <div className="relative mb-4">
                  <label className="block mb-1 text-sm font-bold text-gray-800">संबंध</label>
                  <p className="text-[11px] text-transparent mb-1 leading-tight select-none">.</p>
                  <select 
                    name="relation" 
                    value={party.relation || 'पिता'} 
                    onChange={(e) => handlePartyChange(party.id, e)}
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm transition-colors cursor-pointer"
                  >
                    <option value="पिता">पिता</option>
                    <option value="पति">पति</option>
                  </select>
                </div>

                <HindiInput 
                  label="पिता / पति का नाम" 
                  name="relativeName" 
                  value={party.relativeName} 
                  onChange={(e) => handlePartyChange(party.id, e)} 
                  placeholder="उनका नाम लिखें..." 
                  helpText="खाली छोड़ेंगे तो दादा/पिता का नाम ही छपेगा"
                />
              </div>
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
                        ज़मीन का विवरण #{index + 1}
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
                          <span className="text-[11px] text-green-700 leading-tight block mt-0.5">टिक करने पर आपको बाकी भाइयों के फॉर्म में कुछ नहीं भरना पड़ेगा।</span>
                        </div>
                      </label>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3 mb-2">
                       <HindiInput label="गाँव/मौजा (यदि अलग हो)" name="plotVillage" value={plot.plotVillage} onChange={(e) => handlePlotChange(party.id, plot.id, 'plotVillage', e)} disabled={isAutoSynced} placeholder="नाम..." helpText="मुख्य गाँव से अलग हो तभी भरें" />
                       <HindiInput label="थाना नं. (यदि अलग हो)" name="plotThana" value={plot.plotThana} type="number" disableHindi={true} onChange={(e) => handlePlotChange(party.id, plot.id, 'plotThana', e)} disabled={isAutoSynced} placeholder="नंबर..." helpText="अलग हो तभी भरें" />
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <HindiInput label="जमाबन्दी नं." name="jamabandi" value={plot.jamabandi} disableHindi={true} onChange={(e) => handlePlotChange(party.id, plot.id, 'jamabandi', e)} disabled={isAutoSynced} placeholder="नं." />
                      <div className="mb-4 relative">
                        <label className={`block mb-1 text-sm font-bold ${isAutoSynced ? 'text-gray-500' : 'text-gray-800'}`}>
                          खाता नं. {!isAutoSynced && <span className="text-red-500">*</span>}
                        </label>
                        <select
                          disabled={isAutoSynced}
                          value={
                            totalPlots.findIndex(tp => tp.khata === plot.khata && tp.khesra === plot.khesra && plot.khata !== '') !== -1 
                            ? totalPlots.findIndex(tp => tp.khata === plot.khata && tp.khesra === plot.khesra) 
                            : ""
                          }
                          onChange={(e) => handleAutoFillFromKhata(party.id, plot.id, e.target.value)}
                          className={`w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors ${errors[`party_${party.id}_plot_${index}_khata`] ? 'border-red-500 bg-red-50' : 'border-gray-300'} ${isAutoSynced ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-white cursor-pointer'}`}
                        >
                          <option value="">-- चुनें --</option>
                          {totalPlots.map((tp, tIdx) => {
                            if (!tp.khata && !tp.khesra) return null;
                            return (
                              <option key={tIdx} value={tIdx}>
                                {tp.khata || '...'} (खेसरा: {tp.khesra || '...'})
                              </option>
                            );
                          })}
                        </select>
                        {errors[`party_${party.id}_plot_${index}_khata`] && !isAutoSynced && <p className="text-xs text-red-600 mt-1 font-semibold flex items-center">⚠️ खाता चुनें</p>}
                      </div>
                      <HindiInput label="खेसरा नं." name="khesra" value={plot.khesra} disableHindi={true} onChange={(e) => handlePlotChange(party.id, plot.id, 'khesra', e)} disabled={isAutoSynced} required={!isAutoSynced} errorMsg={errors[`party_${party.id}_plot_${index}_khesra`]} />
                    </div>

                    <div className="mb-3">
                      <label className={`block mb-1 text-sm font-bold ${isAutoSynced ? 'text-gray-500' : 'text-gray-700'}`}>
                        {isMaster && plot.isAutoDivide ? "कुल रकबा (Total Area)" : (isAutoSynced ? "इनका हिस्सा (Auto)" : "रकबा (इनका हिस्सा)")}
                        {!isAutoSynced && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                           <HindiInput label="" name={isMaster && plot.isAutoDivide ? "totalRakbaAcre" : "rakbaAcre"} type="number" value={isMaster && plot.isAutoDivide ? plot.totalRakbaAcre : plot.rakbaAcre} onChange={(e) => handlePlotChange(party.id, plot.id, isMaster && plot.isAutoDivide ? 'totalRakbaAcre' : 'rakbaAcre', e)} disabled={isAutoSynced} placeholder="एकड़" helpText="एकड़" />
                        </div>
                        <div className="flex-1">
                           <HindiInput label="" name={isMaster && plot.isAutoDivide ? "totalRakbaDecimal" : "rakbaDecimal"} type="number" value={isMaster && plot.isAutoDivide ? plot.totalRakbaDecimal : plot.rakbaDecimal} onChange={(e) => handlePlotChange(party.id, plot.id, isMaster && plot.isAutoDivide ? 'totalRakbaDecimal' : 'rakbaDecimal', e)} disabled={isAutoSynced} placeholder="डिसमिल" helpText="डिसमिल" />
                        </div>
                      </div>
                      {errors[`party_${party.id}_plot_${index}_rakba`] && !isAutoSynced && <p className="text-xs text-red-600 font-semibold flex items-center -mt-2">⚠️ रकबा (एकड़ या डिसमिल) भरें</p>}
                      
                      {isMaster && plot.isAutoDivide && (plot.rakbaAcre || plot.rakbaDecimal) && (
                         <p className="text-xs text-green-700 font-extrabold -mt-1 bg-green-50 p-1.5 rounded inline-block border border-green-200 shadow-sm">
                           ➔ हर भाई को मिलेगा: {formatRakbaDisplay(plot.rakbaAcre, plot.rakbaDecimal)}
                         </p>
                      )}
                    </div>

                    <div className="mt-3">
                      <label className={`block mb-2 text-sm font-bold border-b pb-1 ${isAutoSynced ? 'text-gray-500 border-gray-300' : 'text-gray-700 border-gray-300'}`}>चौहद्दी (Boundaries)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <HindiInput label="उत्तर" name="north" value={plot.boundaries.north} onChange={(e) => handleBoundaryChange(party.id, plot.id, 'north', e)}  placeholder="नाम..." />
                        <HindiInput label="दक्षिण" name="south" value={plot.boundaries.south} onChange={(e) => handleBoundaryChange(party.id, plot.id, 'south', e)}  placeholder="नाम..." />
                        <HindiInput label="पूरब" name="east" value={plot.boundaries.east} onChange={(e) => handleBoundaryChange(party.id, plot.id, 'east', e)}  placeholder="नाम..." />
                        <HindiInput label="पश्चिम" name="west" value={plot.boundaries.west} onChange={(e) => handleBoundaryChange(party.id, plot.id, 'west', e)}  placeholder="नाम..." />
                      </div>
                    </div>
                  </div>
                );
              })}

              <button onClick={() => addPlot(party.id)} className="w-full mt-3 bg-purple-100 text-purple-800 border border-purple-300 py-2 rounded rounded-2xl font-bold hover:bg-purple-200 transition-all text-sm">
                + इनके लिए एक और खेत/प्लॉट जोड़ें
              </button>
            </div>
          ))}

          <button onClick={addParty} className="w-full bg-blue-50 text-blue-800 border-2 border-dashed border-blue-700 py-3 rounded-3xl font-bold hover:bg-blue-100 transition-all text-sm md:text-base flex items-center justify-center gap-2">
            <span className="text-xl">+</span> एक और हिस्सेदार (भाई) जोड़ें
          </button>
        </div>
          
        <div className="bg-gray-50 p-4 rounded-3xl mb-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm md:text-base mb-3">गवाहों (Witnesses) की संख्या</h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setWitnessCount(prev => Math.max(2, prev - 1))} 
              className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold hover:bg-red-200"
            >
              - कम करें
            </button>
            <span className="font-extrabold text-xl">{witnessCount}</span>
            <button 
              onClick={() => setWitnessCount(prev => Math.min(5, prev + 1))} 
              className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold hover:bg-green-200"
            >
              + और जोड़ें
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">प्रिंट में खाली लाइनें आएँगी जहाँ गवाह हाथ से साइन करेंगे।</p>
        </div>

        {/* Section 4 & Documents */}
        <div className="bg-yellow-50 p-4 rounded-3xl mb-5 border border-yellow-200 shadow-sm">
           <HindiInput label="अन्य विशेष/कानूनी शर्तें" name="customConditions" value={commonData.customConditions} onChange={handleCommonChange} isTextarea={true} helpText="रास्ते या कुएं की सहमति" placeholder="अपनी शर्तें यहाँ लिखें..." />
        </div>

        <div className="bg-gray-50 p-4 rounded-3xl mb-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-red-600 text-sm md:text-base">संलग्न कागज़ात (चेक करें)</h3>
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
          
        {/* Mobile Action Buttons */}
        <div className="visible lg:invisible sticky bottom-0 z-20 bg-white  rounded-3xl shadow-[0_-4px_14px_rgba(0,0,0,0.08)] px-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                  if (!validateForm()) return;
                  const confirmMsg = "घोषणा: मैंने फॉर्म में भरी गई सभी जानकारी (नाम, खाता, खेसरा, रकबा आदि) की अच्छे से जांच कर ली है और सब सही है।\n\nभविष्य में किसी भी त्रुटि या गलती के लिए यह वेबसाइट जिम्मेदार नहीं होगी।\n\nक्या आप सुरक्षित रूप से पेमेंट पेज पर जाना चाहते हैं?";
                  if (!window.confirm(confirmMsg)) return;
                  openRazorpay(() => {
                     downloadPDF(true); 
                  });
                }}
               disabled={isDownloading}
               className="relative flex flex-col items-center justify-center gap-1
               bg-gradient-to-r from-yellow-400 to-amber-500 text-black
               py-3 rounded-3xl font-bold text-[13px]
               hover:from-yellow-500 hover:to-amber-600
               shadow-[0_6px_16px_rgba(234,179,8,0.45)]
               transition disabled:bg-gray-400"
            >
              <span className="absolute -top-2 right-1 text-[10px] bg-gray-900 text-white px-2 py-[2px] rounded-full shadow-md animate-pulse">
                सीमित ऑफर
              </span>
              <div className="flex items-center gap-1">
                <Crown size={16} />
                <span className="text-[13px] md:text-sm">प्रीमियम डाउनलोड</span>
              </div>
              <div className="flex items-center gap-2 my-0.5">
                <div className="relative flex items-center justify-center opacity-80">
                  <span className="text-[14px] text-gray-800 font-bold">₹99</span>
                  <span className="absolute text-red-600 text-[18px] font-black select-none pointer-events-none ">✕</span>
                </div>
                <span className="text-[18px] font-black leading-none text-gray-900">₹39</span>
              </div>
              <span className="text-[10px] font-bold opacity-90">Blur और Watermark हटेगा</span>
            </button>

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
                 downloadPDF(false);
               }}
               disabled={isDownloading}
               className="flex flex-col items-center justify-center gap-1
               bg-green-200 border border-green-300 text-gray-800
               py-3 rounded-3xl font-bold text-[13px]
               hover:bg-green-300 transition"
             >
               <Download size={18} />
               <span>फ्री डाउनलोड</span>
               <span className="text-xs font-semibold">Free (With Watermark)</span>
             </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Document Preview */}
      <div className="w-full lg:w-2/3 rounded-lg overflow-x-auto overflow-y-auto  lg:h-[88vh] flex justify-center " style={{backgroundColor: 'white'}}>
        <div className=" p-8 md:p-14 relative" style={{ backgroundColor:'white',zoom: scale}}>
          
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

          <div ref={documentRef} id="legal-panchnama-document" className="text-black leading-relaxed bg-white" style={{ fontSize: '15px', color: '#000', fontFamily: "'Arial', sans-serif", padding: '20px' }}>
            
            {/* ⚡ THE UNREMOVABLE FULL-PAGE REPEATING WATERMARK ⚡ */}
            {showWatermark && (
              <div id="watermark-layer" style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 9999,
                pointerEvents: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='450' height='450' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='38' font-weight='900' font-family='Arial, sans-serif' fill='rgba(40, 29, 29, 0.11)' text-anchor='middle' transform='rotate(-40, 225, 225)'%3EBihar Survey Sahayak%3C/text%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}>
              <div style={{ position: 'absolute', top:'.5%', left: '50%', transform: 'translate(-50%, 100px)', zIndex: 10, textAlign: 'center', backgroundColor: 'rgba(255, 0, 0, 0.63)', color: 'white', padding: '6px 8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', filter: 'none' }}>
                कानूनी उपयोग एवं Blur हटाने हेतु प्रीमियम प्रिंट करें <a href="https://biharsurveysahayak.online" style={{fontSize:'10px', color: 'white'}}>https://biharsurveysahayak.online</a>
              </div>
              </div>
            )}

            {isStampPaper && (
              <div style={{ height: '3.5in' }}>
                <div id="stamp-layer" className="print:hidden flex flex-col justify-center items-center relative overflow-hidden rounded-md" style={{ height: '100%', width: '100%', backgroundColor: '#eaf4ea', border: '3px dashed #4caf50', color: '#2e7d32' }}>
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

            <div style={{ 
              filter: showWatermark ? 'blur(1px)' : 'none', 
              userSelect: showWatermark ? 'none' : 'auto', 
              pointerEvents: showWatermark ? 'none' : 'auto', 
              transition: 'filter 0.5s ease'
            }}>
              
              {/* Header Section */}
              <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '900', textDecoration: 'underline', marginBottom: '20px' }}>सहमती बँटवारा (पारिवारिक पंचनामा)</h2>

              {/* Parties Details (फरीक विवरण) */}
              <div style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                {parties.map((party, index) => (
                  <p key={`party-${party.id}`} style={{ marginBottom: '10px' }}>
                    <strong>लेख्यकारी:- फरीक न0-{index + 1}</strong> श्री/श्रीमती {party.name || '___________'}, उम्र {party.age || '___'} साल, {party.relation || 'पिता'}- {party.relativeName || '___________'}, जाती- {commonData.caste || '___________'}, ग्राम- {commonData.village || '___________'}, अंचल- {commonData.anchal || '___________'}, जिला- {commonData.district || '___________'}, राज्य- बिहार, राष्ट्रीयता- भारतीय, आधार क्र.- {party.aadhaar || '___________'}।
                  </p>
                ))}
                <p><strong>लेख्यधारी:-</strong> बहक एक दुसरे को (लेख्यकारी ही लेख्यधारी है)</p>
                <p><strong>लेख्यप्रकार:-</strong> आपसी सहमती बँटवारा नामा</p>
                <p><strong>सम्पति:-</strong> पैत्रिक जमीन जायदाद</p>
              </div>

              <hr style={{ borderTop: '2px solid #000', margin: '20px 0' }} />

              {/* Total Property Details */}
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px', textDecoration: 'underline' }}>कुल सम्पति विवरण</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', textAlign: 'center', border: '1px solid #000' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>थाना न०</th>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>खाता न०</th>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>खेसरा न०</th>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>रकबा</th>
                    <th style={{ border: '1px solid #000', padding: '8px' }}>जमाबंदी</th>
                  </tr>
                </thead>
                <tbody>
                  {totalPlots.map((plot, i) => (
                    <tr key={i}>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{plot.plotThana || commonData.thanaNo || '___'}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{plot.khata || '___'}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{plot.khesra || '___'}</td>
                      <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>{formatRakbaDisplay(plot.rakbaAcre, plot.rakbaDecimal)}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{plot.jamabandi || '___'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Schedules Generation (शेड्यूल क, ख, ग...) */}
              {parties.map((party, index) => {
                const schedules = ['(क)', '(ख)', '(ग)', '(घ)', '(ङ)', '(च)'];
                return (
                  <div key={`schedule-${party.id}`} style={{ marginBottom: '25px', pageBreakInside: 'avoid' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>शेड्यूल {schedules[index]}</h3>
                    <p style={{ marginBottom: '10px', lineHeight: '1.6', textAlign: 'justify' }}>
                      यह जमीन <strong>फरीक न0-{index + 1} (श्री/श्रीमती {party.name}</strong>, {party.relation}- {party.relativeName}) को मिला वो दखल कब्जा में रहेगा। इससे अन्य फरीकों को कोई वास्ता सरोकार नहीं रहेगा, अगर करें तो वह नजायज होगा। जिसका विवरण वर्णित हिस्सा निम्न है:-
                    </p>
                    
                    {party.plots.map((plot, pIndex) => (
                      <div key={`plot-${pIndex}`} style={{ marginBottom: '15px', border: '1px solid #000', padding: '10px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                           <span><strong>खाता न०:</strong> {plot.khata}</span>
                           <span><strong>खेसरा:</strong> {plot.khesra}</span>
                           <span><strong>रकबा:</strong> <span style={{fontWeight: 'bold'}}>{formatRakbaDisplay(plot.rakbaAcre, plot.rakbaDecimal)}</span></span>
                         </div>
                         <p style={{ fontWeight: 'bold', textDecoration: 'underline' }}>- चौहद्दी -</p>
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginTop: '5px' }}>
                            <span><strong>उत्तर-</strong> {plot.boundaries.north || '...........'}</span>
                            <span><strong>दक्षिण-</strong> {plot.boundaries.south || '...........'}</span>
                            <span><strong>पूरब-</strong> {plot.boundaries.east || '...........'}</span>
                            <span><strong>पश्चिम-</strong> {plot.boundaries.west || '...........'}</span>
                         </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {/* Declaration (सन्दर्भ) */}
              <div style={{ marginTop: '30px', pageBreakInside: 'avoid', lineHeight: '1.8' }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '18px', textDecoration: 'underline', marginBottom: '10px' }}>सन्दर्भ</h3>
                <p style={{textAlign: 'justify'}}>
                  उपर्युक्त वर्णित भूमि हम लेख्यकारी की खतियानी एवं पैतृक सम्पति है। हम सभी फरीकेन इस जमीन का मिलजुमले में उपभोग करते आ रहे थे। उक्त जमीन को सभी फरीकेन ने पूर्ण होश-हवास में बिना किसी दबाव के आपस में बँटवारा कर लिया है। उपर्युक्त सम्पति विवरण पर आज दिनांक <strong>{getFormattedHindiDate(commonData.date) || '...........'}</strong> से सभी पक्षकार अपने शेड्युल के अनुसार दखलकार हुए तथा भविष्य में किसी दूसरे पक्षकार के सम्पति पर कोई दावा या आपत्ति नहीं करेंगे। इस बँटवारा के आधार पर सभी फरीक अंचल कार्यालय में दाखिल-खारिज कराकर अपने नाम से अलग-अलग लगान रसीद निर्गत करा सकेंगे।
                </p>
                {commonData.customConditions && (
                  <p style={{marginTop: '10px', textAlign: 'justify'}}><strong>विशेष शर्तें:</strong> {commonData.customConditions}</p>
                )}
              </div>

              {/* Signatures */}
              <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', pageBreakInside: 'avoid' }}>
                 <div style={{ width: '45%' }}>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>फरीकेन का हस्ताक्षर / निशान:</h4>
                    {parties.map((party, i) => (
                      <p key={`sign-${i}`} style={{ marginBottom: '25px', borderBottom: '1px dotted #666', paddingBottom: '5px' }}>{i + 1}. {party.name}</p>
                    ))}
                 </div>
                 <div style={{ width: '45%' }}>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '15px' }}>गवाहों (पंचो) का हस्ताक्षर:</h4>
                    {Array.from({ length: witnessCount }).map((_, i) => (
                      <p key={`wit-${i}`} style={{ marginBottom: '25px', borderBottom: '1px dotted #666', paddingBottom: '5px' }}>{i + 1}.</p>
                    ))}
                 </div>
              </div>

              {/* Attachments */}
              {Object.values(selectedDocs).some(val => val === true) && (
                <div style={{ clear: 'both', marginTop: '50px', borderTop: '2px solid #333', paddingTop: '25px', pageBreakInside: 'avoid' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '15px', fontSize: '18px', padding: '8px',  borderBottom: '1px solid #ccc' }}>संलग्न दस्तावेजों की सूची:</h3>
                  <ul style={{ listStyleType: 'square', paddingLeft: '30px', lineHeight: '2.0', fontSize: '15px' }}>
                    {docOptions.map(doc => ( selectedDocs[doc.key] && <li key={`preview-${doc.key}`}><strong>{doc.label}</strong></li> ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
        
        {/* Desktop Action Buttons */}
        <div className="invisible md:visible sticky bottom-0 z-20 bg-white rounded-3xl shadow-[0_-4px_14px_rgba(0,0,0,0.08)] px-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const confirmMsg = "घोषणा: मैंने फॉर्म में भरी गई सभी जानकारी (नाम, खाता, खेसरा, रकबा आदि) की अच्छे से जांच कर ली है और सब सही है।\n\nभविष्य में किसी भी त्रुटि या गलती के लिए यह वेबसाइट जिम्मेदार नहीं होगी।\n\nक्या आप सुरक्षित रूप से पेमेंट पेज पर जाना चाहते हैं?";
                  if (!window.confirm(confirmMsg)) return;
                  openRazorpay(handlePrint)
              }}
               disabled={isDownloading}
               className="relative flex flex-col items-center justify-center gap-1
               bg-gradient-to-r from-yellow-400 to-amber-500 text-black
               py-3 rounded-3xl font-bold text-[13px]
               hover:from-yellow-500 hover:to-amber-600
               shadow-[0_6px_16px_rgba(234,179,8,0.45)]
               transition disabled:bg-gray-400"
            >
              <span className="absolute -top-2 right-1 text-[10px] bg-gray-900 text-white px-2 py-[2px] rounded-full shadow-md animate-pulse">
                सीमित ऑफर
              </span>
              <div className="flex items-center gap-1">
                <Crown size={16} />
                <span className="text-[13px] md:text-sm">प्रीमियम प्रिंट</span>
              </div>
              <div className="flex items-center gap-2 my-0.5">
                <div className="relative flex items-center justify-center opacity-80">
                  <span className="text-[14px] text-gray-800 font-bold">₹99</span>
                  <span className="absolute text-red-600 text-[18px] font-black select-none pointer-events-none ">✕</span>
                </div>
                <span className="text-[18px] font-black leading-none text-gray-900">₹39</span>
              </div>
              <span className="text-[10px] font-bold opacity-90">Blur और Watermark हटेगा</span>
            </button>

            <button
             onClick={async () => {
               if (!validateForm()) return;
                  const confirmMsg = "घोषणा: मैंने फॉर्म में भरी गई सभी जानकारी (नाम, खाता, खेसरा, रकबा आदि) की अच्छे से जांच कर ली है और सब सही है।\n\nभविष्य में किसी भी त्रुटि या गलती के लिए यह वेबसाइट जिम्मेदार नहीं होगी।\n\nक्या आप सुरक्षित रूप से पेमेंट पेज पर जाना चाहते हैं?";
                  if (!window.confirm(confirmMsg)) return;

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
  );
}