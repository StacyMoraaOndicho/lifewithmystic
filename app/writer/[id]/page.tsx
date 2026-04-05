'use client';

import { useState, useEffect, use } from 'react';
import sanityFetch, { urlFor } from "@/lib/sanity";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PenTool, BookOpen, User } from "lucide-react";
import ProductPurchaseButton from "@/components/ProductPurchaseButton";
import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  title: string;
  type: string;
  price: string;
  link: string;
};

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  excerpt?: string;
};

type Author = {
  _id: string;
  name: string;
  bio?: string;
  image?: any;
  stripeConnectId?: string;
};

export default function WriterProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const sanityId = resolvedParams.id;
  
  const [data, setData] = useState<{ author: Author; posts: Post[]; products: Product[]; profileLinked: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch Author from Sanity
      const author = await sanityFetch<Author>(`
        *[_type == "author" && _id == $id][0] {
          _id, name, bio, image, stripeConnectId
        }
      `, { id: sanityId });

      if (!author) {
        setLoading(false);
        return;
      }

      // 2. Fetch Posts from Sanity
      const posts = await sanityFetch<Post[]>(`
        *[_type == "post" && author._ref == $id] | order(publishedAt desc) {
          _id, title, slug, publishedAt, excerpt
        }
      `, { id: sanityId });

      // 3. Find Supabase profile linked to this Sanity ID to get real products
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('sanity_id', sanityId)
        .maybeSingle();

      let products: Product[] = [];
      let profileLinked = false;

      if (profile) {
        profileLinked = true;
        const { data: dbProducts } = await supabase
          .from('products')
          .select('*')
          .eq('writer_id', profile.id);
        
        if (dbProducts && dbProducts.length > 0) {
          products = dbProducts;
        }
      }

      setData({ author, posts, products, profileLinked });
      setLoading(false);
    }
    fetchData();
  }, [sanityId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <p className="font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">Entering Sanctuary</p>
    </div>
  );
  
  if (!data?.author) return notFound();

  const { author, posts, products, profileLinked } = data;

  return (
    <main className="min-h-screen p-12 bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      <div className="max-w-6xl mx-auto pt-20">
        <header className="mb-20 text-center">
          
          <div className="relative w-32 h-32 mx-auto mb-10 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: 360,
                boxShadow: ["0 0 10px rgba(255,255,255,0.3)", "0 0 25px rgba(255,255,255,0.7)", "0 0 10px rgba(255,255,255,0.3)"]
              }}
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              className="absolute inset-0 rounded-full border-2 border-white/40 z-0"
            />
            <div className="w-full h-full rounded-full bg-[var(--bg)] flex items-center justify-center overflow-hidden relative z-10 shadow-2xl">
              {author.image ? (
                <img src={urlFor(author.image).width(400).height(400).url()} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 opacity-20" />
              )}
            </div>
          </div>

          <h1 className="text-5xl font-light mb-4 tracking-tight tracking-[0.1em]">{author.name}</h1>
          <p className="text-[var(--text)]/60 max-w-2xl mx-auto italic leading-relaxed font-light">
            {author.bio || "Seeker of the sacred mystery."}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-xl font-light mb-8 uppercase tracking-[0.4em] flex items-center gap-3 opacity-80">
                <PenTool className="w-4 h-4" />
                Essays & Reflections
              </h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug.current}`} className="block group">
                    <div className="p-8 rounded-3xl border border-[var(--text)]/5 bg-[var(--text)]/[0.02] group-hover:bg-[var(--text)]/[0.04] transition-all shadow-lg">
                      <h3 className="text-2xl font-light mb-2 group-hover:text-[var(--accent)] transition-colors">{post.title}</h3>
                      <p className="text-[10px] text-[var(--text)]/40 mb-4 font-mono uppercase tracking-widest">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Sacred Thought'}</p>
                      <p className="text-sm text-[var(--text)]/60 line-clamp-2 italic font-light">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-12">
            <section>
              <h2 className="text-xl font-light mb-8 uppercase tracking-[0.4em] flex items-center gap-3 opacity-80">
                <BookOpen className="w-4 h-4" />
                Curated Shop
              </h2>
              <div className="space-y-4">
                {products.length > 0 ? products.map((product) => (
                  <div key={product.id} className="p-6 rounded-2xl border border-[var(--text)]/10 bg-[var(--text)]/[0.02] flex items-center justify-between group hover:bg-[var(--text)]/[0.03] transition-all">
                    <div>
                      <div className="text-[9px] text-[var(--accent)] uppercase font-bold tracking-[0.2em] mb-1">{product.type}</div>
                      <h3 className="text-sm font-light mb-1">{product.title}</h3>
                      <div className="text-lg font-light text-[var(--text)]/60">{product.price}</div>
                    </div>
                    <ProductPurchaseButton product={product} writerStripeId={author.stripeConnectId || 'acct_demo'} />
                  </div>
                )) : (
                  <div className="p-10 border border-dashed border-[var(--text)]/10 rounded-3xl text-center">
                    <p className="text-xs text-[var(--text)]/40 italic">Offerings coming soon...</p>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
