"use client";
import { useEffect, useState } from "react";
import {
  Eye,
  Calendar,
  FileText,
  Download,
  Activity,
  Mail,
  Printer,
  IndianRupee,
  Send,
  Bell
} from "lucide-react";

// Import your blogs object! (Adjust the path if you saved it elsewhere)
import { posts } from "@/app/data/posts"; 

export default function AdminDashboard() {
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

  // ====== PUSH NOTIFICATION STATE ======
  // Default to the first post in your object
  const [selectedSlug, setSelectedSlug] = useState(Object.keys(posts)[0]); 
  const [adminToken, setAdminToken] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetch("/api/get-analytics")
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch("/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data));
  }, []);

  // ====== SEND NOTIFICATION LOGIC ======
  const handleSendNotification = async () => {
    if (!adminToken) return alert("Please enter the Admin Password!");
    
    setIsSending(true);
    const selectedPost = posts[selectedSlug];
    
    try {
      const res = await fetch("/api/notify-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedPost.title,
          // Cut the message off at 100 characters so it fits on mobile screens
          message: selectedPost.intro.substring(0, 100) + "...", 
          slug: selectedSlug,
          adminToken: adminToken,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
        setAdminToken(""); // Clear the password field after sending for safety
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      alert("❌ Request failed! Check your network or server logs.");
    }
    setIsSending(false);
  };

  /* ================= Conversion Rate ================= */
  const totalCreated =
    (stats.today?.vanshawaliCreated || 0) +
    (stats.today?.prapatra2Printed || 0);

  const totalPaid =
    (stats.today?.vanshawaliPaid || 0) +
    (stats.today?.prapatra2Paid || 0);

  const conversionRate =
    totalCreated > 0 ? ((totalPaid / totalCreated) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-10">
      
      {/* ================= HEADER ================= */}
      <div className="mb-10 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Revenue & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor revenue, PDF activity & notify users
          </p>
        </div>
      </div>

      {/* ================= PUSH NOTIFICATION PANEL ================= */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-gray-200 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Bell className="text-blue-500" size={26} /> Send Push Notification
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Inputs Section */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Blog Post</label>
              <select 
                className="w-full border-gray-300 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
              >
                {Object.keys(posts).map(slug => (
                  <option key={slug} value={slug}>{posts[slug].title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Password</label>
              <input 
                type="password" 
                placeholder="Enter ADMIN_SECRET_TOKEN" 
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="w-full border-gray-300 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
              />
            </div>
          </div>

          {/* Live Preview & Send Button Section */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <Eye size={14}/> Live Preview
              </h3>
              <p className="font-bold text-gray-800 mb-2 leading-snug text-lg">📢 {posts[selectedSlug].title}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{posts[selectedSlug].intro}</p>
            </div>
            
            <button 
              onClick={handleSendNotification}
              disabled={isSending}
              className={`mt-6 w-full py-3.5 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all ${
                isSending 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              <Send size={20} className={isSending ? "animate-pulse" : ""} />
              {isSending ? "Broadcasting to all users..." : "Broadcast Notification"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= TOP STATS ================= */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">

        {/* Today Stats */}
        <StatCard
          title="Vanshawali Created"
          value={stats.today?.vanshawaliCreated || 0}
          icon={<FileText size={28} />}
          gradient="from-purple-500 to-purple-700"
        />

        <StatCard
          title="Prapatra-2 Printed"
          value={stats.today?.prapatra2Printed || 0}
          icon={<Printer size={28} />}
          gradient="from-orange-500 to-red-600"
        />

        <StatCard
          title="Vanshawali Paid"
          value={stats.today?.vanshawaliPaid || 0}
          icon={<Download size={28} />}
          gradient="from-green-500 to-green-700"
        />

        <StatCard
          title="Prapatra-2 Paid"
          value={stats.today?.prapatra2Paid || 0}
          icon={<Download size={28} />}
          gradient="from-blue-500 to-blue-700"
        />

        <StatCard
          title="Total Revenue (₹)"
          value={stats.today?.totalRevenue || 0}
          icon={<IndianRupee size={28} />}
          gradient="from-emerald-500 to-teal-600"
        />

        <StatCard
          title="Today's Revenue (₹)"
          value={stats.today?.totalRevenue || 0}
          icon={<Calendar size={28} />}
          gradient="from-yellow-500 to-orange-500"
        />

        <StatCard
          title="Conversion Rate (%)"
          value={conversionRate}
          icon={<Activity size={28} />}
          gradient="from-indigo-600 to-purple-700"
        />

        {/* PDF Stats */}
        <StatCard
          title="Total PDF Preview"
          value={stats.totalPreview || 0}
          icon={<Eye size={28} />}
          gradient="from-pink-500 to-rose-500"
        />

        <StatCard
          title="Total PDF Downloads"
          value={stats.totalDownload || 0}
          icon={<Download size={28} />}
          gradient="from-red-500 to-red-700"
        />

        {/* Total Page Views & Visitors */}
        <StatCard
          title="Total Page Views"
          value={stats.pageViews || 0}
          icon={<Eye size={28} />}
          gradient="from-indigo-500 to-indigo-700"
        />

        <StatCard
          title="Unique Visitors"
          value={stats.uniqueVisitors || 0}
          icon={<Activity size={28} />}
          gradient="from-green-500 to-green-700"
        />

        <StatCard
          title="Today's Visitors"
          value={stats.todayVisitors || 0}
          icon={<Calendar size={28} />}
          gradient="from-yellow-500 to-orange-500"
        />
      </div>

      {/* ================= PDF TABLE ================= */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-gray-200 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          📄 Individual PDF Analytics
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <th className="p-4">PDF Name</th>
                <th className="p-4">Preview Clicks</th>
                <th className="p-4">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {stats.pdfData?.length > 0 ? (
                stats.pdfData.map((pdf, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-700">{pdf.name}</td>
                    <td className="p-4 text-yellow-600 font-bold">{pdf.preview || 0}</td>
                    <td className="p-4 text-red-600 font-bold">{pdf.download || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-6 text-center text-gray-500">
                    No PDF data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= FEEDBACK TABLE ================= */}
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          <Mail size={24} /> User Feedback
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Message</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks?.length > 0 ? (
                feedbacks.map((fb) => (
                  <tr key={fb._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-semibold text-gray-700">{fb.name}</td>
                    <td className="p-4 text-gray-600">{fb.email}</td>
                    <td className="p-4 text-gray-700">{fb.message}</td>
                    <td className="p-4 text-gray-500">{new Date(fb.createdAt).toLocaleString("hi-IN")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No feedback available
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

/* ================= STAT CARD COMPONENT ================= */
function StatCard({ title, value, icon, gradient }) {
  return (
    <div className="relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>
      <div className="relative p-6 text-white flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold opacity-90">{title}</h2>
          {icon}
        </div>
        <p className="text-3xl font-extrabold tracking-wide">{value}</p>
      </div>
    </div>
  );
}