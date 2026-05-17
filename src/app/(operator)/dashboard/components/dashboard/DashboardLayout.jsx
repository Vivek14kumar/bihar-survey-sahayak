import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, FileText, Wallet, Settings, LogOut, IdCard,
  Bell, Search, IndianRupee, Menu, X, RefreshCcw, Target, PanelLeft 
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function DashboardLayout({ 
  children, currentView, setCurrentView, userData, walletBalance, 
  generatedDocsCount, searchQuery, setSearchQuery, notifications, setNotifications 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const notificationRef = useRef(null);
  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleReadSingleNotification = async (notifId, isAlreadyRead) => {
    if (isAlreadyRead) return;
    setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, isRead: true } : n));
    try {
      await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notifId }) });
    } catch (error) { console.error("Failed to mark notification as read"); }
  };

  const handleNavClick = (view) => {
    setCurrentView(view);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* MOBILE / TABLET SIDEBAR OVERLAY */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed lg:static top-0 left-0 h-full bg-[#0f172a] text-slate-300 transition-all duration-300 ease-in-out z-50 overflow-hidden shrink-0 shadow-xl lg:shadow-none
          ${isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72 lg:translate-x-0 lg:w-14"}
        `}
      >
        {/* ========================================= */}
        {/* 1. FULL SIDEBAR (Visible when Open) */}
        {/* ========================================= */}
        <div className={`w-72 h-full flex-col ${!isSidebarOpen && !isMobile ? 'hidden' : 'flex'}`}>
          <div className="pt-6 px-6 pb-4 border-b border-slate-700 flex justify-between items-start">
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 overflow-hidden shrink-0">
                <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white text-lg">Bihar Survey Sahayak</span>
                <span className="text-xs text-slate-200 font-medium">बिहार सर्वेक्षण</span>
              </div>
            </h1>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white p-1">
              <X size={24} />
            </button>
          </div>
          
          <p className="text-[12px] text-center uppercase tracking-widest text-blue-400 mt-4 px-6 font-bold truncate">
            {userData?.shopName || "Survey Sahayak"}
          </p>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2 custom-scrollbar">
            <SidebarItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active={currentView === "dashboard" || currentView.startsWith("form_")} onClick={() => handleNavClick("dashboard")} />
            <SidebarItem icon={<Wallet size={18}/>} label="Wallet & Credits" active={currentView === "wallet"} onClick={() => handleNavClick("wallet")} badge={`₹${walletBalance}`} />
            <SidebarItem icon={<FileText size={18}/>} label="Generated Docs" active={currentView === "documents"} onClick={() => handleNavClick("documents")} badge={generatedDocsCount.toString()} />
            {/* ✨ NEW: Conditionally rendered Amin Profile Link */}
              {userData?.userType === "amin" && (
                <SidebarItem 
                  icon={<IdCard size={18}/>} 
                  label="Digital Profile" 
                  active={currentView === "amin_profile"} 
                  onClick={() => setCurrentView("amin_profile")} 
                  badge="Setup"
                />
              )}
            <SidebarItem icon={<Settings size={18}/>} label="Account Settings" active={currentView === "settings"} onClick={() => handleNavClick("settings")} />
          </nav>
          
          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Balance</p>
              <h3 className="text-2xl font-black text-white flex items-center gap-1"><IndianRupee size={20} className="text-blue-500"/>{walletBalance}</h3>
              <button onClick={() => handleNavClick("wallet")} className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">+ Add Funds</button>
            </div>
          </div>

          <div className="p-4 border-t border-slate-700 pb-safe">
            <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center justify-center gap-3 w-full p-3 text-sm font-bold text-white bg-red-500 border border-red-500/20 rounded-xl hover:bg-red-600 transition-colors">
              <LogOut size={18} /> Secure Logout
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* 2. MINI SIDEBAR (Visible on PC when Closed) */}
        {/* ========================================= */}
        {!isSidebarOpen && !isMobile && (
          <div className="w-14 h-full flex flex-col items-center py-6 bg-[#0f172a] animate-in fade-in duration-300">
            
            {/* Top: Hamburger Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="p-3 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors" 
              title="Expand Menu"
            >
              <Menu size={24} />
            </button>

            {/* Middle: Core Nav Icons */}
            <nav className="flex flex-col gap-4 mt-8 w-full px-1">
              <MiniSidebarItem icon={<LayoutDashboard size={22}/>} label="Home" active={currentView === "dashboard" || currentView.startsWith("form_")} onClick={() => setCurrentView("dashboard")} />
              <MiniSidebarItem icon={<Wallet size={22}/>} label="Wallet" active={currentView === "wallet"} onClick={() => setCurrentView("wallet")} />
              <MiniSidebarItem icon={<FileText size={22}/>} label="Docs" active={currentView === "documents"} onClick={() => setCurrentView("documents")} />
              <MiniSidebarItem icon={<IdCard size={22}/>} label="Digital Profile" active={currentView === "amin_profile"} onClick={() => setCurrentView("amin_profile")} />
              <MiniSidebarItem icon={<Settings size={22}/>} label="Settings" active={currentView === "settings"} onClick={() => setCurrentView("settings")} />
            </nav>

            <div className="flex-1"></div> {/* Spacer pushes Logout to bottom */}

            {/* Bottom: Logout Icon */}
            <div className="w-full px-1 pb-safe">
              <button 
                onClick={() => signOut({ callbackUrl: '/login' })} 
                className="w-full flex justify-center p-3 text-red-400 hover:text-red-500 hover:bg-red-500/30 rounded-xl transition-colors" 
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            </div>

          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-6 z-10 shrink-0 shadow-sm">
          
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            
            {/* Hide Header toggle when Mini Sidebar is showing */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className={`p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0 hidden ${isSidebarOpen ? 'lg:block' : ''}`}
            >
              <PanelLeft size={24} />
            </button>

            {/* BRANDING: Always visible on mobile/tablet, OR on PC when sidebar is closed */}
            {(!isSidebarOpen || isMobile) && (
              <div className="flex items-center gap-1.5 md:gap-2 mr-1 shrink-0 animate-in fade-in zoom-in duration-300">
                <div className="w-6 h-6 md:w-8 md:h-8 overflow-hidden shrink-0">
                  <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-slate-800 font-black text-xs sm:text-[15px] xl:text-lg leading-tight hidden sm:block">
                  Bihar Survey Sahayak
                </span>
              </div>
            )}
            
            <div className="relative flex-1   max-w-[160px] md:max-w-[250px] lg:max-w-sm ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" placeholder="Search forms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-9 pr-8 py-1.5 md:py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>
              )}
            </div>
            
            {/*<div className="sm:hidden p-2 text-slate-400 ml-auto">
              <Search size={20} />
            </div>*/}
          </div>
          
          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4 shrink-0">
            
            <div className="relative" ref={notificationRef}>
              <button onClick={handleNotificationClick} className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
              </button>

              {showNotifications && (
                <div className="
                  fixed top-16 left-1/2 -translate-x-1/2 mt-2 
                  sm:absolute sm:top-full sm:left-auto sm:right-0 sm:translate-x-0 sm:mt-2 
                  w-[calc(100vw-2rem)] max-w-[320px] 
                  bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] 
                  border border-slate-100 z-50 p-4 
                  animate-in fade-in slide-in-from-top-2
                ">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Notifications</h4>
                    {unreadCount > 0 && <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                  </div>
                  <div className="space-y-2 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                    {notifications?.length === 0 || !notifications ? (
                      <p className="text-xs text-slate-400 text-center py-4 italic">No recent notifications</p>
                    ) : (
                      notifications.map((notif) => {
                        const isRefund = notif.title.toLowerCase().includes("refund");
                        const isTarget = notif.title.toLowerCase().includes("target");
                        return (
                          <div key={notif._id} className={`flex gap-3 items-start p-2 rounded-xl transition-colors cursor-pointer ${notif.isRead ? 'hover:bg-slate-50' : 'bg-blue-50/50'}`} onClick={() => handleReadSingleNotification(notif._id, notif.isRead)}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isRefund ? 'bg-amber-100 text-amber-600' : isTarget ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                              {isRefund ? <RefreshCcw size={14} /> : isTarget ? <Target size={14} /> : <Bell size={14} />}
                            </div>
                            <div>
                              <p className={`text-sm ${notif.isRead ? 'font-semibold text-slate-700' : 'font-black text-slate-900'}`}>{notif.title}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{notif.message}</p>
                              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{new Date(notif.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 sm:bg-slate-50 px-2.5 sm:px-3 py-1.5 rounded-full border border-blue-100 sm:border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors shrink-0" onClick={() => setCurrentView("wallet")}>
              <Wallet size={16} className="text-blue-600"/>
              <span className="text-xs sm:text-sm font-bold text-slate-700">₹{walletBalance}</span>
            </div>

            {/*<button onClick={() => signOut({ callbackUrl: "/login" })} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0" title="Logout">
              <LogOut size={20} />
            </button>*/}

            <div className="flex items-center gap-3 border-l border-slate-200 pl-2 sm:pl-4 cursor-pointer shrink-0" onClick={() => setCurrentView("settings")}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">{userData?.ownerName}</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">ID: {userData?.userId}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold uppercase shadow-sm">
                {userData?.ownerName?.substring(0, 2) || "BS"}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative scroll-smooth bg-slate-50 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* MOBILE / TABLET BOTTOM NAV */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around z-40 lg:hidden pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)] px-1 sm:px-4">
          <MobileNavBtn icon={<LayoutDashboard size={20} />} label="Home" active={currentView === "dashboard" || currentView.startsWith("form_")} onClick={() => setCurrentView("dashboard")} />
          <MobileNavBtn icon={<Wallet size={20} />} label="Wallet" active={currentView === "wallet"} onClick={() => setCurrentView("wallet")} badge={walletBalance} />
          
          {/* ✨ NEW: Conditionally rendered Amin Profile Tab for Mobile */}
          {userData?.userType === "amin" && (
            <MobileNavBtn 
              icon={<IdCard size={20} />} 
              label="Profile" 
              active={currentView === "amin_profile"} 
              onClick={() => setCurrentView("amin_profile")} 
            />
          )}

          <div className="flex flex-col items-center justify-center pt-1 pb-2 shrink-0 px-2 cursor-pointer hover:scale-105 transition-transform" onClick={() => setCurrentView("dashboard")} title="Bihar Survey Sahayak">
            <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center mb-0.5 shadow-sm border border-slate-200">
               <img src="/images/logo.png" alt="Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-[9px] font-black text-slate-800 leading-tight uppercase tracking-wider">Bihar Survey</span>
          </div>

          <MobileNavBtn icon={<FileText size={20} />} label="Docs" active={currentView === "documents"} onClick={() => setCurrentView("documents")} notif={generatedDocsCount > 0 ? generatedDocsCount : null} />
          <MobileNavBtn icon={<Settings size={20} />} label="Settings" active={currentView === "settings"} onClick={() => setCurrentView("settings")} />
          <MobileNavBtn icon={<LogOut size={20} />} label="LogOut"  onClick={() => signOut({ callbackUrl: "/login" })} isDanger={true} />
          
        </nav>
      </main>
    </div>
  );
}

// Sub-components
function SidebarItem({ icon, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
      <div className="flex items-center gap-3">{icon}<span className="text-sm font-semibold whitespace-nowrap">{label}</span></div>
      {badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${active ? 'bg-white/20' : 'bg-slate-800 text-emerald-400'}`}>{badge}</span>}
    </button>
  );
}

// NEW COMPONENT: Perfect square icons for the Mini Sidebar
function MiniSidebarItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick} 
      // Changed to w-11 h-11 and mx-auto for a perfectly centered, premium square
      className={`flex items-center justify-center w-11 h-11 mx-auto rounded-xl transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
      title={label}
    >
      {icon}
    </button>
  );
}

// Add 'isDanger' to the props list
function MobileNavBtn({ icon, label, active, onClick, badge, notif, isDanger }) {
  return (
    <button 
      onClick={onClick} 
      // Update the class logic to check for isDanger first
      className={`flex flex-col items-center justify-center w-full py-2.5 sm:py-3 transition-colors relative 
        ${isDanger 
          ? "text-red-500 hover:text-red-600" 
          : active 
            ? "text-blue-600" 
            : "text-slate-400 hover:text-slate-600"
        }`}
    >
      <div className="relative mb-1">
        {icon}
        {badge !== undefined && <span className="absolute -top-1.5 -right-4 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-1.5 rounded-full shadow-sm">₹{badge}</span>}
        {notif && <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white shadow-sm">{notif > 99 ? '99+' : notif}</span>}
      </div>
      <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{label}</span>
      {/* Optional: make the active dot red too if a danger button is somehow active */}
      {active && <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isDanger ? 'bg-red-500' : 'bg-blue-600'}`} />}
    </button>
  );
}