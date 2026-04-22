'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, TrendingUp, Users, DollarSign, BookOpen, Link as LinkIcon, 
  Settings, Plus, ExternalLink, CheckCircle2, Loader2, Sparkles, X, 
  AlertCircle, CreditCard, Smartphone, Globe, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

type Product = { id: string; title: string; type: string; price: string; link: string; };

const ADMIN_EMAIL = "lifewithmystic@gmail.com";

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa / Mobile Money', icon: <Smartphone className="w-5 h-5 text-emerald-500" />, tag: 'Kenya Special' },
  { id: 'card', name: 'Credit / Debit Card', icon: <Globe className="w-5 h-5 text-blue-400" />, tag: 'Africa & Global' },
  { id: 'bank', name: 'Bank Transfer (Pesalink)', icon: <CreditCard className="w-5 h-5 text-yellow-500" />, tag: 'Direct' }
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
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user?.id).maybeSingle();
    
    // Check if user is the admin or has paid
    const isAdmin = user?.email === ADMIN_EMAIL;
    const isActive = profileData?.subscription_status === 'active';

    // FORCE PAYMENT GATE if not admin and not active
    if (!isAdmin && !isActive) {
      setMustPay(true);
      setLoading(false);
      return;
    }

    setProfile(profileData || { username: user?.email?.split('@')[0] });
    const { data: p } = await supabase.from('products').select('*').eq('writer_id', user?.id);
    if (p) setProducts(p);
    if (searchParams.get('status') === 'success') setShowSuccess(true);
    setLoading(false);
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Sanctuary...</div>;

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
              <button key={m.id} onClick={() => handlePayment(m.id)} disabled={!!payLoading} className="w-full p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">{m.icon}</div>
                  <div><h4 className="text-white font-medium text-sm">{m.name}</h4><p className="text-[9px] text-white/30 uppercase tracking-widest mt-1">{m.tag}</p></div>
                </div>
                {payLoading === m.id ? <Loader2 className="animate-spin w-4 h-4 text-[var(--accent)]" /> : <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />}
              </button>
            ))}
          </div>
          <p className="mt-10 text-[9px] text-white/20 uppercase tracking-[0.3em]">Monthly subscription: $9 (1,200 KES)</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--bg)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-16">
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12 p-8 rounded-[40px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between shadow-2xl shadow-emerald-500/5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckCircle2 className="w-8 h-8" /></div>
                <div><h3 className="text-2xl font-light text-white mb-1 uppercase tracking-widest">Presence Activated</h3><p className="text-sm text-white/60 italic">Your voice is now part of the collective sanctuary.</p></div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="p-2 text-white/20 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.h1 className="text-5xl font-light text-white uppercase tracking-[0.2em]">Creator <span className="italic text-[var(--accent)] font-serif">Sanctuary</span></motion.h1>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono mt-2">Presence: {profile?.username || user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/studio"><button className="px-8 py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:shadow-[var(--accent)]/30 hover:scale-[1.02] transition-all">New Reflection</button></Link>
            <Link href="/writer/settings"><button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"><Settings className="w-5 h-5 opacity-40" /></button></Link>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Total Readers', value: '1,240', icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'Total Earnings', value: '$420.50', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400' },
            { label: 'Monthly Growth', value: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-400' },
            { label: 'Active Essays', value: '8', icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-400' }
          ].map((stat) => (
            <div key={stat.label} className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all group shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>{stat.icon}</div>
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</span>
              </div>
              <div className="text-4xl font-light text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <div className="flex items-center justify-between mb-10 px-4">
                <div className="flex items-center gap-4"><Plus className="w-5 h-5 text-[var(--accent)]" /><h2 className="text-2xl font-light text-white uppercase tracking-widest">Digital Offerings</h2></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {products.length > 0 ? products.map((p) => (
                  <div key={p.id} className="p-10 rounded-[40px] border border-white/10 bg-white/[0.02] flex items-center justify-between group hover:border-[var(--accent)]/30 transition-all">
                    <div><div className="text-[9px] text-[var(--accent)] uppercase font-bold tracking-widest mb-2">{p.type}</div><h3 className="text-xl font-light text-white">{p.title}</h3><div className="text-2xl font-light text-white/40">{p.price}</div></div>
                    <LinkIcon className="w-5 h-5 text-white/10 group-hover:text-[var(--accent)] transition-colors" />
                  </div>
                )) : (
                  <Link href="/writer/settings" className="block col-span-full">
                    <button className="w-full p-16 rounded-[40px] border-2 border-dashed border-white/10 text-white/20 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all flex flex-col items-center justify-center gap-4 group">
                      <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" /><span className="text-[10px] uppercase tracking-[0.4em] font-bold">Initiate New Offering</span>
                    </button>
                  </Link>
                )}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-4 mb-10 px-4"><TrendingUp className="w-6 h-6 text-amber-400 opacity-40" /><h2 className="text-2xl font-light text-white uppercase tracking-widest">Resonance Map</h2></div>
              <div className="rounded-[40px] border border-white/10 bg-white/[0.01] overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm">
                  <thead><tr className="border-b border-white/10 text-white/30 uppercase tracking-widest text-[10px] font-bold"><th className="px-10 py-8">Reflection</th><th className="px-10 py-8">Resonance</th><th className="px-10 py-8 text-right">State</th></tr></thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {[{ title: 'Silence as Mirror', v: '450' }, { title: 'The Divine Within', v: '320' }].map((post) => (
                      <tr key={post.title} className="hover:bg-white/[0.02] transition-colors group"><td className="px-10 py-8 font-light text-white text-base">{post.title}</td><td className="px-10 py-8 text-white/40 font-mono text-base">{post.v}</td><td className="px-10 py-8 text-right"><span className="text-emerald-400/60 text-[10px] uppercase font-bold tracking-widest bg-emerald-400/5 px-3 py-1 rounded-full">Published</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <section className="p-12 rounded-[50px] bg-[var(--accent)] text-[var(--bg)] relative overflow-hidden group shadow-3xl">
              <h3 className="text-3xl font-light mb-6 uppercase tracking-widest leading-tight text-white">Elevate <br/>Presence</h3>
              <p className="text-[var(--bg)]/70 text-sm mb-10 leading-relaxed italic font-light">Your current resonance is up 20% this week. Share your latest reflection to keep the momentum flowing through the collective.</p>
              <button className="w-full py-5 bg-white text-[var(--accent)] rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-2xl transition-all">Radiate Now</button>
            </section>
            <section className="p-12 rounded-[50px] border border-white/10 bg-white/[0.01] shadow-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-10 text-center font-mono">Architect Path</h3>
              <div className="space-y-10 text-sm text-white/50 italic font-light"><p>1. Cross-link your essays to create a knowledge constellation.</p><p>2. Add your new course link to your public bio.</p></div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function WriterDashboard() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Entering Sanctuary...</div>}><DashboardContent /></Suspense>
    </ProtectedRoute>
  );
}
