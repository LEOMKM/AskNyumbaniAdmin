# AskNyumbani Admin Dashboard - Netlify Deployment Guide

**Developed by Codzure Solutions Limited**

This guide will help you deploy the AskNyumbani Admin Dashboard to Netlify.

## Prerequisites

- GitHub/GitLab/Bitbucket account
- Netlify account (free tier works fine)
- Supabase project credentials
- Admin email configured

## Quick Deploy

### Option 1: Deploy from Git (Recommended)

1. **Push your code to Git repository**
   ```bash
   cd "AskNyumbani(Admin)"
   git init
   git add .
   git commit -m "Initial commit for Netlify deployment"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider
   - Select the repository
   - Configure build settings:
     - **Base directory:** `AskNyumbani(Admin)` (or leave blank if repo root is the admin folder)
     - **Build command:** `npm run build`
     - **Publish directory:** `.next`
     - **Functions directory:** `.netlify/functions`

3. **Set Environment Variables**
   - In Netlify dashboard, go to: Site settings → Environment variables
   - Add the following variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://yqilhwaexdehmrcdblgz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   NEXT_PUBLIC_ADMIN_EMAIL=admin@asknyumbani.com
   NODE_VERSION=20.0.0
   NEXT_TELEMETRY_DISABLED=1
   ```

4. **Install Netlify Next.js Plugin**
   - In Netlify dashboard, go to: Plugins
   - Search for "Next.js Runtime"
   - Click "Install" to add `@netlify/plugin-nextjs`
   - Or it will be automatically installed from `netlify.toml`

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete (3-5 minutes typically)
   - Your site will be live at: `https://random-name.netlify.app`

### Option 2: Manual Deploy via CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify site**
   ```bash
   cd "AskNyumbani(Admin)"
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Configuration Files

The following files have been created for Netlify deployment:

### `netlify.toml`
Main Netlify configuration file that defines:
- Build commands
- Publish directory
- Redirects and headers
- Environment settings
- Next.js plugin integration

### `.nvmrc`
Specifies Node.js version (20.0.0) for consistent builds.

### `.gitignore`
Updated to exclude build artifacts and sensitive files.

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | `eyJ...` |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Admin email for authentication | ✅ | `admin@asknyumbani.com` |
| `NODE_VERSION` | Node.js version | ✅ | `20.0.0` |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | Optional | `1` |

## Custom Domain Setup

1. **Add Custom Domain**
   - In Netlify: Site settings → Domain management → Add custom domain
   - Enter your domain (e.g., `admin.asknyumbani.com`)

2. **Configure DNS**
   - Add DNS records at your domain registrar:
     ```
     Type: CNAME
     Name: admin
     Value: your-site.netlify.app
     ```

3. **Enable HTTPS**
   - Netlify automatically provisions SSL certificate
   - Force HTTPS redirect in: Site settings → Domain management → HTTPS

## Post-Deployment Checklist

- [ ] ✅ Site is accessible at Netlify URL
- [ ] ✅ Environment variables are set correctly
- [ ] ✅ Can login with admin credentials
- [ ] ✅ Images from Supabase load correctly
- [ ] ✅ All admin functions work (approve/reject/delete)
- [ ] ✅ Custom domain configured (if applicable)
- [ ] ✅ HTTPS enabled and working
- [ ] ✅ Test on different devices/browsers

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Solution: Clear cache and rebuild
netlify build --clear-cache
```

**Error: Out of memory**
```bash
# Solution: Increase Node memory in netlify.toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### Runtime Issues

**Images not loading**
- Verify Supabase URL is correct in environment variables
- Check image domains in `next.config.js`
- Verify Supabase storage is public

**Authentication not working**
- Verify Supabase anon key is correct
- Check browser console for errors
- Verify admin email matches environment variable

**404 on refresh**
- This is handled by the `[[redirects]]` in `netlify.toml`
- If still occurring, verify publish directory is `.next`

### Performance Optimization

**Slow loading times**
- Enable edge caching for static assets (configured in `netlify.toml`)
- Optimize images in Supabase storage
- Consider using Netlify Edge Functions for API routes

## Continuous Deployment

Netlify automatically deploys when you push to your Git repository:

1. **Automatic Deploys** (Production)
   - Push to `main` branch → Automatic deployment
   - Configure in: Site settings → Build & deploy → Deploy contexts

2. **Deploy Previews**
   - Pull requests automatically get preview URLs
   - Test changes before merging

3. **Branch Deploys**
   - Deploy specific branches for staging
   - Configure in: Site settings → Build & deploy → Deploy contexts

## Monitoring and Analytics

1. **Build Logs**
   - View in: Deploys → [Select deploy] → Deploy log

2. **Function Logs**
   - View in: Functions → [Select function] → Logs

3. **Analytics**
   - Enable: Site settings → Analytics
   - View traffic, performance, and errors

## Rollback

If deployment fails or has issues:

```bash
# Via CLI
netlify rollback

# Or via Dashboard
# Deploys → Select previous working deploy → Publish deploy
```

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Rotate keys regularly** - Update in Netlify environment variables
3. **Use Netlify Functions** for sensitive operations
4. **Enable Branch Protection** in Git repository
5. **Review deploy previews** before merging to main

## Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
git add package*.json
git commit -m "Update dependencies"
git push
```

### Clear Build Cache
```bash
netlify build --clear-cache
```

### Redeploy Without Changes
```bash
netlify deploy --prod --trigger
```

## Support

- **Netlify Docs:** https://docs.netlify.com/
- **Next.js on Netlify:** https://docs.netlify.com/frameworks/next-js/
- **Supabase Docs:** https://supabase.com/docs

## Cost Estimate

**Netlify Free Tier includes:**
- 300 build minutes/month
- 100 GB bandwidth/month
- Automatic HTTPS
- Deploy previews
- Forms (100 submissions/month)

For AskNyumbani Admin Dashboard, free tier should be sufficient unless:
- High traffic (>100GB/month)
- Frequent builds (>300 min/month)

**If you need more:** Upgrade to Pro ($19/month) or Business ($99/month)

## Next Steps

1. Deploy to Netlify using Option 1 or Option 2 above
2. Configure custom domain (optional)
3. Test all functionality
4. Share admin URL with team
5. Set up monitoring and alerts

---

**Note:** This deployment guide assumes you're using Next.js 14 with App Router. The configuration has been optimized for the AskNyumbani Admin Dashboard specifically.

---

© 2024 Codzure Solutions Limited. All rights reserved.
