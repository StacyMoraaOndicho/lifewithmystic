Sanity integration (scaffold)
=============================

What I added
- `lib/sanity.ts` — lightweight GROQ HTTP helper (uses `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`).
- `app/blog/page.tsx` — server-rendered blog index (queries `post` docs).
- `app/blog/[slug]/page.tsx` — server-rendered post page with minimal Portable Text rendering.

Next steps for you
1. Create a Sanity project and dataset (see https://www.sanity.io/docs).
2. Add a `post` schema in your Sanity Studio with fields: `title`, `slug`, `publishedAt`, `excerpt`, `body` (Portable Text).
3. Set environment variables in your `.env.local`:

NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectId
NEXT_PUBLIC_SANITY_DATASET=production

4. Restart the dev server: `npm run dev`.
5. (Optional) For full Portable Text rendering install `@portabletext/react` and replace the minimal renderer in `app/blog/[slug]/page.tsx`.

Notes
- The helper uses the public Sanity HTTP API. For private datasets or server-side write operations, use the official Sanity client with proper credentials.
- You can run `npm run prepare:sanity` for a reminder on initializing Sanity locally.
