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
  const searchParams = searchParams = useSearchParams();
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
    // 1. Fetch the user's profile to check status
    const { data: profileData, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .maybeSingle();
    
    if (profileErr) {
      console.error(profileErr);
      setLoading(false);
      return;
    }

    // REDIRECT LOGIC: If they are a writer but haven't paid (or status isn't active), 
    // send them to the payment page.
    if (profileData?.subscription_status !== 'active') {
      router.push('/pricing');
      return;
    }

    // 2. If they ARE active, load the dashboard data
    setProfile(profileData);
    
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('writer_id', user?.id);
    
    if (productsData) setProducts(productsData);
    
    if (searchParams.get('status') === 'success') {
      setShowSuccess(true);
    }
    
    setLoading(false);
  }

  // ... (Rest of the component remains the same)
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <p className="font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">Verifying Presence...</p>
    </div>
  );

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--bg)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-16">
        
        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-12 p-8 rounded-[40px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between relative overflow-hidden"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-light text-[var(--text)] mb-1 uppercase tracking-widest">Welcome to the Sanctuary</h3>
                  <p className="text-sm text-[var(--text)]/60 italic">Your writer subscription is active. Your voice is now part of the collective.</p>
                </div>
              </div>
              <button onClick={() => setShowSuccess(false)} className="p-2 text-[var(--text)]/20 hover:text-[var(--text)] transition-colors">
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl font-light text-[var(--text)] tracking-tight mb-2 uppercase tracking-[0.2em]"
            >
              Creator <span className="italic text-[var(--accent)] font-serif">Sanctuary</span>
            </motion.h1>
            <p className="text-[var(--text)]/40 text-[10px] uppercase tracking-widest font-mono font-bold">
              Welcome back, {profile?.username || user?.email?.split('@')[0]}
            </p>
          </div>
          
          <div className="flex gap-4">
            <Link href="/studio">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg hover:shadow-[var(--accent)]/20 transition-all"
              >
                <PenTool className="w-4 h-4" />
                New Essay
              </motion.button>
            </Link>
            <Link href="/writer/settings">
              <button className="p-3 bg-[var(--text)]/5 text-[var(--text)] border border-[var(--text)]/10 rounded-xl hover:bg-[var(--text)]/10 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </header>

        {/* ... (Rest of the Dashboard UI) ... */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Readers', value: '1,240', icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'Total Earnings', value: '$420.50', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400' },
            { label: 'Monthly Growth', value: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-400' },
            { label: 'Active Essays', value: '8', icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-400' }
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[32px] border border-[var(--text)]/10 bg-[var(--text)]/[0.02] hover:bg-[var(--text)]/[0.04] transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-[var(--text)]/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--text)]/40 font-mono font-bold">{stat.label}</span>
              </div>
              <div className="text-3xl font-light text-[var(--text)]">{stat.value}</div>
            </motion.div>
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
                <Link href="/writer/settings">
                  <button className="text-[10px] text-[var(--accent)] uppercase tracking-widest font-bold hover:underline font-mono">Manage Store</button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <motion.div 
                    key={product.id}
                    whileHover={{ y: -4 }}
                    className="p-8 rounded-[32px] border border-[var(--text)]/10 bg-[var(--text)]/[0.02] flex items-center justify-between group hover:bg-[var(--text)]/[0.04] transition-all shadow-md"
                  >
                    <div>
                      <div className="text-[9px] text-[var(--accent)] uppercase font-bold tracking-widest mb-1">{product.type}</div>
                      <h3 className="text-base font-light text-[var(--text)] mb-1">{product.title}</h3>
                      <div className="text-xl font-light text-[var(--text)]/60">{product.price}</div>
                    </div>
                    <Link href={product.link} target="_blank">
                      <button className="p-4 bg-[var(--text)]/5 text-[var(--text)]/40 rounded-full group-hover:bg-[var(--accent)] group-hover:text-[var(--bg)] transition-all shadow-sm">
                        <LinkIcon className="w-4 h-4" />
                      </button>
                    </Link>
                  </motion.div>
                ))}
                
                <Link href="/writer/settings" className="block">
                  <button className="w-full h-full p-8 rounded-[32px] border-2 border-dashed border-[var(--text)]/10 text-[var(--text)]/20 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all flex flex-col items-center justify-center gap-3 group">
                    <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)] font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">Entering Sanctuary</div>}>
        <DashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
