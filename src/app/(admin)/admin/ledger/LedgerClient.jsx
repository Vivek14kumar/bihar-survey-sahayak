"use client";

import { useState, useMemo } from "react";
import { 
  Search, RotateCcw, FileText, CheckCircle2, Activity,
  AlertCircle, IndianRupee, Filter, Calendar, Bell, XCircle,
  Download, ArrowUpDown, MessageSquareText
} from "lucide-react";
import { processRefund, approveRefundRequest, rejectRefundRequest } from "../../../actions/adminActions"; 

export default function LedgerClient({ initialDocuments }) {
  // Search, Filter & Sort States
  const [activeTab, setActiveTab] = useState("ALL"); // "ALL" or "REQUESTS"
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL"); 
  const [filterDate, setFilterDate] = useState("ALL"); 
  const [filterForm, setFilterForm] = useState("ALL"); 
  const [sortOrder, setSortOrder] = useState("DATE_DESC"); // DATE_DESC, DATE_ASC, COST_DESC, COST_ASC
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

  // 👉 3. Reject Request (Admin initiated with Reason)
  const handleReject = async (docId) => {
    const adminReason = window.prompt("Enter a reason for rejecting this refund (The user will see this):");
    
    if (adminReason === null) return; // Admin clicked Cancel
    
    if (adminReason.trim() === "") {
      alert("Please provide a reason so the user knows why it was rejected.");
      return;
    }

    setLoadingId(docId);
    try {
      // Pass the reason to your server action
      const res = await rejectRefundRequest(docId, adminReason);
      if (res.success) alert("❌ Refund Rejected and user notified.");
    } catch (error) {
      alert(`❌ Failed: ${error.message}`);
    }
    setLoadingId(null);
  };

  // Export Data to CSV
  const handleExportCSV = () => {
    if (filteredDocs.length === 0) return alert("No data to export!");
    
    const headers = ["Date", "Time", "Txn ID", "Reference", "Shop Name", "Operator Mobile", "Client Name", "Form Details", "Cost", "Status", "Refund Reason"];
    const csvRows = [headers.join(",")];
    
    filteredDocs.forEach(doc => {
      const dateObj = new Date(doc.date);
      const row = [
        `"${dateObj.toLocaleDateString("en-IN")}"`,
        `"${dateObj.toLocaleTimeString("en-IN")}"`,
        `"${doc.txnId}"`,
        `"${doc.ref}"`,
        `"${doc.operator?.shopName || 'Unknown'}"`,
        `"${doc.operator?.mobileNumber || 'N/A'}"`,
        `"${doc.clientName}"`,
        `"${doc.title}"`,
        `"${doc.cost}"`,
        `"${doc.status}"`,
        `"${doc.refundReason ? doc.refundReason.replace(/"/g, '""') : 'N/A'}"` // Escape quotes
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `Ledger_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Extract unique form types for the dropdown filter
  const uniqueForms = useMemo(() => {
    const forms = new Set(initialDocuments.map(doc => doc.title));
    return Array.from(forms);
  }, [initialDocuments]);

  // Apply Search, Filters, Tabs, and Sort
  const filteredDocs = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let result = initialDocuments.filter((doc) => {
      // Tab Filter
      if (activeTab === "REQUESTS" && doc.status !== "REFUND_REQUESTED") return false;

      // Search Filter
      const searchString = `${doc.ref} ${doc.txnId} ${doc.operator?.shopName || ""} ${doc.clientMobile}`.toLowerCase();
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());

      // Status Filter
      const matchesStatus = filterStatus === "ALL" || doc.status === filterStatus;

      // Form Type Filter
      const matchesForm = filterForm === "ALL" || doc.title === filterForm;

      // Date Filter
      let matchesDate = true;
      const docDate = new Date(doc.date);
      if (filterDate === "TODAY") matchesDate = docDate >= today;
      if (filterDate === "WEEK") matchesDate = docDate >= startOfWeek;
      if (filterDate === "MONTH") matchesDate = docDate >= startOfMonth;

      return matchesSearch && matchesStatus && matchesForm && matchesDate;
    });

    // Sorting Logic
    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (sortOrder === "DATE_DESC") return dateB - dateA;
      if (sortOrder === "DATE_ASC") return dateA - dateB;
      if (sortOrder === "COST_DESC") return (b.cost || 0) - (a.cost || 0);
      if (sortOrder === "COST_ASC") return (a.cost || 0) - (b.cost || 0);
      return 0;
    });

    return result;
  }, [initialDocuments, searchTerm, filterStatus, filterDate, filterForm, activeTab, sortOrder]);

  // Calculate Dynamic Stats
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
    <div className="space-y-6 max-w-[100vw]">
      
      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1">
          <button 
            onClick={() => setActiveTab("ALL")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition whitespace-nowrap ${activeTab === "ALL" ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
          >
            All Transactions
          </button>
          <button 
            onClick={() => setActiveTab("REQUESTS")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition whitespace-nowrap ${activeTab === "REQUESTS" ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-rose-500 border border-rose-200 hover:bg-rose-50'}`}
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

        {/* Export Button */}
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 rounded-xl text-sm font-bold transition shadow-sm whitespace-nowrap"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* ================= STATS ROW ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0">
            <IndianRupee size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] md:text-sm font-bold text-slate-500 uppercase tracking-wider truncate">Net Earnings</p>
            <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight truncate">₹{stats.revenue}</p>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 shrink-0">
            <RotateCcw size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] md:text-sm font-bold text-slate-500 uppercase tracking-wider truncate">Total Refunded</p>
            <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight truncate">₹{stats.refundedAmount}</p>
            <p className="text-[10px] md:text-xs font-semibold text-rose-500 mt-1 truncate">{stats.refundCount} forms returned</p>
          </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 md:p-4 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shrink-0">
            <Activity size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] md:text-sm font-bold text-slate-500 uppercase tracking-wider truncate">Transaction Volume</p>
            <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight truncate">{stats.totalCount}</p>
          </div>
        </div>
      </div>

      {/* ================= TABLE & FILTERS ================= */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col overflow-hidden relative">
        
        {/* Advanced Filter Bar */}
        <div className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col xl:flex-row justify-between gap-4">
          
          <div className="relative w-full xl:w-96 shrink-0">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Ref, Txn ID, Shop, or Mobile..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
              <Calendar size={16} className="text-slate-400 hidden sm:block" />
              <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="text-xs md:text-sm outline-none bg-transparent font-medium text-slate-700">
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">Last 7 Days</option>
                <option value="MONTH">This Month</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
              <Filter size={16} className="text-slate-400 hidden sm:block" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-xs md:text-sm outline-none bg-transparent font-medium text-slate-700">
                <option value="ALL">All Statuses</option>
                <option value="Paid">Paid Only</option>
                <option value="REFUNDED">Refunded</option>
                <option value="REFUND_REQUESTED">Requests</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm max-w-[140px] md:max-w-xs">
              <FileText size={16} className="text-slate-400 hidden sm:block" />
              <select value={filterForm} onChange={(e) => setFilterForm(e.target.value)} className="text-xs md:text-sm outline-none bg-transparent font-medium text-slate-700 w-full truncate">
                <option value="ALL">All Forms</option>
                {uniqueForms.map(form => (
                  <option key={form} value={form}>{form}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
              <ArrowUpDown size={16} className="text-slate-400 hidden sm:block" />
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="text-xs md:text-sm outline-none bg-transparent font-medium text-slate-700">
                <option value="DATE_DESC">Newest First</option>
                <option value="DATE_ASC">Oldest First</option>
                <option value="COST_DESC">Cost: High to Low</option>
                <option value="COST_ASC">Cost: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table with Scroll Setup */}
        <div className="overflow-x-auto overflow-y-auto custom-scrollbar max-h-[60vh] w-full">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-sm">
              <tr className="text-[10px] md:text-xs uppercase tracking-wider text-slate-500">
                <th className="p-4 md:p-5 font-semibold">Date & Time</th>
                <th className="p-4 md:p-5 font-semibold">Reference / Txn ID</th>
                <th className="p-4 md:p-5 font-semibold">Operator Info</th>
                <th className="p-4 md:p-5 font-semibold">Form Details</th>
                <th className="p-4 md:p-5 font-semibold">Status / Reason</th>
                <th className="p-4 md:p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc._id || doc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                    
                    <td className="p-4 md:p-5 align-top">
                      <p className="text-xs md:text-sm font-bold text-slate-800 whitespace-nowrap">
                        {new Date(doc.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-500 whitespace-nowrap">
                        {new Date(doc.date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </td>

                    <td className="p-4 md:p-5 align-top">
                      <p className="text-xs md:text-sm font-bold text-indigo-600">{doc.ref}</p>
                      <p className="text-[9px] md:text-[10px] text-slate-400 font-mono tracking-wider">{doc.txnId}</p>
                    </td>

                    <td className="p-4 md:p-5 align-top">
                      <p className="text-xs md:text-sm font-bold text-slate-800 max-w-[150px] truncate" title={doc.operator?.shopName}>
                        {doc.operator?.shopName || "Unknown Cafe"}
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-500">
                        {doc.operator?.ownerName ? doc.operator.ownerName.split(' ')[0] : ''} • {doc.operator?.mobileNumber}
                      </p>
                    </td>

                    <td className="p-4 md:p-5 align-top max-w-[200px]">
                      <p className="text-xs md:text-sm font-semibold text-slate-700 truncate" title={doc.title}>{doc.title}</p>
                      <p className="text-[10px] md:text-xs text-slate-400 truncate">
                        Client: {doc.clientName} ({doc.clientMobile})
                      </p>
                    </td>

                    <td className="p-4 md:p-5 align-top">
                      <div className="flex flex-col gap-1.5 items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-xs md:text-sm font-black text-slate-800">₹{doc.cost}</span>
                          {doc.status === "REFUND_REQUESTED" ? (
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[9px] md:text-[10px] font-bold border border-amber-200">
                              <AlertCircle size={10} /> REQUESTED
                            </span>
                          ) : doc.status === "REFUNDED" ? (
                            <span className="flex items-center gap-1 bg-rose-50 text-rose-600 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[9px] md:text-[10px] font-bold border border-rose-100">
                              <AlertCircle size={10} /> REFUNDED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[9px] md:text-[10px] font-bold border border-emerald-100">
                              <CheckCircle2 size={10} /> PAID
                            </span>
                          )}
                        </div>
                        
                        {/* 🌟 New Refund Reason Display 🌟 */}
                        {doc.refundReason && (
                          <div className="flex items-start gap-1.5 bg-amber-50/50 border border-amber-100 text-amber-800 p-1.5 rounded-lg max-w-[180px] w-full mt-0.5">
                            <MessageSquareText size={12} className="shrink-0 mt-0.5 text-amber-500" />
                            <p className="text-[9px] md:text-[10px] leading-tight break-words font-medium italic">
                              "{doc.refundReason}"
                            </p>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="p-4 md:p-5 text-right align-top">
                      {doc.status === "REFUND_REQUESTED" ? (
                        <div className="flex justify-end gap-1.5 md:gap-2">
                          <button 
                            onClick={() => handleApprove(doc._id || doc.id)}
                            disabled={loadingId === (doc._id || doc.id)}
                            className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold hover:bg-emerald-100 transition shadow-sm disabled:opacity-50"
                          >
                            <CheckCircle2 size={12} className={loadingId === (doc._id || doc.id) ? "animate-pulse" : ""} />
                            Approve
                          </button>
                          <button 
                            onClick={() => handleReject(doc._id || doc.id)}
                            disabled={loadingId === (doc._id || doc.id)}
                            className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold hover:bg-slate-100 transition shadow-sm disabled:opacity-50"
                          >
                            <XCircle size={12} />
                            Reject
                          </button>
                        </div>
                      ) : doc.status !== "REFUNDED" ? (
                        <button 
                          onClick={() => handleRefundClick(doc._id || doc.id, doc.txnId)}
                          disabled={loadingId === (doc._id || doc.id)}
                          className="inline-flex items-center gap-1.5 bg-white border border-rose-200 text-rose-600 px-2 py-1.5 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-xs font-bold hover:bg-rose-50 transition shadow-sm disabled:opacity-50"
                        >
                          <RotateCcw size={12} className={loadingId === (doc._id || doc.id) ? "animate-spin" : ""} />
                          {loadingId === (doc._id || doc.id) ? "Processing..." : "Force Refund"}
                        </button>
                      ) : (
                        <span className="text-[10px] md:text-xs text-slate-400 font-semibold italic">Refund Issued</span>
                      )}
                    </td>
                    
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center h-48">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3 border border-slate-100">
                      <Search className="text-slate-300" size={20} />
                    </div>
                    <p className="text-slate-500 font-bold text-sm">No records found</p>
                    <p className="text-slate-400 text-xs mt-1">
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