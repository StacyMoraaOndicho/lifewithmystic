"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";

export default function Oracle() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    try {
      const res = await fetch('/api/search', { method: 'POST', body: JSON.stringify({ q }), headers: { 'Content-Type': 'application/json' } });
      const j = await res.json();
      setResults(j || []);
    } catch (err) {
      setResults([]);
    } finally { setLoading(false); }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    } as any,
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } as any,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <label className="block mb-2 text-lg italic">What truth do you seek?</label>
      <div className="flex gap-2 mb-6">
        <input value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} placeholder="Ask..." className="flex-1 p-2 border rounded" />
        <button onClick={search} className="px-4 py-2 bg-opacity-80 hover:bg-opacity-100 transition">{loading ? 'Searching...' : 'Ask'}</button>
      </div>

      <motion.div className="grid gap-3" variants={containerVariants} initial="hidden" animate={results.length > 0 ? 'show' : 'hidden'}>
        {results.map((r, i) => (
          <motion.a key={i} href={`/blog/${r.slug.current}`} variants={itemVariants} className="p-4 border rounded hover:bg-opacity-5 transition block">
            <h3 className="font-semibold hover:underline">{r.title}</h3>
            <p className="text-sm opacity-70 mt-1">{r.excerpt}</p>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
