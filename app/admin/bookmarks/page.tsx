'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Bookmark {
  slug: string;
  title: string;
  excerpt: string;
  savedAt: string;
}

export default function MyBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      const parsed = JSON.parse(saved);
      const sorted = [...parsed].sort((a: Bookmark, b: Bookmark) => {
        if (sortBy === 'date') {
          return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        } else {
          return a.title.localeCompare(b.title);
        }
      });
      setBookmarks(sorted);
    }
  };

  const removeBookmark = (slug: string) => {
    const updated = bookmarks.filter((b) => b.slug !== slug);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  const exportBookmarks = () => {
    const csv = bookmarks.map((b) => `"${b.title}","${b.excerpt}",${b.slug}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${Date.now()}.csv`;
    a.click();
  };

  useEffect(() => {
    loadBookmarks();
  }, [sortBy]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Bookmarks</h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setSortBy('date')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'date' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => setSortBy('title')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'title' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            A-Z
          </button>
        </div>
        <button
          onClick={exportBookmarks}
          disabled={bookmarks.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          📥 Export CSV
        </button>
      </div>

      <div className="space-y-4">
        {bookmarks.length === 0 ? (
          <p className="text-center opacity-70 py-12">No bookmarks yet. Start bookmarking posts!</p>
        ) : (
          bookmarks.map((bookmark, i) => (
            <motion.div
              key={bookmark.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <Link href={`/blog/${bookmark.slug}`}>
                    <h3 className="font-semibold text-lg hover:text-blue-400 mb-2 cursor-pointer">
                      {bookmark.title}
                    </h3>
                  </Link>
                  <p className="text-sm opacity-70 mb-2">{bookmark.excerpt}</p>
                  <p className="text-xs opacity-50">
                    Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => removeBookmark(bookmark.slug)}
                  className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {bookmarks.length > 0 && (
        <p className="text-sm opacity-70 mt-8 text-center">
          Total bookmarks: {bookmarks.length}
        </p>
      )}
    </div>
  );
}
