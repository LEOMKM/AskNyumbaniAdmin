# 🚀 Quick Start - Fix Login & Setup Admin

Your login is failing because the database hasn't been set up yet. Follow these simple steps:

## ⚡ Step 1: Run the Complete Migration (2 minutes)

### Option A: All-in-One Script (Recommended)

1. **Open Supabase SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/yqilhwaexdehmrcdblgz/sql

2. **Create New Query:**
   - Click "New Query" button

3. **Copy and Paste:**
   - Open: `scripts/run-all-migrations.sql`
   - Select ALL content (Cmd+A / Ctrl+A)
   - Copy (Cmd+C / Ctrl+C)
   - Paste into Supabase SQL Editor

4. **Run the Query:**
   - Click "Run" button or press Ctrl/Cmd + Enter
   - Wait 5-10 seconds

5. **Verify Success:**
   - You should see success messages in the results
   - Look for: "✅ DATABASE SETUP COMPLETE!"

### Option B: Step-by-Step (If Option A fails)

If you already have some tables/functions, run these scripts in order:

**Script 1: Fix RLS Policies**
```bash
scripts/fix-rls-policies.sql
```

**Script 2: Add Admin User**
```bash
scripts/setup-and-add-admin.sql
```

## ✅ Step 2: Verify Setup (30 seconds)

Run the test script to verify everything is working:

```bash
cd Admin\(AN\)
node scripts/test-login.js
```

**Expected Output:**
```
✅ PASS  Admin User Exists
✅ PASS  Email/Password Login
✅ PASS  PIN Login
✅ PASS  Security (Invalid Creds)

🎉 ALL TESTS PASSED! Login system is working!
```

## 🎯 Step 3: Login to Your Admin Panel

### Quick PIN Login (Fastest):
1. Go to: http://localhost:3000/login
2. Click "Use PIN instead"
3. Enter: **2025**
4. You're in! 🎉

### Email/Password Login:
1. Go to: http://localhost:3000/login
2. Email: **admin@asknyumbani.com**
3. Password: **Admin@2025**
4. Click "Sign In"

---

## 🔧 Troubleshooting

### Issue: "400 Bad Request" when logging in
**Cause:** Database functions not created yet
**Fix:** Run `scripts/run-all-migrations.sql` in Supabase SQL Editor

### Issue: "Infinite recursion detected in policy"
**Cause:** RLS policies causing loops
**Fix:** Run `scripts/fix-rls-policies.sql` in Supabase SQL Editor

### Issue: "Invalid email or password"
**Cause:** Admin user not created yet
**Fix:** Run `scripts/setup-and-add-admin.sql` in Supabase SQL Editor

### Issue: Test script fails - "Admin user does not exist"
**Cause:** Migration hasn't been run
**Fix:** Run `scripts/run-all-migrations.sql` first

### Issue: Can't connect to Supabase
**Cause:** Wrong credentials in .env.local
**Fix:** Check your `.env.local` file has correct credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yqilhwaexdehmrcdblgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-key-here
```

---

## 📋 What Gets Created

When you run the migration, here's what happens:

### Tables:
- ✅ `admin_users` - Stores admin accounts
- ✅ `admin_sessions` - Manages login sessions
- ✅ `admin_activity_log` - Tracks all admin actions

### Functions:
- ✅ `admin_login(email, password)` - Email/password login
- ✅ `admin_login_with_pin(pin)` - Quick PIN login
- ✅ `create_admin_pin(user_id, pin)` - Set/update PIN
- ✅ `validate_admin_session(token)` - Check if session valid
- ✅ `hash_password(password)` - Hash passwords/PINs
- ✅ And more...

### Default Admin User:
- ✅ Email: admin@asknyumbani.com
- ✅ Password: Admin@2025
- ✅ PIN: 2025
- ✅ Role: super_admin

---

## 🎓 Understanding the System

### Authentication Flow:

**First Time Setup:**
```
1. Run migration script in Supabase
2. Admin user created automatically with PIN
3. Ready to login immediately!
```

**Login Options:**

**Option 1: PIN Login** (Recommended for daily use)
```
User enters: 2025
  ↓
Hash PIN
  ↓
Check admin_users where pin_hash matches
  ↓
Create 24-hour session
  ↓
Return session token
  ↓
User redirected to dashboard
```

**Option 2: Email/Password Login**
```
User enters: admin@asknyumbani.com + Admin@2025
  ↓
Hash password
  ↓
Check admin_users where email + password_hash match
  ↓
Create 24-hour session
  ↓
Return session token
  ↓
User redirected to dashboard
```

### Session Management:
- Sessions expire after 24 hours
- Each login creates a new session
- Multiple sessions can exist (different devices)
- Logout invalidates specific session

### Security:
- Passwords hashed with SHA256 + salt
- PINs also hashed (same function)
- Account locks after 5 failed attempts
- All activity logged for audit trail
- Session tokens are 64-character random hex

---

## 💡 Quick Commands

**Test login:**
```bash
node scripts/test-login.js
```

**Start dev server:**
```bash
npm run dev
```

**Access admin panel:**
```
http://localhost:3000/login
```

---

## 🆘 Still Having Issues?

If you're still stuck:

1. **Check Supabase is running:**
   - Visit: https://supabase.com/dashboard
   - Ensure your project is active

2. **Verify .env.local:**
   - File exists in Admin(AN) folder
   - Contains correct Supabase URL and key

3. **Check console for errors:**
   - Open browser DevTools (F12)
   - Look for red errors in Console tab

4. **Run migration again:**
   - Sometimes Supabase needs a second run
   - Safe to run multiple times (uses `CREATE OR REPLACE`)

---

## ✨ Next Steps After Login

Once logged in, you can:

1. **Review Property Images**
   - Approve or reject uploaded images
   - Add comments to your decisions
   - Use bulk actions for multiple images

2. **View Dashboard Stats**
   - See pending, approved, rejected counts
   - Filter by status
   - Track activity

3. **Manage Sessions**
   - View active sessions
   - Logout to invalidate session

---

**Need more help?** Check the main README.md or SETUP_GUIDE.md
