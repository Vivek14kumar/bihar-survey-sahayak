"use client";
import Link from "next/link";
import { 
  FileText, 
  Map, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck,
  Files,
  Users,
  BookOpen,
  LayoutGrid
} from "lucide-react";

export default function CompactQuickLinks() {
  const tools = [
    { name: "शपथ पत्र", href: "/shapath-patra", icon: <FileText size={18} className="text-purple-600" /> },
    { name: "बंटवारा पत्र", href: "/batwara-application-bihar", icon: <Users size={18} className="text-orange-600" /> },
    { name: "वंशावली मेकर", href: "/vanshavali", icon: <Map size={18} className="text-emerald-600" /> },
    { name: "परिमार्जन गाइड", href: "/parimarjan-help", icon: <ShieldCheck size={18} className="text-cyan-600" /> },
    { name: "ब्लॉग / खबरें", href: "/blog", icon: <BookOpen size={18} className="text-blue-600" /> },
    { name: "सभी फॉर्म्स", href: "/forms", icon: <Files size={18} className="text-indigo-600" /> },
  ];

  return (
    <footer className="w-full bg-white border-t border-slate-200 pt-10 pb-6 px-4 py-4 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* COLUMN 1 & 2: QUICK TOOLS - Optimized for Mobile Taps */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid size={16} className="text-slate-400" />
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">
                मुख्य टूल्स (Quick Tools)
              </h4>
            </div>
            
            {/* 2-Column Grid on Mobile, 2-Column on Desktop */}
            <div className="grid grid-cols-2 gap-3">
              {tools.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                >
                  <span className="shrink-0 transition-transform group-hover:scale-110">
                    {link.icon}
                  </span>
                  <span className="font-bold text-[14px] text-slate-700 group-hover:text-indigo-700">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 3: OFFICIAL LINKS */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
              सरकारी लिंक
            </h4>
            <div className="flex flex-col gap-3">
              <a 
                href="https://biharbhumi.bihar.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[14px] font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ExternalLink size={16} className="text-slate-400" /> 
                बिहार भूमि पोर्टल
              </a>
              <a 
                href="#" 
                className="flex items-center gap-2 text-[14px] font-bold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <HelpCircle size={16} className="text-slate-400" /> 
                हेल्प डेस्क / संपर्क
              </a>
            </div>
          </div>

          {/* COLUMN 4: BRAND/INFO */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">सपोर्ट</h4>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <p className="text-[13px] text-indigo-900 font-medium leading-relaxed">
                <span className="font-bold block mb-1">बिहार सर्वे सहायक</span>
                शुद्धिकरण और कागजात तैयार करने का सबसे आसान और डिजिटल मंच।
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}