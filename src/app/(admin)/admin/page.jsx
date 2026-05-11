"use client";
import { useEffect, useState } from "react";
import {
  Eye, Calendar, FileText, Download, Activity, Mail, Printer, 
  IndianRupee, Send, Bell, ArrowUpRight, Users, CheckCircle2,
  AlertTriangle, MessageSquare, FileDigit, TrendingUp
} from "lucide-react";
import { posts } from "../../(public)/data/posts"; // Adjust path if needed

export default function ModernAdminDashboard() {
  const [stats, setStats] = useState({
    today: {},
    last7Days: [],
    pageViews: 0,
    uniqueVisitors: 0,
    todayVisitors: 0,
    totalPreview: 0,
    totalDownload: 0,
    pdfData: [],
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(Object.keys(posts)[0] || "");
  const [adminToken, setAdminToken] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Mocking fetch for layout demonstration. Replace with your actual API calls.
    fetch("/api/get-analytics")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.log("Analytics API pending..."));

    fetch("/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data))
      .catch(() => console.log("Feedback API pending..."));
  }, []);

  const handleSendNotification = async () => {
    if (!adminToken) return alert("Admin Password required!");
    setIsSending(true);
    const selectedPost = posts[selectedSlug];
    
    try {
      const res = await fetch("/api/notify-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedPost.title,
          message: selectedPost.intro.substring(0, 100) + "...", 
          slug: selectedSlug,
          adminToken: adminToken,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        setAdminToken("");
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      alert("❌ Request failed!");
    }
    setIsSending(false);
  };

  // Safe data extraction based on your new DB schema
  const today = stats.today || {};
  const totalRevenue = today.totalRevenue || 0;
  const pageViews = today.pageViews || 0;
  const uniqueVisitors = today.uniqueVisitors || 0;
  
  const totalCreated = (today.vanshawaliCreated || 0) + (today.prapatra2Printed || 0) + (today.totalBantwara || 0);
  const totalPaid = (today.vanshawaliCreated || 0) + (today.prapatra2Paid || 0) + (today.paidBantwara || 0);
  const conversionRate = totalCreated > 0 ? ((totalPaid / totalCreated) * 100).toFixed(1) : 0;

  // Simplified UI Component for Admin
async function handleSendMsg() {
  await createNotification(selectedUserId, "Update on your Refund", "We have processed your refund for TXN-123.");
  alert("Message sent!");
}

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <Calendar size={14} /> {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <span className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Operational
          </span>
        </div>
      </div>

      {/* TOP METRICS (Bento Grid Row 1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ModernStatCard 
          title="Today's Revenue" 
          value={`₹${totalRevenue}`} 
          subtitle="Real-time collection"
          icon={<IndianRupee />} 
          color="blue" 
          trend="+12%" 
        />
        <ModernStatCard 
          title="Unique Visitors" 
          value={uniqueVisitors} 
          subtitle="Active today"
          icon={<Users />} 
          color="indigo" 
          trend="+5.2%" 
        />
        <ModernStatCard 
          title="Total Page Views" 
          value={pageViews} 
          subtitle="Traffic volume"
          icon={<Eye />} 
          color="fuchsia" 
        />
        <ModernStatCard 
          title="Conversion Rate" 
          value={`${conversionRate}%`} 
          subtitle="Paid vs Created"
          icon={<TrendingUp />} 
          color="emerald" 
        />
      </div>

      {/* MAIN BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* FORM GENERATION ANALYTICS (Col Span 8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileDigit className="text-blue-500" size={20} /> Form Generation Breakdown
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">Today</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <MiniDataCard title="Vanshawali" created={today.vanshawaliCreated || 0} paid={today.vanshawaliCreated || 0} color="blue" />
            <MiniDataCard title="Prapatra-2" created={today.prapatra2Printed || 0} paid={today.prapatra2Printed || 0} color="indigo" />
            <MiniDataCard title="Bantwara" created={today.totalBantwara || 0} paid={today.paidBantwara || 0} free={today.freeBantwara || 0} color="emerald" />
            <MiniDataCard title="Death Affidavit" created={today.deathAffidavit || 0} paid={today.deathAffidavit || 0} color="amber" />
            <MiniDataCard title="Death Declaration" created={today.deathDeclaration || 0} paid={today.deathDeclaration || 0} color="orange" />
            <MiniDataCard title="Objection Letters" created={today.objectionLetterPaid || 0} paid={today.objectionLetterPaid || 0} color="rose" />
          </div>
        </div>

        {/* NOTIFICATION PANEL (Col Span 4) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-slate-800 to-slate-700 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-slate-700/30">
            <Bell size={120} />
          </div>
          
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
            <Bell size={20} className="text-blue-400" /> Broadcast Update
          </h2>

          <div className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Target Post</label>
              <select 
                className="w-full bg-slate-800/50 border border-slate-600 text-sm p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
              >
                {posts && Object.keys(posts).map(slug => (
                  <option key={slug} value={slug}>{posts[slug].title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Security Token</label>
              <input 
                type="password" 
                placeholder="Enter ADMIN_SECRET" 
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600 text-sm p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-700/50 mt-2">
              <p className="text-xs text-blue-400 font-bold mb-1">Live Preview</p>
              <p className="text-sm font-medium line-clamp-1">{posts?.[selectedSlug]?.title || "Select a post..."}</p>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{posts?.[selectedSlug]?.intro || "Description preview will appear here."}</p>
            </div>

            <button 
              onClick={handleSendNotification}
              disabled={isSending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 text-sm mt-4 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              <Send size={16} className={isSending ? "animate-bounce" : ""} />
              {isSending ? "Sending..." : "Push to All Users"}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM TABLES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PDF Analytics Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm ">
          <div className="flex justify-between items-center mb-6 ">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-indigo-500" size={20} /> Global Document Ledger
            </h2>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div className="h-[50vh] overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-semibold">Document Type</th>
                  <th className="pb-3 font-semibold text-center">Previews</th>
                  <th className="pb-3 font-semibold text-center">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {stats.pdfData?.length > 0 ? (
                  stats.pdfData.map((pdf, index) => (
                    <tr key={index} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="py-4 text-sm font-medium text-slate-800">{pdf.name}</td>
                      <td className="py-4 text-center">
                        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
                          {pdf.preview || 0}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                          {pdf.download || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="py-8 text-center text-slate-400 text-sm">No document data generated yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="text-rose-500" size={20} /> Recent Support Tickets
            </h2>
          </div>
          
          <div className="h-[50vh] overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 font-semibold">Operator</th>
                  <th className="pb-3 font-semibold">Issue/Message</th>
                  <th className="pb-3 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks?.length > 0 ? (
                  feedbacks.slice(0, 5).map((fb) => (
                    <tr key={fb._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="py-4">
                        <p className="text-sm font-bold text-slate-800">{fb.name}</p>
                        <p className="text-xs text-slate-500">{fb.email}</p>
                      </td>
                      <td className="py-4 text-sm text-slate-600 max-w-[200px] ">{fb.message}</td>
                      <td className="py-4 text-right text-xs text-slate-400">
                        {new Date(fb.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="py-8 text-center text-slate-400 text-sm">Inbox is empty.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

// Main Top Metric Cards
function ModernStatCard({ title, value, subtitle, icon, color, trend }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    fuchsia: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <ArrowUpRight size={14} className="mr-1" /> {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
        <p className="text-sm font-semibold text-slate-900 mt-1">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// Mini Cards for Form Analytics
function MiniDataCard({ title, created, paid, free, color }) {
  const badgeColor = {
    blue: "bg-blue-500",
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    orange: "bg-orange-500",
    rose: "bg-rose-500",
  }[color];

  return (
    <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex flex-col justify-between hover:bg-slate-100/80 transition">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${badgeColor}`}></div>
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-black text-slate-800 leading-none">{paid}</p>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">PAID</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-600">{created}</p>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">GENERATED</p>
        </div>
      </div>
      {free !== undefined && free > 0 && (
         <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500">FREE PROMOS</span>
            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md">{free}</span>
         </div>
      )}
    </div>
  );
}