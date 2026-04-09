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
  CreditCard,
  CheckCircle2,
  Loader2,
  Sparkles,
  X,
  AlertCircle
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

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkSubscriptionAndFetchData();
    }
  }, [user]);

  async function checkSubscriptionAndFetchData() {
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (profileErr) throw profileErr;

      // If they aren't active, send to pricing
      if (profileData?.subscription_status !== 'active') {
        router.push('/pricing');
        return;
      }

      setProfile(profileData);
      
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('writer_id', user?.id);
      
      if (productsData) setProducts(productsData);
      
      if (searchParams.get('status') === 'success') {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <p className="font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">Verifying Presence...</p>
    </div>
  );

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--bg)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-16">
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
                  <h3 className="text-2xl font-light text-[var(--text)] mb-1 uppercase tracking-widest">Welcome to the Sanctuary</h3>
                  <p className="text-sm text-[var(--text)]/60 italic">Your writer subscription is active.</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="p-2 text-[var(--text)]/20 hover:text-[var(--text)]"><X /></button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1 className="text-4xl font-light text-[var(--text)] uppercase tracking-[0.2em]">
              Creator <span className="italic text-[var(--accent)]">Sanctuary</span>
            </motion.h1>
            <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-widest font-mono font-bold">
              Welcome back, {profile?.username || user?.email?.split('@')[0]}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/studio">
              <button className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                <PenTool className="w-4 h-4" /> New Essay
              </button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Readers', value: '1,240', icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'Total Earnings', value: '$420.50', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400' },
            { label: 'Monthly Growth', value: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-400' },
            { label: 'Active Essays', value: '8', icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-400' }
          ].map((stat) => (
            <div key={stat.label} className="p-8 rounded-[32px] border border-[var(--text)]/10 bg-[var(--text)]/[0.02]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-[var(--text)]/5 ${stat.color}`}>{stat.icon}</div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--text)]/40 font-mono font-bold">{stat.label}</span>
              </div>
              <div className="text-3xl font-light text-[var(--text)]">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function WriterDashboard() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] font-mono uppercase tracking-[0.5em] text-[10px]">Entering Sanctuary</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
