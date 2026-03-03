"use client";
import Link from "next/link";
import { 
  FileText, 
  Binary, 
  Map, 
  ExternalLink, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  FileSearch,
  Files
} from "lucide-react";

export default function CompactQuickLinks() {
  const tools = [
    { name: "शपथ पत्र", href: "/shapath-patra", icon: <FileText size={16} /> },
    { name: "1MB PDF टूल", href: "/pdf-toolkit", icon: <Binary size={16} /> },
    { name: "वंशावली मेकर", href: "/vanshavali", icon: <Map size={16} /> },
    { name: "परिमार्जन गाइड", href: "/parimarjan-help", icon: <ShieldCheck size={16} /> },
    { name: "सभी फॉर्म्स", href: "/forms", icon: <Files size={16} /> },
    { name: "PDF टूल्स", href: "/pdf", icon: <FileSearch size={16} /> },
  ];

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* COLUMN 1 & 2: QUICK TOOLS (Spans 2 columns on mobile for better tap targets) */}
          <div className="col-span-2 space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">मुख्य टूल्स (Quick Tools)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              {tools.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="flex items-center gap-2 py-1.5 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  <span className="text-slate-400">{link.icon}</span>
                  <span className="font-bold text-[13px]">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 3: OFFICIAL LINKS */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">सरकारी लिंक</h4>
            <div className="flex flex-col gap-2">
              <a href="https://biharbhumi.bihar.gov.in/" target="_blank" className="flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:text-indigo-600">
                <ExternalLink size={14} /> बिहार भूमि
              </a>
              <a href="#" className="flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:text-indigo-600">
                <HelpCircle size={14} /> हेल्प डेस्क
              </a>
            </div>
          </div>

          {/* COLUMN 4: BRAND/INFO */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">सपोर्ट</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              बिहार भूमि सर्वे सहायक <br /> 
              शुद्धिकरण और कागजात <br /> 
              तैयार करने का आसान मंच।
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}