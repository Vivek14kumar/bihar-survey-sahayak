import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link"; // Use Next.js Link for faster routing

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  // Security Check: Only allow 'admin' role
  if (!session || session.user.role !== "admin") {
    redirect("/login"); 
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Admin Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white p-6 shrink-0">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:text-blue-400 transition-colors">Dashboard</Link>
          <Link href="/admin/users" className="block hover:text-blue-400 transition-colors">Operators</Link>
          <Link href="/admin/ledger" className="block hover:text-blue-400 transition-colors">Ledger</Link>
          
          {/* NEW: Link to Amin Verifications */}
          <Link href="/admin/amin-verification" className="block text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Amin Verifications
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}