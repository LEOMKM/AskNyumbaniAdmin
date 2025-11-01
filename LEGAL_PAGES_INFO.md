# Legal Pages for Play Store Submission

## Pages Created

### 1. Privacy Policy
**File:** `app/privacy/page.tsx`
**URL:** `https://your-domain.com/privacy`

**Covers:**
- Data collection (personal info, location, photos)
- How data is used (property listings, GPS search, analytics)
- Data storage and security (Supabase, SSL/TLS encryption)
- Data sharing policies (no third-party sharing)
- User rights (access, deletion, correction, GDPR)
- Children's privacy
- Cookies and tracking
- International data transfers
- Contact information

### 2. Terms of Service
**File:** `app/terms/page.tsx`
**URL:** `https://your-domain.com/terms`

**Covers:**
- Agreement to terms
- Eligibility requirements (18+ years)
- Account registration and security
- Permitted and prohibited uses
- Property listing requirements
- User-generated content policies
- Intellectual property rights
- Third-party services (Google Maps, Firebase)
- Disclaimers and liability limitations
- Dispute resolution (Kenyan jurisdiction)
- Termination policies
- Service modifications
- Contact information

### 3. Login Page Updated
**File:** `app/login/page.tsx`
**Changes:** Added footer links to Privacy Policy and Terms of Service

---

## For Play Store Submission

### 1. Deploy Your Admin Dashboard

First, deploy your admin dashboard to get the public URLs. If using Netlify (as configured):

```bash
cd /Users/leonard.mutugi/CodzureGroup/AskNyumbaniRealEstate/AskNyumbani(Admin)
npm run build
```

Then deploy to Netlify or your hosting provider.

### 2. URLs to Use in Play Console

Once deployed, you'll have these URLs:

**Privacy Policy URL:**
```
https://your-domain.com/privacy
```

**Terms of Service URL (Optional but Recommended):**
```
https://your-domain.com/terms
```

### 3. Where to Enter These URLs in Play Console

#### A. During App Creation:
1. Go to Play Console → Create app
2. In "Privacy Policy" field → Enter your privacy URL

#### B. For Existing Apps:
1. Play Console → Your App
2. **Policy** → **App content** → **Privacy Policy**
3. Click "Start" or "Edit"
4. Enter your privacy policy URL: `https://your-domain.com/privacy`
5. Save

#### C. Store Listing (Optional):
You can also mention the Terms of Service in your app description.

---

## Testing the Pages

### Local Testing (Before Deployment)

```bash
cd /Users/leonard.mutugi/CodzureGroup/AskNyumbaniRealEstate/AskNyumbani(Admin)
npm run dev
```

Then visit:
- http://localhost:3000/privacy
- http://localhost:3000/terms
- http://localhost:3000/login (check footer links)

### After Deployment

Test the live URLs:
- https://your-domain.com/privacy
- https://your-domain.com/terms
- https://your-domain.com/login

**Verify:**
- ✓ Pages load correctly
- ✓ Content is readable
- ✓ Links work (back to login, between pages)
- ✓ Mobile responsive
- ✓ No authentication required (publicly accessible)

---

## Important Notes

### 1. Deployment Domain

Your admin dashboard is configured for Netlify. Common deployment options:

**Option A: Netlify (Configured)**
- Domain format: `https://asknyumbani-admin.netlify.app`
- Or custom domain: `https://admin.asknyumbani.com`

**Option B: Vercel**
- Domain format: `https://asknyumbani-admin.vercel.app`

**Option C: Custom Domain**
- Set up your own domain: `https://admin.your-domain.com`

### 2. Required for Play Store Approval

Google Play requires:
- ✅ Privacy Policy URL (mandatory)
- ✅ Must be publicly accessible (no login required)
- ✅ Must cover data collection, usage, and sharing
- ✅ Must be on a secure domain (HTTPS)

Optional but recommended:
- Terms of Service URL
- Contact email in policies
- GDPR compliance section

### 3. Updating Policies

If you need to update the policies:

1. Edit the files:
   - `app/privacy/page.tsx`
   - `app/terms/page.tsx`

2. Update the "Last Updated" date

3. Redeploy your admin dashboard

4. URLs remain the same (no need to update Play Console)

---

## Content Customization

### Things You May Want to Customize:

1. **Email Addresses:**
   - Current: `support@codzuresolutions.com`
   - Privacy: `privacy@codzuresolutions.com`
   - Legal: `legal@codzuresolutions.com`

   Update these to your actual email addresses.

2. **Company Information:**
   - Currently set to: Codzure Solutions Limited, Nairobi, Kenya
   - Update if different

3. **Additional Services:**
   - If you add new features (in-app purchases, ads, etc.)
   - Update policies accordingly

4. **Website URL:**
   - Add your main website URL if available
   - Update contact section

---

## Play Store Submission Checklist

### Privacy & Legal Requirements

- [ ] Privacy Policy page created ✅
- [ ] Terms of Service page created ✅
- [ ] Links added to login page ✅
- [ ] Admin dashboard deployed
- [ ] Privacy Policy URL obtained
- [ ] URL entered in Play Console
- [ ] Pages tested and publicly accessible
- [ ] HTTPS enabled (automatic with Netlify/Vercel)

### Data Safety Section in Play Console

Based on your Privacy Policy, declare in Play Console:

**Data Collected:**
- ✓ Location (approximate and precise)
- ✓ Photos (property images)
- ✓ Personal info (optional contact details)

**Data Usage:**
- Property discovery and listings
- GPS-based search
- Improve app features

**Data Sharing:**
- No data shared with third parties
- Property contact info shared with buyers (with consent)

**Security Practices:**
- Data encrypted in transit (SSL/TLS)
- Secure storage (Supabase)

---

## URLs for Different Environments

### Development
- Privacy: `http://localhost:3000/privacy`
- Terms: `http://localhost:3000/terms`

### Staging (if applicable)
- Privacy: `https://staging-domain.com/privacy`
- Terms: `https://staging-domain.com/terms`

### Production (for Play Store)
- Privacy: `https://your-production-domain.com/privacy`
- Terms: `https://your-production-domain.com/terms`

**Use only the production URLs in Play Store submission!**

---

## Quick Deployment Guide (Netlify)

1. **Connect Repository:**
   ```bash
   # Push to GitHub first
   git add .
   git commit -m "Add Privacy Policy and Terms of Service pages"
   git push
   ```

2. **Deploy on Netlify:**
   - Go to: https://app.netlify.com
   - Click "Add new site"
   - Import from Git
   - Select your repository
   - Build settings should auto-detect (Next.js)
   - Deploy!

3. **Get Your URL:**
   - After deployment, Netlify provides a URL
   - Example: `https://asknyumbani-admin.netlify.app`

4. **Your Policy URLs:**
   - Privacy: `https://asknyumbani-admin.netlify.app/privacy`
   - Terms: `https://asknyumbani-admin.netlify.app/terms`

5. **Use in Play Console:**
   - Copy the privacy URL
   - Paste in Play Console → Policy → App content → Privacy Policy

---

## Support

If you need to modify the policies or have questions:

**Files to Edit:**
- Privacy Policy: `/app/privacy/page.tsx`
- Terms of Service: `/app/terms/page.tsx`
- Login Page: `/app/login/page.tsx`

**After Editing:**
1. Test locally: `npm run dev`
2. Commit changes: `git commit -am "Update policies"`
3. Push to deploy: `git push`
4. Verify live URLs

---

## Summary

✅ **Created:** Privacy Policy page
✅ **Created:** Terms of Service page
✅ **Updated:** Login page with footer links
📝 **Next:** Deploy admin dashboard to get public URLs
🎯 **Then:** Add privacy URL to Play Console

Your legal pages are ready for Play Store approval! 🎉

---

© 2024 Codzure Solutions Limited
