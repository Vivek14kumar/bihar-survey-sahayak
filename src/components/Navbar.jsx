"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Trees } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          
          <Image
            src="/images/logo.png"
            alt="Bihar Survey Sahayak Logo"
            width={45}
            height={45}
            priority
          />
        
          <div>
            <p className="font-bold text-lg text-slate-800">
              Bihar Survey Sahayak
            </p>
            <p className="text-xs italic text-slate-500 tracking-wide">
              बिहार सर्वेक्षण सहायक
            </p>
          </div>
          
        </Link>


        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-indigo-600 transition">
            होम / Home
          </Link>
          
          <Link href="/paper-format" className="hover:text-indigo-600 transition">
            Prapatra (Format) and Forms
          </Link>

          <Link href="/privacy-policy" className="hover:text-indigo-600 transition">
            Privacy
          </Link>

          <Link href="/terms-and-conditions" className="hover:text-indigo-600 transition">
            Terms
          </Link>

          <Link href="/disclaimer" className="hover:text-indigo-600 transition">
            Disclaimer
          </Link>

          <Link
            href="/#tool"
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            वंशावली बनाएं
          </Link>
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-slate-700"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-6 space-y-4 text-slate-700 font-medium shadow-lg">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block"
          >
            होम
          </Link>

          <Link
            href="/privacy"
            onClick={() => setOpen(false)}
            className="block"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            onClick={() => setOpen(false)}
            className="block"
          >
            Terms & Conditions
          </Link>

          <Link
            href="/disclaimer"
            onClick={() => setOpen(false)}
            className="block"
          >
            Disclaimer
          </Link>

          <Link
            href="/#tool"
            onClick={() => setOpen(false)}
            className="block bg-indigo-600 text-white text-center py-3 rounded-xl shadow-md"
          >
            वंशावली बनाएं
          </Link>
        </div>
      )}
    </header>
  );
}
