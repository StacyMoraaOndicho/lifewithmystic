import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { ImmersiveToggle } from "@/app/components/ImmersiveToggle";
import { MarginReflections } from "@/app/components/MarginReflections";
import PostInteractions from "@/components/PostInteractions";
import Comments from "@/components/Comments";
import Link from "next/link";
import { User, Calendar, ArrowLeft } from "lucide-react";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const { data: postData, error } = await supabase
    .from('posts')
    .select(`
      id, title, slug, published_at, content, excerpt,
      profiles ( id, username, bio )
    `)
    .eq('slug', slug)
    .maybeSingle();

  if (!postData || error) return notFound();

  // FIX: Supabase joins return an array in TS. Extract the first item safely.
  const profiles = postData.profiles as any;
  const author = Array.isArray(profiles) ? profiles[0] : profiles;

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
            {postData.title}
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
              {new Date(postData.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {postData.excerpt && (
            <p className="text-2xl text-white/40 italic leading-relaxed border-l border-[var(--accent)]/30 pl-8 font-light">
              {postData.excerpt}
            </p>
          )}
        </header>

        <section className="prose prose-invert prose-lg max-w-none font-light leading-loose text-white/80 font-serif">
          {renderContent(postData.content)}
        </section>

        <section className="mt-24 pt-12 border-t border-white/5">
          <PostInteractions 
            postId={postData.id} 
            title={postData.title} 
            url={`/blog/${postData.slug}`} 
          />
          <Comments postId={postData.id} />
        </section>
      </article>

      <MarginReflections reflections={[]} />
    </main>
  );
}
