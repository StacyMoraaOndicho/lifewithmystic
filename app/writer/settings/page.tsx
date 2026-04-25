'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Book, Plus, Trash2, CheckCircle2, Loader2, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';

type Product = {
  id: string;
  title: string;
  type: string;
  price: string;
  link: string;
};

function SettingsContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [sanityId, setSanityId] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ title: '', type: 'Ebook', price: '', link: '' });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchProducts();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, sanity_id')
        .eq('id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        setUsername(data.username || '');
        setBio(data.bio || '');
        setSanityId(data.sanity_id || '');
      }
    } catch (err: any) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('writer_id', user?.id);
    
    if (!error) setProducts(data || []);
  }

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id,
          username, 
          bio, 
          sanity_id: sanityId,
          email: user.email
        }, { onConflict: 'id' });
      
      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Save error:', err);
      alert(`Database Error: ${err.message || 'Could not save.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.link) {
      alert('Please fill in both the Title and the External Link.');
      return;
    }

    setAddingProduct(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          writer_id: user?.id,
          title: newProduct.title,
          type: newProduct.type,
          price: newProduct.price,
          link: newProduct.link
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setProducts([...products, data]);
        setNewProduct({ title: '', type: 'Ebook', price: '', link: '' });
      }
    } catch (err: any) {
      alert(`Product Error: ${err.message}`);
    } finally {
      setAddingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <p className="font-mono uppercase tracking-[0.5em] text-[10px] text-white animate-pulse">Syncing Profile...</p>
    </div>
  );

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto pt-16">
        <header className="mb-16 flex justify-between items-end px-4">
          <div>
            <Link href="/writer/dashboard" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 mb-4 transition-all group">
              <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Sanctuary
            </Link>
            <h1 className="text-5xl font-light tracking-tight mb-2 uppercase tracking-[0.2em]">Presence <span className="italic text-[var(--accent)] font-serif">Settings</span></h1>
          </div>
          <div className="flex gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-10 py-4 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:shadow-2xl transition-all shadow-xl disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Finalize Changes</>}
            </motion.button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-16">
          {/* Public Profile Section */}
          <section className="p-12 rounded-[40px] border border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-4 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-light uppercase tracking-widest">Architect Identity</h2>
            </div>
            
            <div className="space-y-12">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4 font-bold ml-2">Pseudonym / Name</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light text-xl"
                  placeholder="stacy"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-white/30 mb-1 font-bold ml-2">
                  Sanity Integration Key
                </label>
                <p className="text-[10px] text-white/20 mb-6 italic ml-2">Links your reflections to your profile.</p>
                <input 
                  type="text" 
                  value={sanityId}
                  onChange={(e) => setSanityId(e.target.value)}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 text-white/40 focus:outline-none focus:border-[var(--accent)]/50 transition-all font-mono text-xs"
                  placeholder="a7c8ddab-..."
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4 font-bold ml-2">Bio / Essence</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light h-56 resize-none leading-relaxed text-lg"
                  placeholder="angels are born, never made"
                />
              </div>
            </div>
          </section>

          {/* Digital Offerings Section */}
          <section className="p-12 rounded-[40px] border border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-400">
                <Book className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-light uppercase tracking-widest">Digital Offering Constellation</h2>
            </div>

            <div className="space-y-6 mb-12">
              {products.length === 0 ? (
                <p className="text-center py-20 text-white/20 uppercase tracking-[0.4em] text-[10px] italic border border-dashed border-white/10 rounded-[40px]">No offerings radiating in your sanctuary yet.</p>
              ) : products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-8 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-all">
                  <div>
                    <div className="text-[9px] text-[var(--accent)] uppercase font-bold tracking-widest mb-2">{product.type}</div>
                    <h3 className="text-xl font-light">{product.title}</h3>
                    <p className="text-sm text-white/30 font-mono mt-1">{product.price} • <span className="opacity-40">{product.link}</span></p>
                  </div>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-4 text-red-500/20 hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddProduct} className="p-12 rounded-[50px] border-2 border-dashed border-white/5 bg-white/[0.01] space-y-10">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 mb-4 text-center font-mono">Initiate New Offering</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/20 font-bold ml-2">Title</label>
                  <input type="text" placeholder="Reflection Guide" value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/20 font-bold ml-2">Type</label>
                  <select value={newProduct.type} onChange={(e) => setNewProduct({...newProduct, type: e.target.value})} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white/60 focus:outline-none appearance-none">
                    <option>Ebook</option><option>Course</option><option>Digital Art</option><option>Consultation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/20 font-bold ml-2">Valuation</label>
                  <input type="text" placeholder="$19" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-white/20 font-bold ml-2">Transmission Link</label>
                  <input type="url" placeholder="https://..." value={newProduct.link} onChange={(e) => setNewProduct({...newProduct, link: e.target.value})} className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none" />
                </div>
              </div>
              <button type="submit" disabled={addingProduct} className="w-full py-6 bg-white text-black rounded-[24px] text-[10px] uppercase tracking-[0.5em] font-bold hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {addingProduct ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Manifest Offering</>}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function WriterSettings() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-[0.5em] text-[10px]">Accessing Identity Records...</div>}>
      <ProtectedRoute>
        <SettingsContent />
      </ProtectedRoute>
    </Suspense>
  );
}
