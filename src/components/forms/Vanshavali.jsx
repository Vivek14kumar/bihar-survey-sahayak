"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Users, UserPlus, RotateCcw, Edit3, CircleCheckBig, Download, Loader2 } from "lucide-react";
import AutoFamilyTreePDF from "@/components/TreePDF";
import { pdf } from "@react-pdf/renderer";
import FamilyTreePreview from "@/components/FamilyTreePreviewWrapper";
import toast from "react-hot-toast";

const RELATIONS = ["स्वयं", "पुत्र", "पुत्री", "पत्नी", "मृतक"];

// Updated with Props: isGenerating (loading state), onGenerate (wallet logic)
export default function Vanshavali({ isGenerating, onGenerate }) {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [relation, setRelation] = useState("स्वयं");
  const [editId, setEditId] = useState(null);
  const [formatType, setFormatType] = useState("survey");

  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentField, setCurrentField] = useState(null);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  // Updated generatePDF to accept a watermark flag
  const generatePDF = async (withWatermark = false) => {
    if (!treeData) return;

    const blob = await pdf(
      <AutoFamilyTreePDF data={treeData} formatType={formatType} isPreview={withWatermark} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Vanshavali_${withWatermark ? "Preview_" : ""}${treeData.name || "Bihar_Survey"}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- INTERNAL WALLET LOGIC ---
  const handleDownload = async () => {
    if (!treeData) {
      toast.error("कृपया पहले सदस्य जोड़ें");
      return;
    }

    // Confirmation matches your design
    if (!window.confirm("क्या आपने जानकारी सही से भर दी है? वॉलेट से राशि काट ली जाएगी।")) return;
    const mobile = "N/A";
    // Trigger parent wallet deduction system
    const success = await onGenerate(treeData.name, mobile); 
    
    if (success) {
      toast.success("भुगतान सफल! डाउनलोड शुरू हो रहा है...");
      generatePDF(false); // Generate clean PDF
    }
  };

  const handleWatermarkDownload = () => {
    toast.success("वॉटरमार्क के साथ डाउनलोड हो रहा है...");
    generatePDF(true); // Generate with watermark
  };

  // ---------- Transliteration API (Unchanged) ----------
  const fetchSuggestions = async (word) => {
    if (!word) return;
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

  const debounceFetch = (word) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(word), 300);
  };

  const handleInputChange = (value, setter) => {
    setter(value);
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.trim()) debounceFetch(lastWord);
    else setSuggestions([]);
  };

  const selectSuggestion = (selectedWord) => {
    const setter = currentField === "name" ? setName : setParent;
    const value = currentField === "name" ? name : parent;
    const words = value.split(" ");
    words[words.length - 1] = selectedWord;
    setter(words.join(" ") + " ");
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }
    if (e.key === " ") {
      if (suggestions.length > 0) {
        e.preventDefault();
        selectSuggestion(suggestions[0]);
      }
    }
  };

  //------------ Parent Select Logic (Unchanged) ----------------
  const parentOptions = [
    ...new Map(members.map((m) => [m.name, { name: m.name, relation: m.relation }])).values()
  ];

  const filteredParents = parentOptions.filter((p) => {
    if (relation === "पत्नी" || relation === "पुत्र" || relation === "पुत्री") {
      return ["स्वयं", "पुत्र"].includes(p.relation);
    }
    return true;
  });

  useEffect(() => { setParent(""); }, [relation]);

  useEffect(() => {
    const saved = localStorage.getItem("survey_data");
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("survey_data", JSON.stringify(members));
  }, [members]);

  const handleReset = () => {
    if (confirm("क्या आप सभी डेटा हटाना चाहते हैं?")) {
      localStorage.removeItem("survey_data");
      setMembers([]);
      setRelation("स्वयं");
    }
  };

  const handleAddMember = () => {
    if (!name.trim()) return;
    if (editId) {
      setMembers((prev) => prev.map((m) => m.id === editId ? { ...m, name, parent, relation, dead: relation === "मृतक" } : m));
      setEditId(null);
    } else {
      const finalParent = members.length === 0 ? null : parent;
      setMembers([...members, { id: Date.now(), name, parent: finalParent, relation: relation === "मृतक" ? "स्वयं" : relation, dead: relation === "मृतक" }]);
    }
    setName(""); setParent(""); setRelation("पुत्र"); setCurrentField(null);
  };

  const handleDeleteMember = (id) => {
    if (confirm("क्या आप सदस्य को हटाना चाहते हैं?")) setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const buildTree = () => {
    const map = {};
    members.forEach((m) => { map[m.name] = { ...m, children: [], spouse: null }; });
    let root = null;
    members.forEach((m) => {
      if (!m.parent) { root = map[m.name]; return; }
      const parentNode = map[m.parent];
      if (!parentNode) return;
      if (m.relation === "पत्नी") parentNode.spouse = { name: m.name };
      else parentNode.children.push(map[m.name]);
    });
    return root;
  };

  const treeData = buildTree();

  const renderInput = (value, setter, fieldName, placeholder) => (
    <div className="relative w-full">
      <input
        value={value}
        onFocus={() => setCurrentField(fieldName)}
        onChange={(e) => handleInputChange(e.target.value, setter)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="p-3 rounded-xl border w-full focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      {currentField === fieldName && suggestions.length > 0 && (
        <div className="absolute bg-white border rounded-xl mt-1 w-full shadow-lg z-50 max-h-48 overflow-auto">
          {suggestions.map((s, i) => (
            <div key={i} onClick={() => selectSuggestion(s)} className={`px-3 py-2 cursor-pointer ${i === activeIndex ? "bg-indigo-100" : "hover:bg-gray-100"}`}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        
        {/* FORMAT SELECTOR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Option 1: Survey Format */}
            <div 
              onClick={() => setFormatType("survey")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm flex items-start gap-4 ${
                formatType === 'survey' ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' : 'border-gray-200 bg-white hover:border-indigo-300'
              }`}
            >
              <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${formatType === 'survey' ? 'border-indigo-600' : 'border-gray-300'}`}>
                {formatType === 'survey' && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
              </div>
              <div>
                <h3 className="font-bold text-indigo-900 text-lg">
                  सर्वे वंशावली <span className="text-sm font-normal text-indigo-700 block md:inline">(Survey Format)</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  स्व-घोषणा (Self-Declaration) के साथ। बिहार भूमि सर्वे 2026 के लिए सबसे उपयुक्त।
                </p>
              </div>
            </div>
          
            {/* Option 2: Blank Format */}
            <div 
              onClick={() => setFormatType("blank")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm flex items-start gap-4 ${
                formatType === 'blank' ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200' : 'border-gray-200 bg-white hover:border-emerald-300'
              }`}
            >
              <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${formatType === 'blank' ? 'border-emerald-600' : 'border-gray-300'}`}>
                {formatType === 'blank' && <div className="w-3 h-3 bg-emerald-600 rounded-full" />}
              </div>
              <div>
                <h3 className="font-bold text-emerald-900 text-lg">
                  सादा वंशावली <span className="text-sm font-normal text-emerald-700 block md:inline">(Affidavit/ मुखिया/सरपंच)</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  बिना किसी टेक्स्ट के। कोर्ट शपथ-पत्र (Affidavit) और नोटरी/मुखिया/सरपंच कार्य के लिए उपयुक्त।
                </p>
              </div>
            </div>
        </div>

        {/* ADD MEMBER FORM */}
        <div className="bg-white shadow-xl rounded-3xl p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderInput(name, setName, "name", "नाम लिखें")}
            <select value={relation} onChange={(e) => setRelation(e.target.value)} className="p-3 rounded-xl border w-full">
              {RELATIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
            <select value={parent} onChange={(e) => setParent(e.target.value)} className="p-3 rounded-xl border w-full">
              <option value="">पिता / पति चुनें</option>
              {filteredParents.map((p, i) => <option key={i} value={p.name}>{p.relation}: {p.name}</option>)}
            </select>
            <button onClick={handleAddMember} className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2">
              <Plus size={18} /> {editId ? "संपादित करें" : "जोड़ें"}
            </button>
          </div>
        </div>

        {/* MEMBERS LIST */}
        {members.length > 0 && (
          <div className="bg-white shadow-xl rounded-3xl p-6 mb-6 overflow-x-auto">
             <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">सदस्य सूची</h2>
              <button onClick={handleReset} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white"><RotateCcw size={16} /> Reset</button>
            </div>
            <table className="min-w-full">
              <thead><tr className="border-b"><th className="py-2 px-3 text-left">नाम</th><th className="py-2 px-3 text-left">रिश्ता</th><th className="py-2 px-3 text-left">पिता/पति</th><th className="py-2 px-3 text-left">क्रिया</th></tr></thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b">
                    <td className="py-2 px-3">{m.name}</td>
                    <td className="py-2 px-3">{m.relation}</td>
                    <td className="py-2 px-3">{m.parent || "-"}</td>
                    <td className="py-2 px-3"><button onClick={() => handleDeleteMember(m.id)} className="text-red-500"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PREVIEW & ACTIONS */}
        {treeData && (
          <div className="bg-white p-6 rounded-3xl shadow-xl space-y-4">
            <FamilyTreePreview data={treeData} formatType={formatType} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Watermark Download Button */}
              <button
                onClick={handleWatermarkDownload}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-xl font-semibold transition flex flex-col items-center border-2 border-dashed border-gray-300"
              >
                <span className="flex items-center gap-2">
                  <Download size={20} /> Preview (Watermark)
                </span>
                <span className="text-xs font-normal">Download With Watermark (Free)</span>
              </button>

              {/* Wallet Deduction Download Button */}
              <button
                disabled={isGenerating}
                onClick={handleDownload}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-semibold transition flex flex-col items-center disabled:opacity-70"
              >
                {isGenerating ? (
                   <span className="flex items-center gap-2 text-lg animate-pulse">
                    <Loader2 className="animate-spin" size={20} /> Processing...
                   </span>
                ) : (
                  <>
                    <span className="flex items-center gap-2 text-lg">
                      <Download size={20} /> Final PDF (Wallet)
                    </span>
                    <span className="text-sm font-normal opacity-90">PDF Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}