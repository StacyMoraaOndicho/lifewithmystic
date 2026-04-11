'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PenTool, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen, 
  Link as LinkIcon, 
  Settings, 
  Plus, 
  ExternalLink,
  CheckCircle2,
  Loader2,
  Sparkles,
  X,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  title: string;
  type: string;
  price: string;
  link: string;
};

// MASTER ADMIN EMAIL
const ADMIN_EMAIL = "lifewithmystic@gmail.com";

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const isComingFromPayment = searchParams.get('status') === 'success';
      if (isComingFromPayment) {
        setIsVerifying(true);
        setTimeout(() => {
          checkSubscriptionAndFetchData(false);
          setShowSuccess(true);
          window.history.replaceState({}, '', '/writer/dashboard');
        }, 4000);
      } else {
        checkSubscriptionAndFetchData(true);
      }
    }
  }, [user]);

  async function checkSubscriptionAndFetchData(redirectOnFail = true) {
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (profileErr) throw profileErr;

      // --- IMPROVED SECURITY & ADMIN BYPASS ---
      const isAdmin = user?.email === ADMIN_EMAIL;
      const isWriter = profileData?.role === 'writer' || user?.user_metadata?.plan === 'writer';
      const isActive = profileData?.subscription_status === 'active';

      // If NOT admin AND (not a writer or not active), kick them out
      if (!isAdmin && (!isWriter || !isActive) && redirectOnFail) {
        router.push('/pricing');
        return;
      }

      // Load data for Admin or Paid Writer
      setProfile(profileData || { username: user?.email?.split('@')[0], role: isAdmin ? 'admin' : 'writer' });
      
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('writer_id', user?.id);
      
      if (productsData) setProducts(productsData);
    } catch (err) {
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
      setIsVerifying(false);
    }
  }

  const handleConnectPayouts = async () => {
    setConnectLoading(true);
    setErrorMsg(null);
    try {
      // Logic for Paystack Connect / Payout setup
      alert("Payout Gateway setup is currently restricted to verified Kenyan identities. Please contact support to complete your onboarding.");
    } catch (err) {
      setErrorMsg('Gateway connection timed out.');
    } finally {
      setConnectLoading(false);
    }
  };

  const stats = [
    { label: 'Total Readers', value: '1,240', icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Total Earnings', value: '$420.50', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400' },
    { label: 'Monthly Growth', value: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-400' },
    { label: 'Active Essays', value: '8', icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-400' }
  ];

  if (loading || isVerifying) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--accent)] opacity-20" />
        <p className="font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">
          {isVerifying ? 'Finalizing Presence...' : 'Entering Sanctuary'}
        </p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--bg)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-16 font-light">
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-12 p-8 rounded-[40px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-light text-[var(--text)] mb-1 uppercase tracking-widest leading-none">Welcome to the Sanctuary</h3>
                  <p className="text-sm text-[var(--text)]/60 italic mt-2">Your subscription is active. Your voice is now part of the collective.</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="p-2 text-[var(--text)]/20 hover:text-[var(--text)]"><X /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.h1 className="text-5xl font-light text-[var(--text)] uppercase tracking-[0.2em] mb-3">
              Creator <span className="italic text-[var(--accent)] font-serif">Sanctuary</span>
            </motion.h1>
            <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-widest font-mono font-bold">
              Presence: {profile?.username || user?.email?.split('@')[0]}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/studio">
              <button className="px-8 py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-2xl hover:scale-[1.02] transition-all">
                <PenTool className="w-4 h-4" /> New Reflection
              </button>
            </Link>
            <Link href="/writer/settings">
              <button className="p-4 bg-[var(--text)]/5 text-[var(--text)] border border-[var(--text)]/10 rounded-2xl hover:bg-[var(--text)]/10 transition-all">
                <Settings className="w-5 h-5 opacity-40" />
              </button>
            </Link>
          </div>
        </header>

        {/* PAYOUT ONBOARDING BANNER */}
        {!profile?.paystack_id && !profile?.stripe_connect_id && (
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 p-10 rounded-[40px] bg-blue-500/5 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="flex items-center gap-8 text-center md:text-left">
              <div className="w-20 h-20 rounded-3xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <CreditCard className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-light text-white mb-2">Enable Reader Payouts</h3>
                <p className="text-sm text-white/40 italic leading-relaxed max-w-md">Link your local bank or mobile money account to receive payments directly for your digital offerings.</p>
              </div>
            </div>
            <button 
              onClick={handleConnectPayouts}
              disabled={connectLoading}
              className="px-10 py-5 bg-blue-500 text-white rounded-[20px] font-bold uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {connectLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Begin Onboarding'}
            </button>
          </motion.section>
        )}

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-[40px] border border-[var(--text)]/5 bg-[var(--text)]/[0.01] hover:bg-[var(--text)]/[0.03] transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl bg-[var(--text)]/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--text)]/30 font-bold">{stat.label}</span>
              </div>
              <div className="text-4xl font-light text-[var(--text)]">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {/* DIGITAL PRODUCTS */}
            <section>
              <div className="flex items-center justify-between mb-10 px-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-light text-[var(--text)] uppercase tracking-widest">Digital Offerings</h2>
                </div>
                <Link href="/writer/settings">
                  <button className="text-[10px] text-[var(--accent)] uppercase tracking-widest font-bold hover:underline font-mono">Manage Constellation</button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {products.length > 0 ? products.map((product) => (
                  <div key={product.id} className="p-10 rounded-[40px] border border-[var(--text)]/10 bg-[var(--text)]/[0.02] flex items-center justify-between group hover:bg-[var(--text)]/[0.04] transition-all shadow-xl">
                    <div>
                      <div className="text-[9px] text-[var(--accent)] uppercase font-bold tracking-widest mb-2">{product.type}</div>
                      <h3 className="text-xl font-light text-[var(--text)] mb-1">{product.title}</h3>
                      <div className="text-2xl font-light text-[var(--text)]/40">{product.price}</div>
                    </div>
                    <LinkIcon className="w-5 h-5 text-[var(--text)]/10 group-hover:text-[var(--text)]/40 transition-colors" />
                  </div>
                )) : (
                  <Link href="/writer/settings" className="block col-span-full">
                    <button className="w-full p-16 rounded-[40px] border-2 border-dashed border-[var(--text)]/10 text-[var(--text)]/20 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all flex flex-col items-center justify-center gap-4 group">
                      <Plus className="w-10 h-10 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Initiate New Offering</span>
                    </button>
                  </Link>
                )}
              </div>
            </section>

            {/* ANALYTICS TABLE */}
            <section>
              <div className="flex items-center gap-4 mb-10 px-4">
                <TrendingUp className="w-6 h-6 text-amber-400 opacity-40" />
                <h2 className="text-2xl font-light text-[var(--text)] uppercase tracking-widest">Resonance Map</h2>
              </div>
              <div className="rounded-[40px] border border-[var(--text)]/10 bg-[var(--text)]/[0.01] overflow-hidden shadow-2xl">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--text)]/10 text-[var(--text)]/30 uppercase tracking-widest text-[10px] font-bold">
                      <th className="px-10 py-8 font-medium">Reflection</th>
                      <th className="px-10 py-8 font-medium">Resonance</th>
                      <th className="px-10 py-8 text-right font-medium">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--text)]/[0.05]">
                    {[
                      { title: 'Silence as Mirror', views: '450', status: 'Published' },
                      { title: 'The Divine Within', views: '320', status: 'Published' },
                      { title: 'Virtue as Strategy', views: '89', status: 'Published' }
                    ].map((post) => (
                      <tr key={post.title} className="hover:bg-[var(--text)]/[0.02] transition-colors group">
                        <td className="px-10 py-8 font-light text-[var(--text)] text-base">{post.title}</td>
                        <td className="px-10 py-8 text-[var(--text)]/40 font-mono tracking-tighter text-base">{post.views}</td>
                        <td className="px-10 py-8 text-right">
                          <span className="text-emerald-400/60 text-[10px] uppercase font-bold tracking-widest bg-emerald-400/5 px-3 py-1 rounded-full">{post.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* SIDEBAR SECTIONS */}
          <div className="space-y-12">
            <section className="p-12 rounded-[50px] bg-[var(--accent)] text-[var(--bg)] relative overflow-hidden group shadow-3xl">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <h3 className="text-3xl font-light mb-6 uppercase tracking-widest leading-tight">Elevate <br/>Presence</h3>
              <p className="text-[var(--bg)]/70 text-sm mb-10 leading-relaxed italic font-light">Your current resonance is up 20% this week. Share your latest reflection to keep the momentum flowing through the collective.</p>
              <button className="w-full py-5 bg-[var(--bg)] text-[var(--accent)] rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:shadow-2xl transition-all">
                <ExternalLink className="w-4 h-4" /> Radiate Now
              </button>
            </section>

            <section className="p-12 rounded-[50px] border border-[var(--text)]/10 bg-[var(--text)]/[0.01] shadow-xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--text)]/30 mb-10 text-center font-mono">Architect Path</h3>
              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-mono shrink-0 font-bold border border-[var(--accent)]/20 shadow-inner">01</div>
                  <p className="text-sm text-[var(--text)]/50 leading-relaxed italic font-light pt-1">Cross-link your essays to create a knowledge constellation within the sanctuary.</p>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-mono shrink-0 font-bold border border-[var(--accent)]/20 shadow-inner">02</div>
                  <p className="text-sm text-[var(--text)]/50 leading-relaxed italic font-light pt-1">Add your new course link to your public bio to deepen reader engagement.</p>
                </div>
              </div>
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">Entering Sanctuary</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
