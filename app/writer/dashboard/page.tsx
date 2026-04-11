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
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

      // MANDATORY LOCK: If not Admin AND not Active, kick out to pricing
      const isAdmin = user?.email === ADMIN_EMAIL;
      const isActive = profileData?.subscription_status === 'active';

      if (!isAdmin && !isActive && redirectOnFail) {
        // This is the absolute wall - if you haven't paid, you cannot be here.
        router.push('/pricing?status=confirmed&plan=writer&force_gateway=true');
        return;
      }

      setProfile(profileData || { username: user?.email?.split('@')[0], role: isAdmin ? 'admin' : 'writer' });
      const { data: productsData } = await supabase.from('products').select('*').eq('writer_id', user?.id);
      if (productsData) setProducts(productsData);
    } catch (err) {
      console.error('Dashboard Error:', err);
    } finally {
      setLoading(false);
      setIsVerifying(false);
    }
  }

  const stats = [
    { label: 'Total Readers', value: '1,240', icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Total Earnings', value: '$420.50', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400' },
    { label: 'Monthly Growth', value: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-400' },
    { label: 'Active Essays', value: '8', icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-400' }
  ];

  if (loading || isVerifying) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-[var(--accent)]" />
        <p className="font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">Securing Presence...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--bg)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-16">
        <AnimatePresence>
          {showSuccess && (
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-12 p-8 rounded-[40px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Sparkles /></div>
                <div>
                  <h3 className="text-2xl font-light text-white mb-1">Welcome to the Sanctuary</h3>
                  <p className="text-sm text-white/60 italic">Your writer subscription is active.</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)}><X /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-light text-white uppercase tracking-[0.2em]">Creator <span className="italic text-[var(--accent)] font-serif">Sanctuary</span></h1>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono mt-2">Identity: {profile?.username || user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/studio"><button className="px-8 py-4 bg-[var(--accent)] text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl">New Reflection</button></Link>
            <Link href="/writer/settings"><button className="p-4 bg-white/5 border border-white/10 rounded-2xl"><Settings className="w-5 h-5 opacity-40" /></button></Link>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</span>
              </div>
              <div className="text-4xl font-light text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="text-2xl font-light text-white uppercase tracking-widest mb-10 px-4">Digital Offerings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {products.length > 0 ? products.map((p) => (
                  <div key={p.id} className="p-10 rounded-[40px] border border-white/10 bg-white/[0.02] flex items-center justify-between group">
                    <div><h3 className="text-xl font-light text-white">{p.title}</h3><div className="text-2xl font-light text-white/40">{p.price}</div></div>
                    <LinkIcon className="w-5 h-5 text-white/10" />
                  </div>
                )) : (
                  <Link href="/writer/settings" className="block col-span-full">
                    <button className="w-full p-16 rounded-[40px] border-2 border-dashed border-white/10 text-white/20 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all flex flex-col items-center justify-center gap-4 group">
                      <Plus className="w-10 h-10" />
                      <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Initiate New Offering</span>
                    </button>
                  </Link>
                )}
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
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Entering Sanctuary</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
