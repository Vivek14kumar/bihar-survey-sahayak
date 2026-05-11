"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ShieldCheck, KeyRound, AlertCircle, CheckCircle2, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function ResetPassword() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token; 

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Double-check on submit just in case
    if (newPassword.length < 8 || newPassword !== confirmPassword) {
      setError("Please fix the errors above before submitting.");
      return; 
    }

    setLoading(true);

    try {
      console.log("SENDING TO BACKEND:", { token, newPassword });
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // --- Real-time Validation Logic ---
  const isPasswordTooShort = newPassword.length > 0 && newPassword.length < 8;
  const doPasswordsMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;
  const isFormInvalid = newPassword.length < 8 || newPassword !== confirmPassword;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row border border-white">
        
        {/* Left Side: Branding & Trust */}
        <div className="md:w-80 bg-slate-800 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10">
            <Lock size={160} />
          </div>
          
          <div className="relative z-10">
            <h1 className="text-xl font-bold tracking-tight mb-8">Bihar Survey Sahayak</h1>
            <div className="space-y-6">
              <div className="bg-slate-700/50 p-4 rounded-2xl border border-slate-600/50">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Final Step</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Create a strong, secure password to protect your operator dashboard and wallet balance.
                </p>
              </div>
              
              <div className="space-y-4 mt-6">
                <FeatureItem icon={<ShieldCheck size={16}/>} title="Encrypted Storage" desc="Your password is safely hashed." />
                <FeatureItem icon={<KeyRound size={16}/>} title="Secure Access" desc="Never share your password." />
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-700 mt-8">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={10} /> Safe Recovery Process
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          
          {!success ? (
            <>
              <header className="mb-8">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Create New Password</h2>
                <p className="text-slate-500 text-sm mt-1">Please enter your new secure password below.</p>
              </header>

              {/* General Submission Error */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start gap-3 rounded-r-lg">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* New Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      maxLength={8}
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} 
                      className={`w-full pl-10 pr-12 py-3.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all focus:bg-white focus:ring-4 font-medium text-slate-800 ${
                        isPasswordTooShort 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                      }`} 
                      placeholder="Min 8 characters" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* REAL-TIME LENGTH WARNING */}
                  {isPasswordTooShort && (
                    <span className="text-xs text-red-500 ml-1 flex items-center gap-1 font-medium mt-0.5">
                      <AlertCircle size={12} /> Must be at least 8 characters long
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      maxLength={8}
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className={`w-full pl-10 pr-4 py-3.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all focus:bg-white focus:ring-4 font-medium text-slate-800 ${
                        doPasswordsMismatch 
                          ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' 
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                      }`} 
                      placeholder="Repeat password" 
                    />
                  </div>
                  {/* REAL-TIME MISMATCH WARNING */}
                  {doPasswordsMismatch && (
                    <span className="text-xs text-red-500 ml-1 flex items-center gap-1 font-medium mt-0.5">
                      <AlertCircle size={12} /> Passwords do not match
                    </span>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading || isFormInvalid} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform active:scale-[0.98] mt-6 text-xs uppercase tracking-[0.2em] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    'Save New Password'
                  )}
                </button>
              </form>
            </>
          ) : (
            
            /* Success State */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Password Updated!</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
                Your password has been successfully changed. You can now use your new password to access your operator dashboard.
              </p>
              
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] text-xs uppercase tracking-[0.2em]"
              >
                Proceed to Login <ArrowRight size={16} />
              </Link>
            </div>
          )}

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