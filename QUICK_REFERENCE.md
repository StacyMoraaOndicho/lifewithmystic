# 🚀 Quick Reference - lifewithmystic Platform

## ⚡ What You Have (23+ Features)

### Post Management
- ✅ Create posts
- ✅ Edit posts
- ✅ Delete posts
- ✅ Draft mode
- ✅ Schedule posting
- ✅ Categories & tags
- ✅ Featured images

### User Engagement
- ✅ Comments (moderated)
- ✅ Likes system
- ✅ Bookmarks/save
- ✅ Social sharing (Twitter, LinkedIn, Facebook)
- ✅ Related posts
- ✅ Author bio
- ✅ Read time tracking

### Analytics
- ✅ View tracking
- ✅ Engagement metrics
- ✅ Analytics dashboard
- ✅ Top posts ranking

### Platform Features
- ✅ Newsletter signup
- ✅ Dark/light theme
- ✅ Mobile responsive
- ✅ Glassmorphism design
- ✅ Email + biometric auth
- ✅ Admin dashboard

---

## 📱 Pages Built

1. `/` - Home
2. `/blog` - All posts
3. `/blog/[slug]` - Post view
4. `/archive` - Timeline
5. `/knowledge-graph` - Interactive concepts
6. `/about` - Author bio
7. `/manifesto` - Mission
8. `/reflections` - User submissions
9. `/audio` - Podcasts
10. `/admin` - Dashboard
11. `/admin/create` - Create posts
12. `/admin/edit` - Manage posts
13. `/admin/analytics` - Stats
14. `/admin/login` - Authentication

---

## 🔧 API Routes

### Posts
- `POST /api/posts/create` - New post
- `POST /api/posts/save` - Update post
- `POST /api/posts/delete` - Remove post

### Analytics
- `POST /api/analytics/track` - Track views/likes
- `GET /api/analytics` - Get stats

### Community
- `POST /api/comments` - Add comment
- `GET /api/comments` - Fetch comments
- `POST /api/newsletter/subscribe` - Email signup

### Search
- `POST /api/search` - Full-text search

---

## 🎨 Key Files

### Essential Files
| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, theme provider |
| `app/page.tsx` | Home page |
| `components/Nav.tsx` | Mobile-responsive navigation |
| `lib/auth-context.tsx` | Authentication state |
| `lib/sanity.ts` | CMS client |

### Admin Files
| File | Purpose |
|------|---------|
| `app/admin/page.tsx` | Dashboard |
| `app/admin/create/page.tsx` | Create posts |
| `app/admin/edit/page.tsx` | Manage posts |
| `app/admin/analytics/page.tsx` | Statistics |

### Components
| Component | Purpose |
|-----------|---------|
| `Nav` | Navigation (mobile responsive) |
| `RecentPosts` | Latest articles grid |
| `Comments` | Comment system |
| `EngagementButtons` | Like/bookmark buttons |
| `SocialShare` | Social sharing |
| `NewsletterSignup` | Email capture |
| `AuthorBio` | Author info |
| `RelatedPosts` | Recommendations |

---

## 🌐 Environment Variables

Create `.env.local`:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token

# Optional: Google Analytics
NEXT_PUBLIC_GA_ID=your_ga_id

# Optional: Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

---

## 📊 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 + React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4.1 |
| **Animations** | Framer Motion |
| **CMS** | Sanity.io HTTP API |
| **Database** | Supabase (optional) |
| **Theme** | next-themes |
| **Auth** | Custom + WebAuthn |
| **Hosting** | Vercel (recommended) |

---

## 🚀 Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Utilities
npm run lint             # Check code quality
npm run type-check       # TypeScript check

# Deployment
vercel deploy            # Deploy to Vercel
```

---

## 🎯 How to Add Content

### Create a Post (via Admin)

1. Go to `http://localhost:3000/admin`
2. Login (email: test@test.com, password: test123)
3. Click "Create Post"
4. Fill in:
   - Title
   - Slug (URL-friendly)
   - Excerpt (summary)
   - Body (main content)
   - Publish date
5. Click "Create"
6. Post appears on `/blog`

### Edit a Post

1. Go to `/admin/edit`
2. Find post in list
3. Click "Edit"
4. Update fields
5. Click "Save"

### View Analytics

1. Go to `/admin/analytics`
2. See:
   - Total views, likes, bookmarks
   - Top performing posts
   - Read time averages

---

## 📱 Mobile Testing

### In Browser DevTools
1. Press `F12`
2. Press `Ctrl+Shift+M` (or click phone icon)
3. Test at sizes: 375px, 768px, 1024px
4. Check hamburger menu works

### Key Responsive Points
- Hamburger menu: < 768px
- Single column: < 768px
- Two column: 768px - 1024px
- Full layout: > 1024px

---

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'zen-bg': '#f5f1ed',
  'zen-text': '#2d2d2d',
  // ... add your colors
}
```

### Add New Pages
Create file: `app/new-page/page.tsx`
```typescript
export default function NewPage() {
  return <main>Your content</main>;
}
```

### Create New Component
Create file: `components/MyComponent.tsx`
```typescript
export default function MyComponent() {
  return <div>Component</div>;
}
```

---

## 🔐 Admin Login (Demo)

**Email**: `test@test.com`  
**Password**: `test123`

⚠️ **For production, integrate:**
- Supabase authentication
- NextAuth.js
- Clerk
- Auth0

---

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm run build
```

### Types Not Found
```bash
# Regenerate types
npm run type-check
```

### Port 3000 in Use
```bash
npm run dev -- -p 3001
```

### Sanity Connection Failed
- Check `.env.local` has correct token
- Verify project ID
- Ensure token has read/write permissions

---

## 📚 Documentation

Quick links to full docs:

- **`PLATFORM_COMPLETE.md`** - Full platform overview
- **`NEXT_FEATURES.md`** - 38 features to build next
- **`RESPONSIVE_COMPLETE.md`** - Mobile/responsive info
- **`SESSION_SUMMARY.md`** - What was done this session
- **`FEATURES_COMPLETE.md`** - Feature implementation guide
- **`BUILD_SUMMARY.md`** - Technical details

---

## 🎯 Recommended Next Features

**Pick one to build next:**

1. **Advanced Search** (1-2 days)
   - Full-text search UI
   - Filter by category/date
   - Search history

2. **Bookmarks Persistence** (2-3 days)
   - Save to database
   - Sync across devices
   - Export reading list

3. **Table of Contents** (1-2 days)
   - Auto-generate from headings
   - Sticky sidebar
   - Smooth scroll to sections

4. **Code Highlighting** (1 day)
   - Pretty syntax colors
   - Copy code button
   - Language detection

5. **Email Digest** (3-4 days)
   - Weekly summary
   - User preferences
   - Unsubscribe links

See `NEXT_FEATURES.md` for all 38 features!

---

## 💬 Support

Need help?

1. Check the documentation files
2. Review component code
3. Check browser console for errors
4. Run `npm run build` to verify

---

**Your platform is ready! 🚀**

Deploy now:
```bash
npm run build && npm start
```

**What's next?** Pick a feature and let's build! 🎯
