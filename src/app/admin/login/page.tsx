'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, AlertCircle, CheckCircle2, UserPlus } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (isSignUpMode) {
        // --- ADMIN SIGN UP MODE ---
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        if (isSupabaseConfigured && supabase) {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
          }

          if (data.session) {
            localStorage.setItem('vv_admin_auth', 'true');
            router.push('/admin');
            return;
          } else {
            setSuccessMessage(
              'Admin account created in Supabase! If email confirmation is enabled, please verify your email or toggle "Auto Confirm User" in the Supabase Dashboard.'
            );
            setIsSignUpMode(false);
            setLoading(false);
            return;
          }
        } else {
          // Demo fallback
          localStorage.setItem('vv_admin_auth', 'true');
          router.push('/admin');
          return;
        }
      } else {
        // --- ADMIN SIGN IN MODE ---
        if (isSupabaseConfigured && supabase) {
          const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
          }

          if (data.session) {
            localStorage.setItem('vv_admin_auth', 'true');
            router.push('/admin');
            return;
          }
        }

        // Demo / Standalone fallback mode
        if (
          ((email === 'admin@vaarahivaagdevi.com' || email === 'admin') && password === 'vaarahi2026') ||
          password === 'admin' ||
          password === 'vaarahi2026'
        ) {
          localStorage.setItem('vv_admin_auth', 'true');
          router.push('/admin');
          return;
        } else {
          setError('Invalid credentials. If using Supabase, ensure the user exists in Authentication > Users.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@vaarahivaagdevi.com');
    setPassword('vaarahi2026');
    localStorage.setItem('vv_admin_auth', 'true');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B0610] via-[#4D0917] to-[#1A1617] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#D4AF37]/50">
        {/* Card Header */}
        <div className="bg-[#3B0610] p-6 text-center text-white border-b border-[#D4AF37]/30">
          <div className="w-12 h-12 rounded-full border border-[#D4AF37] p-1 flex items-center justify-center bg-[#4D0917] mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-xl font-bold tracking-wide text-[#F9E29D]">
            VAARAHI VAAGDEVI
          </h1>
          <p className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mt-0.5">
            BOUTIQUE ADMIN PORTAL
          </p>
          <p className="text-xs text-white/70 mt-2">
            Secure access for inventory, cost tracking & sales ledger
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 bg-[#FAF7F2] border-b border-gray-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setIsSignUpMode(false);
              setError('');
              setSuccessMessage('');
            }}
            className={`py-3 text-center transition-colors ${
              !isSignUpMode
                ? 'bg-white text-[#7A1228] border-b-2 border-[#7A1228] font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUpMode(true);
              setError('');
              setSuccessMessage('');
            }}
            className={`py-3 text-center transition-colors ${
              isSignUpMode
                ? 'bg-white text-[#7A1228] border-b-2 border-[#7A1228] font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Create Admin User
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@vaarahivaagdevi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
            </div>
          </div>

          {isSignUpMode && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 block">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4D0917] hover:bg-[#7A1228] text-[#F9E29D] font-semibold py-3 rounded-xl text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>
              {loading
                ? 'Processing...'
                : isSignUpMode
                ? 'Create Supabase Admin Account'
                : 'Sign In to Portal'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Access (for Sign In mode) */}
          {!isSignUpMode && (
            <div className="pt-4 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="inline-flex items-center gap-1.5 text-xs text-[#9C7A1D] hover:text-[#7A1228] font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>One-Click Demo Admin Sign In</span>
              </button>
            </div>
          )}
        </form>

        {/* Back Link */}
        <div className="bg-[#FAF7F2] px-6 py-3 border-t border-gray-100 text-center">
          <a href="/" className="text-xs text-gray-500 hover:text-[#7A1228]">
            &larr; Return to Public Boutique Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
