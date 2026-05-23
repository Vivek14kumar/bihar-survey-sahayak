import { useState } from "react";
import { FileArchive, Clock, FileText, User, Phone, CheckCircle2, XCircle, AlertCircle, Calendar } from "lucide-react";

export default function LedgerView({ generatedDocs, setGeneratedDocs }) {
  const [docFilter, setDocFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  // State for Refund Modal
  const [refundModal, setRefundModal] = useState({ isOpen: false, docId: null });
  const [refundReason, setRefundReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const formCounts = generatedDocs.reduce((acc, doc) => {
    acc[doc.title] = (acc[doc.title] || 0) + 1;
    return acc;
  }, {});

  const allGroupedByDate = generatedDocs.reduce((acc, doc) => {
    const dateKey = doc.date ? doc.date.split(',')[0].trim() : "Unknown Date";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(doc);
    return acc;
  }, {});
  const availableDates = Object.keys(allGroupedByDate).sort((a, b) => new Date(b) - new Date(a));

  const filteredDocs = generatedDocs.filter(doc => {
    const matchesType = docFilter === "All" || doc.title === docFilter;
    const docDate = doc.date ? doc.date.split(',')[0].trim() : "Unknown Date";
    const matchesDate = dateFilter === "All" || docDate === dateFilter;
    return matchesType && matchesDate;
  });

  const groupedDocs = filteredDocs.reduce((acc, doc) => {
    const dateKey = doc.date ? doc.date.split(',')[0].trim() : "Unknown Date";
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(doc);
    return acc;
  }, {});
  const sortedFilteredDates = Object.keys(groupedDocs).sort((a, b) => new Date(b) - new Date(a));

  const openRefundModal = (docId) => {
    setRefundReason("");
    setCustomReason("");
    setRefundModal({ isOpen: true, docId });
  };

  const closeRefundModal = () => {
    setRefundModal({ isOpen: false, docId: null });
  };

  const submitRefundRequest = async () => {
    const { docId } = refundModal;
    const finalReason = refundReason === "Other" ? customReason : refundReason;

    if (!finalReason.trim()) {
      alert("Please provide a reason for the refund.");
      return;
    }

    try {
      const res = await fetch("/api/documents/refund-request", {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ docId, reason: finalReason })
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Credit refund requested successfully. The admin will review it shortly.");
        setGeneratedDocs(prevDocs => prevDocs.map(doc => 
          (doc._id === docId || doc.id === docId) ? { ...doc, status: "REFUND_REQUESTED", refundReason: finalReason } : doc
        ));
        closeRefundModal();
      } else {
        alert(data.error || "Failed to request refund.");
      }
    } catch (error) { 
      console.error("Refund Request Error:", error); 
    }
  };

  return (
    <div className="animate-in fade-in duration-300 max-w-5xl mx-auto h-full flex flex-col relative">
      
      {/* Refund Modal Overlay */}
      {refundModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Request Refund</h3>
            <p className="text-sm text-slate-500 mb-5">Please let us know why you need a refund for this document.</p>
            
            <select 
              className="w-full border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            >
              <option value="">Select a reason...</option>
              <option value="Document generated with incorrect data">Document generated with incorrect data</option>
              <option value="PDF was blank or corrupted">PDF was blank or corrupted</option>
              <option value="System took credits but failed to download">System took credits but failed to download</option>
              <option value="Other">Other (Please specify)</option>
            </select>

            {refundReason === "Other" && (
              <textarea
                placeholder="Briefly describe the issue..."
                className="w-full border border-slate-200 rounded-xl p-3 mb-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none h-24"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={closeRefundModal}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitRefundRequest}
                disabled={!refundReason || (refundReason === "Other" && !customReason.trim())}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Client Ledger</h2>
          <p className="text-slate-500 text-sm mt-1">Track and filter documents generated for your customers.</p>
        </div>
        {generatedDocs.length > 0 && (
          <div className="relative group shrink-0">
            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 pl-3 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400">
              <div className="text-blue-600 flex items-center gap-1.5"><Calendar size={16} strokeWidth={2.5} /><span className="text-xs font-black uppercase tracking-widest text-slate-400">Date:</span></div>
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-transparent border-none text-sm font-bold text-slate-800 outline-none cursor-pointer pr-2 appearance-none z-10">
                <option value="All">All Time History</option>
                {availableDates.map(date => (<option key={date} value={date}>{date} — ({allGroupedByDate[date].length} Forms)</option>))}
              </select>
            </div>
          </div>
        )}
      </header>
      
      {generatedDocs.length > 0 && (
        <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar">
          <button onClick={() => setDocFilter("All")} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 shadow-sm transition-all ${docFilter === "All" ? "bg-slate-800 text-white border-transparent" : "bg-white border-slate-200 text-slate-600 border"}`}>
            <FileArchive size={14} /> All Forms ({generatedDocs.length})
          </button>
          {Object.entries(formCounts).map(([formName, count]) => (
            <button key={formName} onClick={() => setDocFilter(formName)} className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 shadow-sm transition-all border ${docFilter === formName ? "bg-blue-600 text-white border-blue-600" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
              <span className={`w-2 h-2 rounded-full ${docFilter === formName ? "bg-white" : "bg-blue-500"}`}></span>{formName}: <span>{count}</span>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16">
            <FileArchive size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No documents match the selected filters.</p>
            <button onClick={() => { setDocFilter("All"); setDateFilter("All"); }} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="p-4 md:p-6 overflow-y-auto max-h-[65vh] custom-scrollbar space-y-8">
            {sortedFilteredDates.map((date) => (
              <div key={date} className="relative">
                <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-3 mb-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2"><Clock size={16} className="text-blue-600"/> {date}</h3>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{groupedDocs[date].length} {docFilter !== "All" ? docFilter : "Forms"}</span>
                </div>
                <div className="space-y-3">
                  {groupedDocs[date].map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-blue-600 shrink-0"><FileText size={18}/></div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 capitalize truncate text-sm">{doc.title}</h4>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm"><User size={10} className="text-slate-400"/> {doc.clientName}</span>
                            {doc.clientMobile && doc.clientMobile !== "N/A" && <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md"><Phone size={10}/> {doc.clientMobile}</span>}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px] text-slate-400 font-medium"><span className="font-mono text-slate-500">Ref: {doc.ref}</span><span>•</span><span className="font-mono text-slate-500">TxnId: {doc.txnId}</span></div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right flex flex-col items-end gap-1.5">
                        <span className={`text-xs font-black px-2.5 py-1.5 rounded-lg border ${doc.status === "REFUNDED" ? "text-slate-500 bg-slate-100 border-slate-200 line-through" : "text-emerald-600 bg-emerald-50 border-emerald-100"}`}>
                          {doc.cost || "NA"} Crs
                        </span>

                        <div className="mt-2 flex flex-col items-end gap-1 shrink-0">
                          {doc.status === "REFUND_REQUESTED" ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 shadow-sm">
                              <Clock size={10} className="animate-pulse" /> Review Pending
                            </span>
                          ) : doc.status === "REFUNDED" ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-200 shadow-sm">
                              <CheckCircle2 size={10} /> Refunded
                            </span>
                          ) : doc.status === "REFUND_REJECTED" ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-200 shadow-sm">
                                <XCircle size={10} /> Request Denied
                              </span>

                              {/* 👇 ADMIN REASON DISPLAYED TO USER HERE 👇 */}
                              {doc.adminMessage && (
                                <span className="text-[9px] text-rose-500 italic max-w-[150px] text-right leading-tight">
                                  Admin Note: "{doc.adminMessage}"
                                </span>
                              )}
                            </div>
                          ) : (
                            <button onClick={() => openRefundModal(doc.id || doc._id)} className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-rose-500 font-medium underline underline-offset-2 transition-colors focus:outline-none">
                              <AlertCircle size={10} /> Report Refund
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}