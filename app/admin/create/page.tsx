'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Loader2, X, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Post = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
};

function CreatePostContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<Post>({
    title: '', slug: '', excerpt: '', content: '',
    publishedAt: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
    if (name === 'title') {
      setPost(prev => ({ 
        ...prev, 
        slug: value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-') 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...post, 
          userId: user?.id 
        }),
      });

      if (!response.ok) throw new Error('Failed to publish to the collective.');

      setMessage({ type: 'success', text: 'Reflection successfully published to the Sanctuary.' });
      
      // Redirect to the blog to see it live after 2 seconds
      setTimeout(() => {
        router.push('/blog');
      }, 2000);

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pt-16">
        <div className="flex justify-between items-center mb-16 px-4">
          <h1 className="text-4xl font-light text-white uppercase tracking-[0.2em]">New <span className="italic text-[var(--accent)]">Reflection</span></h1>
          <Link href="/writer/dashboard"><button className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/40 hover:text-white"><X className="w-5 h-5" /></button></Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 glass p-10 rounded-[40px] border border-white/5 bg-white/[0.01]">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Reflection Title</label>
            <input type="text" name="title" value={post.title} onChange={handleChange} required className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-[var(--accent)]/50 transition-all font-light" placeholder="e.g. The Architecture of Silence" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">URL Slug</label>
              <input type="text" name="slug" value={post.slug} onChange={handleChange} required className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Publish Date</label>
              <input type="date" name="publishedAt" value={post.publishedAt} onChange={handleChange} required className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-light" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Summary (Excerpt)</label>
            <textarea name="excerpt" value={post.excerpt} onChange={handleChange} required rows={3} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-light resize-none" placeholder="A brief whisper..." />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold ml-2">Wisdom (Content)</label>
            <textarea name="content" value={post.content} onChange={handleChange} required rows={12} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white font-light font-serif text-lg leading-relaxed" placeholder="Pour your wisdom here..." />
          </div>

          <button type="submit" disabled={loading} className="w-full p-5 rounded-2xl bg-[var(--accent)] text-white font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish to Collective'}
          </button>

          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center justify-center gap-3 p-4 rounded-2xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest">{message.text}</p>
            </motion.div>
          )}
        </form>
      </motion.div>
    </main>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Initializing Studio...</div>}>
      <ProtectedRoute>
        <CreatePostContent />
      </ProtectedRoute>
    </Suspense>
  );
}
