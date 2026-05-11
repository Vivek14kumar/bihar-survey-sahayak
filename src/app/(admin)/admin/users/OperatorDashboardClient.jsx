// src/app/(admin)/admin/users/OperatorDashboardClient.jsx
"use client";

import { useState } from "react";
import { 
  Search, Wallet, Target, Trophy, Send, Users, 
  Zap, Plus, RotateCcw, Activity, ShieldAlert, CheckCircle2 
} from "lucide-react";
import { updateIndividualFormTarget, updateGlobalFormTarget, broadcastNotification, updateWalletBalance, updateOperatorTarget } from "@/app/actions/adminActions";

export default function OperatorDashboardClient({ initialOperators, leaderboard, networkStats }) {
  const [operators, setOperators] = useState(initialOperators);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 👉 NEW: Filter state for tracking achievements
  const [targetFilter, setTargetFilter] = useState("ALL"); // "ALL", "ACHIEVED", "PENDING"
  const [loading, setLoading] = useState(false);

  // Global States
  const [globalTarget, setGlobalTarget] = useState(10);
  const [globalReward, setGlobalReward] = useState(50);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");

  const [targetFormName, setTargetFormName] = useState("Vanshavali");

  const handleGlobalTargetUpdate = async () => {
  if (!confirm(`Set target for ${targetFormName} to ${globalTarget} forms for ₹${globalReward}?`)) return;
  setLoading(true);
  try {
    // Call the NEW server action
    await updateGlobalFormTarget(targetFormName, globalTarget, globalReward);
    alert(`✅ Global target for ${targetFormName} applied successfully!`);
  } catch (error) {
    alert("❌ Failed to update global targets.");
  }
  setLoading(false);
};

  const handleBroadcast = async () => {
    if (!broadcastTitle || !broadcastMessage) return alert("Please fill both fields.");
    setLoading(true);
    try {
      await broadcastNotification(broadcastTitle, broadcastMessage, "PROMO");
      alert("✅ Broadcast sent to all operators!");
      setBroadcastTitle("");
      setBroadcastMessage("");
    } catch (error) {
      alert("❌ Failed to send broadcast.");
    }
    setLoading(false);
  };

  const handleIndividualAction = async (userId, type, currentVal1, currentVal2) => {
    if (type === "WALLET") {
      const amount = prompt(`Enter amount to ADD to Wallet:`);
      if (!amount || isNaN(amount)) return;
      
      setLoading(true);
      await updateWalletBalance(userId, amount, "ADD", "Admin Top-Up");
      alert("✅ Wallet Updated");
      setLoading(false);

    } else if (type === "TARGET") {
      
      // 👉 NEW: Form-Specific Prompts for Individual Users
      const formToTarget = prompt("Which form? (e.g., Vanshavali, Prapatra 2):", "Vanshavali");
      if (!formToTarget) return;
      
      const newTarget = prompt(`Enter target for ${formToTarget}:`, "5");
      if (!newTarget || isNaN(newTarget)) return;

      const newReward = prompt(`Enter Cashback Reward for ${formToTarget}:`, "5");
      if (!newReward || isNaN(newReward)) return;

      setLoading(true);
      try {
        // Call the server action
        await updateIndividualFormTarget(userId, formToTarget, newTarget, newReward);
        alert(`✅ Custom Target Updated for ${formToTarget}`);
      } catch (error) {
        alert("❌ Failed to set individual target.");
      }
      setLoading(false);

    } else if (type === "SUSPEND") {
      const confirmBlock = confirm(`Are you sure you want to change the account status for this operator?`);
      if(confirmBlock) alert("Feature ready to be wired to server action!");
    }
  };

  // 👉 NEW: Combined Filtering Logic (Search + Target Status)
  const filteredOperators = operators.filter(op => {
    // 1. Check Search Match
    const searchString = `${op.shopName} ${op.mobileNumber} ${op.ownerName}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());

    // 2. Check Target Match
    const target = op.dailyTargetForms || 10;
    const current = op.todayFormsGenerated || 0;
    const isAchieved = current >= target;

    let matchesTarget = true;
    if (targetFilter === "ACHIEVED") matchesTarget = isAchieved;
    if (targetFilter === "PENDING") matchesTarget = !isAchieved;

    return matchesSearch && matchesTarget;
  });

  // Count metrics for the Tabs
  const achievedCount = operators.filter(op => (op.todayFormsGenerated || 0) >= (op.dailyTargetForms || 10)).length;
  const pendingCount = operators.length - achievedCount;

  return (
    <div className="space-y-6">
      
      {/* ================= NETWORK QUICK STATS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Fleet</p>
            <p className="text-2xl font-black text-slate-800">{networkStats.totalOperators}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Activity size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Today's Forms</p>
            <p className="text-2xl font-black text-slate-800">{networkStats.todayNetworkVolume}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl"><CheckCircle2 size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Targets Hit</p>
            <p className="text-2xl font-black text-slate-800">{networkStats.targetAchievers}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><RotateCcw size={20} /></div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Total Refunds</p>
            <p className="text-2xl font-black text-slate-800">{networkStats.totalRefunds}</p>
          </div>
        </div>
      </div>

      {/* ================= MIDDLE ROW: CONTROLS & LEADERBOARD ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COMPACT LEADERBOARD */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Trophy className="text-yellow-500" size={18} /> Top 5 Today
            </h2>
          </div>
          
          <div className="space-y-2">
            {leaderboard.length > 0 ? leaderboard.map((op, index) => (
              <div key={op._id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-black w-5 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-amber-600' : 'text-slate-300'}`}>
                    #{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight truncate max-w-[120px]">{op.shopName || op.ownerName}</p>
                    <p className="text-[10px] text-slate-500">{op.ownerName} | {op.district}</p>
                  </div>
                </div>
                <div className="bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm text-xs font-bold text-indigo-600">
                  {op.todayFormsGenerated} forms
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-slate-400 text-sm">No forms generated today.</div>
            )}
          </div>
        </div>

        {/* GLOBAL CONTROLS */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl p-6 shadow-xl text-white flex flex-col justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Zap className="text-blue-400" size={18} /> Fleet Management
          </h2>

          <div className="grid md:grid-cols-2 gap-4 h-full">
            {/* Global Target Form UI */}
<div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-between">
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Set Universal Target</p>
    
    {/* 👉 NEW: Form Name Dropdown */}
    <select 
      value={targetFormName} 
      onChange={(e) => setTargetFormName(e.target.value)}
      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-white mb-2"
    >
      <option value="Vanshavali">Vanshavali</option>
      <option value="Prapatra 2">Prapatra 2</option>
      <option value="Bantwara">Bantwara</option>
      {/* Add any other form names you have */}
    </select>

    <div className="flex gap-2 mb-3">
      <div className="w-1/2">
        <label className="text-[10px] text-slate-500 mb-1 block">Daily Forms</label>
        <input type="number" value={globalTarget} onChange={(e) => setGlobalTarget(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
      </div>
      <div className="w-1/2">
        <label className="text-[10px] text-slate-500 mb-1 block">Cashback (₹)</label>
        <input type="number" value={globalReward} onChange={(e) => setGlobalReward(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500" />
      </div>
    </div>
  </div>
  <button onClick={handleGlobalTargetUpdate} disabled={loading} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg text-xs transition">Apply to All</button>
</div>

            {/* Broadcast Form */}
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Push Notification</p>
                <input type="text" placeholder="Title..." value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 mb-2" />
                <textarea placeholder="Message content..." value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} rows="2" className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 mb-2 resize-none" />
              </div>
              <button onClick={handleBroadcast} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs flex justify-center items-center gap-2 transition"><Send size={12} /> Send Broadcast</button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ROW: DIRECTORY ================= */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Header & Tabs */}
        <div className="p-5 border-b border-slate-100 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-indigo-500" size={18} /> Operator Directory
            </h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input type="text" placeholder="Search by shop or mobile..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm" />
            </div>
          </div>

          {/* 👉 NEW: Interactive Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button 
              onClick={() => setTargetFilter("ALL")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${targetFilter === "ALL" ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              All Operators ({operators.length})
            </button>
            <button 
              onClick={() => setTargetFilter("ACHIEVED")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${targetFilter === "ACHIEVED" ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'}`}
            >
              <CheckCircle2 size={14} /> Achieved Target ({achievedCount})
            </button>
            <button 
              onClick={() => setTargetFilter("PENDING")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap ${targetFilter === "PENDING" ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100'}`}
            >
              <Activity size={14} /> In Progress ({pendingCount})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-500">
                <th className="p-4 font-semibold">Operator Info</th>
                <th className="p-4 font-semibold">Wallet Status</th>
                <th className="p-4 font-semibold">Gamification Progress</th>
                <th className="p-4 font-semibold text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody>
  {filteredOperators.length > 0 ? filteredOperators.map((op) => {
    // Check if they have hit at least one target
    const hasWonAny = op.activeTargets?.some(t => t.currentProgress >= t.targetForm);
    
    return (
      <tr key={op._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
        <td className="p-4 align-top pt-5">
          <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
            {op.shopName} 
            {/*!op.isActive && <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[8px] rounded-sm ml-1">SUSPENDED</span>*/}
            {hasWonAny && <CheckCircle2 size={14} className="text-emerald-500 ml-1" title="Target Hit!" />}
          </p>
          <p className="text-xs text-slate-500">{op.ownerName} • {op.mobileNumber}</p>
        </td>
        
        <td className="p-4 align-top pt-5">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${op.walletBalance < 20 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <Wallet size={12} />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-800">₹{op.walletBalance}</span>
              {op.walletBalance < 20 && <p className="text-[9px] font-bold text-rose-500">LOW</p>}
            </div>
          </div>
        </td>

        {/* 👉 NEW: DYNAMIC FORM-SPECIFIC TARGETS DISPLAY */}
        <td className="p-4 min-w-[200px]">
          {op.activeTargets && op.activeTargets.length > 0 ? (
            <div className="space-y-3">
              {op.activeTargets.map((target, idx) => {
                const isHit = target.currentProgress >= target.targetForm;
                const progressPercent = Math.min((target.currentProgress / target.Form) * 100, 100);
                
                return (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-slate-600">{target.formName} ({target.currentProgress}/{target.targetForm})</span>
                      <span className={isHit ? "text-emerald-600" : "text-blue-600"}>
                        {isHit ? `₹${target.cashbackReward} WON!` : `₹${target.cashbackReward} CB`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isHit ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[10px] font-bold text-slate-400 italic">No active targets today.</p>
          )}
        </td>

        <td className="p-4 text-right align-top pt-5">
          <div className="flex justify-end gap-2">
            <button onClick={() => handleIndividualAction(op._id, "WALLET", op.walletBalance)} title="Add Funds" className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-100">
              <Plus size={14} />
            </button>
            <button onClick={() => handleIndividualAction(op._id, "TARGET", 10, 50)} title="Set Form Target" className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-100">
              <Target size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  }) : (
    <tr>
      <td colSpan="4" className="p-8 text-center text-slate-500 text-sm font-semibold">
        No operators found.
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