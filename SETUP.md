# lifewithmystic — Sacred Digital Space Setup Guide

A philosophical, immersive blogging platform with dual themes, reflections, search, and knowledge graphs.

## Architecture

- **Frontend**: Next.js 16+ with TypeScript and Tailwind CSS.
- **Styling**: Dual themes (Zen Minimalism, Dark Academia) via CSS variables and `next-themes`.
- **Sensory Layer**: Particle background (Canvas) + Framer Motion page transitions + breathing animations.
- **CMS**: Sanity.io for essays (`post` schema with Portable Text).
- **Database**: Supabase for reflections (user highlights + comments).
- **Search**: Oracle search UI querying Sanity via `/api/search`.
- **Content Rendering**: `@portabletext/react` for full Portable Text support.

## Quick Start

```bash
cd c:\Users\Dell\Documents\lifewithmystic
npm run dev
```

Visit `http://localhost:3000` to preview.

## Environment Variables

Create `.env.local` and fill in:

```
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production

# Supabase (for reflections)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Pages

- `/` — Homepage with animated title and theme toggle.
- `/blog` — Blog index (lists Sanity posts).
- `/blog/[slug]` — Blog post with reflections + Portable Text rendering.
- `/about` — About page (placeholder).
- `/manifesto` — Manifesto (add your 500-word introduction).
- `/archive` — Archive listing all posts.
- `/reflections` — Reflections list (Supabase-powered when configured).
- `/audio` — Audio player for ambient tracks.
- `/knowledge-graph` — Visual knowledge graph (nodes + sample data).
- `/contact` — Contact page.

## Setting Up Sanity

1. Go to [sanity.io](https://sanity.io).
2. Create a project and dataset.
3. Copy the example schemas from `studio/schemas/` into your Sanity Studio.
4. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`.
5. Add `post` documents (with `title`, `slug`, `body` (Portable Text), `excerpt`, `publishedAt`).
6. Restart the dev server: `npm run dev`.

## Setting Up Supabase (Reflections)

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Create a `reflections` table with columns:
   - `id` (uuid, primary key)
   - `postId` (text)
   - `paragraphIndex` (int)
   - `user` (text)
   - `text` (text)
   - `created_at` (timestamp)
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
4. Users can add reflections on blog posts via the `+` button beside paragraphs.
5. Reflections are fetched and displayed on `/reflections` and on individual blog posts.

## Features

- **Dual Themes**: Toggle between Zen (light) and Dark Academia (textures).
- **Animated Particles**: Background canvas with subtle movement.
- **Sensory Animations**: Page transitions, breathing title, typewriter effects.
- **Oracle Search**: "What truth do you seek?" — fuzzy search with staggered result animations.
- **Reflections**: Click `+` on any paragraph to add a reflection (Supabase-backed).
- **Knowledge Graph**: Visual map of essays as interconnected nodes.
- **Audio Player**: Play ambient tracks (Monastery Rain, Deep Forest Silence, Tibetan Singing Bowls).
- **Portable Text**: Full rich-text rendering via `@portabletext/react`.
- **Responsive**: Mobile-friendly layouts and touch support.

## Hydration Warning (Dev Overlay)

If you see a "tree hydrated" warning on the dev overlay, it's a known React hydration mismatch (usually theme-related).
- The layout now has `suppressHydrationWarning` to suppress the warning safely.
- Hard reload the page (Ctrl+F5) and disable any browser extensions that modify the DOM.

## Sample Data

When Sanity is not configured, the blog shows two sample posts (fallback):
- "Silence as Mirror"
- "The Divine Within"

Once you connect Sanity, it will replace this data with your live content.

## Next Steps

1. **Customize Design**: Edit `app/globals.css` to adjust colors, fonts, and animations.
2. **Add Manifesto**: Replace placeholder in `app/manifesto/page.tsx` with your 500-word introduction.
3. **Upload Audio**: Add ambient tracks to `public/audio/` and reference them in `AudioPlayer` or the Audio page.
4. **Configure Analytics**: Add Google Analytics or Vercel Analytics.
5. **Deploy**: Push to Vercel (automatic deployments from GitHub) or your hosting provider.
6. **Custom Domain**: Configure `lifewithmystic.com` via your domain registrar.

## Troubleshooting

- **Blog shows "No posts found"**: Configure Sanity env vars and add content.
- **Reflections API 500 error**: Check Supabase credentials and ensure the `reflections` table exists.
- **Search returns nothing**: Verify Sanity is configured and posts have titles/excerpts matching the search term.
- **Particle background doesn't animate**: Check browser console for JavaScript errors; ensure Chromium-based browser.

## File Structure

```
app/
  layout.tsx              # Root layout with Nav and ThemeProvider
  page.tsx                # Homepage
  blog/
    page.tsx              # Blog index
    [slug]/page.tsx       # Blog post with reflections
  about|manifesto|archive|reflections|audio|contact|knowledge-graph/
    page.tsx              # Page routes
  api/
    search/route.ts       # Oracle search endpoint
    reflections/route.ts  # Reflections API
components/
  Nav.tsx                 # Site navigation
  ThemeEngine.tsx         # Theme toggle (Zen/Academia)
  ClientThemeProvider.tsx # Client-only theme wrapper
  SensoryMount.tsx        # Particles + motion container
  Particles.tsx           # Animated background
  MotionContainer.tsx     # Page transition wrapper
  Typewriter.tsx          # Animated typewriter
  AudioPlayer.tsx         # Audio playback
  Oracle.tsx              # Search UI
  ParagraphReflection.tsx # Reflection input per paragraph
  KnowledgeGraphViz.tsx   # Visual graph nodes
lib/
  sanity.ts               # Sanity fetch helper
  supabase.ts             # Supabase helper
studio/
  schemas/post.ts         # Sanity post schema
  schemas/author.ts       # Sanity author schema
  schema.js               # Schema entry
  README.md               # Studio setup
```

## Contact & Support

For questions or feedback, reach out at contact@lifewithmystic.example (update with your email).

---

**Made with care for thoughtful, contemplative discourse.**
