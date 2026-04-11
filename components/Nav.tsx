'use client';

import Link from "next/link";
import { useImmersiveMode } from "@/lib/immersive-context";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ThemeSelector from "./ThemeSelector";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function Nav() {
  const { isImmersive } = useImmersiveMode();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (user) {
      fetchUserRole();
    } else {
      setRole(null);
    }
  }, [user]);

  async function fetchUserRole() {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single();
    setRole(data?.role || 'seeker');
  }

  const navLinks = [
    { href: '/blog', label: 'Essays' },
    { href: '/writers', label: 'Creators' },
    { href: '/archive', label: 'Archive' },
    { href: '/about', label: 'About' },
  ];

  const isAdmin = user?.email === "lifewithmystic@gmail.com";
  const isWriter = role === 'writer' || user?.user_metadata?.plan === 'writer';

  if (!mounted) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isImmersive ? -100 : 0 }}
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
        className="w-full border-b border-white/5 fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-500"
      >
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-between h-14">
          
          <Link href="/" className="text-lg font-light tracking-[0.3em] uppercase shrink-0">
            lifewithmystic
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-xs uppercase tracking-widest opacity-40 hover:opacity-100 transition-all">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            {isAdmin && (
              <Link href="/admin" className="px-3 py-1 border border-amber-500/30 text-amber-500 text-[9px] uppercase tracking-widest rounded-lg hover:bg-amber-500/10 transition-all">
                Admin
              </Link>
            )}

            {isWriter && (
              <Link href="/writer/dashboard" className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg)] text-[9px] uppercase tracking-widest font-bold rounded-full">
                Dashboard
              </Link>
            )}

            {!user ? (
              <Link href="/login" className="text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100">Login</Link>
            ) : (
              <button onClick={() => signOut()} className="text-[10px] uppercase tracking-widest opacity-30 hover:opacity-100 transition-all">Logout</button>
            )}
            
            <ThemeSelector />
          </div>
        </div>
      </motion.nav>
      <div className="h-20" />
    </>
  );
}
