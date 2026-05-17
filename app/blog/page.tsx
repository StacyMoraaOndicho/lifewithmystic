'use client';

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Calendar } from "lucide-react";

type PostPreview = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt: string;
  profiles?: any;
};

export default function BlogPage() {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id, title, slug, published_at, excerpt,
          profiles ( username )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getRelativeTime = (date?: string) => {
    if (!date) return '';
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now.getTime() - postDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto pt-24">
        <header className="mb-20 px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-light tracking-tight uppercase mb-4"
          >
            Essays
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] w-24 bg-gradient-to-r from-amber-400 to-rose-400 mb-8"
          />
          <p className="text-white/40 italic text-lg leading-relaxed max-w-xl">A sanctuary for shared wisdom and silent reflections.</p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            <p className="font-mono text-[10px] uppercase tracking-widest opacity-20">Synchronizing...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, idx) => {
              const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
              
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group p-8 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[var(--accent)]/30 transition-all duration-500 shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-light mb-3 group-hover:text-[var(--accent)] transition-colors uppercase tracking-tight">
                            {post.title}
                          </h2>
                          <p className="text-white/50 leading-relaxed italic font-light line-clamp-2 mb-4">
                            {post.excerpt || 'Click to read this reflection...'}
                          </p>
                          <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest font-bold">
                            <span className="text-[var(--accent)]">
                              {formatDate(post.published_at)}
                            </span>
                            <span className="opacity-30">
                              {getRelativeTime(post.published_at)}
                            </span>
                            <span className="text-[var(--accent)]/60">
                              By {author?.username || 'Architect'}
                            </span>
                          </div>
                        </div>
                        <div className="text-xl opacity-0 group-hover:opacity-100 transition-opacity text-[var(--accent)]">→</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
