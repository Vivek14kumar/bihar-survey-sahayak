import { useState } from "react";
import { ArrowLeft, Users, CheckCircle2 } from "lucide-react";

import Prapatra2Form from "@/components/forms/Prapatra2Form";
import Prapatra3Form from "@/components/forms/Prapatra3Form";
import LegalPanchnama from "@/components/forms/LegalPanchnama";
import ParimarjanAffidavit from "@/components/forms/ParimarjanAffidavit";
import DeathCertiAffidavit from "@/components/forms/DeathCertiAffidavit";
import DeathCertificateDecl from "@/components/forms/DeathCertificateDecl";
import ObjectionLetter from "@/components/forms/ObjectionLetter";
import CancelJamabandhi from "@/components/forms/CancelJamabandhi";
import Vanshavali from "@/components/forms/Vanshavali";

const formConfig = {
  "form_prapatra2": { title: "Prapatra 2", cost: 5, Component: Prapatra2Form },
  "form_prapatra3": { title: "Prapatra 3(1)", cost: 5, Component: Prapatra3Form },
  "form_vanshavali": { title: "Vanshavali", cost: 10, Component: Vanshavali },
  "form_batwara": { title: "Batwara Application", cost: 30, Component: LegalPanchnama },
  "form_shapath": { title: "Shapath Patra", cost: 3, Component: ParimarjanAffidavit },
  "form_deathCertiAfi": { title: "Death Certificate Affidavit", cost: 5, Component: DeathCertiAffidavit },
  "form_DeathCertiDec": { title: "Death Certificate (Mukhiya)", cost: 5, Component: DeathCertificateDecl },
  "form_objection": { title: "Objection Letter", cost: 5, Component: ObjectionLetter },
  "form_cancelJama": { title: "Jamabandhi Cancellation", cost: 5, Component: CancelJamabandhi },
};

export default function FormWrapperView({ currentView, setCurrentView, walletBalance, onSuccess }) {
  const [clientName, setClientName] = useState("");
  const [clientMobile, setClientMobile] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  const activeForm = formConfig[currentView];
  if (!activeForm) return null;

  const handleGenerateForm = async (formName, cost, fallbackName = "", fallbackMobile = "") => {
    if (walletBalance < cost) {
      alert(`Insufficient balance! This form requires ₹${cost}. Please recharge your wallet.`);
      setCurrentView("wallet");
      return false; 
    }

    setIsGenerating(true);
    const finalClientName = clientName.trim() || fallbackName.trim() || "";
    const finalClientMobile = clientMobile.trim() || fallbackMobile.trim() || "";

    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formName, cost, clientName: finalClientName, clientMobile: finalClientMobile }),
      });

      if (res.ok) {
        const data = await res.json();
        onSuccess(data.newBalance, data.transaction, data.document);
        setGenerationSuccess(true);
        setTimeout(() => setGenerationSuccess(false), 5000);
        setClientName("");
        setClientMobile("");
        return true; 
      } else {
        const err = await res.json();
        alert(err.message || "Failed to generate document. Try again.");
        return false;
      }
    } catch (error) {
      console.error("Generation error:", error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const ActiveComponent = activeForm.Component;

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-4 pb-2 border-b border-slate-200">
        <button onClick={() => setCurrentView("dashboard")} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Generation Cost <span className="text-lg font-black text-slate-800">&nbsp;₹{activeForm.cost}</span></p>
          {/*<p className="text-lg font-black text-slate-800">₹{activeForm.cost}</p>*/}
        </div>
      </div>

      <div className="bg-slate-50 border border-yellow-400 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={16} className="text-slate-400" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Client Reference <span className="text-slate-400 font-normal lowercase">(Optional)</span>
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Client Name (e.g., Rahul Kumar)" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">+91</span>
            <input type="tel" maxLength="10" placeholder="Mobile Number" value={clientMobile} onChange={(e) => setClientMobile(e.target.value.replace(/\D/g, ''))} className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </div>

      <div >
        <ActiveComponent 
          isGenerating={isGenerating} 
          onGenerate={(cName, cMobile) => handleGenerateForm(activeForm.title, activeForm.cost, cName, cMobile)} 
        />
      </div>

      {generationSuccess && (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center mt-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-bold text-emerald-800">Document Generated!</h3>
          <p className="text-emerald-600 text-sm mb-4">Saved to your Generated Docs archive.</p>
        </div>
      )}
    </div>
  );
}