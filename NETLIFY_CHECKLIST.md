# Netlify Deployment Checklist

**Developed by Codzure Solutions Limited**

Use this checklist to ensure a smooth deployment to Netlify.

## Pre-Deployment (Local Setup)

### Code Preparation
- [ ] All code is committed to Git
- [ ] `.env.local` is NOT committed (check `.gitignore`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] All features tested locally

### Configuration Files
- [ ] `netlify.toml` exists and is configured
- [ ] `.nvmrc` exists with Node version 20.0.0
- [ ] `.gitignore` updated with build artifacts
- [ ] `next.config.js` optimized for Netlify
- [ ] `package.json` has correct build scripts

### Environment Variables Ready
- [ ] `NEXT_PUBLIC_SUPABASE_URL` value available
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` value available
- [ ] `NEXT_PUBLIC_ADMIN_EMAIL` value available
- [ ] All values are from production Supabase project

## Repository Setup

### Git Repository
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is accessible
- [ ] Branch name is correct (usually `main` or `master`)
- [ ] No large files committed (check `.gitignore`)

## Netlify Setup

### Account & Site Creation
- [ ] Netlify account created (or logged in)
- [ ] Site created and connected to repository
- [ ] Correct repository selected
- [ ] Correct branch selected for production

### Build Settings
- [ ] Build command: `npm run build`
- [ ] Publish directory: `.next`
- [ ] Functions directory: `.netlify/functions`
- [ ] Base directory: (leave blank or set to admin folder path)

### Environment Variables (In Netlify Dashboard)
Navigate to: Site settings → Environment variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` added
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` added
- [ ] `NEXT_PUBLIC_ADMIN_EMAIL` added
- [ ] `NODE_VERSION` = `20.0.0` added
- [ ] `NEXT_TELEMETRY_DISABLED` = `1` added (optional)

**Double-check:** No quotes around values, no extra spaces

### Plugin Installation
- [ ] Next.js Runtime plugin installed (`@netlify/plugin-nextjs`)
  - Auto-installs from `netlify.toml` OR
  - Manual install: Site settings → Plugins → Install

## First Deployment

### Deploy
- [ ] Click "Deploy site" or push to trigger deploy
- [ ] Wait for build to complete (check build log)
- [ ] No build errors
- [ ] Deployment succeeded

### Post-Deployment Testing
- [ ] Site is accessible at Netlify URL
- [ ] Login page loads
- [ ] Can login with admin credentials
- [ ] Images from Supabase load correctly
- [ ] Dashboard displays data correctly
- [ ] Image approval/rejection works
- [ ] All CRUD operations functional
- [ ] No console errors in browser
- [ ] Test on mobile device
- [ ] Test in different browsers

## Production Configuration

### Domain Setup (Optional)
- [ ] Custom domain added in Netlify
- [ ] DNS records configured at domain registrar
- [ ] HTTPS certificate provisioned (automatic)
- [ ] Force HTTPS enabled
- [ ] Custom domain working

### Security
- [ ] Security headers configured (from `netlify.toml`)
- [ ] HTTPS only (no HTTP access)
- [ ] Environment variables secure
- [ ] No sensitive data in client code
- [ ] Supabase RLS policies configured

### Performance
- [ ] Page load times acceptable (<3s)
- [ ] Images optimized and loading fast
- [ ] No excessive JavaScript bundle size
- [ ] Lighthouse score checked (aim for >90)

### Monitoring
- [ ] Deploy notifications configured (email/Slack)
- [ ] Error tracking set up (optional: Sentry)
- [ ] Uptime monitoring (optional)
- [ ] Analytics enabled (Netlify Analytics or Google Analytics)

## Continuous Deployment

### Automatic Deploys
- [ ] Production deploys on push to main branch
- [ ] Deploy previews enabled for pull requests
- [ ] Branch deploys configured (if needed)
- [ ] Build notifications working

### Deploy Settings
Navigate to: Site settings → Build & deploy → Continuous deployment

- [ ] Auto-deploy enabled for production branch
- [ ] Deploy contexts configured
- [ ] Build hooks created (if needed)

## Post-Launch

### Documentation
- [ ] Team has access to Netlify dashboard
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Rollback procedure documented

### Maintenance
- [ ] Update schedule planned
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Support contact established

## Troubleshooting Reference

### If Build Fails

1. **Check build log in Netlify**
   - Look for error messages
   - Note which step failed

2. **Common issues:**
   - Missing environment variables
   - Node version mismatch
   - Dependency installation failures
   - TypeScript errors
   - Out of memory

3. **Solutions:**
   - Verify all environment variables set
   - Check Node version in build log
   - Clear cache: Site settings → Build & deploy → Clear cache
   - Review error in build log and fix locally first

### If Site Doesn't Load

1. **Check deployment status**
   - Verify deployment succeeded
   - Check Functions tab for errors

2. **Common issues:**
   - Wrong publish directory
   - Environment variables not set
   - Supabase connection issues
   - Image domains not configured

3. **Solutions:**
   - Verify publish directory is `.next`
   - Double-check environment variables
   - Test Supabase connection
   - Add image domains to `next.config.js`

### If Features Don't Work

1. **Check browser console**
   - Look for JavaScript errors
   - Check network tab for failed requests

2. **Common issues:**
   - CORS errors
   - Missing environment variables
   - Supabase RLS blocking requests
   - Authentication issues

3. **Solutions:**
   - Configure CORS in Supabase
   - Verify all env vars in Netlify
   - Review RLS policies
   - Test authentication flow

## Quick Command Reference

```bash
# Test build locally
npm run build

# Deploy via CLI (first time)
netlify login
netlify init
netlify deploy --prod

# Check deployment status
netlify status

# View logs
netlify logs

# Open Netlify dashboard
netlify open
```

## Contact & Support

- **Netlify Docs:** https://docs.netlify.com/
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs

## Notes

- First deployment may take longer (5-10 minutes)
- Subsequent deployments are faster (2-5 minutes)
- Deploy previews build on every PR
- Production deploys on merge to main
- Rollback is instant (just republish old deploy)

---

**Last Updated:** 2024
**Version:** 1.0

✅ Check off items as you complete them!

---

© 2024 Codzure Solutions Limited
