"use client";

import React, { useState, useEffect } from "react";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import {
  Plus,
  Trash2,
  FileDown,
  Info,
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

  const trackVanshawaliDownload = async () => {
  await fetch("/api/track-vanshawali", {
    method: "POST",
  });
};

  useEffect(() => {
    const saved = localStorage.getItem("survey_data");
    if (saved) setMembers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("survey_data", JSON.stringify(members));
  }, [members]);

  const handleAddMember = () => {
    if (!name) {
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

  const buildTree = () => {
    const map = {};

    members.forEach((m) => {
      map[m.name] = {
        ...m,
        children: [],
        spouse: null,
        father: null,
      };
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
        parentNode.spouse = {
          name: m.name,
          relation: "पत्नी",
        };
      } else if (m.relation === "स्वयं") {
        map[m.name].father = m.parent;
        root = map[m.name];
      } else {
        parentNode.children.push(map[m.name]);
      }
    });

    return root;
  };

  const treeData = buildTree();

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
          <p className="text-sm mt-2 opacity-90">
            परिवार के सदस्यों की जानकारी जोड़ें और PDF तैयार करें
          </p>
        </div>

        {/* GUIDE */}
        <div className="bg-white shadow-md border border-indigo-100 p-5 rounded-2xl mb-6">
          <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-2">
            <Info size={18} />
            कैसे भरें
          </div>
          <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-1">
            <li>सबसे पहले परिवार के मूल व्यक्ति का नाम जोड़ें</li>
            <li>फिर उनके पुत्र / पुत्री जोड़ें</li>
            <li>पत्नी जोड़ते समय पति का नाम लिखें</li>
          </ol>
        </div>

        {/* FORM CARD */}
        <div className="bg-white shadow-xl rounded-3xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold">
            <UserPlus size={20} />
            सदस्य जोड़ें
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <ReactTransliterate
              value={name}
              onChangeText={setName}
              lang="hi"
              placeholder="नाम लिखें"
              className="p-3 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="p-3 rounded-xl border focus:ring-2 focus:ring-indigo-400"
            >
              {RELATIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <ReactTransliterate
              value={parent}
              onChangeText={setParent}
              lang="hi"
              placeholder={
                members.length === 0
                  ? "पहला व्यक्ति"
                  : relation === "पत्नी"
                  ? "पति का नाम"
                  : "पिता का नाम"
              }
              className="p-3 rounded-xl border focus:ring-2 focus:ring-indigo-400"
            />

            <button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-indigo-600 to-emerald-600 hover:opacity-90 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Plus size={18} /> जोड़ें
            </button>
          </div>
        </div>

        {/* MEMBER LIST */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-indigo-700 font-semibold">
            <List size={20} />
            जोड़े गए सदस्य
          </div>

          {members.length === 0 ? (
            <div className="text-center text-gray-500 bg-white p-8 rounded-2xl shadow">
              अभी कोई सदस्य नहीं जोड़ा गया है
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((m, i) => (
                <div
                  key={m.id}
                  className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-4 rounded-2xl shadow-sm border"
                >
                  <div>
                    <p className="font-semibold">
                      {i + 1}. {m.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {m.parent
                        ? relation === "पत्नी"
                          ? `पति: ${m.parent}`
                          : `पिता: ${m.parent}`
                        : "मूल व्यक्ति"}{" "}
                      | {m.relation}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setMembers(members.filter((x) => x.id !== m.id))
                    }
                    className="mt-3 md:mt-0 text-red-600 bg-red-50 p-2 rounded-full hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PDF SECTION */}
        {treeData && (
          <div className="bg-white p-6 rounded-3xl shadow-xl">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold mb-4">
              <FileDown size={20} />
              PDF Preview
            </div>

            <div className="border rounded-xl overflow-hidden mb-6">
              <PDFViewer width="100%" height={400}>
                <AutoFamilyTreePDF data={treeData} />
              </PDFViewer>
            </div>

            <PDFDownloadLink
  document={<AutoFamilyTreePDF data={treeData} />}
  fileName="bihar_vanshavali.pdf"
>
  {({ loading }) => (
    <button
      onClick={trackVanshawaliDownload}
      className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-semibold p-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg"
    >
      <FileDown size={18} />
      {loading ? "PDF तैयार हो रहा है..." : "PDF डाउनलोड करें"}
    </button>
  )}
</PDFDownloadLink>

          </div>
        )}
      </div>
    </div>
  );
}
