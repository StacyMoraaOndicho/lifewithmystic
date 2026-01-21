'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DigestSettings {
  enabled: boolean;
  day: string;
  time: string;
  categories: string[];
  lastSent?: string;
}

export default function EmailDigestPage() {
  const [settings, setSettings] = useState<DigestSettings>({
    enabled: false,
    day: 'Monday',
    time: '09:00',
    categories: ['Philosophy', 'Meditation', 'Mindfulness'],
  });
  const [subscribers, setSubscribers] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('digestSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    const subs = localStorage.getItem('emailSubscribers');
    if (subs) {
      setSubscribers(JSON.parse(subs));
    }
  }, []);

  const saveSettings = async () => {
    setLoading(true);
    localStorage.setItem('digestSettings', JSON.stringify(settings));
    setMessage('Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
    setLoading(false);
  };

  const addSubscriber = () => {
    if (!newEmail || subscribers.includes(newEmail)) {
      setMessage('Invalid or duplicate email');
      return;
    }

    const updated = [...subscribers, newEmail];
    setSubscribers(updated);
    localStorage.setItem('emailSubscribers', JSON.stringify(updated));
    setNewEmail('');
    setMessage('Subscriber added!');
    setTimeout(() => setMessage(''), 2000);
  };

  const removeSubscriber = (email: string) => {
    const updated = subscribers.filter((s) => s !== email);
    setSubscribers(updated);
    localStorage.setItem('emailSubscribers', JSON.stringify(updated));
  };

  const sendTestEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          settings,
          testEmail: subscribers[0] || 'test@example.com',
        }),
      });

      if (response.ok) {
        setMessage('Test email sent!');
      } else {
        setMessage('Failed to send test email');
      }
    } catch (error) {
      setMessage('Error sending email');
    }
    setTimeout(() => setMessage(''), 3000);
    setLoading(false);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6 min-h-screen"
    >
      <h1 className="text-3xl font-bold mb-2">📧 Weekly Email Digest</h1>
      <p className="text-opacity-60 mb-8">
        Manage automated weekly summaries of your blog posts
      </p>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 p-3 rounded bg-green-500/20 text-green-300 text-sm"
        >
          {message}
        </motion.div>
      )}

      {/* Digest Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-opacity-5 bg-blue-500 rounded-lg p-6 mb-6 border border-blue-500/20"
      >
        <h2 className="text-xl font-bold mb-4">Digest Settings</h2>

        <div className="space-y-4">
          {/* Enable toggle */}
          <div className="flex items-center justify-between">
            <label className="font-semibold">Enable Digest</label>
            <button
              onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
              className={`px-4 py-2 rounded transition-colors ${
                settings.enabled
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}
            >
              {settings.enabled ? '✓ Enabled' : '✗ Disabled'}
            </button>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Send Day</label>
              <select
                value={settings.day}
                onChange={(e) => setSettings({ ...settings, day: e.target.value })}
                className="w-full px-3 py-2 rounded bg-opacity-10 bg-white border border-opacity-20 border-white"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Send Time (UTC)</label>
              <input
                type="time"
                value={settings.time}
                onChange={(e) => setSettings({ ...settings, time: e.target.value })}
                className="w-full px-3 py-2 rounded bg-opacity-10 bg-white border border-opacity-20 border-white"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold mb-2">Include Categories</label>
            <div className="flex flex-wrap gap-2">
              {['Philosophy', 'Meditation', 'Mindfulness', 'Personal Growth', 'Spirituality'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      const updated = settings.categories.includes(cat)
                        ? settings.categories.filter((c) => c !== cat)
                        : [...settings.categories, cat];
                      setSettings({ ...settings, categories: updated });
                    }}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      settings.categories.includes(cat)
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-opacity-10 bg-white text-opacity-60'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={saveSettings}
            disabled={loading}
            className="w-full mt-4 px-4 py-2 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </motion.button>
        </div>
      </motion.div>

      {/* Subscribers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-opacity-5 bg-green-500 rounded-lg p-6 border border-green-500/20"
      >
        <h2 className="text-xl font-bold mb-4">
          Email Subscribers ({subscribers.length})
        </h2>

        {/* Add subscriber */}
        <div className="flex gap-2 mb-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter email address..."
            className="flex-1 px-3 py-2 rounded bg-opacity-10 bg-white border border-opacity-20 border-white"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={addSubscriber}
            className="px-4 py-2 rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
          >
            Add
          </motion.button>
        </div>

        {/* Subscribers list */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {subscribers.length === 0 ? (
            <p className="text-opacity-40 text-sm">No subscribers yet</p>
          ) : (
            subscribers.map((email) => (
              <motion.div
                key={email}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center p-2 rounded bg-opacity-5 bg-white"
              >
                <span className="text-sm">{email}</span>
                <button
                  onClick={() => removeSubscriber(email)}
                  className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Remove
                </button>
              </motion.div>
            ))
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={sendTestEmail}
          disabled={loading || subscribers.length === 0}
          className="w-full mt-4 px-4 py-2 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : '📨 Send Test Email'}
        </motion.button>
      </motion.div>
    </motion.main>
  );
}
