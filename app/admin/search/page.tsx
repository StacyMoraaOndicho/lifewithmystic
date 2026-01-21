'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SearchResult {
  title: string;
  slug: string;
  excerpt: string;
  _createdAt: string;
}

export default function AdvancedSearch() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Fetch categories from sample posts
    setCategories(['Meditation', 'Philosophy', 'Personal Growth', 'Consciousness']);
  }, []);

  const search = async () => {
    if (!query.trim() && !category) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, category }),
      });
      
      const data = await response.json();
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Advanced Search</h1>

      <div className="space-y-4 mb-8">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Search Posts</label>
          <input
            type="text"
            placeholder="Search by title, excerpt..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && search()}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Filter by Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={search}
          disabled={loading}
          className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.length > 0 && (
          <p className="text-sm opacity-70">Found {results.length} result(s)</p>
        )}
        
        {results.map((post, i) => (
          <motion.a
            key={i}
            href={`/blog/${post.slug}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="block p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
          >
            <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
            <p className="text-sm opacity-70 mb-2">{post.excerpt}</p>
            <p className="text-xs opacity-50">{new Date(post._createdAt).toLocaleDateString()}</p>
          </motion.a>
        ))}

        {loading && <p className="text-center opacity-70">Searching...</p>}
        {!loading && query && results.length === 0 && <p className="text-center opacity-70">No results found</p>}
      </div>
    </div>
  );
}
