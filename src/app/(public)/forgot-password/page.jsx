"use client";

import { useState } from 'react';
import Link from 'next/link';
import { User, ShieldCheck, KeyRound, LifeBuoy, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to process your request. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Unable to connect to the server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-white">
        
        {/* Left Side: Branding & Trust */}
        <div className="md:w-80 bg-slate-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10">
            <KeyRound size={160} />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-xl font-bold tracking-tight mb-8">Bihar Survey Sahayak</h1>
            <div className="space-y-6">
              <div className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600/50">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Account Recovery</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Don't worry, it happens. Regain access to your secure workspace to continue your work without interruption.
                </p>
              </div>
              
              <div className="space-y-4 mt-6">
                <FeatureItem icon={<ShieldCheck size={16}/>} title="Secure Process" desc="Your account safety is our priority." />
                {/*<FeatureItem icon={<LifeBuoy size={16}/>} title="24/7 Support" desc="Need help? Contact our support team." />*/}
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-700 mt-8">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <KeyRound size={10} /> Secure Recovery Portal
            </p>
          </div>
        </div>

        {/* Right Side: Recovery Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          
          {!success ? (
            <>
              <header className="mb-8">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Reset Password</h2>
                <p className="text-slate-500 text-sm mt-1">Enter your registered details to receive reset instructions.</p>
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
                      placeholder="Ex: BSS-USER-656436 or Email" 
                    />
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
                      Processing...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            
            /* UPDATED SUCCESS STATE */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
                Link Sent!
              </h3>
              
              <div className="max-w-sm mx-auto mt-4">
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  A password reset link has been sent to <span className="font-bold text-slate-800">{maskEmail(identifier)}</span>.
                </p>

                {/* Highlighted Spam Warning */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-left shadow-sm">
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                    Please check your <span className="font-bold uppercase tracking-wider">Spam or Junk</span> folder if you do not see it in your inbox within 2 minutes.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <Link href="/login" className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-blue-600 transition-colors">
              <ArrowLeft size={16} />
              Back to Secure Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper components and functions
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

// Function to dynamically mask the email or format the mobile/userId
function maskEmail(input) {
  if (!input) return "your registered address";
  
  // If it's an email address
  if (input.includes('@')) {
    const [name, domain] = input.split('@');
    if (name.length <= 2) return `${name[0]}***@${domain}`;
    return `${name.substring(0, 2)}***${name.substring(name.length - 2)}@${domain}`;
  }
  
  // If it's a mobile number or User ID, just say "your registered email"
  return "your registered email address";
}