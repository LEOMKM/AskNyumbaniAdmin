# Admin User Creation Scripts

This directory contains scripts to add admin users to the Ask Nyumbani Real Estate admin panel.

## 🚀 Quick Start

You have **three options** to create an admin user with PIN 2025:

### Option 1: Complete Setup Script (Recommended - Most Reliable)

This script ensures all functions exist and creates the admin in one go.

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `yqilhwaexdehmrcdblgz`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of [`setup-and-add-admin.sql`](./setup-and-add-admin.sql)
6. Click **Run** or press `Ctrl/Cmd + Enter`

**Default Credentials Created:**
- **Email:** admin@asknyumbani.com
- **Password:** Admin@2025
- **PIN:** 2025
- **Role:** super_admin

### Option 2: Simple SQL Script (If migrations already run)

Use this if your database already has the `hash_password()` function.

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard)
2. Copy and paste the contents of [`add-admin.sql`](./add-admin.sql)
3. Click **Run**

### Option 3: Node.js Script

1. **Install dependencies** (if not already installed):
   ```bash
   cd Admin\(AN\)
   npm install @supabase/supabase-js dotenv
   ```

2. **Run the script:**
   ```bash
   node scripts/add-admin.js
   ```

## 📝 Customizing Admin Details

### For SQL Script:

Edit the VALUES in `add-admin.sql` or `setup-and-add-admin.sql`:

```sql
VALUES (
    'your-email@example.com',          -- Change email
    public.hash_password('YourPass'),  -- Change password
    public.hash_password('1234'),      -- Change PIN (4 digits, uses same function)
    'Your Name',                       -- Change full name
    'super_admin',                     -- Change role (admin or super_admin)
    ...
)
```

**Note:** Both password and PIN use the `hash_password()` function.

### For Node.js Script:

Edit the `adminData` object in `add-admin.js`:

```javascript
const adminData = {
    email: 'your-email@example.com',
    password: 'YourPassword123',
    pin: '1234',  // Must be 4 digits
    full_name: 'Your Full Name',
    role: 'super_admin'  // 'admin' or 'super_admin'
};
```

## 🎯 Admin Roles

| Role | Permissions |
|------|-------------|
| `admin` | Can approve/reject property images, view dashboard |
| `super_admin` | All admin permissions + can manage other admins |

## 🔑 Login Methods

After creating the admin, you can login using:

1. **PIN Login** (Fastest):
   - Enter your 4-digit PIN: `2025`
   - Instant access to dashboard

2. **Email/Password Login**:
   - Email: `admin@asknyumbani.com`
   - Password: `Admin@2025`

## 🛠️ Troubleshooting

### "Admin already exists"

If you get this error, the email is already in use. You can:

1. **Use a different email** in the script
2. **Delete the existing admin** first:
   ```sql
   DELETE FROM public.admin_users WHERE email = 'admin@asknyumbani.com';
   ```

### "Missing Supabase credentials"

Ensure your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yqilhwaexdehmrcdblgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### "Function hash_password does not exist"

Run the database migrations first:
```bash
cd Admin\(AN\)
npx supabase db push
```

Or manually run the migration files in `supabase/migrations/` in your Supabase SQL Editor.

## 📋 Verification

After running the script, verify the admin was created:

```sql
SELECT
    email,
    full_name,
    role,
    is_active,
    created_at
FROM public.admin_users
WHERE email = 'admin@asknyumbani.com';
```

## 🔒 Security Notes

1. **Change default credentials** after first login
2. **Use strong passwords** in production
3. **Never commit** `.env.local` to version control
4. **PIN should be 4 digits** (0000-9999)
5. The current implementation uses SHA256 - consider upgrading to bcrypt/argon2 for production

## 📚 Related Documentation

- [Supabase Migrations](../supabase/migrations/)
- [Auth Context](../lib/contexts/auth-context.tsx)
- [Login Page](../app/login/page.tsx)

## 💡 Next Steps

1. Run one of the scripts above
2. Navigate to `http://localhost:3000/login`
3. Login with PIN `2025`
4. Start managing property images!

---

**Need help?** Check the main README or contact support.
