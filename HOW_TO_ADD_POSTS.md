# How to Add Posts & Manage Your Blog

## Quick Start: Two Ways to Add Posts

### Option 1: Simple Form (Recommended for Quick Posts) ⚡

Visit **`http://localhost:3001/admin/create`** and you'll see a beautiful form with:
- Title input
- Auto-generated slug
- Excerpt (2-sentence summary)
- Full content area
- Publication date selector
- One-click publish button

**Steps:**
1. Go to http://localhost:3001/admin
2. Click "Create New Post"
3. Fill in the form
4. Click "Publish Post"
5. You'll be taken directly to your new essay!

**What happens:**
- Post is instantly created in Sanity
- Appears on blog index with date
- Shows in recent posts on homepage
- Included in archive timeline

### Option 2: Advanced CMS (Full Features) 🎛️

Visit **Sanity Studio** at https://sanity.io/manage

**Features:**
- Upload featured images
- Rich text editing (formatting, links, etc.)
- Manage multiple authors
- Draft/publish workflows
- SEO optimization

---

## Setting Up Sanity for Posts

### Required Environment Variable

Add this to your `.env.local`:

```bash
SANITY_API_TOKEN=your_token_here
```

**To get your token:**

1. Go to [https://sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to **Settings > API > Tokens**
4. Create a new token with these permissions:
   - `Read` ✓
   - `Write` ✓
   - `Assets read` ✓
   - `Assets write` ✓
5. Copy the token and paste into `.env.local`

### If You Don't Have a Sanity Project Yet

1. Go to [https://sanity.io](https://sanity.io)
2. Create a free account
3. Create a new project
4. Choose the "Blog" template
5. Set dataset to `production`
6. Get your Project ID and add to `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
```

---

## Post Structure

When you create a post (either via form or Sanity), it needs:

```
Title: "The Art of Silence"
Slug: "the-art-of-silence"
Excerpt: "Exploring how quiet moments reshape our understanding of self."
Content: "Full essay text here..."
Published Date: "2025-01-21"
```

### Auto-Generated Fields
- `_id` — Unique identifier
- `_createdAt` — When it was created
- `_updatedAt` — When it was last edited

### Where Posts Appear
- ✅ Homepage: 3 most recent posts
- ✅ `/blog` — All posts with dates & read times
- ✅ `/archive` — Timeline grouped by year
- ✅ `/blog/[slug]` — Individual post page
- ✅ Search results via Oracle

---

## Form Validation

The quick post form validates:
- ✓ Title required (1-255 characters)
- ✓ Slug required (auto-generated, must be URL-safe)
- ✓ Excerpt required (max 200 characters)
- ✓ Content required (plain text or formatted)
- ✓ Date required (any past or future date)

**Slug format:**
- Lowercase
- Hyphens instead of spaces
- No special characters
- Example: `my-first-essay` → `/blog/my-first-essay`

---

## Sample Post Content

Here's an example you can copy and test:

```
Title: "Digital Silence: Finding Peace Online"

Slug: digital-silence-finding-peace-online

Excerpt: In an age of infinite connection, we must learn to cultivate digital silence—not as withdrawal, but as intentional presence.

Content:
We live in an era of unprecedented connectivity. Yet paradoxically, many of us feel more isolated than ever.

This essay explores the practice of digital silence: the art of disconnecting not to escape, but to reconnect with what matters.

Through ancient meditation practices and modern psychology, we'll discover how strategic silence shapes our minds, heals our relationships, and reclaims our agency.

In the space between notifications, we find ourselves again.

Publish Date: Today's date
```

---

## Admin Dashboard Features

Visit **`http://localhost:3001/admin`** to see:

### Quick Actions
- **✍️ Create New Post** — Jump to the creation form
- **🎛️ Sanity Studio** — Link to full CMS

### Dashboard Stats
- Total posts published
- Posts from this week
- Posts from this month
- Total views counter

### Recent Posts List
- Quick view of latest 10 posts
- Publication dates
- Direct links to view each post

---

## Troubleshooting

### "Post failed to create"
**Solution:** Check that `SANITY_API_TOKEN` is set in `.env.local` and has write permissions.

### "Token not valid"
**Solution:** 
1. Go to Sanity dashboard
2. Regenerate a new token
3. Update `.env.local`
4. Restart dev server

### "Project ID not found"
**Solution:**
1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
2. Check it matches your Sanity project ID from dashboard
3. Make sure dataset is `production` (or your chosen dataset)

### "Slug already exists"
**Solution:**
- Each post needs a unique slug
- Try: `post-title-2` or `post-title-v2`
- Or use different wording: `my-essay` → `thoughts-on-essay`

### "Dates not showing"
**Solution:**
- Make sure `publishedAt` field is set
- Format should be: `YYYY-MM-DD`
- Check post appears after 2-3 seconds (caching)

---

## Advanced: Editing Posts

### Via Form (Not Yet Available)
- Coming soon: Edit existing posts via form

### Via Sanity Studio
1. Go to https://sanity.io/manage
2. Select your project
3. Go to "Posts" section
4. Click any post to edit
5. Changes sync instantly to your site

---

## Best Practices

### For Post Titles
- Keep 3-7 words for clarity
- Use action verbs: "Exploring", "Understanding", "Discovering"
- Avoid clickbait—embrace authenticity

### For Slugs
- Make them descriptive: `the-art-of-silence` (not `post-1`)
- Use hyphens: `my-post` (not `my_post` or `mypost`)
- Keep under 50 characters

### For Excerpts
- Write as if introducing the post
- Include the main idea
- Make it engaging—users see this in listings
- 1-2 sentences, 50-200 characters

### For Content
- Use clear paragraph breaks
- Write for web: shorter paragraphs, scannable
- Be authentic—readers feel it
- Include your unique voice

### For Dates
- Publish backdated posts for retroactive additions
- Schedule future posts by setting future dates
- Archive past posts—they stay in timeline view

---

## Next Steps

1. ✅ Set up `.env.local` with Sanity credentials
2. ✅ Visit `/admin` to see your dashboard
3. ✅ Click "Create New Post"
4. ✅ Fill the form with test content
5. ✅ Publish and see your post appear!
6. 📝 Write your first real essay
7. 🚀 Share your thoughts with the world

---

## Additional Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **Blog CMS Best Practices**: https://www.sanity.io/guides/sanity-fundamentals
- **Markdown Writing Guide**: https://www.markdownguide.org/
- **SEO for Blog Posts**: https://moz.com/beginners-guide-to-seo

---

**Happy writing! Your thoughts matter. Share them. 📝✨**
