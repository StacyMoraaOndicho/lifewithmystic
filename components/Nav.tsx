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
      .maybeSingle();
    setRole(data?.role || 'seeker');
  }

  const navLinks = [
    { href: '/blog', label: 'Essays' },
    { href: '/writers', label: 'Creators' },
    { href: '/knowledge-graph', label: 'Knowledge Graph' },
    { href: '/archive', label: 'Archive' },
    { href: '/about', label: 'About' },
    { href: '/manifesto', label: 'Manifesto' },
    { href: '/reflections', label: 'Reflections' },
    { href: '/audio', label: 'Audio' },
  ];

  const isAdmin = user?.email === "lifewithmystic@gmail.com";
  const isWriter = role === 'writer' || user?.user_metadata?.plan === 'writer';

  if (!mounted) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isImmersive ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ 
          backgroundColor: 'var(--bg, #0a0a0a)', 
          borderBottomColor: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text)'
        }}
        className="w-full border-b fixed top-0 left-0 right-0 z-50 py-2 md:py-3 transition-all duration-500"
      >
        <div className="max-w-[1800px] mx-auto px-4 md:px-10 flex items-center justify-between h-12 md:h-16">
          
          <Link href="/" className="text-base md:text-lg font-light tracking-[0.2em] uppercase whitespace-nowrap shrink-0 mr-12">
            lifewithmystic
          </Link>

          <div className="hidden md:flex flex-1 items-center max-w-[800px] overflow-hidden relative">
            <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth h-10 w-full relative">
              {/* Left Glowing Bar */}
              <motion.div 
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="h-6 w-[2px] bg-white shrink-0 mr-8 shadow-[0_0_10px_#fff]" 
              />
              
              <div className="flex items-center gap-10 px-4">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[var(--text)] opacity-40 hover:opacity-100 transition-all text-[11px] whitespace-nowrap font-medium shrink-0 uppercase tracking-[0.2em]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Right Glowing Bar */}
              <motion.div 
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="h-6 w-[2px] bg-white shrink-0 ml-8 shadow-[0_0_10px_#fff]" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-12">
            {/* ADMIN BUTTON - Always visible and clean */}
            <Link href="/admin" className="hidden lg:block px-3 py-1 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all uppercase tracking-widest text-[10px] opacity-40 hover:opacity-100">
              Admin
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  {(isWriter || isAdmin) && (
                    <Link href="/writer/dashboard" className="px-4 py-1.5 bg-[var(--accent)] text-[var(--bg)] text-[10px] uppercase tracking-widest font-bold rounded-xl hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] transition-all">
                      Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut()}
                    className="px-3 py-1.5 text-[10px] border border-current opacity-20 hover:opacity-100 rounded-full transition-all uppercase tracking-widest"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-xs opacity-60 hover:opacity-100 transition-all uppercase tracking-widest">
                    Login
                  </Link>
                  
                  <div className="flex flex-col items-center">
                    <Link href="/signup" className="px-6 py-1.5 text-xs bg-[var(--accent)] text-[var(--bg)] rounded-full hover:opacity-90 transition-all uppercase tracking-widest font-semibold z-10">
                      Join
                    </Link>
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], textShadow: ["0 0 0px #fff", "0 0 10px #fff", "0 0 0px #fff"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="mt-1"
                    >
                      <Link href="/pricing" className="text-[10px] italic text-white/80 hover:text-white transition-all whitespace-nowrap tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                        Become a Writer
                      </Link>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-4 w-[1px] bg-current opacity-10 hidden sm:block" />
            <ThemeSelector />
            
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-current hover:bg-opacity-5 transition-colors"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
            className="fixed top-14 left-0 right-0 z-40 md:hidden border-b border-opacity-10 shadow-2xl"
          >
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-4 text-center">
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="block py-3 text-white/40 font-bold uppercase tracking-widest border-b border-white/5">Admin Panel</Link>
              {(isWriter || isAdmin) && <Link href="/writer/dashboard" onClick={() => setMobileOpen(false)} className="block py-3 text-[var(--accent)] font-bold uppercase tracking-widest border-b border-white/5">Writer Dashboard</Link>}
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block py-2 opacity-70 hover:opacity-100 text-lg font-light uppercase tracking-widest">{link.label}</Link>
              ))}
              <div className="pt-4 border-t border-current border-opacity-10 flex flex-col gap-3">
                {user ? <button onClick={() => { signOut(); setMobileOpen(false); }} className="w-full py-3 border border-current border-opacity-20 rounded-xl uppercase tracking-widest text-sm">Logout</button> : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full py-3 border border-current border-opacity-20 rounded-xl text-center uppercase tracking-widest text-sm">Login</Link>
                    <Link href="/signup" onClick={() => setMobileOpen(false)} className="w-full py-3 bg-[var(--accent)] text-[var(--bg)] rounded-xl text-center uppercase tracking-widest text-sm font-semibold">Join</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="h-16 md:h-20" />
    </>
  );
}
