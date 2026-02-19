"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  ShieldCheck,
  FileWarning,
  Users,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const mobileNavItems = [
    { name: "होम", href: "/", icon: <Home size={20} /> },
    { name: "वंशावली", href: "/#tool", icon: <Users size={20} /> },
    { name: "Prapatra", href: "/pdf", icon: <FileText size={20} /> },
    { name: "Privacy", href: "/privacy-policy", icon: <ShieldCheck size={20} /> },
    { name: "Terms", href: "/terms-and-conditions", icon: <FileWarning size={20} /> },
  ];

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header className="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200 shadow-sm">
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
              <p className="font-bold text-lg text-slate-800">Bihar Survey Sahayak</p>
              <p className="text-xs italic text-slate-500 tracking-wide">बिहार सर्वेक्षण सहायक</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-indigo-600 transition">होम / Home</Link>
            <Link href="/pdf" className="hover:text-indigo-600 transition">Prapatra (Format) and Forms</Link>
            <Link href="/privacy-policy" className="hover:text-indigo-600 transition">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-indigo-600 transition">Terms</Link>
            <Link href="/disclaimer" className="hover:text-indigo-600 transition">Disclaimer</Link>
            <Link
              href="/#tool"
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              वंशावली बनाएं
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= MOBILE TOP HEADER ================= */}
      <header className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Bihar Survey Sahayak Logo"
              width={35}
              height={35}
              priority
            />
            <div>
              <p className="font-semibold text-sm">Bihar Survey Sahayak</p>
              <p className="text-[10px] text-slate-500">बिहार सर्वेक्षण सहायक</p>
            </div>
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-slate-700 p-2 rounded-md hover:bg-slate-200 transition"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="bg-white shadow-md border-t border-slate-200">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href || pathname === item.href.split("#")[0];
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 transition ${
                    isActive ? "text-indigo-600 font-semibold" : "text-slate-700"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-inner z-50 md:hidden">
        <div className="flex justify-around items-center py-2">
          {/* Show only main actions */}
          <Link
            href="/#tool"
            className="flex flex-col items-center text-xs px-2 py-1 text-indigo-600"
          >
            <Users size={20} />
            <span className="mt-1">वंशावली</span>
          </Link>
          <Link
            href="/pdf"
            className="flex flex-col items-center text-xs px-2 py-1 text-slate-600"
          >
            <FileText size={20} />
            <span className="mt-1">Prapatra</span>
          </Link>
        </div>
      </nav>

      {/* Add bottom padding so content isn't hidden behind nav */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
