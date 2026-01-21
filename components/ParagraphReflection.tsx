"use client";
import { useState } from "react";

export default function ParagraphReflection({
  postId,
  index,
  children,
}: Readonly<{ postId: string; index: number; children: React.ReactNode }>) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<'idle'|'saving'|'done'|'error'>('idle');

  async function save() {
    setStatus('saving');
    try {
      const res = await fetch('/api/reflections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, paragraphIndex: index, user: 'anonymous', text }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || 'save failed');
      setStatus('done');
      setTimeout(() => { setOpen(false); setText(''); setStatus('idle'); }, 900);
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <div className="relative group">
      <div className="inline-block">{children}</div>
      <button
        className="opacity-0 group-hover:opacity-100 transition absolute -right-8 top-0 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center"
        onClick={() => setOpen(true)}
        aria-label="Add reflection"
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white text-black rounded p-6 w-[min(700px,90%)]">
            <h3 className="text-lg mb-2">Add Reflection</h3>
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-32 p-2 border" />
            <div className="mt-3 flex gap-2 justify-end">
              <button className="px-3 py-1" onClick={() => setOpen(false)}>Cancel</button>
              <button className="px-3 py-1 bg-blue-600 text-white" onClick={save} disabled={status==='saving'}>
                {status==='saving' ? 'Saving...' : 'Save'}
              </button>
            </div>
            {status==='error' && <p className="text-red-600 mt-2">Failed saving.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
