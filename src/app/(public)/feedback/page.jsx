"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";

export default function Feedback() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("कृपया सभी फ़ील्ड भरें।");
      return;
    }

    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("धन्यवाद! आपका फीडबैक सेव कर दिया गया।");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        alert(data.message || "कुछ गलत हुआ।");
      }
    } catch (err) {
      console.error(err);
      alert("कुछ गलत हुआ।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Mail size={32} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-slate-800">सुझाव / Feedback</h1>
        </div>

        <p className="text-slate-600 mb-6">
          कृपया हमें अपनी राय दें। आपका फीडबैक हमारे लिए महत्वपूर्ण है।
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="पूरा नाम"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="email"
            placeholder="ईमेल"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            placeholder="आपका संदेश"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-emerald-600 text-white p-3 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition disabled:opacity-50"
          >
            <Send size={18} /> {loading ? "सेव किया जा रहा है..." : "भेजें / Send Feedback"}
          </button>

          {success && <p className="mt-4 text-green-600 font-semibold">{success}</p>}
        </form>
      </div>
    </div>
  );
}
