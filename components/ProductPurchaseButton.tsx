'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

type Product = {
  id: string;
  title: string;
  type: string;
  price: string;
  link: string;
};

export default function ProductPurchaseButton({ 
  product, 
  writerStripeId 
}: { 
  product: Product; 
  writerStripeId: string 
}) {
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productTitle: product.title,
          productPrice: product.price,
          productLink: product.link,
          writerStripeId: writerStripeId,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initiate purchase. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handlePurchase}
      disabled={loading}
      className="p-3 bg-[var(--text)]/5 text-[var(--text)]/40 rounded-full group-hover:bg-[var(--accent)] group-hover:text-[var(--bg)] transition-all flex items-center justify-center disabled:opacity-50"
      title={`Purchase ${product.title}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4" />
      )}
    </motion.button>
  );
}
