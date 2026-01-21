# Admin Features & Post Creation System

## What You Can Now Do

### 1. **Quick Post Creation Form** 📝
- **URL**: `http://localhost:3001/admin/create`
- **Features**:
  - Beautiful form with real-time validation
  - Auto-generates URL slugs from titles
  - Character counter for excerpts (max 200)
  - Publication date selector
  - Instant publishing with success/error messages
  - Auto-redirects to new post on success

### 2. **Admin Dashboard** 🎛️
- **URL**: `http://localhost:3001/admin`
- **Features**:
  - Quick stats (total posts, this week, this month)
  - Recent posts list (last 10)
  - One-click access to "Create New Post"
  - Link to Sanity Studio for advanced editing
  - Posts load dynamically from Sanity

### 3. **Navigation Update** 🔗
- Added "Admin" link to navigation bar
- Takes you straight to `/admin` dashboard
- Hidden in immersive reading mode

---

## How It Works

### Backend
**New API Route**: `/api/posts/create`
- Accepts POST requests with post data
- Creates document in Sanity CMS
- Returns slug, ID, and success message
- Full error handling with helpful messages

### Frontend Components
**New Pages**:
- `/admin` — Dashboard
- `/admin/create` — Post creation form

**Features**:
- Client-side form validation
- Loading states with animations
- Success/error messages
- Auto-slug generation
- Responsive design

---

## Setup Required

### 1. Add to `.env.local`

```bash
# Required for post creation API
SANITY_API_TOKEN=your_api_token_here
```

**To get your token**:
1. Visit https://sanity.io/manage
2. Select your project
3. Go to Settings > API > Tokens
4. Create new token (enable read + write)
5. Copy paste into `.env.local`

### 2. Restart Dev Server

```bash
npm run dev
```

---

## What Each Field Does

| Field | Example | Notes |
|-------|---------|-------|
| **Title** | "The Sacred Within" | Post headline, required, 1-255 chars |
| **Slug** | "the-sacred-within" | URL path, auto-generated, editable, unique |
| **Excerpt** | "A meditation on finding divinity in ourselves" | 1-2 sentences, max 200 chars, shows in listings |
| **Content** | Full essay text | Plain text format, full paragraph support |
| **Publish Date** | 2025-01-21 | Controls when/where post appears in listings |

---

## Where Posts Appear

After publishing, your post automatically shows in:

✅ **Homepage** — If it's one of 3 most recent posts
✅ **Blog Index** (`/blog`) — All posts sorted by date
✅ **Archive** (`/archive`) — Timeline view by year
✅ **Search** (Oracle) — Searchable by title/content
✅ **Direct URL** — `/blog/your-slug`

---

## Quick Workflow

```
Visit /admin
    ↓
Click "Create New Post"
    ↓
Fill form:
  - Title ✓
  - Auto-slug ✓
  - Excerpt ✓
  - Content ✓
  - Date ✓
    ↓
Click "Publish Post"
    ↓
✨ Success! Redirected to new post
    ↓
Post appears everywhere instantly
```

---

## Technical Details

### Form Validation
- All fields required
- Slug must be URL-safe (lowercase, hyphens, no special chars)
- Excerpt max 200 characters
- Date format: YYYY-MM-DD

### API Response
- Status 201: Post created successfully
- Status 400: Missing required fields
- Status 500: Sanity API error (usually token missing)

### Error Handling
- Missing token → Clear error message with setup instructions
- Invalid slug → Can edit manually
- Sanity error → Returns error details

---

## Files Created/Modified

**Created**:
- `/app/admin/page.tsx` — Dashboard
- `/app/admin/create/page.tsx` — Form page
- `/app/api/posts/create/route.ts` — API endpoint
- `HOW_TO_ADD_POSTS.md` — Full guide
- `QUICK_START_POSTS.md` — Quick reference

**Modified**:
- `/components/Nav.tsx` — Added Admin link

---

## Next Steps

1. ✅ Add `SANITY_API_TOKEN` to `.env.local`
2. ✅ Restart dev server
3. ✅ Visit `/admin`
4. ✅ Click "Create New Post"
5. ✅ Write your first post
6. ✅ Publish!

---

## Examples

### Example 1: Quick Test Post
```
Title: Test Post
Slug: test-post (auto-fills)
Excerpt: This is a test to see how it works
Content: This is the full content of my test post. It appears on the blog.
Date: Today
```

### Example 2: Real Essay
```
Title: Understanding the Inner Silence
Slug: understanding-inner-silence
Excerpt: Silence is not absence. It is presence—the deepest form of being.
Content: [Full 500-1000 word essay here]
Date: 2025-01-21
```

---

## Sanity Studio (Advanced)

For more complex editing (images, rich text, etc.):

1. Visit https://sanity.io/manage
2. Select your project
3. Edit posts directly in the CMS interface
4. Changes sync instantly to your site

---

## Troubleshooting

**"Failed to create post"**
→ Check that `SANITY_API_TOKEN` is in `.env.local` and valid

**"Project ID not found"**
→ Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set

**"Slug already exists"**
→ Each post needs unique slug; edit manually in form

**"Token invalid"**
→ Regenerate at Sanity dashboard, update `.env.local`, restart server

**"Changes not showing"**
→ Wait 2-3 seconds (caching) and refresh browser

---

## Features Roadmap

- ✅ Create new posts via form
- ✅ Admin dashboard
- ✅ Quick stats
- ⏳ Edit existing posts via form
- ⏳ Delete posts via admin
- ⏳ Featured image upload
- ⏳ Post categories/tags
- ⏳ Author management

---

## You're Ready! 🚀

Everything is set up to start publishing. Your blog is now fully functional.

**Go write something beautiful!** ✨
