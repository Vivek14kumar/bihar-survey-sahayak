"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Users, UserPlus, RotateCcw,  Edit3, CircleCheckBig, Download, IndianRupee  } from "lucide-react";
import AutoFamilyTreePDF from "./TreePDF";
import { pdf } from "@react-pdf/renderer";
import FamilyTreePreview from "@/components/FamilyTreePreviewWrapper";

import toast from "react-hot-toast";

const RELATIONS = ["स्वयं", "पुत्र", "पुत्री", "पत्नी", "मृतक"];

export default function Vanshavali() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [relation, setRelation] = useState("स्वयं");
  const [editId, setEditId] = useState(null);

  const [formatType, setFormatType] = useState("survey"); // 'survey' or 'blank'
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [applicantMobile, setApplicantMobile] = useState("");

  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentField, setCurrentField] = useState(null);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  const generatePDF = async () => {
  if (!treeData) return;

  const blob = await pdf(
    <AutoFamilyTreePDF data={treeData} formatType={formatType} />
  ).toBlob();

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `Vanshavali_${treeData.name || "Bihar_Survey"}.pdf`;
  link.click();

  URL.revokeObjectURL(url);
};

  // ---------- Transliteration API ----------
  const fetchSuggestions = async (word) => {
    if (!word) return;
    if (cacheRef.current[word]) {
      setSuggestions(cacheRef.current[word]);
      setActiveIndex(0);
      return;
    }
    try {
      const res = await fetch(
        `https://inputtools.google.com/request?text=${word}&itc=hi-t-i0-und&num=5`
      );
      const data = await res.json();
      if (data[0] === "SUCCESS") {
        const result = data[1][0][1];
        cacheRef.current[word] = result;
        setSuggestions(result);
        setActiveIndex(0);
      }
    } catch {
      setSuggestions([]);
    }
  };

  const debounceFetch = (word) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(word);
    }, 300);
  };

  /*const handleInputChange = (value, setter) => {
    setter(value);
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    if (lastWord.trim()) debounceFetch(lastWord);
    else setSuggestions([]);
  };*/
  const handleInputChange = (value, setter) => {
    // MOBILE FIX: Detect if the last typed character is a space 
    // and if we have active suggestions waiting to be applied.
    if (value.endsWith(" ") && suggestions.length > 0) {
      const words = value.split(" ");
      
      // 'words' will look like ["mera", ""] because of the trailing space.
      // We replace the last typed English word (index: length - 2) with the top suggestion.
      words[words.length - 2] = suggestions[0];
      
      // Join it back together (this automatically keeps the trailing space)
      setter(words.join(" "));
      setSuggestions([]);
      return;
    }

    // Standard typing logic (no space pressed)
    setter(value);
    const words = value.split(" ");
    const lastWord = words[words.length - 1];
    
    if (lastWord.trim()) {
      debounceFetch(lastWord);
    } else {
      setSuggestions([]);
    }
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
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
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

  //------------ Select Parent Details ----------------
  const parentOptions = [
    ...new Map(
      members.map((m) => [m.name, { name: m.name, relation: m.relation }])
    ).values()
  ];

  const filteredParents = parentOptions.filter((p) => {
    // पत्नी → only male members
    if (relation === "पत्नी") {
      return ["स्वयं", "पुत्र"].includes(p.relation);
    }

    // पुत्र / पुत्री → only male members
    if (relation === "पुत्र" || relation === "पुत्री") {
      return ["स्वयं", "पुत्र"].includes(p.relation);
    }

    return true;
  });

  useEffect(()=>{
    setParent("");
  },[relation]);

  // ---------- Load Razorpay script ----------
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
  }, []);

  // ---------- LocalStorage ----------
  useEffect(() => {
    const saved = localStorage.getItem("survey_data");
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("survey_data", JSON.stringify(members));
  }, [members]);

  //------------- Delete LocalStorage -----------
  const handleReset = () => {
  if (confirm("क्या आप सभी डेटा हटाना चाहते हैं?")) {
    localStorage.removeItem("survey_data");
    setMembers([]);
    setRelation("स्वयं");   // reset relation
    setApplicantMobile([]);
  }
}; 
  const trackVanshawaliDownload = async () => {
  try {
    // We send the "type" so the backend knows to check 'freeUsedVanshavali'
    const res = await fetch("/api/check-download", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "vanshavali" }) 
    });
    
    const data = await res.json();

    if (!data.allowed) {
      // Free limit reached → open payment
      openRazorpay();
      return false;
    }

    // Access granted (either free or paid)
    return true;
  } catch (err) {
    console.error("Error checking download:", err);
    return false;
  }
};

  // ---------- Razorpay ----------
  const openRazorpay = async () => {
  // 1️⃣ Check if Razorpay is loaded
  if (!window.Razorpay) {
    alert("Payment system loading… please try again.");
    return;
  }

  try {
    // 2️⃣ Create order on backend
    const orderRes = await fetch("/api/create-razorpay-order", { 
      method: "POST",
      body: JSON.stringify({ type: "vanshavali" }) // Pass type here
    });
    if (!orderRes.ok) throw new Error("Failed to create order");

    const orderData = await orderRes.json();

    // 3️⃣ Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY, // frontend key
      amount: orderData.amount,
      currency: "INR",
      name: "Vanshavali PDF",
      description: "Payment for PDF download",
      order_id: orderData.id,

      // ✅ Prefill user info
      prefill: {
        name: "Customer Name",
        contact: applicantMobile,
        email: "customer@example.com", // add email for reliability
      },

      // ✅ Force Razorpay to use our prefill instead of cached values
      readonly: {
        name: false,
        contact: false,
        email: false,
      },

      theme: { color: "#2f78f6" },

      // 4️⃣ Handler after successful payment
      handler: async function (response) {
        try {
          await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          // 2️⃣ Track vanshavali paid download
            await fetch("/api/track-vanshawali", {
              method: "POST",
            });

          // ✅ Generate PDF only after successful verification
          generatePDF();
        } catch (err) {
          console.error("Payment verification failed", err);
          alert("Payment verification failed. Please contact support.");
        }
      },

      modal: {
        escape: true,
        ondismiss: function () {
          console.log("Payment popup closed by user");
        },
      },
    };

    // 5️⃣ Open Razorpay modal
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    alert("Something went wrong while initiating payment. Please try again.");
  }
};

  /*const trackVanshawaliDownload = async () => {
    await fetch("/api/track-vanshawali", { method: "POST" });
  };*/
  
  // ---------- PDF Download ----------
  const handleDownload = () => {
    // 1️⃣ Validate Form First
  // 1️⃣ मोबाइल नंबर चेक करें
  if (!applicantMobile) {
    alert("कृपया आवेदक का मोबाइल नंबर दर्ज करें।");
    return;
  }

  // भारतीय मोबाइल नंबर चेक करने का फॉर्मूला (शुरुआत 6,7,8,9 से और कुल 10 अंक)
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(applicantMobile)) {
    alert("कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें ।");
    return;
  }
  // 2️⃣ First Confirmation (Review Form)
  const confirmReview = window.confirm(
    "Payment करने से पहले कृपया वंशावली (PREVIEW) को ध्यान से देख लें।\n\nक्या आपने सभी जानकारी सही से भर दी है?"
  );

  if (!confirmReview) return;

  // 3️⃣ Legal Responsibility Confirmation
  const confirmResponsibility = window.confirm(
    "मैंने वंशावली को ध्यान से देख लिया है।\n\nयदि कोई जानकारी गलत है तो उसकी पूरी जिम्मेदारी मेरी होगी।\n\nक्या आप डाउनलोड जारी रखना चाहते हैं?"
  );

  if (!confirmResponsibility) return;
  openRazorpay();
};

/*const handleDownload = async () => {
  try {
    const res = await fetch("/api/check-download", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "vanshavali" }) 
    });
    const data = await res.json();

    if (!data.allowed) {
      toast.error("मुफ़्त डाउनलोड खत्म हो गया। कृपया भुगतान करें।", { icon: "💳" });
      openRazorpay();
      return;
    }

    // ✅ Increment vanshawali count
    await fetch("/api/track-vanshawali", { method: "POST" });
    
    // Show message if it was a free download
    if (data.freeRemaining !== undefined) {
      toast(`आपके पास अभी ${data.freeRemaining} मुफ़्त (FREE!) डाउनलोड बाकी हैं।`, {
        icon: <CircleCheckBig size={20} className="text-green-600" />,
        duration: 4000,
        style: {
          border: '1px solid #4f46e5',
          padding: '10px',
          color: '#96dc26',
        },
      });
    }

    // Trigger PDF Generation
    generatePDF();

  } catch (err) {
    console.error("Download error:", err);
    toast.error("तकनीकी समस्या, कृपया पुनः प्रयास करें।");
  }
};*/

  // ---------- Add / Edit Member ----------
  const handleAddMember = () => {
    if (!name.trim()) {
      alert("नाम आवश्यक है");
      return;
    }

    if (editId) {
      // Update existing member
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editId
            ? { ...m, name, parent, relation, dead: relation === "मृतक" }
            : m
        )
      );
      setEditId(null);
    } else {
      // Add new member
      const finalParent = members.length === 0 ? null : parent;
      setMembers([
        ...members,
        {
          id: Date.now(),
          name,
          parent: finalParent,
          relation: relation === "मृतक" ? "स्वयं" : relation,
          dead: relation === "मृतक",
        },
      ]);
    }

    setName("");
    setParent("");
    setRelation("पुत्र");
    setCurrentField(null);
  };

  const handleEditMember = (member) => {
    setName(member.name);
    setParent(member.parent || "");
    setRelation(member.relation === "पत्नी" && member.parent ? "पत्नी" : member.relation);
    setEditId(member.id);

    // Fix transliteration activation
    setCurrentField("name");
    setSuggestions([]);
  };

  const handleDeleteMember = (id) => {
    if (confirm("क्या आप सदस्य को हटाना चाहते हैं?")) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // ---------- Build Tree ----------
  const buildTree = () => {
    const map = {};
    members.forEach((m) => {
      map[m.name] = { ...m, children: [], spouse: null };
    });

    let root = null;
    members.forEach((m) => {
      if (!m.parent) {
        root = map[m.name];
        return;
      }
      const parentNode = map[m.parent];
      if (!parentNode) return;
      if (m.relation === "पत्नी") {
        parentNode.spouse = { name: m.name };
      } else {
        parentNode.children.push(map[m.name]);
      }
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
        className="p-3 rounded-xl border w-full"
      />
      {currentField === fieldName && suggestions.length > 0 && (
        <div className="absolute bg-white border rounded-xl mt-1 w-full shadow-lg z-50 max-h-48 overflow-auto">
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => selectSuggestion(s)}
              className={`px-3 py-2 cursor-pointer ${
                i === activeIndex ? "bg-indigo-100" : "hover:bg-gray-100"
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        

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


        {/* FORM */}
        <div className="bg-white shadow-xl rounded-3xl p-6 mb-6">
          {/* Header & Mobile Input Section */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-gray-100">

            {/* हेडिंग */}
            <div className="flex items-center gap-3">
              {/* Icon with beautiful background & soft shadow */}
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200 shadow-sm">
                <UserPlus size={22} strokeWidth={2.5} />
              </div>

              {/* Text with Gradient and Subtitle */}
              <div className="flex flex-col">
                <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent tracking-tight">
                  सदस्य जोड़ें
                </span>
                <span className="text-[11px] font-medium text-gray-500 mt-0.5">
                  वंशावली में परिवार का विवरण दर्ज करें
                </span>
              </div>
            </div>

            {/* आवेदक का मोबाइल नंबर */}
            <div className="w-full sm:w-auto">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 ml-1">
                आवेदक का मोबाइल नंबर <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all w-full sm:w-64">
                <span className="bg-gray-100 px-3 py-2 text-gray-600 text-sm font-medium border-r border-gray-300 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={applicantMobile}
                  onChange={(e) => {
                    // 1. सिर्फ नंबर टाइप होने दें
                    let val = e.target.value.replace(/\D/g, ""); 

                    // 2. अगर पहला नंबर 0, 1, 2, 3, 4 या 5 है, तो उसे हटा दें
                    val = val.replace(/^[0-5]+/, ""); 

                    setApplicantMobile(val);
                  }}
                  placeholder="10 अंकों का नंबर"
                  className="w-full px-3 py-2 text-sm outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {renderInput(name, setName, "name", "नाम लिखें")}

            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="p-3 rounded-xl border w-full"
            >
              {RELATIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            
            {/*Select Parent Details */}
            {/*renderInput(parent, setParent, "parent", "पिता / पति का नाम")*/}
            <select
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="p-3 rounded-xl border w-full"
            >
              <option value="">पिता / पति चुनें</option>

              {filteredParents.map((p, i) => (
                <option key={i} value={p.name}>
                  {p.relation} : {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto py-3"
            >
              <Plus size={18} /> {editId ? "संपादित करें" : "जोड़ें"}
            </button>
          </div>
        </div>

        {/* MEMBERS LIST */}
        {members.length > 0 && (
          <div className="bg-white shadow-xl rounded-3xl p-6 mb-6 overflow-x-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">सदस्य सूची</h2>
              <button 
               onClick={handleReset}
               className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-2 px-3">नाम</th>
                  <th className="py-2 px-3">रिश्ता</th>
                  <th className="py-2 px-3">पिता/पति</th>
                  <th className="py-2 px-3">क्रिया</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100">
                    <td className="py-2 px-3">{m.name}</td>
                    <td className="py-2 px-3">{m.relation}</td>
                    <td className="py-2 px-3">{m.parent || "-"}</td>
                    <td className="py-2 px-3 flex flex-col sm:flex-row gap-2">
                      {/*<button
                        onClick={() => handleEditMember(m)}
                        className="flex items-center gap-1 px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500 transition"
                      >
                        <Edit3 size={16} /> संपादित करें
                      </button>*/}
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} /> हटाएं
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PDF */}
        {treeData && (
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <FamilyTreePreview data={treeData} formatType={formatType} />

            <button
              onClick={handleDownload}
              className="w-full mt-4 bg-sky-400 hover:bg-sky-700 text-white p-4 rounded-xl font-semibold transition flex flex-col items-center gap-1"
            >
              <span className="flex items-center gap-2 text-lg">
                <Download size={20} />
                Download PDF Without Watermark - ₹ 15
              </span>

              <span className="text-sm font-normal opacity-90">
                बिना वॉटरमार्क PDF डाउनलोड करें – ₹15
              </span>
            </button>
          </div>
        )}
        {/* TESTING BYPASS BUTTON - REMOVE IN PRODUCTION 
        {process.env.NODE_ENV === "development" && (
          <button
            onClick={() => {
              toast.success("Testing Bypass: Generating PDF...");
              generatePDF();
            }}
            className="w-full mt-2 bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-xl font-mono text-xs flex items-center justify-center gap-2 border-2 border-dashed border-red-500"
          >
            [DEV ONLY] Bypass Payment & Download
          </button>
        )}*/}
      </div>
    </div>
  );
}
