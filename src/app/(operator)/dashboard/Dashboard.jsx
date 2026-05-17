"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Layout & Views
import DashboardLayout from "./components/dashboard/DashboardLayout";
import HomeView from "./components/views/HomeView";
import WalletView from "./components/views/WalletView";
import LedgerView from "./components/views/LedgerView";
import SettingsView from "./components/views/SettingsView";
import FormWrapperView from "./components/views/FormWrapperView";
import AminProfileForm from "./components/profile/AminProfile";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // --- GLOBAL STATES ---
  const [userData, setUserData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [generatedDocs, setGeneratedDocs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // --- UI STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Initial Global Data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fetchAllData = async () => {
      if (status === "authenticated") {
        try {
          const profileRes = await fetch("/api/user/profile");
          if (profileRes.ok) {
            const data = await profileRes.json();
            setUserData(data);
            setWalletBalance(data.walletBalance || 0);
          }

          const txRes = await fetch("/api/wallet/transactions");
          if (txRes.ok) setTransactions(await txRes.json());

          const docsRes = await fetch("/api/documents");
          if (docsRes.ok) setGeneratedDocs(await docsRes.json());

          const notifRes = await fetch("/api/notifications", { cache: "no-store" });
          if (notifRes.ok) setNotifications(await notifRes.json());

        } catch (error) {
          console.error("Failed to fetch dashboard data", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAllData();
  }, [status, router]);

  // Global Handlers
  const handleUpdateWallet = (newBalance, newTransaction) => {
    if (newBalance !== undefined) setWalletBalance(newBalance);
    if (newTransaction) setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDocumentGenerated = (newBalance, newTransaction, newDoc) => {
    if (newBalance !== undefined) setWalletBalance(newBalance);
    if (newTransaction) setTransactions(prev => [
      newTransaction, 
      ...(Array.isArray(prev) ? prev : []) // <-- Safely falls back to empty array
    ]);
    if (newDoc) setGeneratedDocs(prev => [newDoc, ...prev]);
  };

  if (isLoading || status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      currentView={currentView} 
      setCurrentView={setCurrentView}
      userData={userData}
      walletBalance={walletBalance}
      generatedDocsCount={generatedDocs.length}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      notifications={notifications}
      setNotifications={setNotifications}
    >
      {currentView === "dashboard" && (
        <HomeView 
          searchQuery={searchQuery} 
          setCurrentView={setCurrentView} 
          onRewardClaimed={handleUpdateWallet}
        />
      )}

      {currentView.startsWith("form_") && (
        <FormWrapperView 
          currentView={currentView}
          setCurrentView={setCurrentView}
          walletBalance={walletBalance}
          onSuccess={handleDocumentGenerated}
        />
      )}

      {currentView === "documents" && (
        <LedgerView 
          generatedDocs={generatedDocs} 
          setGeneratedDocs={setGeneratedDocs} 
        />
      )}

      {currentView === "wallet" && (
        <WalletView 
          walletBalance={walletBalance} 
          transactions={transactions} 
          onUpdateWallet={handleUpdateWallet} 
        />
      )}

      {currentView === "amin_profile" && userData?.userType === "amin" && (
        <AminProfileForm existingData={userData} />
      )}

      {currentView === "settings" && (
        <SettingsView 
          userData={userData} 
          setUserData={setUserData} 
        />
      )}
    </DashboardLayout>
  );
}