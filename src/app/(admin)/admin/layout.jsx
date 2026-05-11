// src/app/(admin)/admin/layout.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// 1. Ensure 'export default' is present
export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // 2. Security Check: Only allow 'admin' role
  if (!session || session.user.role !== "admin") {
    redirect("/login"); 
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block hover:text-blue-400">Dashboard</a>
          <a href="/admin/users" className="block hover:text-blue-400">Operators</a>
          <a href="/admin/ledger" className="block hover:text-blue-400">Ledger</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}