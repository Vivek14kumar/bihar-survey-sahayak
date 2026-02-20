"use client";

import React, { useState, useEffect, useRef } from "react";

export default function LandscapePage() {
  const [todayDate, setTodayDate] = useState("");
  const [currentCell, setCurrentCell] = useState(null); 
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  const [isPrinting, setIsPrinting] = useState(false);

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
      ryotName: "",
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

  const handleHindiChange = (entryId, plotIndex, field, value) => {
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
    const { entryId, plotIndex, field } = currentCell;
    const entry = entries.find(e => e.id === entryId);
    const currentValue = plotIndex === null ? entry[field] : entry.plots[plotIndex][field];

    const words = currentValue.split(" ");
    words[words.length - 1] = selectedWord;
    const finalValue = words.join(" ") + " ";

    handleHindiChange(entryId, plotIndex, field, finalValue);
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

  const handlePrint = async () => {
    setIsPrinting(true);

    // Track only AFTER print dialog closes
    const afterPrintHandler = async () => {
      await fetch("/api/track-prapatra2-print", {
        method: "POST",
      });

      window.removeEventListener("afterprint", afterPrintHandler);
      setIsPrinting(false);
    };

    window.addEventListener("afterprint", afterPrintHandler);

    window.print();
  };

  useEffect(() => {
    setTodayDate(new Date().toLocaleDateString("en-GB"));
  }, []);

  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 no-print-bg">
      <div className="flex justify-center mb-6 print:hidden">
        <button
        onClick={handlePrint}
        disabled={isPrinting}
        className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
      >
        {isPrinting ? "Preparing Print..." : "Print Prapatra-2"}
      </button>
      </div>

      <div className="w-full overflow-x-auto print:overflow-visible  ">
        <div className=" relative mx-auto bg-white shadow-2xl print:shadow-none print:m-0 page-container p-4 md:p-6 lg:p-8 border border-gray-200 print:border-none w-full">
          
          <header className="text-center underline mb-6">
            <p className="font-bold text-lg text-black">प्रपत्र-2</p>
            <p className="text-sm">(देखें नियम-6 उप नियम-(1))</p>
            <h1 className="font-bold mt-2 text-black text-base">रैयत द्वारा स्वामित्व/धारित भूमि की स्व-घोषणा हेतु प्रपत्र</h1>
          </header>

          {/* TOP HEADER SECTION WITH HINDI INPUT */}
          <section className="grid grid-cols-3 gap-y-4 text-sm mb-6 text-black font-medium">
            {[
              { label: "राजस्व ग्राम", field: "revenueVillage", width: "w-40" },
              { label: "थाना नं०", field: "thanaNo", width: "w-24" },
              { label: "हल्का नं०", field: "halkaNo", width: "w-24" },
              { label: "पुलिस थाना", field: "policeThana", width: "w-40" },
              { label: "अंचल", field: "anchal", width: "w-40" },
              { label: "जिला", field: "district", width: "w-40" },
            ].map((item) => (
              <span key={item.field}>
                {item.label} :- 
                <input
                  className={`border-b border-dotted border-black outline-none px-1 bg-transparent ${item.width}`}
                  value={entries[0][item.field]}
                  onFocus={() => setCurrentCell({ entryId: entries[0].id, plotIndex: null, field: item.field })}
                  onChange={(e) => handleHindiChange(entries[0].id, null, item.field, e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="लिखें"
                />
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
              <thead>
                <tr className="">
                  <th className="border border-black p-1 w-[14%]" rowSpan={2}>रैयत का नाम (सह-हिस्सेदारों कनाम एवं अंश, अगर कोई हो, सहित) एवं पिता का नाम</th>
                  <th className="border border-black p-1 w-[12%]" rowSpan={2}>स्थायी पता</th>
                  <th className="border border-black p-1" colSpan={6}>स्वामित्व/धारित भूमि का ब्यौरा</th>
                  <th className="border border-black p-1 w-[8%]" rowSpan={2}>जमाबंदी सं०</th>
                  <th className="border border-black p-1 w-[12%]" rowSpan={2}>भूमि पर दावा का आधार यथा-उत्तराधिकार/दान क्रय/बंदोबस्त/अन्य</th>
                  <th className="border border-black p-1 w-[10%]" rowSpan={2}>अभ्युक्ति अगर <br />कोई हो</th>
                </tr>
                <tr className=" text-[10px]">
                  <th className="border border-black p-1 w-[5%]">खाता</th>
                  <th className="border border-black p-1 w-[5%]">खेसरा</th>
                  <th className="border border-black p-1 w-[6%]">रकबा <br />ए0 डी0</th>
                  <th className="border border-black p-1 w-[20%]">चौहद्दी</th>
                  <th className="border border-black p-1 w-[7%]">किस्म जमीन</th>
                  <th className="border border-black p-1 w-[7%]">सेस को ए0 डी0 छोड़कर लगान</th>
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
                              <textarea 
                                value={entry.ryotName}
                                onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: null, field: 'ryotName' })}
                                onChange={(e) => handleHindiChange(entry.id, null, 'ryotName', e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full min-h-[140px] outline-none resize-none bg-transparent" />
                            </td>
                            <td className="border border-black p-1 align-top" rowSpan={entry.plots.length}>
                              <textarea 
                                value={entry.address}
                                onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: null, field: 'address' })}
                                onChange={(e) => handleHindiChange(entry.id, null, 'address', e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full min-h-[140px] outline-none resize-none bg-transparent" />
                            </td>
                          </>
                        )}

                        <td className="border border-black"><input className="w-full text-center outline-none bg-transparent" value={plot.khata} onChange={(e) => handlePlotChange(entry.id, pIdx, 'khata', e.target.value)} /></td>
                        <td className="border border-black"><input className="w-full text-center outline-none bg-transparent" value={plot.khesra} onChange={(e) => handlePlotChange(entry.id, pIdx, 'khesra', e.target.value)} /></td>
                        <td className="border border-black"><input className="w-full text-center outline-none bg-transparent" value={plot.rakba} onChange={(e) => handlePlotChange(entry.id, pIdx, 'rakba', e.target.value)} /></td>

                        <td className="border border-black p-0 text-left">
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
                            value={plot.type}
                            onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: pIdx, field: 'type' })}
                            onChange={(e) => handleHindiChange(entry.id, pIdx, 'type', e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full text-center outline-none bg-transparent" />
                        </td>
                        <td className="border border-black"><input className="w-full text-center outline-none bg-transparent" value={plot.rent} onChange={(e) => handlePlotChange(entry.id, pIdx, 'rent', e.target.value)} /></td>

                        {pIdx === 0 && (
                          <>
                            <td className="border border-black p-1 align-top" rowSpan={entry.plots.length}>
                              <input value={entry.jamabandi} onChange={(e) => handleEntryChange(entry.id, 'jamabandi', e.target.value)} className="w-full text-center outline-none bg-transparent" />
                            </td>
                            <td className="border border-black p-1 align-top" rowSpan={entry.plots.length}>
                              <textarea 
                                value={entry.claimBasis}
                                onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: null, field: 'claimBasis' })}
                                onChange={(e) => handleHindiChange(entry.id, null, 'claimBasis', e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full min-h-[140px] outline-none resize-none bg-transparent text-[10px]" />
                            </td>
                            <td className="border border-black p-1 align-top" rowSpan={entry.plots.length}>
                              <textarea 
                                value={entry.remarks}
                                onFocus={() => setCurrentCell({ entryId: entry.id, plotIndex: null, field: 'remarks' })}
                                onChange={(e) => handleHindiChange(entry.id, null, 'remarks', e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full min-h-[140px] outline-none resize-none bg-transparent text-[10px]" />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[9px] mt-4 text-black leading-tight font-medium">
            मैं/हम घोषणा करता हूँ/करते हैं कि स्व-घोषणा में की गई प्रविष्टि मेरी/हमारी जानकारी में सही है। स्व-घोषणा में किसी गलत प्रविष्टि के लिए मैं/हम जवाबदेह हूँ/है। <br />
            नोट :- इस प्रपत्र को दो प्रतियों में दाखिल किया जायेगा। एक प्रति आवेदक को प्राप्तकर्त्ता पदा0/कर्मी द्वारा हस्ताक्षर तथा आवेदन की तारीख एवं क्रमांक अंकित कर प्राप्ति के प्रमाण के रूप में लौटाया जाएगा
          </p>
          <section className="mt-4 text-black">
            <div className="grid grid-cols-3 items-start px-4">
              <div className="space-y-4 text-sm font-medium">
                {/* PLACE WITH HINDI INPUT */}
                <p>
                  स्थान: 
                  <input 
                    className="border-b border-dotted border-black outline-none w-40 px-1 bg-transparent" 
                    value={entries[0].place}
                    onFocus={() => setCurrentCell({ entryId: entries[0].id, plotIndex: null, field: 'place' })}
                    onChange={(e) => handleHindiChange(entries[0].id, null, 'place', e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="लिखें"
                  />
                </p>
                  <p>दिनांक: <span className="font-bold underline">{todayDate}</span></p>
                  <p>मोबाईल नं०: <input className="border-b border-dotted border-black outline-none w-32 font-bold bg-transparent" maxLength={10} minLength={10} placeholder="लिखें" /></p>
              </div>
              <div>
                  <p>आधार सं०: <input className="border-b border-dotted border-black outline-none w-40 font-bold bg-transparent" maxLength={12} minLength={12} placeholder="लिखें" /></p>
              </div>
              <div className="text-center">
                <div className="w-64 mb-2"></div>
                <p className="text-sm font-bold">रैयत का हस्ताक्षर / अंगूठे का निशान</p>
                <div className="mt-10 space-y-2 text-left text-[13px] border-t border-black">
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <div className="flex justify-center mb-6 print:hidden">
        <button
        onClick={handlePrint}
        disabled={isPrinting}
        className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
      >
        {isPrinting ? "Preparing Print..." : "Print Prapatra-2"}
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