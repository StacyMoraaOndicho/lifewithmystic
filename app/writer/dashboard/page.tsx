'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, TrendingUp, Users, DollarSign, BookOpen, Link as LinkIcon, 
  Settings, Plus, ExternalLink, CheckCircle2, Loader2, Sparkles, X, 
  AlertCircle, Smartphone, Globe, ChevronRight, LayoutDashboard, Edit3
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

type Product = { id: string; title: string; type: string; price: string; link: string; };

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa / Mobile Money', icon: <Smartphone className="w-5 h-5 text-emerald-500" />, tag: 'Kenya Special' },
  { id: 'card', name: 'Credit / Debit Card', icon: <Globe className="w-5 h-5 text-blue-400" />, tag: 'Africa & Global' },
  { id: 'bank', name: 'Bank Transfer (Pesalink)', icon: <ChevronRight className="w-5 h-5 text-yellow-500" />, tag: 'Direct' }
];

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mustPay, setMustPay] = useState(false);
  const [payLoading, setPayLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkSubscriptionAndFetchData();
    }
  }, [user]);

  async function checkSubscriptionAndFetchData() {
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user?.id).maybeSingle();
      
      const role = profileData?.role || user?.user_metadata?.role || user?.user_metadata?.plan || 'seeker';
      const isAdmin = role === 'admin' || user?.email === "lifewithmystic@gmail.com";
      const isActive = profileData?.subscription_status === 'active' || searchParams.get('status') === 'success';

      if (!isAdmin && !isActive) {
        setMustPay(true);
        setLoading(false);
        return;
      }

      setMustPay(false);
      setProfile(profileData || { username: user?.email?.split('@')[0], role });
      
      const { data: p } = await supabase.from('products').select('*').eq('writer_id', user?.id);
      if (p) setProducts(p);
      
      if (searchParams.get('status') === 'success') setShowSuccess(true);
    } catch (err) {
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handlePayment = async (methodId: string) => {
    setPayLoading(methodId);
    try {
      const res = await fetch('/api/paystack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, userEmail: user?.email, amount: 9 }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert("Gateway error.");
    } finally {
      setPayLoading(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">
      Entering Sanctuary...
    </div>
  );

  if (mustPay) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[40px] p-12 text-center shadow-3xl">
          <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-8 border border-[var(--accent)]/20 shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)] text-[var(--accent)]">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-light text-white mb-2 uppercase tracking-[0.2em]">Activate Presence</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-12">Choose your gateway to enter the Creator Sanctuary</p>
          <div className="space-y-4 text-left">
            {paymentMethods.map((m) => (
              <button key={m.id} onClick={() => handlePayment(m.id)} disabled={!!payLoading} className="w-full p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-[var(--accent)]/30 hover:bg-white/[0.05] transition-all flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">{m.icon}</div>
                  <div><h4 className="text-white font-medium text-sm">{m.name}</h4><p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{m.tag}</p></div>
                </div>
                {payLoading === m.id ? <Loader2 className="animate-spin w-4 h-4 text-[var(--accent)]" /> : <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />}
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--bg)] transition-colors duration-500 font-light">
      <div className="max-w-6xl mx-auto pt-16">
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12 p-8 rounded-[40px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle2 className="w-8 h-8" /></div>
                <div><h3 className="text-2xl font-light text-white mb-1 uppercase tracking-widest">Presence Activated</h3><p className="text-sm text-white/60 italic">Your voice is now part of the collective sanctuary.</p></div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="p-2 text-white/20 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4">
          <div>
            <motion.h1 className="text-5xl font-light text-white uppercase tracking-[0.2em]">Creator <span className="italic text-[var(--accent)] font-serif">Sanctuary</span></motion.h1>
            <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-widest font-mono mt-2 tracking-[0.4em]">Presence: {profile?.username || user?.email?.split('@')[0]}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/admin/create">
              <button className="px-8 py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-2xl hover:scale-[1.02] transition-all">
                <PenTool className="w-4 h-4" /> New Reflection
              </button>
            </Link>
            <Link href="/writer/settings">
              <button className="p-4 bg-[var(--text)]/5 text-[var(--text)] border border-[var(--text)]/10 rounded-2xl hover:bg-[var(--text)]/10 transition-all shadow-sm">
                <Settings className="w-5 h-5 opacity-40" />
              </button>
            </Link>
          </div>
        </header>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Total Readers', value: '1,240', icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'Total Earnings', value: '$420.50', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400' },
            { label: 'Monthly Growth', value: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-400' },
            { label: 'Active Essays', value: '8', icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-400' }
          ].map((stat, idx) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</span>
              </div>
              <div className="text-4xl font-light text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function WriterDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Entering Sanctuary...</div>}>
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    </Suspense>
  );
}
