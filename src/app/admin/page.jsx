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
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totals: {},
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

  useEffect(() => {
    fetch("/api/get-analytics")
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch("/api/feedback")
      .then((res) => res.json())
      .then((data) => setFeedbacks(data));
  }, []);

  /* ================= Conversion Rate ================= */

  const totalCreated =
    (stats.totals?.vanshawaliCreated || 0) +
    (stats.totals?.prapatra2Printed || 0);

  const totalPaid =
    (stats.totals?.vanshawaliPaid || 0) +
    (stats.totals?.prapatra2Paid || 0);

  const conversionRate =
    totalCreated > 0
      ? ((totalPaid / totalCreated) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 md:p-10">
      
      {/* ================= HEADER ================= */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Admin Revenue & Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor revenue, PDF activity & user feedback
        </p>
      </div>

      {/* ================= TOP STATS ================= */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">

        <StatCard
          title="Vanshawali Created"
          value={stats.totals?.vanshawaliCreated || 0}
          icon={<FileText size={28} />}
          gradient="from-purple-500 to-purple-700"
        />

        <StatCard
          title="Prapatra-2 Printed"
          value={stats.totals?.prapatra2Printed || 0}
          icon={<Printer size={28} />}
          gradient="from-orange-500 to-red-600"
        />

        <StatCard
          title="Vanshawali Paid"
          value={stats.totals?.vanshawaliPaid || 0}
          icon={<Download size={28} />}
          gradient="from-green-500 to-green-700"
        />

        <StatCard
          title="Prapatra-2 Paid"
          value={stats.totals?.prapatra2Paid || 0}
          icon={<Download size={28} />}
          gradient="from-blue-500 to-blue-700"
        />

        <StatCard
          title="Total Revenue (₹)"
          value={stats.totals?.totalRevenue || 0}
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
                    <td className="p-4 font-semibold text-gray-700">
                      {pdf.name}
                    </td>
                    <td className="p-4 text-yellow-600 font-bold">
                      {pdf.preview || 0}
                    </td>
                    <td className="p-4 text-red-600 font-bold">
                      {pdf.download || 0}
                    </td>
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
                    <td className="p-4 font-semibold text-gray-700">
                      {fb.name}
                    </td>
                    <td className="p-4 text-gray-600">{fb.email}</td>
                    <td className="p-4 text-gray-700">{fb.message}</td>
                    <td className="p-4 text-gray-500">
                      {new Date(fb.createdAt).toLocaleString("hi-IN")}
                    </td>
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