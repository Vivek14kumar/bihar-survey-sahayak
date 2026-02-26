"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Users, UserPlus, Edit3, CircleCheckBig  } from "lucide-react";
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

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentField, setCurrentField] = useState(null);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  const generatePDF = async () => {
  if (!treeData) return;

  const blob = await pdf(
    <AutoFamilyTreePDF data={treeData} />
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

  const trackVanshawaliDownload = async () => {
    try {
      const res = await fetch("/api/check-download", { method: "POST" });
      const data = await res.json();

      if (!data.allowed) {
        // Free limit reached → open payment
        openRazorpay();
        return false;
      }

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
    const orderRes = await fetch("/api/create-razorpay-order", { method: "POST" });
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
        contact: "9876543210",
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


const handleDownload = async () => {
  try {
    const res = await fetch("/api/check-download", { method: "POST" });
    const data = await res.json();

    if (!data.allowed) {
      toast.error("मुफ़्त डाउनलोड खत्म हो गया। कृपया भुगतान करें।", { icon: "💳" });
      openRazorpay();
      return;
    }

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
};

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

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white p-6 rounded-3xl shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Users size={32} />
            <h1 className="text-2xl sm:text-3xl font-bold">
              बिहार भूमि सर्वेक्षण वंशावली
            </h1>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white shadow-xl rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold">
            <UserPlus size={20} />
            सदस्य जोड़ें
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

            {renderInput(parent, setParent, "parent", "पिता / पति का नाम")}

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
            <h2 className="text-lg font-semibold mb-4">सदस्य सूची</h2>
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
            <FamilyTreePreview data={treeData}  />

            <button
              onClick={handleDownload}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-xl font-semibold transition"
            >
              PDF डाउनलोड करें
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
