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
  FileSpreadsheet, // Replaced Form for better semantics
  User,
  Mail,
  Binary,
  LifeBuoy,
  Stamp // Icon for Shapath Patra
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Define all routes for central management
  const navLinks = [
    { name: "होम", href: "/", icon: <Home size={18} /> },
    { name: "शपथ पत्र", href: "/shapath-patra", icon: <Stamp size={18} /> },
    { name: "PDF टूलकिट", href: "/pdf-toolkit", icon: <Binary size={18} /> },
    { name: "प्रपत्र भरे (Forms)", href: "/forms", icon: <FileSpreadsheet size={18} /> },
    { name: "परिमार्जन हेल्प", href: "/parimarjan-help", icon: <LifeBuoy size={18} /> },
    { name: "PDF डाउनलोड", href: "/pdf", icon: <FileText size={18} /> },
  ];

  const secondaryLinks = [
    { name: "About", href: "/about", icon: <User size={18} /> },
    { name: "Contact", href: "/contact", icon: <Mail size={18} /> },
    { name: "Privacy", href: "/privacy-policy", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header className="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Logo" width={45} height={45} priority />
            <div>
              <p className="font-black text-lg text-slate-900 leading-none">Bihar Survey Sahayak</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-1">बिहार सर्वेक्षण सहायक</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="flex items-center gap-6 text-sm font-bold text-slate-600">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`transition-colors hover:text-indigo-600 ${pathname === link.href ? 'text-indigo-600' : ''}`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>
            
            <Link 
              href="/#tool" 
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition shadow-lg shadow-slate-200 active:scale-95"
            >
              वंशावली बनाएं
            </Link>
          </nav>
        </div>
      </header>

      {/* ================= MOBILE TOP HEADER ================= */}
      <header className="md:hidden sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm print:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={35} height={35} priority />
            <div>
              <p className="font-black text-slate-900 leading-none">Bihar Survey Sahayak</p>
              <p className="text-[8px] font-bold text-indigo-600 uppercase tracking-widest mt-1">बिहार सर्वेक्षण सहायक</p>
            </div>
            
          </Link>
          
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-slate-700 p-2 bg-slate-100 rounded-xl active:scale-90 transition-transform"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Full Menu Overlay */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 p-2">
              {[...navLinks, ...secondaryLinks].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  onClick={() => setMenuOpen(false)} 
                  className={`flex items-center gap-4 px-4 py-4 rounded-xl font-bold text-slate-700 ${pathname === item.href ? 'bg-indigo-50 text-indigo-600' : ''}`}
                >
                  <span className={pathname === item.href ? 'text-indigo-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 md:hidden print:hidden">
        <div className="flex justify-around items-center py-3">
          <Link href="/" className={`flex flex-col items-center gap-1 ${pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Home size={20} />
            <span className="text-[10px] font-black uppercase">Home</span>
          </Link>
          
          <Link href="/pdf-toolkit" className={`flex flex-col items-center gap-1 ${pathname === '/pdf-toolkit' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Binary size={20} />
            <span className="text-[10px] font-black uppercase">PDF टूल</span>
          </Link>

          <Link href="/#tool" className="flex flex-col items-center -mt-8">
            <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-xl shadow-indigo-200 ring-4 ring-white">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-black text-indigo-600 mt-2 uppercase">वंशावली</span>
          </Link>

          <Link href="/forms" className={`flex flex-col items-center gap-1 ${pathname === '/forms' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <FileSpreadsheet size={20} />
            <span className="text-[10px] font-black uppercase">प्रपत्र</span>
          </Link>

          <Link href="/shapath-patra" className={`flex flex-col items-center gap-1 ${pathname === '/shapath-patra' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <Stamp size={20} />
            <span className="text-[10px] font-black uppercase">शपथ पत्र</span>
          </Link>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="md:hidden h-20 print:hidden"></div>
    </>
  );
}