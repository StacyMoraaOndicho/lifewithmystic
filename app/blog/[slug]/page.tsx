import sanityFetch from "../../../lib/sanity";
import { notFound } from "next/navigation";
import { PortableText } from '@portabletext/react';
import { ImmersiveToggle } from "@/app/components/ImmersiveToggle";
import { MarginReflections } from "@/app/components/MarginReflections";
import PostInteractions from "@/components/PostInteractions";
import Comments from "@/components/Comments";
import Link from "next/link";
import { User, Lock } from "lucide-react";

type PortableBlock = any;

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  body?: PortableBlock[];
  excerpt?: string;
  isPremium?: boolean;
  author?: {
    _id: string;
    name: string;
    bio?: string;
  };
};

// params is a Promise in Next.js 15+
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: Post | undefined;
  
  try {
    const res = await sanityFetch<Post[]>(`
      *[_type == "post" && slug.current == $slug] { 
        _id, 
        title, 
        slug, 
        publishedAt, 
        body, 
        excerpt,
        isPremium,
        "author": author->{ _id, name, bio }
      }`, { slug });
    post = res?.[0];
  } catch (err) {
    console.error(err);
  }

  if (!post) return notFound();

  // Mock subscription check - in production this uses Supabase auth
  const isSubscribed = false; 
  const isLocked = post.isPremium && !isSubscribed;

  return (
    <main className="min-h-screen p-12 bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--accent)]/30 transition-colors duration-500">
      <ImmersiveToggle />
      
      <article className="max-w-3xl mx-auto pt-20">
        <header className="mb-12">
          {post.isPremium && (
            <div className="flex items-center gap-2 text-[var(--accent)] text-[10px] uppercase tracking-[0.3em] font-bold mb-4">
              <Lock className="w-3 h-3" /> Premium Essay
            </div>
          )}
          <h1 className="text-5xl font-light mb-6 tracking-tight leading-tight glow">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 mb-8 text-xs uppercase tracking-[0.3em] font-mono text-[var(--text)]/40">
            {post.author && (
              <Link href={`/writer/${post.author._id}`} className="text-[var(--accent)] font-bold hover:underline">
                {post.author.name}
              </Link>
            )}
            <div className="h-3 w-px bg-[var(--text)]/10" />
            <span>
              {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </span>
          </div>
          {post.excerpt && (
            <p className="text-xl text-[var(--text)]/60 italic leading-relaxed border-l-2 border-[var(--accent)]/30 pl-6">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Portable Text rendering with Gating logic */}
        <section className={`prose prose-invert prose-lg max-w-none relative
          prose-headings:text-[var(--text)] prose-headings:font-light 
          prose-p:text-[var(--text)]/80 prose-p:leading-relaxed
          prose-strong:text-[var(--accent)] prose-a:text-[var(--accent)]
          prose-blockquote:border-[var(--accent)]/30 prose-blockquote:text-[var(--text)]/60 prose-blockquote:italic
          ${isLocked ? 'max-h-[200px] overflow-hidden' : ''}`}>
          
          {Array.isArray(post.body) && post.body.length > 0 ? (
            <div className={isLocked ? 'blur-md select-none pointer-events-none' : ''}>
              <PortableText value={post.body} />
            </div>
          ) : (
            <div className="p-8 border border-dashed border-[var(--text)]/10 rounded-2xl text-center text-[var(--text)]/20 uppercase tracking-widest text-xs font-mono">
              The ink is still wet...
            </div>
          )}

          {isLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-transparent pt-20">
              <div className="p-10 rounded-3xl border border-[var(--accent)]/30 bg-[var(--bg)]/90 backdrop-blur-xl text-center shadow-2xl max-w-md mx-auto">
                <Lock className="w-10 h-10 text-[var(--accent)] mx-auto mb-6" />
                <h3 className="text-2xl font-light mb-4">Deepen your Journey</h3>
                <p className="text-sm text-[var(--text)]/60 mb-8 italic">This sacred reflection is reserved for our community of writers and subscribers.</p>
                <Link href="/pricing" className="block w-full py-4 bg-[var(--accent)] text-[var(--bg)] rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-lg transition-all">
                  Unlock with Subscription
                </Link>
              </div>
            </div>
          )}
        </section>

        {!isLocked && (
          <>
            {/* Author Bio Section */}
            {post.author && (
              <section className="mt-20 p-10 rounded-3xl border border-[var(--text)]/10 bg-[var(--text)]/[0.02] flex items-start gap-8">
                <div className="w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-[var(--text)]/40 mb-2 font-mono">About the Writer</h4>
                  <h3 className="text-2xl font-light mb-4 text-[var(--text)]">{post.author.name}</h3>
                  <p className="text-sm text-[var(--text)]/60 italic mb-6 leading-relaxed">
                    {post.author.bio || "A contributor exploring the intersections of silence and wisdom."}
                  </p>
                  <Link href={`/writer/${post.author._id}`} className="text-xs uppercase tracking-widest text-[var(--accent)] font-bold hover:underline">
                    View Full Profile & Shop →
                  </Link>
                </div>
              </section>
            )}

            <PostInteractions 
              postId={post._id} 
              title={post.title} 
              url={`/blog/${post.slug.current}`} 
            />

            <Comments postId={post._id} />
          </>
        )}
      </article>

      <MarginReflections reflections={[]} />
    </main>
  );
}
