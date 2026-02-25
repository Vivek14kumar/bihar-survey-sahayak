"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsChart({ data }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl mb-10">
      <h2 className="text-xl font-bold mb-4">Last 7 Days Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="pageViews" />
          <Line type="monotone" dataKey="totalRevenue" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}