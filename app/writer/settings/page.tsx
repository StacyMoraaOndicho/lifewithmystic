'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Book, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/ProtectedRoute';

type Product = {
  id: string;
  title: string;
  type: string;
  price: string;
  link: string;
};

export default function WriterSettings() {
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
      alert(`Database Error: ${err.message || 'Could not save. Check your Supabase SQL policies.'}`);
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <p className="font-mono uppercase tracking-[0.5em] text-[10px] animate-pulse">Opening your records...</p>
    </div>
  );

  return (
    <ProtectedRoute>
      <main className="min-h-screen p-6 md:p-12 bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
        <div className="max-w-4xl mx-auto pt-16">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-light tracking-tight mb-2 uppercase tracking-[0.2em]">Writer <span className="italic text-[var(--accent)] font-serif">Settings</span></h1>
              <p className="text-[var(--text)]/40 uppercase tracking-[0.3em] text-[10px] font-mono font-bold">Curate your public presence</p>
            </div>
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-8 py-3 bg-[var(--accent)] text-[var(--bg)] rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:shadow-2xl transition-all shadow-xl disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : success ? <><CheckCircle2 className="w-3 h-3" /> Saved</> : <><Save className="w-3 h-3" /> Save Changes</>}
              </motion.button>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-12">
            {/* Public Profile Section */}
            <section className="p-10 rounded-[40px] border border-[var(--text)]/10 bg-[var(--text)]/[0.02]">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-light uppercase tracking-widest">Public Profile</h2>
              </div>
              
              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--text)]/40 mb-3 font-mono font-bold">Display Name</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-5 rounded-2xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light text-lg"
                    placeholder="stacy"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--text)]/40 mb-1 font-mono font-bold flex items-center gap-2">
                    Sanity Author ID
                  </label>
                  <p className="text-[9px] text-[var(--text)]/30 mb-4 italic">Crucial: Paste your ID from Sanity Studio here to link your products.</p>
                  <input 
                    type="text" 
                    value={sanityId}
                    onChange={(e) => setSanityId(e.target.value)}
                    className="w-full p-5 rounded-2xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all font-mono text-sm opacity-70"
                    placeholder="a7c8ddab-de11..."
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--text)]/40 mb-3 font-mono font-bold">Bio / Philosophy</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-5 rounded-2xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-[var(--text)] focus:outline-none focus:border-[var(--accent)]/50 transition-all font-light h-48 resize-none leading-relaxed"
                    placeholder="angels are born, never made"
                  />
                </div>
              </div>
            </section>

            {/* Digital Offerings Section */}
            <section className="p-10 rounded-[40px] border border-[var(--text)]/10 bg-[var(--text)]/[0.02]">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                  <Book className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-light uppercase tracking-widest">Digital Offerings</h2>
              </div>

              <div className="space-y-4 mb-10">
                {products.length === 0 ? (
                  <p className="text-center py-12 text-[var(--text)]/20 uppercase tracking-widest text-[10px] italic border border-dashed border-[var(--text)]/10 rounded-3xl">No offerings in your sanctuary yet.</p>
                ) : products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-6 rounded-3xl border border-[var(--text)]/5 bg-[var(--text)]/[0.01] hover:bg-[var(--text)]/[0.03] transition-all group">
                    <div>
                      <div className="text-[9px] text-[var(--accent)] uppercase font-bold tracking-widest mb-1">{product.type}</div>
                      <h3 className="text-base font-light">{product.title}</h3>
                      <p className="text-xs text-[var(--text)]/40">{product.price} • <span className="opacity-50 truncate max-w-[200px] inline-block">{product.link}</span></p>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-3 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddProduct} className="p-10 rounded-[40px] border-2 border-dashed border-[var(--text)]/10 bg-[var(--text)]/[0.01] space-y-8">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text)]/40 mb-2 font-mono">Add New Offering</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input 
                    type="text" 
                    placeholder="Title (e.g. The Angel's Diary)"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                    className="w-full p-4 rounded-xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-sm focus:outline-none focus:border-[var(--accent)]/50"
                  />
                  <select 
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                    className="w-full p-4 rounded-xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-sm focus:outline-none text-[var(--text)]/60"
                  >
                    <option>Ebook</option>
                    <option>Course</option>
                    <option>Digital Art</option>
                    <option>Consultation</option>
                  </select>
                  <input 
                    type="text" 
                    placeholder="Price (e.g. $19)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full p-4 rounded-xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-sm focus:outline-none"
                  />
                  <input 
                    type="url" 
                    placeholder="External Link (Amazon, Gumroad, etc)"
                    value={newProduct.link}
                    onChange={(e) => setNewProduct({...newProduct, link: e.target.value})}
                    className="w-full p-4 rounded-xl bg-[var(--text)]/5 border border-[var(--text)]/10 text-sm focus:outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={addingProduct}
                  className="w-full py-5 bg-[var(--accent)] text-[var(--bg)] rounded-3xl text-[10px] uppercase tracking-[0.3em] font-bold hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {addingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add to My Sanctuary</>}
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
