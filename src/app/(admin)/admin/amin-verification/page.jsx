"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, CheckCircle, XCircle, AlertTriangle, FileText, 
  User, Phone, Briefcase, Clock, ChevronLeft, 
  ExternalLink, Ban, Loader2, ShieldCheck
} from "lucide-react";

export default function AdminVerificationPage() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");

  // Replace your existing useEffect and handleAction in AdminVerificationPage.jsx

  // 1. Fetch Real Data
  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/admin/verify-profile');
        const data = await res.json();
        if (data.success) {
          setProfiles(data.profiles);
        }
      } catch (error) {
        console.error("Failed to fetch profiles", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // 2. Execute Real Actions
  const handleAction = async (actionType) => {
    if (actionType === "reject" && !rejectionReason.trim()) {
      return alert("Please provide a reason for rejection.");
    }
    
    if (actionType === "block" && !window.confirm("Permanently BLOCK this profile?")) {
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/admin/verify-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profileId: selectedProfile._id, 
          action: actionType, 
          reason: rejectionReason 
        })
      });

      const result = await res.json();

      if (result.success) {
        alert(`Profile marked as: ${actionType.toUpperCase()}`);
        
        // Remove it from the current view list
        setProfiles(prev => prev.filter(p => p._id !== selectedProfile._id));
        setSelectedProfile(null);
        setRejectionReason("");
      } else {
        alert("Action failed: " + result.error);
      }
      
    } catch (error) {
      alert("Network error. Try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================
  // VIEW 1: PROFILES LIST
  // ==========================================
  if (!selectedProfile) {
    const filteredProfiles = profiles.filter(p => p.status === activeFilter);

    return (
      <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="text-emerald-600" /> Amin Verifications
            </h1>
            <p className="text-slate-500 text-sm mt-1">Review KYC documents to approve the 3-day trial.</p>
          </div>
          
          {/* Filters */}
          <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
            {['pending', 'live', 'blocked'].map((f) => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeFilter === f ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {f} {f === 'pending' && <span className="ml-1 bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">{profiles.filter(p=>p.status==='pending').length}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-emerald-500" />
              <p>Loading profiles...</p>
            </div>
          ) : filteredProfiles.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-lg font-semibold text-slate-700">All caught up!</p>
              <p className="text-sm">No {activeFilter} profiles to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                    <th className="p-4 font-semibold">Amin Name</th>
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Credential</th>
                    <th className="p-4 font-semibold">Submitted</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProfiles.map((profile) => (
                    <tr key={profile._id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{profile.ownerNameEn}</div>
                        <div className="text-xs text-slate-500">{profile.ownerNameHi}</div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1"><Phone size={14} className="text-blue-500"/> {profile.publicMobile}</div>
                      </td>
                      <td className="p-4">
                        {profile.hasFormalCertificate ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold">
                            <CheckCircle size={12}/> Formal Certificate
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-md text-xs font-bold">
                            <AlertTriangle size={12}/> Mukhiya Affidavit
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-500 flex items-center gap-1">
                        <Clock size={14}/> {new Date(profile.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => setSelectedProfile(profile)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                        >
                          Review Docs
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: SPLIT SCREEN DOCUMENT VIEWER
  // ==========================================
  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header inside the main content area */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
        <button 
          onClick={() => setSelectedProfile(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors"
        >
          <ChevronLeft size={20} /> Back to List
        </button>
        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold border border-slate-200">
          ID: {selectedProfile._id.slice(-6).toUpperCase()}
        </span>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Data & Actions (Spans 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4 border-b pb-3">
              <User size={20} className="text-blue-600"/> Profile Data
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Full Name</p>
                <p className="font-bold text-slate-800">{selectedProfile.ownerNameEn} / {selectedProfile.ownerNameHi}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Mobile</p>
                  <p className="font-medium text-slate-800">{selectedProfile.publicMobile}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Experience</p>
                  <p className="font-medium text-slate-800">{selectedProfile.experience} Years</p>
                </div>
              </div>
            </div>
          </div>

          {!selectedProfile.hasFormalCertificate ? (
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl shadow-sm p-5">
              <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-2">
                <AlertTriangle size={18} /> No Formal Certificate
              </h3>
              <div className="bg-white/60 p-3 rounded-lg border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase">Mukhiya Contact</p>
                  <p className="font-bold text-lg text-slate-800">{selectedProfile.mukhiyaContact || "Not Provided"}</p>
                </div>
                <a href={`tel:${selectedProfile.mukhiyaContact}`} className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors">
                  <Phone size={18} />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl shadow-sm p-5">
              <h3 className="text-emerald-800 font-bold flex items-center gap-2 mb-2">
                <CheckCircle size={18} /> Formal Certificate
              </h3>
              <p className="text-sm text-emerald-700">Reg No: <span className="font-bold">{selectedProfile.registrationNumber || "N/A"}</span></p>
            </div>
          )}

          {/* ACTION PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Verification Decision</h3>
            <button 
              disabled={isProcessing}
              onClick={() => handleAction("live")}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm mb-4"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Approve & Start 3-Day Trial
            </button>
            <hr className="my-4 border-slate-100" />
            <div className="space-y-3">
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-rose-500 resize-none h-20 bg-slate-50"
              />
              <button 
                disabled={isProcessing}
                onClick={() => handleAction("reject")}
                className="w-full flex items-center justify-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-3 px-4 rounded-xl"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                Reject Documents
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Document Viewer (Spans 8 columns) */}
        <div className="lg:col-span-8 h-full">
          {/* h-[calc(100vh-8rem)] ensures it scrolls independently of the main layout */}
          <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-10rem)] sticky top-24">
            <div className="bg-slate-900 p-4 border-b border-slate-700 flex gap-4 overflow-x-auto shrink-0">
              <div className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <FileText size={16} className="text-blue-400"/> 1. Aadhaar Card
              </div>
              <div className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <FileText size={16} className={selectedProfile.hasFormalCertificate ? "text-emerald-400" : "text-amber-400"}/> 
                {selectedProfile.hasFormalCertificate ? "2. Training Certificate" : "2. Mukhiya Affidavit"}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-slate-800/50">
              
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> Aadhaar Card
                  </h4>
                  <a href={selectedProfile.aadhaarUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                    Open <ExternalLink size={14}/>
                  </a>
                </div>
                <div className="bg-black rounded-lg overflow-hidden border border-slate-700 flex justify-center p-2">
                  <img src={selectedProfile.aadhaarUrl} alt="Aadhaar" className="max-w-full h-auto max-h-[500px] object-contain" />
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <span className={selectedProfile.hasFormalCertificate ? "bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs" : "bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"}>2</span> 
                    {selectedProfile.hasFormalCertificate ? "Formal Certificate" : "Mukhiya Letter"}
                  </h4>
                  <a href={selectedProfile.hasFormalCertificate ? selectedProfile.certificateUrl : selectedProfile.experienceLetterUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                    Open <ExternalLink size={14}/>
                  </a>
                </div>
                <div className="bg-black rounded-lg overflow-hidden border border-slate-700 flex justify-center p-2">
                  <img src={selectedProfile.hasFormalCertificate ? selectedProfile.certificateUrl : selectedProfile.experienceLetterUrl} alt="Professional Proof" className="max-w-full h-auto max-h-[600px] object-contain" />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}