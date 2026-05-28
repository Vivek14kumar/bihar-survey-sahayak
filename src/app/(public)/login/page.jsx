"use client";

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, User, Lock, ShieldCheck, TrendingUp, Printer, AlertCircle } from 'lucide-react';
import Image from "next/image";

export default function Login() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(''); // Replaces 'email'
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      identifier: identifier, 
      password: password,
    });

    if (result?.error) {
      setError("Invalid credentials. Please check your details and try again.");
      setLoading(false);
    } else {
      // 1. Await the new session to guarantee the cookie is set
      const session = await getSession();
      
      // 2. Check the role and force a hard redirect
      if (session?.user?.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    }
  };

  return (
    <div className=" relative min-h-screen  flex items-center justify-center p-4">
     {/* Background Image - Restored & Responsive */}
           <div className="absolute inset-0 -z-30 ">
             
             {/* Desktop Image (Hidden on mobile, block on md screens and up) */}
             <Image
               src="/images/bg-survey1.webp"
               alt="Bihar Survey Background Desktop"
               fill
               priority
               sizes="100vw"
               className="hidden md:block object-cover object-center"
             />
     
             {/* Mobile Image 9:16 (Block on mobile, hidden on md screens and up) */}
             <Image
               src="/images/bg-survey1-mobile.webp" 
               alt="Bihar Survey Background Mobile"
               fill
               priority
               sizes="100vw"
               className="block md:hidden object-cover object-center"
             />
     
             {/* Very subtle dark overlay to help the glass panel pop */}
             <div className="absolute inset-0 bg-black/20" />
           </div>
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-white">
        
        {/* Left Side: Branding & Trust */}
        <div className="md:w-80 bg-slate-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-10 -right-10 opacity-10"><ShieldCheck size={160} /></div>
          
          <div className="relative z-10">
            <h1 className="text-xl font-bold tracking-tight mb-8">Bihar Survey Sahayak</h1>
            <div className="space-y-6">
              <div className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600/50">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Welcome Back</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Access your secure workspace to generate documents in easy & faster. To increase your Income
                </p>
              </div>
              
              <div className="space-y-4 mt-6">
                <FeatureItem icon={<Printer size={16}/>} title="Quick Print Access" desc="Fast your work and Get more Customers." />
                <FeatureItem icon={<TrendingUp size={16}/>} title="Increase Earnings +" desc="Increase your daily Income." />
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-700 mt-8">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Lock size={10} /> Secure Operator Portal
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <header className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Authorization</h2>
            <p className="text-slate-500 text-sm mt-1">Enter your credentials to access the dashboard.</p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start gap-3 rounded-r-lg">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">
                Email, Mobile, or User ID
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 font-medium text-slate-800" 
                  placeholder="Ex: BSS-OP-123456" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Secure Password
                </label>
                <Link href="/forgot-password" className="text-[10px] font-bold text-blue-600 hover:underline uppercase">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-10 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-800" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] mt-6 text-xs uppercase tracking-[0.2em] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                'Secure Login'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 text-sm font-medium">
              New to Bihar Survey Sahayak?{' '}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Create an Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="bg-slate-900/50 p-2 rounded-lg text-blue-400 shrink-0 border border-slate-600/30">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-100 tracking-tight">{title}</p>
        <p className="text-[11px] text-slate-400 leading-snug">{desc}</p>
      </div>
    </div>
  );
}