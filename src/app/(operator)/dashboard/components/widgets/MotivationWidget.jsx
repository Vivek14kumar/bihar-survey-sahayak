import { Target, Trophy, CheckCircle2 } from "lucide-react";

export function MotivationWidget({ dailyTargets = [], leaderboard = { topShops: [], userRank: "Calculating..." }, onClaim }) {
  return (
    <div className="flex flex-row  gap-2 shrink">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full sm:w-64 p-4 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-1">
          <h3 className="text-[8px] md:text-[12px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Target size={14} className="text-blue-500"/> Daily Targets</h3>
          <span className="text-[8px] md:text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">{dailyTargets.length} Active</span>
        </div>
        <div className="space-y-3 overflow-y-auto max-h-[140px] custom-scrollbar pr-1">
          {dailyTargets.length === 0 ? <p className="text-xs text-slate-400 text-center py-4 italic">No targets set for today.</p> : dailyTargets.map((target) => {
            const isMet = target.currentProgress >= target.targetForm;
            const progressPercent = Math.min(100, (target.currentProgress / target.targetForm) * 100);
            const remaining = Math.max(0, target.targetForm - target.currentProgress);
            return (
              <div key={target._id} className={`p-2.5 rounded-lg border ${isMet ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="text-[11px] font-bold text-slate-700 capitalize flex items-center gap-1">{isMet && <CheckCircle2 size={12} className="text-emerald-500" />} {target.formName}</h4>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 ${isMet ? 'text-emerald-700 bg-emerald-100/50' : 'text-blue-700 bg-blue-100/50'}`}>₹{target.cashbackReward}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden"><div className={`h-1.5 rounded-full transition-all duration-1000 ${isMet ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${progressPercent}%` }}></div></div>
                <div className="flex justify-between items-center">
                  <p className="text-[9px] font-bold text-slate-500">{target.currentProgress} / {target.targetForm} Done</p>
                  <div className={`text-[9px] font-bold ${isMet ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isMet ? (target.isRewardClaimed ? "Claimed ✓" : <button onClick={() => onClaim(target._id)} className="bg-emerald-500 text-white px-2 py-1 rounded shadow-sm hover:bg-emerald-600 active:scale-95 transition-all animate-pulse">Claim ₹{target.cashbackReward}</button>) : (`${remaining} more left`)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm w-full sm:w-64 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <h3 className="text-[8px] md:text-[12px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5"><Trophy size={14} className="text-rose-500"/> Top Operator's</h3>
          <span className="text-[8px] font-bold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full animate-pulse">LIVE</span>
        </div>
        <div className="space-y-2 mb-2 min-h-[50px]">
          {leaderboard.topShops.length === 0 ? <p className="text-xs text-slate-400 text-center py-2 italic">Loading data...</p> : leaderboard.topShops.map((shop, index) => (
            <div key={shop.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${index === 0 ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"}`}>{index + 1}</div>
                <p className="text-[9px] md:text-[11px] font-bold text-slate-700 max-w-[120px]">{shop.shopName}, {shop.ownerName} • <span className="text-slate-400">{shop.city}</span></p>
              </div>
              <p className="text-[11px] font-black text-emerald-600">{shop.count}</p>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between bg-slate-50 -mx-4 -mb-4 px-4 py-2 rounded-b-xl">
           <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> Your Rank</div>
           <p className="text-[10px] font-black text-blue-600">{leaderboard.userRank}</p>
        </div>
      </div>
    </div>
  );
}