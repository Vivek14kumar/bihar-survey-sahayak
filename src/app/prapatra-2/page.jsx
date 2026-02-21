"use client";

import React, { useState, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { Download, Printer, Loader2 } from "lucide-react";

export default function LandscapePage() {
  const [todayDate, setTodayDate] = useState("");
  const [currentCell, setCurrentCell] = useState(null); 
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const contentRef = useRef(null);

  const validateForm = () => {
  const entry = entries[0];
  const missingFields = [];

  // 1. Check Header Fields
  const headerLabels = {
    revenueVillage: "राजस्व ग्राम",
    thanaNo: "थाना नं०",
    //halkaNo: "हल्का नं०",
    policeThana: "पुलिस थाना",
    anchal: "अंचल",
    district: "जिला"
  };

  Object.keys(headerLabels).forEach(key => {
    if (!entry[key] || entry[key].trim() === "") {
      missingFields.push(headerLabels[key]);
    }
  });

  // 2. Check at least one Ryot Name
  if (!entry.ryotDetails[0].name.trim()) {
    missingFields.push("रैयत का नाम");
  }

  if (missingFields.length > 0) {
    alert(`कृपया निम्नलिखित विवरण भरें: \n${missingFields.join(", ")}`);
    return false;
  }

  return true;
};

  const handleDownloadPDF = async () => {
    if (!validateForm()) return; // Stop if blank
  if (!contentRef.current) return;
  setIsDownloading(true); // Start loading

  // 1. Hide interactive elements (Add/Remove buttons)
  const buttons = contentRef.current.querySelectorAll('.print\\:hidden');
  buttons.forEach(btn => btn.style.display = 'none');
  
  const inputs = contentRef.current.querySelectorAll('input, textarea');
  
  const originalPlaceholders = new Map();
  inputs.forEach((el, index) => {
    if (el.placeholder) {
      originalPlaceholders.set(el, el.placeholder);
      el.placeholder = ''; // This makes them invisible in the snapshot
    }
  });

  try {
    // 2. Generate the snapshot
    // We increase pixel ratio to 3 for crystal clear Hindi text
    const dataUrl = await htmlToImage.toPng(contentRef.current, { 
      pixelRatio: 3,
      backgroundColor: '#ffffff',
    });

    // 3. Setup PDF (A4 Landscape)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // 4. Add the image and save
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Bihar_Survey_Prapatra2_${todayDate}.pdf`);

  } catch (err) {
    console.error('PDF Generation Error:', err);
  } finally {
    // 5. Restore the buttons
    buttons.forEach(btn => btn.style.display = '');
    setIsDownloading(false);
    await fetch("/api/track-prapatra2-print", { method: "POST" });
  }
};


  // 1. DATA STRUCTURE: Includes Header, Table, and Footer fields
  const [entries, setEntries] = useState([
    {
      id: 1,
      // Header Fields
      revenueVillage: "",
      thanaNo: "",
      halkaNo: "",
      policeThana: "",
      anchal: "",
      district: "",
      // Table Fields
      ryotDetails: [{ name: "", fatherName: "" }], // Changed from ryotName: ""
      address: "",
      jamabandi: "",
      claimBasis: "",
      remarks: "",
      // Footer Fields
      place: "",
      plots: [
        { khata: "", khesra: "", rakba: "", north: "", south: "", east: "", west: "", type: "", rent: "" },
        { khata: "", khesra: "", rakba: "", north: "", south: "", east: "", west: "", type: "", rent: "" },
        { khata: "", khesra: "", rakba: "", north: "", south: "", east: "", west: "", type: "", rent: "" },
        { khata: "", khesra: "", rakba: "", north: "", south: "", east: "", west: "", type: "", rent: "" },
      ]
    }
  ]);

  const addShareholder = (entryId) => {
  const entry = entries.find(e => e.id === entryId);
  // Limit to 4 shareholders
  if (entry.ryotDetails.length < 4) {
    setEntries(prev => prev.map(e => 
      e.id === entryId 
        ? { ...e, ryotDetails: [...e.ryotDetails, { name: "", fatherName: "" }] }
        : e
    ));
  }
};

const removeShareholder = (entryId, index) => {
  setEntries(prev => prev.map(e => {
    if (e.id === entryId && e.ryotDetails.length > 1) {
      const newDetails = e.ryotDetails.filter((_, i) => i !== index);
      return { ...e, ryotDetails: newDetails };
    }
    return e;
  }));
};

const handleShareholderChange = (entryId, index, field, value) => {
  setEntries(prev => prev.map(e => {
    if (e.id === entryId) {
      const newDetails = [...e.ryotDetails];
      newDetails[index][field] = value;
      return { ...e, ryotDetails: newDetails };
    }
    return e;
  }));
  
  // Trigger Hindi Suggestions
  const words = value.split(" ");
  const lastWord = words[words.length - 1];
  if (lastWord.trim()) {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(lastWord), 300);
  }
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

const handleHindiChange = (entryId, plotIndex, field, value, isNumeric = false) => {
  // If numeric, only allow digits (0-9). If not a digit, stop.
  if (isNumeric && value !== "" && !/^\d+$/.test(value)) {
    return;
  }

  // 1. Update the state
  if (plotIndex === null) {
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, [field]: value } : e));
  } else {
    setEntries(prev => prev.map(e => {
      if (e.id === entryId) {
        const newPlots = [...e.plots];
        newPlots[plotIndex][field] = value;
        return { ...e, plots: newPlots };
      }
      return e;
    }));
  }

  // 2. Hindi Suggestion Logic
  // SKIP if field is numeric OR value is empty
  if (isNumeric || !value.trim()) {
    setSuggestions([]);
    return;
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
  if (!currentCell) return;
  const { entryId, shareholderIndex, plotIndex, field } = currentCell;

  setEntries(prev => prev.map(e => {
    if (e.id === entryId) {
      // 1. Logic for Shareholders
      if (shareholderIndex !== null && shareholderIndex !== undefined) {
        const newDetails = [...e.ryotDetails];
        const words = newDetails[shareholderIndex][field].trim().split(" ");
        words[words.length - 1] = selectedWord;
        newDetails[shareholderIndex][field] = words.join(" ") + " "; // Add ONE space to move to next word
        return { ...e, ryotDetails: newDetails };
      }

      // 2. Logic for Plots (North, South, etc.)
      if (plotIndex !== null && plotIndex !== undefined) {
        const newPlots = [...e.plots];
        const words = newPlots[plotIndex][field].trim().split(" ");
        words[words.length - 1] = selectedWord;
        newPlots[plotIndex][field] = words.join(" ") + " ";
        return { ...e, plots: newPlots };
      }

      // 3. Logic for Header/Footer fields
      const words = e[field].trim().split(" ");
      words[words.length - 1] = selectedWord;
      return { ...e, [field]: words.join(" ") + " " };
    }
    return e;
  }));

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
    // This prevents the "Space" character from being added to the textarea 
    // by the browser AFTER we've already updated the state.
    e.preventDefault(); 
    selectSuggestion(suggestions[activeIndex]);
  }
};

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Prapatra-2_${todayDate}`,
    // Optional: Keep your tracking logic
    onAfterPrint: async () => {
      await fetch("/api/track-prapatra2-print", { method: "POST" });
      console.log("Print tracked successfully");
    },
  });

  useEffect(() => {
    setTodayDate(new Date().toLocaleDateString("en-GB"));
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 no-print-bg">
      <div className="flex justify-center gap-4 mb-6 print:hidden">
        {/* Print Button */}
        <button
          onClick={() => {
    if (validateForm()) {
      handlePrint();
    }
  }}
          disabled={isPrinting}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isPrinting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Printer className="w-5 h-5" />
          )}
          {isPrinting ? "Preparing..." : "Print Prapatra-2"}
        </button>
        
        {/* Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isDownloading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
        </button>
      </div>

      <div className="w-full overflow-x-auto print:overflow-visible  ">
        <div ref={contentRef} className=" relative max-md:min-w-[1000px] mx-auto bg-white shadow-2xl print:shadow-none print:m-0 page-container p-4 md:p-6 lg:p-8 border border-gray-200 print:border-none w-full">
          
          <header className="text-center underline mb-2">
            <p className="font-bold text-lg text-black">प्रपत्र-2</p>
            <p className="text-sm">(देखें नियम-6 उप नियम-(1))</p>
            <h1 className="font-bold mt-2 text-black text-base">रैयत द्वारा स्वामित्व/धारित भूमि की स्व-घोषणा हेतु प्रपत्र</h1>
          </header>

          {/* TOP HEADER SECTION WITH HINDI INPUT */}
          <section className="grid grid-cols-3 gap-y-4 text-sm mb-4 text-black font-medium">
            {[
              { label: "राजस्व ग्राम", field: "revenueVillage", width: "w-52", numeric: false },
              { label: "थाना नं०", field: "thanaNo", width: "w-24", numeric: true }, // Set to true
              { label: "हल्का नं०", field: "halkaNo", width: "w-24", numeric: true }, // Set to true
              { label: "पुलिस थाना", field: "policeThana", width: "w-50", numeric: false },
              { label: "अंचल", field: "anchal", width: "w-50", numeric: false },
              { label: "जिला", field: "district", width: "w-50", numeric: false },
            ].map((item) => (
              <span key={item.field} className="flex flex-col">
  <div className="flex items-center">
    {item.label} :- 
    <input
      className={`border-b border-dotted outline-none px-1 bg-transparent ${item.width} ${
        (!entries[0][item.field] && item.field !== 'halkaNo') ? "border-red-400" : "border-black"
      } focus:border-blue-500 transition-colors`}
                  value={entries[0][item.field]}
                  onFocus={() => setCurrentCell({ entryId: entries[0].id, plotIndex: null, field: item.field })}
                  onChange={(e) => 
                    handleHindiChange(entries[0].id, null, item.field, e.target.value, item.numeric)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={item.numeric ? "00" : "लिखें"}
                  
                /></div>
  {(!entries[0][item.field] && item.field !== 'halkaNo') && (
    <span className="text-[10px] text-red-500 italic ml-14 print:hidden">आवश्यक है*</span>
  )}
</span>
            ))}
          </section>

          <div className="relative">
            {/* Suggestion Dropdown */}
            {suggestions.length > 0 && currentCell && (
              <div className="fixed bg-white border-2 border-blue-500 rounded shadow-2xl z-[9999] min-w-[150px]"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', maxWidth: '90vw' }}>
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => selectSuggestion(s)}
                    className={`px-4 py-2 cursor-pointer border-b last:border-0 ${i === activeIndex ? "bg-blue-100 font-bold" : "hover:bg-gray-100"}`}>
                    {s}
                  </div>
                ))}
              </div>
            )}

            <table className="w-full border-collapse border-[1.5px] border-black text-[11px] text-center table-fixed">
               <colgroup>
                <col style={{ width: '12%' }} /> {/* Column 1: Ryot Name */}
                <col style={{ width: '10%' }} /> {/* Column 2: Address */}
                <col style={{ width: '4%' }} />  {/* Column 3: Khata */}
                <col style={{ width: '4%' }} />  {/* Column 4: Khesra */}
                <col style={{ width: '4%' }} />  {/* Column 5: Rakba */}
                <col style={{ width: '20%' }} /> {/* Column 6: CHAUHADDI (Maximized) */}
                <col style={{ width: '7%' }} />  {/* Column 7: Type */}
                <col style={{ width: '4%' }} />  {/* Column 8: Rent */}
                <col style={{ width: '5%' }} />  {/* Column 9: Jamabandi */}
                <col style={{ width: '8%' }} />  {/* Column 10: Claim Basis */}
                <col style={{ width: '8%' }} />  {/* Column 11: Remarks */}
              </colgroup>
              <thead>
                <tr className="">
                  <th className="border border-black p-1" rowSpan={2}>रैयत का नाम (सह-हिस्सेदारों का नाम एवं अंश, अगर कोई हो, सहित) एवं पिता का नाम</th>
                  <th className="border border-black p-1" rowSpan={2}>स्थायी पता</th>
                  <th className="border border-black p-1 " colSpan={6}>स्वामित्व/धारित भूमि का ब्यौरा</th>
                  <th className="border border-black p-1 " rowSpan={2}>जमाबंदी सं०</th>
                  <th className="border border-black p-1 " rowSpan={2}>भूमि पर दावा का आधार यथा-उत्तराधिकार/दान क्रय/बंदोबस्त/अन्य</th>
                  <th className="border border-black p-1 " rowSpan={2}>अभ्युक्ति अगर <br />कोई हो</th>
                </tr>
                <tr className=" text-[10px]">
                  <th className="border border-black p-1">खाता</th>
                  <th className="border border-black p-1">खेसरा</th>
                  <th className="border border-black p-1">रकबा <br />ए0 डी0</th>
                  <th className="border border-black p-1]">चौहद्दी</th>
                  <th className="border border-black p-1">किस्म जमीन</th>
                  <th className="border border-black p-1">सेस को छोड़कर लगान</th>
                </tr>
                <tr className=" font-bold text-[9px]">
                  {Array.from({ length: 11 }).map((_, i) => <td key={i} className="border border-black">{i + 1}</td>)}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <React.Fragment key={entry.id}>
                    {entry.plots.map((plot, pIdx) => (
                      <tr key={pIdx}>
                        {pIdx === 0 && (
                          <>
                            <td className="border border-black p-1 align-top" rowSpan={entry.plots.length}>
                              {entry.ryotDetails.map((ryot, rIdx) => (
                                <div key={rIdx} className="mb-2 border-b border-gray-200 last:border-0 pb-1 relative group">
                                  <div className="flex items-start gap-1">
                                    <span className="text-[10px] font-bold mt-1">{rIdx + 1}.</span>
                                    <div className="flex-1 text-[11px]">
                                      <textarea 
                                        placeholder="रैयत का नाम"
                                        value={ryot.name}
                                        spellCheck="false"
                                        onFocus={() => setCurrentCell({ entryId: entry.id, shareholderIndex: rIdx, field: 'name' })}
                                        onChange={(e) => handleShareholderChange(entry.id, rIdx, 'name', e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full min-h-[30px] leading-tight outline-none resize-none bg-transparent placeholder:italic "
                                      />
                                      <textarea 
                                        placeholder="पिता / पति का नाम"
                                        value={ryot.fatherName}
                                        spellCheck="false"
                                        onFocus={() => setCurrentCell({ entryId: entry.id, shareholderIndex: rIdx, field: 'fatherName' })}
                                        onChange={(e) => handleShareholderChange(entry.id, rIdx, 'fatherName', e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full min-h-[30px] leading-tight outline-none resize-none bg-transparent text-gray-700 border-t border-dotted border-gray-300 placeholder:italic"
                                      />
                                    </div>
                                    
                                    {/* Remove Button - Hidden in Print and hidden if only 1 item remains */}
                                    {entry.ryotDetails.length > 1 && (
                                      <button 
                                        onClick={() => removeShareholder(entry.id, rIdx)}
                                        className="print:hidden text-red-500 hover:text-red-700 text-[10px] font-bold px-1"
                                        title="Remove"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              
                              {/* Add Button - Hidden in Print and hidden if limit reached */}
                              {entry.ryotDetails.length < 4 && (
                                <button 
                                  type="button"
                                  onClick={() => addShareholder(entry.id)}
                                  className="print:hidden mt-1 w-full text-[9px] bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-1 rounded border border-indigo-200 dashed"
                                >
                                  + अन्य हिस्सेदार जोड़ें ({entry.ryotDetails.length}/4)
                                </button>
                              )}
                            </td>
                            <td className="border border-black p-1 align-top" rowSpan={entry.plots.length}>
                              <textarea 
                              placeholder="स्थायी पता"
                                value={entry.address}
                                onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: null, field: 'address' })}
                                onChange={(e) => handleHindiChange(entry.id, null, 'address', e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full min-h-[140px] outline-none resize-none bg-transparent placeholder:italic" />
                            </td>
                          </>
                        )}

                        <td className="border border-black "><input className="w-full text-center outline-none bg-transparent placeholder:italic" placeholder="00" value={plot.khata} onChange={(e) => handlePlotChange(entry.id, pIdx, 'khata', e.target.value)} /></td>
                        <td className="border border-black"><input className="w-full text-center outline-none bg-transparent placeholder:italic" placeholder="00" value={plot.khesra} onChange={(e) => handlePlotChange(entry.id, pIdx, 'khesra', e.target.value)} /></td>
                        <td className="border border-black"><input className="w-full text-center outline-none bg-transparent placeholder:italic" placeholder="00" value={plot.rakba} onChange={(e) => handlePlotChange(entry.id, pIdx, 'rakba', e.target.value)} /></td>

                        <td className="border border-black p-0 text-left ">
                          <div className="flex flex-col text-[10px]">
                            {['north', 'south', 'east', 'west'].map((dir, i) => {
                              const labels = { north: 'ऊ०-', south: 'द०-', east: 'पु०-', west: 'प०-' };
                              return (
                                <div key={dir} className={`flex items-center px-1 ${i < 3 ? 'border-b border-black' : ''}`}>
                                  <span className="w-6 border-r border-black mr-1 font-bold">{labels[dir]}</span>
                                  <input 
                                    value={plot[dir]}
                                    onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: pIdx, field: dir })}
                                    onChange={(e) => handleHindiChange(entry.id, pIdx, dir, e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 outline-none h-6 bg-transparent" />
                                </div>
                              );
                            })}
                          </div>
                        </td>

                        <td className="border border-black p-1">
                          <input 
                            placeholder="किस्म जमीन"
                            value={plot.type}
                            onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: pIdx, field: 'type' })}
                            onChange={(e) => handleHindiChange(entry.id, pIdx, 'type', e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full text-center outline-none bg-transparent placeholder:italic" />
                        </td>
                        <td className="border border-black"><input className="w-full text-center outline-none bg-transparent placeholder:italic" placeholder="00.00" value={plot.rent} onChange={(e) => handlePlotChange(entry.id, pIdx, 'rent', e.target.value)} /></td>

                        {/* Individual cells for Jamabandi, Claim Basis, and Remarks for every row */}
                        <td className="border border-black p-1 align-top">
                          <input 
                            placeholder="00" 
                            value={plot.jamabandi || ""} // Accessing from plot level if you moved it, otherwise entry.jamabandi
                            onChange={(e) => handlePlotChange(entry.id, pIdx, 'jamabandi', e.target.value)} 
                            className="w-full text-center outline-none bg-transparent placeholder:italic" 
                          />
                        </td>

                        <td className="border border-black p-1 align-top">
                          <textarea 
                            placeholder="दावा का आधार"
                            value={plot.claimBasis || ""} 
                            onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: pIdx, field: 'claimBasis' })}
                            onChange={(e) => handleHindiChange(entry.id, pIdx, 'claimBasis', e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full min-h-[40px] outline-none resize-none bg-transparent text-[10px] placeholder:italic" 
                          />
                        </td>

                        <td className="border border-black p-1 align-top">
                          <textarea 
                            placeholder="अभ्युक्ति"
                            value={plot.remarks || ""} 
                            onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: pIdx, field: 'remarks' })}
                            onChange={(e) => handleHindiChange(entry.id, pIdx, 'remarks', e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full min-h-[40px] outline-none resize-none bg-transparent text-[10px] placeholder:italic" 
                          />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[9px] text-black leading-tight font-medium">
            मैं/हम घोषणा करता हूँ/करते हैं कि स्व-घोषणा में की गई प्रविष्टि मेरी/हमारी जानकारी में सही है। स्व-घोषणा में किसी गलत प्रविष्टि के लिए मैं/हम जवाबदेह हूँ/है। <br />
            नोट :- इस प्रपत्र को दो प्रतियों में दाखिल किया जायेगा। एक प्रति आवेदक को प्राप्तकर्त्ता पदा0/कर्मी द्वारा हस्ताक्षर तथा आवेदन की तारीख एवं क्रमांक अंकित कर प्राप्ति के प्रमाण के रूप में लौटाया जाएगा
          </p>
          <section className="mt-2 text-black">
            <div className="grid grid-cols-3 items-start px-4">
              <div className="space-y-0.5 text-sm font-medium">
                {/* PLACE WITH HINDI INPUT */}
                <p>
                  स्थान: 
                  <input 
                    className="border-b border-dotted border-black outline-none w-40 px-1 bg-transparent placeholder:italic" 
                    value={entries[0].place}
                    onFocus={() => setCurrentCell({ entryId: entries[0].id, plotIndex: null, field: 'place' })}
                    onChange={(e) => handleHindiChange(entries[0].id, null, 'place', e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="लिखें"
                  />
                </p>
                  <p>दिनांक: <span className="font-bold underline">{todayDate}</span></p>
                  <p>मोबाईल नं०: <input className="border-b border-dotted border-black outline-none w-32 font-bold bg-transparent placeholder:italic" maxLength={10} minLength={10} placeholder="लिखें" /></p>
              </div>
              <div>
                  <p>आधार सं०: <input className="border-b border-dotted border-black outline-none w-40 font-bold bg-transparent placeholder:italic" maxLength={12} minLength={12} placeholder="लिखें" /></p>
              </div>
              <div className="text-center">
                <div className="w-64"></div>
                <p className="text-sm font-bold">रैयत का हस्ताक्षर / अंगूठे का निशान</p>
                <div className="mt-6 space-y-2 text-left text-[13px] border-t border-black">
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 mb-6 print:hidden">
        {/* Print Button */}
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isPrinting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Printer className="w-5 h-5" />
          )}
          {isPrinting ? "Preparing..." : "Print Prapatra-2"}
        </button>
        
        {/* Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isDownloading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
        </button>
      </div>
      <style jsx global>{`
  @page { 
    size: A4 landscape; 
    margin: 5mm; 
  }

  /* ===== SCREEN VIEW (Responsive) ===== */
  @media screen {
    .page-container {
      width: 100%;
      max-width: 1400px;   /* prevents over-stretching on big screens */
      min-height: auto;
    }
  }

  /* ===== PRINT VIEW (Exact A4 Landscape) ===== */
  @media print {

  /* Hide everything */
  body * {
    visibility: hidden !important;
  }
  
 
  input::placeholder,
  textarea::placeholder {
    color: transparent !important; /* Hide placeholder in print */
  }

  /* Show only form container */
  .page-container,
  .page-container * {
    visibility: visible !important;
  }

  /* Position form properly on page */
  .page-container {
    position: absolute;
    left: 0;
    top: 0;

    width: 297mm;
    height: 210mm;

    padding: 6mm;
    box-sizing: border-box;

    overflow: hidden;
  }

}
`}</style>
    </div>
  );

  function handlePlotChange(entryId, pIdx, field, val) {
    setEntries(prev => prev.map(e => {
        if (e.id === entryId) {
            const newPlots = [...e.plots];
            newPlots[pIdx][field] = val;
            return { ...e, plots: newPlots };
        }
        return e;
    }));
  }

  function handleEntryChange(entryId, field, val) {
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, [field]: val } : e));
  }
}