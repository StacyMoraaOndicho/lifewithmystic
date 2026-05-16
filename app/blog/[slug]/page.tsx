import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ImmersiveToggle } from "@/app/components/ImmersiveToggle";
import { MarginReflections } from "@/app/components/MarginReflections";
import PostInteractions from "@/components/PostInteractions";
import Comments from "@/components/Comments";
import Link from "next/link";
import { User, Calendar, ArrowLeft } from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  content: string;
  excerpt?: string;
  profiles?: any; // Using any here to handle Supabase's complex join types safely
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id, title, slug, published_at, content, excerpt,
      profiles ( id, username, bio )
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (!data || error) return notFound();
  
  const post = data as Post;
  
  // Handle Supabase returning join as array or single object
  const author = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;

  const renderContent = (text: string) => {
    return text.split('\n').map((para, i) => (
      <p key={i} className="mb-6">{para}</p>
    ));
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-[#0a0a0a] text-white selection:bg-[var(--accent)]/30 transition-colors duration-500">
      <ImmersiveToggle />
      
      <article className="max-w-3xl mx-auto pt-24">
        <Link href="/blog" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/20 hover:text-white mb-12 transition-all">
          <ArrowLeft className="w-3 h-3" /> Back to Collective
        </Link>

        <header className="mb-16">
          <h1 className="text-6xl font-light mb-8 tracking-tight leading-tight uppercase">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-8 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)]">
                {author?.username || 'Architect'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/20 font-bold">
              <Calendar className="w-3 h-3" /> 
              {new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {post.excerpt && (
            <p className="text-2xl text-white/40 italic leading-relaxed border-l border-[var(--accent)]/30 pl-8 font-light">
              {post.excerpt}
            </p>
          )}
        </header>

        <section className="prose prose-invert prose-lg max-w-none font-light leading-loose text-white/80 font-serif">
          {renderContent(post.content)}
        </section>

        <section className="mt-24 pt-12 border-t border-white/5">
          <PostInteractions 
            postId={post.id} 
            title={post.title} 
            url={`/blog/${post.slug}`} 
          />
          <Comments postId={post.id} />
        </section>
      </article>

      <MarginReflections reflections={[]} />
    </main>
  );
}
