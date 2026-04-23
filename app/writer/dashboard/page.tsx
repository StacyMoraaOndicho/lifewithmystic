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
    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user?.id).maybeSingle();
      
      const isAdmin = user?.email === ADMIN_EMAIL;
      const isActive = profileData?.subscription_status === 'active';

      // MANDATORY LOCK: If not Admin and not Active, show payment options
      if (!isAdmin && !isActive) {
        setMustPay(true);
        setLoading(false);
        return;
      }

      setProfile(profileData || { username: user?.email?.split('@')[0] });
      const { data: p } = await supabase.from('products').select('*').eq('writer_id', user?.id);
      if (p) setProducts(p);
      if (searchParams.get('status') === 'success') setShowSuccess(true);
    } catch (err) {
      console.error(err);
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
        body: JSON.stringify({ 
          userId: user?.id, 
          userEmail: user?.email, 
          amount: 9 // Fixed $9 plan
        }),
      });
      const data = await res.json();
      if (data.url) {
        // SUCCESS: This takes the user to the Paystack Payment Screen
        window.location.href = data.url;
      } else {
        alert("Payment Gateway initializing. Please wait 10 seconds and try again.");
      }
    } catch (err) {
      alert("Sacred Sanctuary connection lost. Check your internet.");
    } finally {
      setPayLoading(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Entering Sanctuary...</div>;

  if (mustPay) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[40px] p-12 text-center shadow-3xl">
          <div className="w-20 h-20 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mx-auto mb-8 border border-[var(--accent)]/20 shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)] text-[var(--accent)]">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-light text-white mb-2 uppercase tracking-[0.2em]">Activate Presence</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-12">Select your gateway to enter the Creator Sanctuary</p>
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
          <p className="mt-10 text-[9px] text-white/20 uppercase tracking-[0.3em]">Pay with M-Pesa or Global Card</p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[var(--bg)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-16">
        {/* Full Dashboard UI Restored Below */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-5xl font-light text-white uppercase tracking-[0.2em]">Creator <span className="italic text-[var(--accent)] font-serif">Sanctuary</span></h1>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono mt-2">Presence: {profile?.username || user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/studio"><button className="px-8 py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl">New Reflection</button></Link>
            <Link href="/writer/settings"><button className="p-4 bg-white/5 border border-white/10 rounded-2xl"><Settings className="w-5 h-5 opacity-40" /></button></Link>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Total Readers', value: '1,240', icon: <Users className="w-5 h-5" />, color: 'text-blue-400' },
            { label: 'Total Earnings', value: '$420.50', icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-400' },
            { label: 'Monthly Growth', value: '+12%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-400' },
            { label: 'Active Essays', value: '8', icon: <BookOpen className="w-5 h-5" />, color: 'text-purple-400' }
          ].map((stat) => (
            <div key={stat.label} className="p-10 rounded-[40px] border border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>{stat.icon}</div>
                <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</span>
              </div>
              <div className="text-4xl font-light text-white">{stat.value}</div>
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
      <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Loading Sanctuary...</div>}><DashboardContent /></Suspense>
    </ProtectedRoute>
  );
}
