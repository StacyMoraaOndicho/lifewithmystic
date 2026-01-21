# Quick Reference: Adding Posts

## TL;DR - 5 Steps to Publish

```
1. Go to http://localhost:3001/admin
2. Click "Create New Post"
3. Fill the form:
   - Title: "Your Essay Title"
   - Slug: auto-generates (customize if needed)
   - Excerpt: 1-2 sentence summary
   - Content: Full essay text
   - Date: When to publish
4. Click "Publish Post"
5. ✨ You're done! Read your post at /blog/your-slug
```

---

## Environment Setup (Do This Once)

1. Get Sanity API token:
   - https://sanity.io/manage > Your Project > Settings > API > Tokens
   - Create new token (give it read + write permissions)

2. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_token_here
   ```

3. Restart dev server: `npm run dev`

---

## Where to Add Posts

| Method | URL | Best For |
|--------|-----|----------|
| **Quick Form** | `/admin/create` | Fast publishing |
| **Sanity Studio** | https://sanity.io/manage | Rich content, media |
| **This Guide** | — | Reference |

---

## Post Fields Explained

| Field | What To Put | Notes |
|-------|-----------|-------|
| **Title** | Post headline | Appears in listings & page title |
| **Slug** | URL path | Auto-generated from title, must be unique |
| **Excerpt** | 1-2 sentence summary | Shows in blog listing & homepage |
| **Content** | Full essay text | Plain text or formatted content |
| **Date** | Publication date | Controls sort order in listings |

---

## Slug Examples

```
Title: "The Art of Silence"
→ Slug: the-art-of-silence
→ URL: /blog/the-art-of-silence

Title: "Digital Minimalism 2025"
→ Slug: digital-minimalism-2025
→ URL: /blog/digital-minimalism-2025

Title: "Why We Need Sacred Spaces"
→ Slug: why-we-need-sacred-spaces
→ URL: /blog/why-we-need-sacred-spaces
```

---

## What Happens After Publishing

✅ Post appears on `/blog` (blog index)
✅ Shows in recent posts on homepage (if top 3 recent)
✅ Listed in `/archive` timeline
✅ Searchable via Oracle search
✅ Direct link: `/blog/your-slug`
✅ Date appears everywhere automatically

---

## Common Tasks

### Create a new post
→ Go to `/admin/create` or `/admin`

### View all posts
→ Visit `/blog` or `/admin` (see list)

### Edit existing post
→ Via Sanity Studio (https://sanity.io/manage)

### See draft of post
→ Visit `/blog/your-slug` before publishing

### Delete a post
→ Go to Sanity Studio, find post, delete

### Change publish date
→ Via Sanity Studio (editing)

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Submit form | `Ctrl/Cmd + Enter` |
| Focus title field | `Ctrl/Cmd + 1` |
| Focus content field | `Ctrl/Cmd + 5` |

---

## Tips & Tricks

💡 **Slug Strategy**: Use descriptive slugs (`the-sacred-within` not `post-42`)

💡 **Dates**: Publish backdated posts to build archive instantly

💡 **Excerpts**: Make them compelling—this is what readers see first

💡 **Content**: Write as you think. Edit after. Authenticity matters.

💡 **Frequency**: Consistency beats quantity. 1 post/month > 0 posts/year

---

## Help & Troubleshooting

**Can't create post?** → Check `SANITY_API_TOKEN` in `.env.local`

**Token invalid?** → Regenerate at Sanity dashboard, update `.env.local`

**Project ID wrong?** → Copy from Sanity dashboard under project name

**Slug already exists?** → Each post needs unique slug; try `post-v2`

**Date not showing?** → Verify format: `YYYY-MM-DD`

**Post not appearing?** → Wait 2-3 seconds (caching), then refresh

---

## Full Documentation

→ See `HOW_TO_ADD_POSTS.md` for complete guide

---

**You're all set! Go write something beautiful. ✨**
