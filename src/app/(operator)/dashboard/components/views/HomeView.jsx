import { useState, useEffect } from "react";
import { CheckCircle2, Search, FileSignature, FileText, Users, Activity, Scale, Wallet } from "lucide-react";
import { MotivationWidget } from "../widgets/MotivationWidget";

// FULL ARRAY OF ALL FORMS
const availableForms = [
  { id: "prapatra2", category: "forms", title: "Prapatra 2", desc: "Self Declaration Form.", icon: <FileSignature size={24}/>, cost: "5", badge: "Popular", badgeColor: "bg-rose-100 text-rose-700", view: "form_prapatra2" },
  { id: "prapatra3", category: "all", title: "Prapatra 3(1)", desc: "Claim details format.", icon: <FileText size={24}/>, cost: "5", view: "form_prapatra3" },
  { id: "vanshavali", category: "forms", title: "Vanshavali", desc: "Family tree layouts.", icon: <Users size={24}/>, cost: "10", badge: "High Margin", badgeColor: "bg-emerald-100 text-emerald-700", view: "form_vanshavali" },
  { id: "batwara", category: "forms", title: "Batwara Application", desc: "Land partition form.", icon: <Activity size={24}/>, cost: "30", badge: "High Margin", badgeColor: "bg-emerald-100 text-emerald-700", view: "form_batwara" },
  { id: "shapath", category: "all", title: "Shapath Patra", desc: "General affidavit format from Notary.", icon: <Scale size={24}/>, cost: "3", view: "form_shapath" },
  { id: "deathCertiAfi", category: "affidavits", title: "Death Certificate Affidavit", desc: "Death affidavit format.", icon: <Scale size={24}/>, cost: "5", view: "form_deathCertiAfi" },
  { id: "deathCertiDec", category: "affidavits", title: "Death Certificate (Mukhiya/Sarpanch)", desc: "Mukhiya / Sarpanch affidavit format.", icon: <Scale size={24}/>, cost: "5", view: "form_DeathCertiDec" },
  { id: "objection", category: "all", title: "Objection Letter", desc: "Claim details format.", icon: <FileText size={24}/>, cost: "5", view: "form_objection" },
  { id: "cancelJama", category: "all", title: "Jamabandhi Cancellation", desc: "Cancellation details format.", icon: <FileText size={24}/>, cost: "5", view: "form_cancelJama" }
];

export default function HomeView({ searchQuery, setCurrentView, onRewardClaimed, userData }) {
  const [activeTab, setActiveTab] = useState("all");
  const [dailyTargets, setDailyTargets] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ topShops: [], userRank: "Loading..." });

  // Optional: Extract userType for cleaner code
  const userType = userData?.userType || 'operator';
  
  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const [targetRes, leaderRes] = await Promise.all([
          fetch("/api/targets/daily", { cache: 'no-store' }),
          fetch("/api/leaderboard", { cache: 'no-store' })
        ]);
        
        const tData = await targetRes.json();
        const lData = await leaderRes.json();
        if (tData?.targets) setDailyTargets(tData.targets);
        if (lData?.topShops) setLeaderboard(lData);
      } catch (error) { console.error(error); }
    };
    fetchGamificationData();
    const intervalId = setInterval(fetchGamificationData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleClaimReward = async (targetId) => {
    try {
      const res = await fetch("/api/targets/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetId }) });
      const data = await res.json();
      if (data.success) {
        alert("🎉 Reward Claimed! Money added to your wallet.");
        onRewardClaimed(data.newBalance, data.transaction);
      } else alert(data.error);
    } catch (error) { console.error("Failed to claim:", error); }
  };

  const filteredForms = availableForms.filter((form) => {
    const matchesTab = activeTab === 'all' || form.category === activeTab;
    const query = searchQuery ? searchQuery.toLowerCase() : "";
    const matchesSearch = !query || form.title.toLowerCase().includes(query) || form.desc.toLowerCase().includes(query);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-300">
      {/* CHANGED: xl:flex-row is now lg:flex-row */}
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start gap-4">
        
        {/* Left Side: Header Text */}
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex bg-green-100/80 text-green-700 text-[10px] font-black px-2 py-0.5 rounded border border-blue-200">
              <CheckCircle2 size={14} /> &nbsp; सक्रिय (ACTIVE)
            </span>
            <span className="text-[11px] text-slate-500 font-bold">बिहार सर्वे सहायक</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            {userType === 'amin' ? "AMIN'S" : "OPERATOR'S"}{' '}
            <span className="text-blue-600">DASHBOARD</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">
            ग्राहकों के लिए सर्वे फॉर्म बनाने के लिए नीचे दिए गए टेम्पलेट का चयन करें। (Select a template below to draft survey forms.)
          </p>
        </div>
        
        {/* Right Side: Widget Container */}
        {/* CHANGED: All 'xl:' prefixes are now 'lg:' */}
        <div className="w-full flex  lg:w-auto lg:block mt-2 lg:mt-0 ">
          <MotivationWidget dailyTargets={dailyTargets} leaderboard={leaderboard} onClaim={handleClaimReward} />
        </div>

      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-px overflow-x-auto custom-scrollbar">
        <button onClick={() => setActiveTab('all')} className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'all' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>All Tools</button>
        <button onClick={() => setActiveTab('forms')} className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'forms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Main Forms</button>
        <button onClick={() => setActiveTab('affidavits')} className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap ${activeTab === 'affidavits' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Affidavits</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
        {filteredForms.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <Search className="text-slate-300 mb-3" size={32} />
            <p className="text-slate-600 font-bold">No forms found</p>
            <p className="text-sm text-slate-400 mt-1">Try searching for a different keyword.</p>
          </div>
        ) : (
          filteredForms.map((form) => (
             <div key={form.id} onClick={() => setCurrentView(form.view)} className="group p-5 rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer bg-white flex flex-col transition-all h-full">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform duration-300">{form.icon}</div>
                    {form.badge && <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${form.badgeColor}`}>{form.badge}</span>}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{form.title}</h3>
                  <p className="text-[11px] text-slate-500 mb-6">{form.desc}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
                   <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1 border border-slate-200">
                     <Wallet size={12} className="text-blue-600"/> Cost:{form.cost} Credits
                   </span>
                </div>
             </div>
          ))
        )}
      </div>
    </div>
  );
}