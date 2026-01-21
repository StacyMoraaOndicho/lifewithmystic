import React from "react";

export const dynamic = 'force-dynamic';

export default async function ReflectionsPage() {
  let reflections: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000'}/api/reflections`);
    if (res.ok) reflections = await res.json();
  } catch (err) {
    // Supabase not configured
  }

  return (
    <main className="min-h-screen p-12 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-4">Reflections</h1>
      {reflections.length === 0 ? (
        <p className="mb-4">No reflections yet. Configure Supabase and add reflections on the blog posts to see them listed here.</p>
      ) : (
        <ul className="space-y-4">
          {reflections.map((r: any, i: number) => (
            <li key={i} className="p-4 border rounded">
              <p className="text-sm opacity-70">{r.user} on post {r.postId}:</p>
              <p className="mt-2">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
