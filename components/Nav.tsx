'use client';

import Link from "next/link";
import { useImmersiveMode } from "@/lib/immersive-context";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ThemeSelector from "./ThemeSelector";

export default function Nav() {
  const { isImmersive } = useImmersiveMode();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/blog', label: 'Essays' },
    { href: '/knowledge-graph', label: 'Knowledge Graph' },
    { href: '/archive', label: 'Archive' },
    { href: '/about', label: 'About' },
    { href: '/manifesto', label: 'Manifesto' },
    { href: '/reflections', label: 'Reflections' },
    { href: '/audio', label: 'Audio' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isImmersive ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-full border-b bg-white/5 dark:bg-black/5 backdrop-blur-md fixed top-0 left-0 right-0 z-50 py-3 md:py-4"
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-base md:text-lg font-semibold whitespace-nowrap">
            lifewithmystic
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="opacity-70 hover:opacity-100 transition-opacity text-sm lg:text-base whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/admin" className="hidden sm:block px-2 md:px-3 py-1 text-sm border rounded hover:bg-amber-500/10 transition-colors whitespace-nowrap">
              Admin
            </Link>
            
            {/* Theme Selector */}
            {mounted && <ThemeSelector />}

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileOpen ? '✕' : '☰'}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-0 right-0 z-40 md:hidden bg-white/10 dark:bg-black/10 backdrop-blur-lg border-b"
          >
            <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 opacity-70 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 border rounded hover:bg-amber-500/10 transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block py-2 px-3 border rounded hover:bg-amber-500/10 transition-colors"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content overlap */}
      <div className="h-12 md:h-16" />
    </>
  );
}
