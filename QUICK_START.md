# Quick Start - Deploy to Netlify in 5 Minutes

**Developed by Codzure Solutions Limited**

## Option 1: Automated Script (Easiest)

```bash
cd "AskNyumbani(Admin)"
./deploy-to-netlify.sh
```

Choose option 7 to test build, then option 2 to initialize, then option 3 to deploy.

## Option 2: Manual Steps

### 1. Prepare Repository
```bash
cd "AskNyumbani(Admin)"
git add .
git commit -m "Prepare for Netlify deployment"
git push
```

### 2. Deploy on Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Click "Show advanced" → "New variable" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://yqilhwaexdehmrcdblgz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [your-key]
   NEXT_PUBLIC_ADMIN_EMAIL = admin@asknyumbani.com
   NODE_VERSION = 20.0.0
   ```
6. Click "Deploy"

### 3. Test Your Site

Visit the URL provided by Netlify (e.g., `https://your-site.netlify.app`)

## Environment Variables Needed

Copy these from your `.env.local` or Supabase dashboard:

| Variable | Where to Find | Example |
|----------|--------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | `eyJ...` |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Your admin email | `admin@example.com` |

## Common Issues & Quick Fixes

### Build Fails with "Module not found"
```bash
# Clear cache in Netlify dashboard
Site settings → Build & deploy → Clear cache and retry deploy
```

### Images Don't Load
Check `next.config.js` has your Supabase domain:
```javascript
images: {
  domains: ['yqilhwaexdehmrcdblgz.supabase.co'],
}
```

### Can't Login
- Verify `NEXT_PUBLIC_ADMIN_EMAIL` matches your Supabase user email
- Check Supabase → Authentication → Users

### 404 on Page Refresh
This should be handled automatically by `netlify.toml`. If not, verify the file exists.

## Test Checklist

- [ ] Site loads at Netlify URL
- [ ] Login page appears
- [ ] Can login with admin credentials
- [ ] Dashboard shows data
- [ ] Images display correctly
- [ ] Can approve/reject images

## Next Steps

1. ✅ Site deployed successfully
2. 📧 Share URL with team
3. 🌐 Add custom domain (optional)
4. 📊 Set up monitoring
5. 🔒 Review security settings

## Files Created for Deployment

- ✅ `netlify.toml` - Main configuration
- ✅ `.nvmrc` - Node version
- ✅ `.gitignore` - Ignore build files
- ✅ `next.config.js` - Optimized config
- ✅ `deploy-to-netlify.sh` - Deployment script

## Support

- 📖 Full guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- ✅ Checklist: [NETLIFY_CHECKLIST.md](./NETLIFY_CHECKLIST.md)
- 💬 Netlify docs: https://docs.netlify.com

---

**Estimated time:** 5-10 minutes
**Difficulty:** Easy
**Cost:** Free (Netlify free tier)

© 2024 Codzure Solutions Limited
