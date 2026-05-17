"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, CheckCircle, XCircle, AlertTriangle, FileText, 
  User, Phone, MapPin, Briefcase, Calendar, ChevronLeft, 
  ExternalLink, Ban, Loader2, ShieldCheck, Clock
} from "lucide-react";

export default function AdminVerificationPage() {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFilter, setActiveFilter] = useState("pending");
  const [rejectionReason, setRejectionReason] = useState("");

  // ==========================================
  // MOCK DATA FETCHING (Simulating your backend)
  // ==========================================
  useEffect(() => {
    // Simulate API call to fetch profiles
    const fetchProfiles = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setProfiles([
          {
            _id: "64a1b2c3d4e5f",
            ownerNameEn: "Vivek Kumar",
            ownerNameHi: "विवेक कुमार",
            publicMobile: "9876543210",
            whatsappNumber: "9876543210",
            status: "pending",
            serviceAreas: ["Patna", "Danapur", "Phulwari Sharif"],
            experience: 5,
            hasFormalCertificate: false,
            mukhiyaContact: "9123456780",
            aadhaarUrl: "https://via.placeholder.com/600x400/e2e8f0/475569?text=Aadhaar+Front+and+Back",
            experienceLetterUrl: "https://via.placeholder.com/600x800/e2e8f0/475569?text=Mukhiya+Self+Declaration+Letter",
            certificateUrl: "",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          },
          {
            _id: "64a1b2c3d4e6a",
            ownerNameEn: "Rajeev Ranjan",
            ownerNameHi: "राजीव रंजन",
            publicMobile: "8765432109",
            whatsappNumber: "8765432109",
            status: "pending",
            serviceAreas: ["Gaya", "Bodh Gaya"],
            experience: 8,
            hasFormalCertificate: true,
            registrationNumber: "GM/2021/889",
            aadhaarUrl: "https://via.placeholder.com/600x400/e2e8f0/475569?text=Aadhaar+Front+and+Back",
            experienceLetterUrl: "",
            certificateUrl: "https://via.placeholder.com/600x800/e2e8f0/475569?text=Amanat+Training+Certificate",
            createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          }
        ]);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchProfiles();
  }, []);

  // ==========================================
  // ADMIN ACTION HANDLERS
  // ==========================================
  const handleAction = async (actionType) => {
    if (actionType === "reject" && !rejectionReason.trim()) {
      return alert("Please provide a reason for rejection so the Amin can fix it.");
    }
    
    // Warn before permanent block
    if (actionType === "block") {
      const confirmBlock = window.confirm("Are you sure you want to PERMANENTLY BLOCK this profile? This cannot be easily undone.");
      if (!confirmBlock) return;
    }

    setIsProcessing(true);

    try {
      // SIMULATE API CALL
      // await fetch('/api/admin/verify', { method: 'POST', body: JSON.stringify({ profileId: selectedProfile._id, action: actionType, reason: rejectionReason }) });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert(`Profile successfully marked as: ${actionType.toUpperCase()}`);
      
      // Update local state to remove processed profile from pending list
      setProfiles(prev => prev.filter(p => p._id !== selectedProfile._id));
      setSelectedProfile(null);
      setRejectionReason("");
      
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ==========================================
  // VIEW: MAIN LIST OF PROFILES
  // ==========================================
  if (!selectedProfile) {
    const filteredProfiles = profiles.filter(p => p.status === activeFilter);

    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" /> Admin Verification Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">Review documents and approve Amin profiles for the 3-day trial.</p>
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

          {/* List/Table View */}
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
                <p className="text-sm">No {activeFilter} profiles to review right now.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500 uppercase tracking-wider">
                      <th className="p-4 font-semibold">Amin Name</th>
                      <th className="p-4 font-semibold">Contact</th>
                      <th className="p-4 font-semibold">Credential Type</th>
                      <th className="p-4 font-semibold">Submitted</th>
                      <th className="p-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProfiles.map((profile) => (
                      <tr key={profile._id} className="hover:bg-slate-50 transition-colors">
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
      </div>
    );
  }

  // ==========================================
  // VIEW: DETAIL & VERIFICATION SCREEN
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* Detail Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
        <button 
          onClick={() => setSelectedProfile(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-semibold transition-colors"
        >
          <ChevronLeft size={20} /> Back to List
        </button>
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold border border-slate-200">
            ID: {selectedProfile._id.slice(-6).toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Amin Data & Actions (Spans 4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Profile Summary Card */}
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

              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Service Areas</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProfile.serviceAreas.map(area => (
                    <span key={area} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-semibold">{area}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Credential Warning / Info Card */}
          {!selectedProfile.hasFormalCertificate ? (
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl shadow-sm p-5">
              <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-2">
                <AlertTriangle size={18} /> No Formal Certificate
              </h3>
              <p className="text-sm text-amber-700 mb-3">This Amin is using a Mukhiya Letter/Affidavit. Please verify the contact number provided below.</p>
              <div className="bg-white/60 p-3 rounded-lg border border-amber-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase">Mukhiya Contact</p>
                  <p className="font-bold text-lg text-slate-800">{selectedProfile.mukhiyaContact}</p>
                </div>
                <a href={`tel:${selectedProfile.mukhiyaContact}`} className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors">
                  <Phone size={18} />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-r-2xl shadow-sm p-5">
              <h3 className="text-emerald-800 font-bold flex items-center gap-2 mb-2">
                <CheckCircle size={18} /> Formal Certificate User
              </h3>
              <p className="text-sm text-emerald-700">Registration No: <span className="font-bold">{selectedProfile.registrationNumber || "N/A"}</span></p>
            </div>
          )}

          {/* DECISION ACTION PANEL */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4">Verification Decision</h3>
            
            <button 
              disabled={isProcessing}
              onClick={() => handleAction("live")}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all mb-4"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Approve & Start 3-Day Trial
            </button>

            <hr className="my-4 border-slate-100" />

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-600">Rejection Reason (Required if rejecting):</label>
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Aadhaar image is blurry, signature missing..."
                className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-rose-500 resize-none h-20 bg-slate-50"
              />
              <button 
                disabled={isProcessing}
                onClick={() => handleAction("reject")}
                className="w-full flex items-center justify-center gap-2 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold py-3 px-4 rounded-xl transition-all"
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                Reject & Request Changes
              </button>
            </div>

            <div className="mt-6 text-center">
              <button 
                disabled={isProcessing}
                onClick={() => handleAction("block")}
                className="text-xs text-slate-400 hover:text-red-600 font-bold flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <Ban size={12} /> Permanently Block (Fraud)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Document Viewer (Spans 8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
            <div className="bg-slate-900 p-4 border-b border-slate-700 flex gap-4 overflow-x-auto">
              <div className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <FileText size={16} className="text-blue-400"/> 1. Aadhaar Card
              </div>
              <div className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                <FileText size={16} className={selectedProfile.hasFormalCertificate ? "text-emerald-400" : "text-amber-400"}/> 
                {selectedProfile.hasFormalCertificate ? "2. Training Certificate" : "2. Mukhiya Affidavit"}
              </div>
            </div>

            {/* Document Render Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-800/50">
              
              {/* Doc 1: Aadhaar */}
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
                    Aadhaar Card (Self-Attested)
                  </h4>
                  <a href={selectedProfile.aadhaarUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                    Open Original <ExternalLink size={14}/>
                  </a>
                </div>
                {/* Render Image (Fallback to iframe if PDF logic is needed later) */}
                <div className="bg-black rounded-lg overflow-hidden border border-slate-700 flex justify-center">
                  <img src={selectedProfile.aadhaarUrl} alt="Aadhaar Document" className="max-w-full max-h-[500px] object-contain" />
                </div>
              </div>

              {/* Doc 2: Professional Proof */}
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-bold flex items-center gap-2">
                    <span className={selectedProfile.hasFormalCertificate ? "bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs" : "bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs"}>2</span> 
                    {selectedProfile.hasFormalCertificate ? "Formal Training Certificate" : "Mukhiya Letter / Affidavit"}
                  </h4>
                  <a href={selectedProfile.hasFormalCertificate ? selectedProfile.certificateUrl : selectedProfile.experienceLetterUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                    Open Original <ExternalLink size={14}/>
                  </a>
                </div>
                <div className="bg-black rounded-lg overflow-hidden border border-slate-700 flex justify-center">
                  <img 
                    src={selectedProfile.hasFormalCertificate ? selectedProfile.certificateUrl : selectedProfile.experienceLetterUrl} 
                    alt="Professional Document" 
                    className="max-w-full max-h-[600px] object-contain" 
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}