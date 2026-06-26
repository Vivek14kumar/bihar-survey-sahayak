"use client";

import Link from "next/link";
import React, { useState } from "react";
import { BellRing, ArrowRight, X } from "lucide-react";

export default function FloatingViralUpdateCard() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-3 left-3 right-3 z-50 md:left-auto md:right-4 md:w-auto">

      <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-red-200 bg-white/95 px-3 py-2.5 shadow-[0_8px_30px_rgba(255,0,0,0.15)] backdrop-blur-xl">

        {/* Glow */}
        <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-red-500/10 blur-2xl" />

        {/* Left Color Bar */}
        <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-red-600 via-pink-500 to-orange-400" />

        {/* Icon */}
        <div className="relative ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-md">
          <BellRing size={17} />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-yellow-400 ring-2 ring-white" />
        </div>

        {/* Text Important Notice*/}
        <div className="min-w-0 flex-1">

          <div className="mb-0.5 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-red-700">
            New Service
          </div>

          <h4 className="truncate text-[12px] font-black text-gray-900 md:text-[13px]">
            फोटो वाली वंशावली बनाएं{/*मंत्री जी का जिलेवार समीक्षा कार्यक्रम*/}
          </h4>

          <p className="truncate text-[10px] text-gray-500 md:text-[11px]">
            फोटो सहित वंशावली बनाएं{/*आज किन जिलों में समीक्षा होगी देखें*/}
          </p>
        </div>

        {/* Button */}
        <Link
          href="/vanshavali-photo"
          className="flex shrink-0 items-center gap-1 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-3 py-2 text-[10px] font-bold text-white shadow-md transition hover:scale-[1.03]"
        >
          View
          <ArrowRight size={12} />
        </Link>

        {/* Close */}
        <button
          onClick={() => setShow(false)}
          className="shrink-0 rounded-full p-1 text-gray-900 bg-red-100 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}