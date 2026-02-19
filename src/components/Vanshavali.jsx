"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Trash2,
  FileDown,
  Users,
  UserPlus,
  List,
} from "lucide-react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import AutoFamilyTreePDF from "./TreePDF";

const RELATIONS = ["स्वयं", "पुत्र", "पुत्री", "पत्नी", "मृतक"];

export default function Vanshavali() {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [relation, setRelation] = useState("स्वयं");

  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentField, setCurrentField] = useState(null);

  const debounceRef = useRef(null);
  const cacheRef = useRef({});

  /* ---------------- GOOGLE API (DEBOUNCED + CACHED) ---------------- */

  const fetchSuggestions = async (word) => {
    if (!word) return;

    // Check cache first
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
        cacheRef.current[word] = result; // Save to cache
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
    }, 300); // 300ms debounce
  };

  /* ---------------- INPUT HANDLING ---------------- */

  const handleInputChange = (value, setter) => {
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

    // SPACE selects first suggestion automatically
    if (e.key === " ") {
      if (suggestions.length > 0) {
        e.preventDefault();
        selectSuggestion(suggestions[0]);
      }
    }
  };

  /* ---------------- STORAGE ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("survey_data");
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("survey_data", JSON.stringify(members));
  }, [members]);

  const trackVanshawaliDownload = async () => {
    await fetch("/api/track-vanshawali", { method: "POST" });
  };

  /* ---------------- ADD MEMBER ---------------- */

  const handleAddMember = () => {
    if (!name.trim()) {
      alert("नाम आवश्यक है");
      return;
    }

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

    setName("");
    setParent("");
    setRelation("पुत्र");
  };

  /* ---------------- TREE ---------------- */

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

  /* ---------------- UI ---------------- */

  const renderInput = (value, setter, fieldName, placeholder) => (
    <div className="relative">
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
                i === activeIndex
                  ? "bg-indigo-100"
                  : "hover:bg-gray-100"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 py-6 px-4 rounded-xl">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white p-6 rounded-3xl shadow-xl mb-6">
          <div className="flex items-center gap-3">
            <Users size={32} />
            <h1 className="text-2xl md:text-3xl font-bold">
              बिहार भूमि सर्वेक्षण वंशावली
            </h1>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white shadow-xl rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold">
            <UserPlus size={20} />
            सदस्य जोड़ें
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {renderInput(name, setName, "name", "नाम लिखें")}

            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="p-3 rounded-xl border"
            >
              {RELATIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            {renderInput(
              parent,
              setParent,
              "parent",
              "पिता / पति का नाम"
            )}

            <button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <Plus size={18} /> जोड़ें
            </button>
          </div>
        </div>

        {/* PDF */}
        {treeData && (
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <PDFViewer width="100%" height={400}>
              <AutoFamilyTreePDF data={treeData} />
            </PDFViewer>

            <PDFDownloadLink
              document={<AutoFamilyTreePDF data={treeData} />}
              fileName="bihar_vanshavali.pdf"
            >
              {({ loading }) => (
                <button
                  onClick={trackVanshawaliDownload}
                  className="w-full mt-4 bg-indigo-600 text-white p-4 rounded-xl"
                >
                  {loading
                    ? "PDF तैयार हो रहा है..."
                    : "PDF डाउनलोड करें"}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        )}
      </div>
    </div>
  );
}
