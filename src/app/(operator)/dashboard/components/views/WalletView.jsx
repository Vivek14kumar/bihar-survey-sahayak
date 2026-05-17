import { useState, useEffect, useCallback } from "react";
import { 
  Wallet, CreditCard, CheckCircle2, AlertTriangle, History, Calendar, 
  FileText, Gift, ArrowDownRight, Filter, Sparkles, ChevronDown, Loader2 
} from "lucide-react";

export default function WalletView({ walletBalance, onUpdateWallet }) {
  // Payment States
  const [addAmount, setAddAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Data & Pagination States
  const [localTransactions, setLocalTransactions] = useState([]);
  const [txFilter, setTxFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Transaction Fetching Logic ---
  const fetchTransactions = useCallback(async (pageNum, currentData = []) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/wallet/transactions?page=${pageNum}&limit=6&type=${txFilter}&date=${dateFilter}`);
      if (res.ok) {
        const json = await res.json();
        // If it's page 1, replace the data. Otherwise, append to existing data.
        setLocalTransactions(pageNum === 1 ? json.data : [...currentData, ...json.data]);
        setHasMore(json.hasMore);
      } else {
        console.error("Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [txFilter, dateFilter]);

  // Refetch from Page 1 whenever filters change
  useEffect(() => {
    setPage(1);
    fetchTransactions(1, []);
  }, [txFilter, dateFilter, fetchTransactions]);

  // Load More Button Handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage, localTransactions);
  };

  // --- Razorpay Payment Logic ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amount = Number(addAmount);
    if (!amount || amount <= 0) return;
    
    setIsProcessing(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      const orderRes = await fetch("/api/razorpay/create-wallet-order", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount }), 
      });
      const orderData = await orderRes.json();
      
      if (!orderData.id) {
        alert("Failed to initialize payment. Try again.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, currency: "INR", name: "Bihar Survey Sahayak", description: "Wallet Top-Up",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/wallet/add", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount, razorpayPaymentId: response.razorpay_payment_id, razorpayOrderId: response.razorpay_order_id, razorpaySignature: response.razorpay_signature }),
            });
            if (verifyRes.ok) {
              const data = await verifyRes.json();
              onUpdateWallet(data.newBalance, data.transaction); 
              setAddAmount("");
              setPaymentSuccess(true);
              
              // Refresh transaction list after successful payment
              fetchTransactions(1, []);
              
              setTimeout(() => setPaymentSuccess(false), 4000);
            } else {
              alert("Payment received, but wallet update failed. Contact Admin.");
            }
          } catch (err) { console.error("Wallet update error:", err); }
        },
        theme: { color: "#3b82f6" },
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert("Payment Failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (error) { console.error("Payment setup error:", error); } 
    finally { setIsProcessing(false); }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-300">
      <header className="mb-5 sm:mb-6 lg:mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight leading-tight break-words">Wallet Management</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Add credits and manage transactions securely.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 lg:gap-7">
        
        {/* LEFT SECTION */}
        <div className="xl:col-span-2 space-y-5 lg:space-y-6 min-w-0">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 p-4 sm:p-6 md:p-8 shadow-xl">
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute right-2 top-2 sm:right-4 sm:top-4 opacity-10"><Wallet className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32" /></div>
            <div className="relative z-10 min-w-0">
              <p className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.25em] text-blue-300 mb-2">Available Credits</p>
              <h3 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight break-all">₹{walletBalance}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 md:p-8 overflow-hidden">
            <div className="flex items-start sm:items-center gap-3 mb-5 sm:mb-6">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0"><CreditCard size={20} className="text-blue-700" /></div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg md:text-xl font-black text-slate-800 break-words">Recharge Wallet</h3>
                <p className="text-[11px] sm:text-sm text-slate-500">Add money instantly using secure payment.</p>
              </div>
            </div>

            {paymentSuccess && (
              <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-700">
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-bold leading-relaxed">Payment Successful! Credits added to your wallet.</p>
              </div>
            )}

            <form onSubmit={handleAddMoney} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Enter Amount</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-bold">₹</div>
                  <input type="number" min="10" max="200" required value={addAmount}
                    onChange={(e) => { const v = e.target.value; if (v === "" || Number(v) <= 200) setAddAmount(v); }}
                    placeholder="Enter amount between 10 and 200"
                    className="w-full h-12 sm:h-14 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[50, 100, 150, 200].map((amt) => (
                  <button key={amt} type="button" onClick={() => setAddAmount(amt)}
                    className={`flex-1 min-w-[70px] sm:min-w-[85px] px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all whitespace-nowrap ${Number(addAmount) === amt ? "bg-blue-600 text-white border-blue-600 shadow-md" : "bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"}`}>
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-3 text-amber-800">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-1.5 text-amber-900">Strict No Refund Policy</p>
                    <p className="text-[11px] font-semibold leading-relaxed mb-1.5">Added funds cannot be refunded or transferred to any bank account under any circumstances. You can add a minimum of ₹10 and a maximum of ₹200 per transaction.</p>
                    <p className="text-[11px] font-semibold leading-relaxed text-amber-700 pt-1.5 border-t border-amber-200/50"><span className="font-black">महत्वपूर्ण:</span> वॉलेट में जोड़े गए पैसे किसी भी स्थिति में वापस (Refund) या बैंक खाते में ट्रांसफर नहीं किए जाएंगे। एक बार में कम से कम ₹10 और अधिकतम ₹200 ही जोड़ सकते हैं।</p>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isProcessing} className="w-full h-12 sm:h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.18em] text-[11px] sm:text-xs shadow-lg transition-all active:scale-[0.98] disabled:opacity-50">
                {isProcessing ? "Processing Payment..." : "Proceed to Add"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SECTION: Transactions */}
        <div className="border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5 sticky top-5 bg-white z-10 flex flex-col h-full lg:max-h-[850px] shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="flex items-center gap-2 text-[11px] sm:text-xs font-black text-slate-800 uppercase tracking-[0.2em] min-w-0">
              <History size={15} className="text-blue-500 shrink-0" />
              <span className="truncate">Recent Transactions</span>
            </h3>
            <div className="relative flex items-center bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors rounded-lg px-2 py-1 cursor-pointer">
               <Calendar size={12} className="text-blue-500 mr-1.5" />
               <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="text-[10px] font-bold text-slate-600 bg-transparent outline-none cursor-pointer appearance-none pr-1">
                 <option value="ALL">All Time</option><option value="TODAY">Today</option><option value="WEEK">Past 7 Days</option><option value="MONTH">Past 30 Days</option>
               </select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
            {["ALL", "CREDIT", "DEBIT", "REWARD", "REFUND"].map((tab) => (
              <button key={tab} onClick={() => setTxFilter(tab)}
                className={`text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${txFilter === tab ? tab === "REWARD" ? "bg-amber-100 text-amber-700 shadow-sm" : tab === "REFUND" ? "bg-indigo-100 text-indigo-700 shadow-sm" : "bg-slate-800 text-white shadow-sm" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}>
                {tab === "REWARD" && txFilter === tab && <Sparkles size={12} className="text-amber-500" />}
                {tab === "DEBIT" ? "PAID" : tab === "CREDIT" ? "TOP-UPS" : tab}
              </button>
            ))}
          </div>

          <div className="space-y-3 overflow-y-auto mt-4 custom-scrollbar pr-1 flex-1">
            {/* Initial Loading State */}
            {isLoading && page === 1 ? (
               <div className="py-12 flex items-center justify-center">
                 <Loader2 size={24} className="text-blue-500 animate-spin" />
               </div>
            ) : localTransactions.length === 0 ? (
              <div className="py-12 text-center animate-in fade-in flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-inner"><Filter size={24} className="text-slate-300" /></div>
                <p className="text-sm font-bold text-slate-700">No matching transactions</p>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">We couldn't find any {txFilter !== "ALL" ? txFilter.toLowerCase() : ""} records for this time period.</p>
                {(txFilter !== "ALL" || dateFilter !== "ALL") && (
                  <button onClick={() => { setTxFilter("ALL"); setDateFilter("ALL"); }} className="mt-4 text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">Clear Filters</button>
                )}
              </div>
            ) : (
              <>
                {/* Render Server Data */}
                {localTransactions.map((tx) => {
                  const isReward = tx.form?.toLowerCase().includes("reward") || tx.note?.toLowerCase().includes("auto-claim") || tx.type === "REWARD";
                  return (
                    <div key={tx.id || tx._id || tx.txnId} className={`flex justify-between items-start gap-3 p-3 sm:p-4 rounded-2xl border transition-all overflow-hidden group ${isReward ? 'bg-gradient-to-r from-amber-50 to-yellow-50/50 border-amber-200 shadow-sm hover:shadow-md' : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm hover:bg-slate-50'}`}>
                      <div className="flex gap-3 min-w-0 flex-1">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${isReward ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-inner" : tx.isCredit ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-500 border border-slate-200"}`}>
                          {isReward ? <Gift size={18} className="animate-pulse" /> : tx.isCredit ? <ArrowDownRight size={18} strokeWidth={2.5} /> : <FileText size={16} />}
                        </div>
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <p className={`text-xs sm:text-sm font-bold truncate flex items-center gap-1.5 ${isReward ? 'text-amber-900' : 'text-slate-800'}`}>
                            {tx.form || (tx.isCredit ? "Wallet Top-up" : "Form Generation")}
                            {isReward && <Sparkles size={12} className="text-amber-500" />}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">{new Date(tx.time || tx.createdAt || tx.date).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                            <span className="w-fit max-w-[80px] sm:max-w-full truncate text-[9px] sm:text-[10px] font-mono font-bold text-slate-400">{tx.txnId}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 flex flex-col justify-center items-end">
                        <p className={`text-sm sm:text-base font-black whitespace-nowrap tracking-tight ${isReward ? "text-amber-600" : tx.isCredit ? "text-emerald-600" : "text-slate-800"}`}>
                          {tx.isCredit ? "+" : "-"}₹{tx.amount?.toString().replace("-₹", "").replace("+₹", "")}
                        </p>
                        <div className="mt-1 flex flex-col items-end gap-1">
                          {isReward && <span className="text-[8px] font-black text-amber-500 bg-amber-100/50 px-1.5 py-0.5 rounded uppercase tracking-widest">Cashback</span>}
                          {tx.status !== "SUCCESS" && <span className={`inline-flex items-center justify-center text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest whitespace-nowrap ${tx.status === "FAILED" ? "text-rose-600 bg-rose-50 border border-rose-100" : "text-amber-600 bg-amber-50 border border-amber-100"}`}>{tx.status}</span>}
                        </div>
                        <div>
                          {tx.status === "SUCCESS" && (tx.amount === 199 || tx.form.includes("Profile Subscription (30 Days)")) && (
                            <a 
                              href={`/invoice/${tx.txnId}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-gray-400 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                              Download Invoice
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Load More Button */}
                {hasMore && (
                  <button 
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    className="w-full mt-2 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : (
                      <>Load More <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" /></>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}