'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);
    setShowResend(false);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsError(true);
      if (error.message.includes('Email not confirmed')) {
        setMessage('Your identity has not been confirmed. Check your inbox or request a new link.');
        setShowResend(true);
      } else {
        setMessage(`Error: ${error.message}`);
      }
    } else if (data.user) {
      setMessage('Re-entering the sanctuary...');
      setTimeout(() => router.push('/blog'), 1000);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (error) {
      setMessage(`Resend failed: ${error.message}`);
      setIsError(true);
    } else {
      setMessage('A fresh link has been transmitted to your inbox.');
      setIsError(false);
      setCountdown(60); // Start the 60 second countdown
    }
    setResending(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)] transition-colors duration-500">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 rounded-[40px] border border-[var(--text)]/10 bg-[var(--bg)] shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-tight text-[var(--text)] mb-2 uppercase tracking-[0.2em]">Welcome Back</h1>
          <p className="text-[var(--text)]/40 italic font-light uppercase tracking-widest text-[10px]">Re-enter the inner sanctuary</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--text)]/40 font-mono font-bold">Identity (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-5 rounded-2xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light"
              placeholder="name@email.com"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--text)]/40 font-mono font-bold">Secret (Password)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-5 rounded-2xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full p-5 rounded-2xl bg-[var(--accent)] text-[var(--bg)] hover:shadow-2xl hover:scale-[1.01] transition-all font-bold uppercase tracking-[0.3em] text-[10px] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Enter Sanctuary'}
          </button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mt-8 p-5 rounded-2xl text-center border flex flex-col gap-4 ${isError ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}
            >
              <div className="flex items-center justify-center gap-2">
                {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                <p className="text-[10px] font-bold uppercase tracking-widest">{message}</p>
              </div>

              {showResend && (
                <button 
                  onClick={handleResend}
                  disabled={countdown > 0 || resending}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] uppercase tracking-widest font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                  {countdown > 0 ? `Wait ${countdown}s to Resend` : 'Resend Confirmation Link'}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-[var(--text)]/5 text-center flex flex-col gap-4">
          <p className="text-sm text-[var(--text)]/40">
            First time here? <Link href="/signup" className="text-[var(--accent)] hover:underline font-medium">Create a new identity</Link>
          </p>
          <Link href="/blog" className="text-[9px] text-[var(--text)]/20 hover:text-[var(--text)] transition-colors uppercase tracking-[0.4em] font-bold">← Return to the Blog</Link>
        </div>
      </motion.div>
    </main>
  );
}
