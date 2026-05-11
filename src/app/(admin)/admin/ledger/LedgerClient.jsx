// src/app/(admin)/admin/ledger/LedgerClient.jsx
"use client";

import { useState, useMemo } from "react";
import { 
  Search, RotateCcw, FileText, CheckCircle2, Activity,
  AlertCircle, IndianRupee, Filter, Calendar, TrendingUp,
  Bell, XCircle 
} from "lucide-react";
import { processRefund, approveRefundRequest, rejectRefundRequest } from "../../../actions/adminActions"; 

export default function LedgerClient({ initialDocuments }) {
  // Search & Filter States
  const [activeTab, setActiveTab] = useState("ALL"); // "ALL" or "REQUESTS"
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PAID, REFUNDED
  const [filterDate, setFilterDate] = useState("ALL"); // ALL, TODAY, WEEK, MONTH
  const [filterForm, setFilterForm] = useState("ALL"); 
  const [loadingId, setLoadingId] = useState(null);

  // Count pending requests for the notification badge
  const pendingCount = initialDocuments.filter(doc => doc.status === "REFUND_REQUESTED").length;

  // 👉 1. Force Refund (Admin initiated)
  const handleRefundClick = async (docId, txnId) => {
    const confirmRefund = window.confirm(`Force refund for ${txnId}? Money will return to the operator's wallet.`);
    if (!confirmRefund) return;

    setLoadingId(docId);
    try {
      const res = await processRefund(docId, txnId);
      if (res.success) alert("✅ Refund processed successfully.");
    } catch (error) {
      alert(`❌ Refund failed: ${error.message}`);
    }
    setLoadingId(null);
  };

  // 👉 2. Approve Request (Operator initiated)
  const handleApprove = async (docId) => {
    if (!window.confirm("Approve this refund and return the money?")) return;
    setLoadingId(docId);
    try {
      const res = await approveRefundRequest(docId);
      if (res.success) alert("✅ Refund Approved!");
    } catch (error) {
      alert(`❌ Failed: ${error.message}`);
    }
    setLoadingId(null);
  };

  // 👉 3. Reject Request (Operator initiated)
  const handleReject = async (docId) => {
    if (!window.confirm("Reject this request? The status will revert to Paid.")) return;
    setLoadingId(docId);
    try {
      const res = await rejectRefundRequest(docId);
      if (res.success) alert("❌ Refund Rejected.");
    } catch (error) {
      alert(`❌ Failed: ${error.message}`);
    }
    setLoadingId(null);
  };

  // Extract unique form types for the dropdown filter
  const uniqueForms = useMemo(() => {
    const forms = new Set(initialDocuments.map(doc => doc.title));
    return Array.from(forms);
  }, [initialDocuments]);

  // Apply Search, Filters, and Tabs
  const filteredDocs = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return initialDocuments.filter((doc) => {
      // Tab Filter: If on REQUESTS tab, only show requested. If ALL, show everything.
      if (activeTab === "REQUESTS" && doc.status !== "REFUND_REQUESTED") return false;

      // 1. Search Filter
      const searchString = `${doc.ref} ${doc.txnId} ${doc.operator?.shopName || ""} ${doc.clientMobile}`.toLowerCase();
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());

      // 2. Status Filter
      const matchesStatus = filterStatus === "ALL" || doc.status === filterStatus;

      // 3. Form Type Filter
      const matchesForm = filterForm === "ALL" || doc.title === filterForm;

      // 4. Date Filter
      let matchesDate = true;
      const docDate = new Date(doc.date);
      if (filterDate === "TODAY") matchesDate = docDate >= today;
      if (filterDate === "WEEK") matchesDate = docDate >= startOfWeek;
      if (filterDate === "MONTH") matchesDate = docDate >= startOfMonth;

      return matchesSearch && matchesStatus && matchesForm && matchesDate;
    });
  }, [initialDocuments, searchTerm, filterStatus, filterDate, filterForm, activeTab]);

  // Calculate Dynamic Stats based on currently filtered documents
  const stats = useMemo(() => {
    let revenue = 0;
    let refundedAmount = 0;
    let refundCount = 0;

    filteredDocs.forEach(doc => {
      if (doc.status === "REFUNDED") {
        refundedAmount += doc.cost;
        refundCount++;
      } else if (doc.status === "Paid") {
        revenue += doc.cost;
      }
    });

    return { revenue, refundedAmount, refundCount, totalCount: filteredDocs.length };
  }, [filteredDocs]);

  return (
    <div className="space-y-6">
      
      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setActiveTab("ALL")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${activeTab === "ALL" ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
        >
          All Transactions
        </button>
        <button 
          onClick={() => setActiveTab("REQUESTS")}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition ${activeTab === "REQUESTS" ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-rose-500 border border-rose-200 hover:bg-rose-50'}`}
        >
          <Bell size={16} className={pendingCount > 0 ? "animate-pulse" : ""} />
          Pending Requests 
          {pendingCount > 0 && (
            <span className="bg-white text-rose-600 px-2 py-0.5 rounded-full text-xs font-black shadow-sm">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ================= STATS ROW ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Net Earnings</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">₹{stats.revenue}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <RotateCcw size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Refunded</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">₹{stats.refundedAmount}</p>
            <p className="text-xs font-semibold text-rose-500 mt-1">{stats.refundCount} forms returned</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Transaction Volume</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">{stats.totalCount}</p>
          </div>
        </div>
      </div>

      {/* ================= TABLE & FILTERS ================= */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Advanced Filter Bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between gap-4">
          
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Ref, Txn ID, Shop, or Mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
              <Calendar size={16} className="text-slate-400" />
              <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="text-sm outline-none bg-transparent font-medium text-slate-700">
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">Last 7 Days</option>
                <option value="MONTH">This Month</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
              <Filter size={16} className="text-slate-400" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm outline-none bg-transparent font-medium text-slate-700">
                <option value="ALL">All Statuses</option>
                <option value="Paid">Paid Only</option>
                <option value="REFUNDED">Refunded Only</option>
                <option value="REFUND_REQUESTED">Requests Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
              <FileText size={16} className="text-slate-400" />
              <select value={filterForm} onChange={(e) => setFilterForm(e.target.value)} className="text-sm outline-none bg-transparent font-medium text-slate-700 max-w-[120px] truncate">
                <option value="ALL">All Forms</option>
                {uniqueForms.map(form => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <th className="p-5 font-semibold">Date & Time</th>
                <th className="p-5 font-semibold">Reference / Txn ID</th>
                <th className="p-5 font-semibold">Operator Info</th>
                <th className="p-5 font-semibold">Form Details</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                    
                    <td className="p-5">
                      <p className="text-sm font-bold text-slate-800">
                        {new Date(doc.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(doc.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>

                    <td className="p-5">
                      <p className="text-sm font-bold text-indigo-600">{doc.ref}</p>
                      <p className="text-[10px] text-slate-400 font-mono tracking-wider">{doc.txnId}</p>
                    </td>

                    <td className="p-5">
                      <p className="text-sm font-bold text-slate-800">{doc.operator?.shopName || "Unknown Cafe"}</p>
                      <p className="text-xs text-slate-500">{doc.operator?.ownerName} • {doc.operator?.mobileNumber}</p>
                    </td>

                    <td className="p-5">
                      <p className="text-sm font-semibold text-slate-700">{doc.title}</p>
                      <p className="text-xs text-slate-400">Client: {doc.clientName} ({doc.clientMobile})</p>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-800 w-12">₹{doc.cost}</span>
                        {doc.status === "REFUND_REQUESTED" ? (
                          <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-amber-200">
                            <AlertCircle size={12} /> REQUESTED
                          </span>
                        ) : doc.status === "REFUNDED" ? (
                          <span className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-rose-100">
                            <AlertCircle size={12} /> REFUNDED
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md text-[10px] font-bold border border-emerald-100">
                            <CheckCircle2 size={12} /> PAID
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-5 text-right">
                      {doc.status === "REFUND_REQUESTED" ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleApprove(doc._id)}
                            disabled={loadingId === doc._id}
                            className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition shadow-sm disabled:opacity-50"
                          >
                            <CheckCircle2 size={14} className={loadingId === doc._id ? "animate-pulse" : ""} />
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(doc._id)}
                            disabled={loadingId === doc._id}
                            className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition shadow-sm disabled:opacity-50"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      ) : doc.status !== "REFUNDED" ? (
                        <button 
                          onClick={() => handleRefundClick(doc._id, doc.txnId)}
                          disabled={loadingId === doc._id}
                          className="inline-flex items-center gap-1.5 bg-white border border-rose-200 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-50 transition shadow-sm disabled:opacity-50"
                        >
                          <RotateCcw size={14} className={loadingId === doc._id ? "animate-spin" : ""} />
                          {loadingId === doc._id ? "Processing..." : "Force Refund"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-semibold italic">Refund Issued</span>
                      )}
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
                      <Search className="text-slate-400" size={24} />
                    </div>
                    <p className="text-slate-600 font-bold">No records found</p>
                    <p className="text-slate-400 text-sm mt-1">
                      {activeTab === "REQUESTS" ? "You have no pending refund requests! 🎉" : "Try adjusting your search or filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}