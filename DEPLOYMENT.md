# Deployment & Domain Setup Guide

## Pre-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_SITE_URL` in `.env.local` to your domain
- [ ] Replace `lifewithmystic.com` in `/lib/metadata.ts` with your actual domain
- [ ] Add OG image to `/public/og-image.jpg` (1200x630px recommended)
- [ ] Update Twitter handle in `/lib/metadata.ts` (optional)
- [ ] Add Google Analytics ID: `NEXT_PUBLIC_GA_ID` in `.env.local` (optional)
- [ ] Configure Sanity project and content
- [ ] Configure Supabase for reflections system
- [ ] Add content to `/app/manifesto/page.tsx`

## Domain Setup

### Option 1: Vercel (Recommended)

**Quickest deployment path:**

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit: lifewithmystic platform"
git remote add origin https://github.com/YOUR_USERNAME/lifewithmystic.git
git push -u origin main

# 2. Deploy to Vercel
# Go to https://vercel.com/new
# Connect GitHub repo
# Set environment variables in Vercel dashboard:
#   - NEXT_PUBLIC_SANITY_PROJECT_ID
#   - NEXT_PUBLIC_SANITY_DATASET
#   - NEXT_PUBLIC_SUPABASE_URL
#   - SUPABASE_SERVICE_ROLE_KEY
#   - NEXT_PUBLIC_GA_ID (optional)
#   - NEXT_PUBLIC_SITE_URL=https://lifewithmystic.com

# 3. Connect domain
# In Vercel Project Settings > Domains
# Add your domain and update DNS records
```

**DNS Setup for Custom Domain (Vercel):**

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Create CNAME record:
   ```
   Name: @ (or your subdomain)
   Type: CNAME
   Value: cname.vercel.com
   ```
3. Or use Vercel's nameserver records:
   ```
   ns1.vercel.com
   ns2.vercel.com
   ```

### Option 2: Self-Hosted (Docker)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

**Deploy with Docker Compose:**

```yaml
version: '3.8'
services:
  lifewithmystic:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SANITY_PROJECT_ID=${NEXT_PUBLIC_SANITY_PROJECT_ID}
      - NEXT_PUBLIC_SANITY_DATASET=${NEXT_PUBLIC_SANITY_DATASET}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID}
      - NEXT_PUBLIC_SITE_URL=https://lifewithmystic.com
    restart: unless-stopped
```

### Option 3: Netlify

```bash
# 1. Connect GitHub repo
# Go to https://app.netlify.com/start

# 2. Build settings:
# Build command: npm run build
# Publish directory: .next
# Functions directory: api

# 3. Environment variables:
# Add all variables from .env.local in Netlify dashboard

# 4. Deploy with Netlify CLI (optional):
npm install -g netlify-cli
netlify deploy
```

## SSL Certificate Setup

All hosting platforms (Vercel, Netlify, Heroku) provide **free SSL certificates** by default. No additional setup needed.

## Email Notifications (for Reflections)

If you want to email reflections to admin, update `/app/api/reflections/route.ts`:

```typescript
// Send email on new reflection
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// After saving reflection:
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.ADMIN_EMAIL,
  subject: 'New Reflection',
  html: `<p>${userReflection}</p>`,
});
```

## Database Backups

### Sanity Backup

Sanity provides automatic backups. Access via:
- Sanity Dashboard > Settings > Backups
- Daily automated backups kept for 30 days

### Supabase Backup

Supabase provides:
- Automated daily backups (kept for 30 days on paid plans)
- Manual backup export via Dashboard > Backups

Backup command:
```bash
# Export Supabase data
supabase db pull

# This creates a migration file with current schema
```

## Performance Monitoring

### Vercel Analytics

Available automatically on Vercel deployments:
- Web Vitals tracking (CLS, LCP, FID)
- Real User Monitoring (RUM)
- Edge performance

### Open Source Alternative: Plausible

```bash
npm install @types/window-plausible
```

Add to `.env.local`:
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=lifewithmystic.com
```

## SEO Verification

1. **Google Search Console**
   - Submit sitemap: `https://lifewithmystic.com/api/sitemap`
   - Verify domain ownership
   - Monitor crawl errors
   - Check Core Web Vitals

2. **Bing Webmaster Tools**
   - Submit sitemap
   - Verify domain

3. **Monitor RSS Feed**
   - Subscribe: `https://lifewithmystic.com/api/rss`
   - Update feed URL in podcast directories

## Content Delivery Network (CDN)

### Cloudflare (Free)

1. Update nameservers to Cloudflare
2. Enable caching rules
3. Setup Page Rules for performance

```
Cache Level: Cache Everything
Browser Cache TTL: 1 month
```

## Monitoring & Alerts

### Health Check Endpoint

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date() });
}
```

Monitor with Uptime Robot:
- Endpoint: `https://lifewithmystic.com/api/health`
- Check interval: 5 minutes
- Get alerts if down

## Post-Launch

1. **Announce Launch**
   - Twitter/X: Tweet about launch
   - LinkedIn: Share link
   - Email list: Send newsletter
   - Reddit: Share in relevant subreddits

2. **Promote Content**
   - Share RSS feed in aggregators
   - Add to Hacker News if relevant
   - Cross-post to Medium (canonical link to main site)

3. **Monitor Metrics**
   - Check Google Analytics weekly
   - Monitor Core Web Vitals
   - Track RSS subscribers
   - Monitor reflection submissions

## Troubleshooting

### "Build fails on deploy"
- Check environment variables are set
- Ensure Sanity project exists and is accessible
- Verify Supabase connection string

### "Site is slow"
- Check Vercel Analytics > Edge Functions
- Enable image optimization (if using Next Image)
- Check database query performance in Supabase

### "Emails not sending"
- Verify email credentials in environment
- Check Supabase server logs
- Test with `npm run dev` locally first

## Domain-Specific Configuration

Replace all instances of `lifewithmystic.com` with your domain in:
- [ ] `/lib/metadata.ts` (OG tags, Twitter card)
- [ ] Environment variables: `NEXT_PUBLIC_SITE_URL`
- [ ] Domain registrar DNS records
- [ ] Google Analytics (if using)
- [ ] Google Search Console
- [ ] Social media links

## Next Steps

1. **Choose hosting provider** (Vercel recommended for Next.js)
2. **Register domain** (Namecheap, GoDaddy, Google Domains)
3. **Connect domain to hosting**
4. **Set up SSL certificate** (automatic)
5. **Configure DNS** (CNAME or nameservers)
6. **Deploy and test** (verify all pages load)
7. **Submit to search engines** (Google, Bing)
8. **Monitor performance** (Vercel Analytics, Google Search Console)

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Sanity Deployment**: https://www.sanity.io/docs
- **Supabase Docs**: https://supabase.com/docs
