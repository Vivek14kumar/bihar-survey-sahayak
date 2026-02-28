"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Home,
  FileText,
  ShieldCheck,
  FileWarning,
  Users,
  Menu,
  X,
  Form,
  User,
  Mail
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [bottomFormOpen, setBottomFormOpen] = useState(false);
  
  const bottomDropdownRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFormOpen(false);
      }
      if (bottomDropdownRef.current && !bottomDropdownRef.current.contains(event.target)) {
        setBottomFormOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mobileNavItems = [
    { name: "होम", href: "/", icon: <Home size={20} /> },
    { name: "वंशावली", href: "/#tool", icon: <Users size={20} /> },
    { name: "Prapatra Pdf", href: "/pdf", icon: <FileText size={20} /> },
    { name: "Prapatra-2 भरे", href: "/prapatra-2", icon: <Form size={20} /> },
    { name: "शपथ पत्र/Shapath Patra", href: "/shapath-patra", icon: <FileText size={20} /> },
    { name: "About", href: "/about", icon: <User  size={20} /> },
    { name: "Privacy", href: "/privacy-policy", icon: <ShieldCheck size={20} /> },
    { name: "Terms", href: "/terms-and-conditions", icon: <FileWarning size={20} /> },
    { name: "Contact", href: "/contact", icon: <Mail size={20} /> },
  ];

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      {/* Added print:hidden here */}
      <header className="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Logo" width={45} height={45} priority />
            <div>
              <p className="font-bold text-lg text-slate-800">Bihar Survey Sahayak</p>
              <p className="text-xs italic text-slate-500 tracking-wide">बिहार सर्वेक्षण सहायक</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="flex items-center gap-8 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-indigo-600 transition">होम / Home</Link>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setFormOpen(!formOpen)} className="hover:text-indigo-600 transition flex items-center gap-1">
                प्रपत्र भरे /Form
              </button>
              {formOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-xl border border-slate-200 py-2 z-50">
                  <Link href="/prapatra-2" onClick={() => setFormOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-100">Prapatra-2 भरे</Link>
                  <Link href="/shapath-patra" onClick={() => setFormOpen(false)} className="block px-4 py-2 text-sm hover:bg-slate-100">शपथ पत्र/Shapath Patra</Link>
                </div>
              )}
            </div>
            <Link href="/pdf" className="hover:text-indigo-600 transition">Prapatra pdf</Link>
            <Link href="/about" className="hover:text-indigo-600 transition">About</Link>
            <Link href="/contact" className="hover:text-indigo-600 transition">Contact</Link>
            <Link href="/#tool" className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md">वंशावली बनाएं</Link>
          </nav>
        </div>
      </header>

      {/* ================= MOBILE TOP HEADER ================= */}
      {/* Added print:hidden here */}
      <header className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={35} height={35} priority />
            <div>
              <p className="font-semibold text-sm">Bihar Survey Sahayak</p>
              <p className="text-[10px] text-slate-500">बिहार सर्वेक्षण सहायक</p>
            </div>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-slate-700 p-2 hover:bg-slate-200 rounded-md">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="bg-white shadow-md border-t border-slate-200">
            {mobileNavItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      {/* Added print:hidden here */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-inner z-50 md:hidden print:hidden">
        <div className="flex justify-around items-center py-2">
          <Link href="/#tool" className="flex flex-col items-center text-xs px-2 py-1 text-indigo-600">
            <Users size={20} />
            <span className="mt-1">वंशावली</span>
          </Link>
          <div className="relative flex flex-col items-center text-xs px-2 py-1" ref={bottomDropdownRef}>
            <button onClick={() => setBottomFormOpen(!bottomFormOpen)} className="flex flex-col items-center text-slate-600">
              <Form size={20} />
              <span className="mt-1">प्रपत्र भरे</span>
            </button>
            {bottomFormOpen && (
              <div className="absolute bottom-14 bg-white shadow-xl rounded-xl w-44 border border-slate-200 py-2">
                <Link href="/prapatra-2" onClick={() => setBottomFormOpen(false)} className="block px-4 py-2 text-sm">Prapatra-2 भरे</Link>
                <Link href="/shapath-patra" onClick={() => setBottomFormOpen(false)} className="block px-4 py-2 text-sm">शपथ पत्र</Link>
              </div>
            )}
          </div>
          <Link href="/pdf" className="flex flex-col items-center text-xs px-2 py-1 text-slate-600">
            <FileText size={20} />
            <span className="mt-1">Prapatra</span>
          </Link>
        </div>
      </nav>

      {/* Spacer for bottom nav - Also hide in print to avoid empty space */}
      <div className="md:hidden h-16 print:hidden"></div>
    </>
  );
}