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
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (user) {
      const isComingFromPayment = searchParams.get('status') === 'success';
      checkSubscriptionAndFetchData(isComingFromPayment);
    }
  }, [user]);

  async function checkSubscriptionAndFetchData(retry = false) {
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (profileErr) throw profileErr;

      // GRACEFUL VERIFICATION: If the webhook is slow, wait and try one more time
      if (profileData?.subscription_status !== 'active' && retry) {
        setIsVerifying(true);
        // Wait 3 seconds for the webhook to catch up
        await new Promise(resolve => setTimeout(resolve, 3500));
        return checkSubscriptionAndFetchData(false); // Try once more without retry
      }

      // If STILL not active after retry, then redirect
      if (profileData?.subscription_status !== 'active') {
        router.push('/pricing');
        return;
      }

      // If active, proceed normally
      setProfile(profileData);
      setIsVerifying(false);
      
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
                  <h3 className="text-2xl font-light text-[var(--text)] mb-1 uppercase tracking-widest leading-none">Welcome to the Sanctuary</h3>
                  <p className="text-sm text-[var(--text)]/60 italic mt-2">Your writer subscription is active. Your voice is now part of the collective.</p>
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
            <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-widest font-mono font-bold mt-2">
              Welcome back, {profile?.username || user?.email?.split('@')[0]}
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/studio">
              <button className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02]">
                <PenTool className="w-4 h-4" /> New Essay
              </button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-8 px-4">
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-[var(--accent)]" />
                  <h2 className="text-xl font-light text-[var(--text)] uppercase tracking-widest">Digital Products</h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="p-8 rounded-[32px] border border-[var(--text)]/10 bg-[var(--text)]/[0.02] flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-[var(--accent)] uppercase font-bold tracking-widest mb-1">{product.type}</div>
                      <h3 className="text-base font-light text-[var(--text)] mb-1">{product.title}</h3>
                      <div className="text-xl font-light text-[var(--text)]/60">{product.price}</div>
                    </div>
                    <LinkIcon className="w-4 h-4 text-[var(--text)]/20" />
                  </div>
                ))}
                
                <Link href="/writer/settings" className="block">
                  <button className="w-full h-full p-8 rounded-[32px] border-2 border-dashed border-[var(--text)]/10 text-[var(--text)]/20 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all flex flex-col items-center justify-center gap-3">
                    <Plus className="w-8 h-8" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">New Offering</span>
                  </button>
                </Link>
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] font-mono uppercase tracking-[0.5em] text-[10px]">Initializing Sanctuary...</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
