# Fix for Admin Login Ambiguous Column Error

## Problem
The admin login is failing with this PostgreSQL error:
```
{
  code: "42702",
  message: "column reference \"pin_hash\" is ambiguous",
  details: "It could refer to either a PL/pgSQL variable or a table column.",
  hint: null
}
```

## Root Cause
The error occurs in the `admin_login_with_pin` function (and possibly other admin login functions) when the query references the `pin_hash` column without explicitly specifying which table it belongs to.

This typically happens when:
1. A JOIN or subquery involves multiple tables with the same column name
2. Column names are not qualified with table aliases (e.g., `u.pin_hash`)
3. PostgreSQL can't determine which table's column to use

## The Fix
The SQL script `fix-admin-login-ambiguous-column.sql` recreates all admin login functions with:

1. **Explicit table qualifications** - All column references use table aliases:
   ```sql
   -- WRONG (causes ambiguity)
   WHERE pin_hash = v_pin_hash

   -- CORRECT (explicit)
   WHERE u.pin_hash = v_pin_hash
   ```

2. **Recreated functions**:
   - `admin_login(email, password)` - Email/password authentication
   - `admin_login_with_pin(pin)` - PIN-based authentication
   - `create_admin_pin(admin_user_id, pin)` - Create/update PIN
   - `invalidate_admin_session(session_token)` - Logout

## How to Apply the Fix

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to: **SQL Editor**
3. Click **New Query**
4. Copy the entire content of `scripts/fix-admin-login-ambiguous-column.sql`
5. Paste it into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for success message: "Success. No rows returned"

### Option 2: Using Supabase CLI
```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Direct Database Connection
```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" \
  -f scripts/fix-admin-login-ambiguous-column.sql
```

## Verify the Fix

Run the test script to verify login works:
```bash
node scripts/test-login.js
```

Or run the diagnostic script:
```bash
node scripts/diagnose-login.js
```

Expected output:
```
✅ PASS: admin_login function exists and works
✅ PASS: admin_login_with_pin function exists
✅ SUCCESS! Login working perfectly!
```

## What Changed

### Before (Ambiguous)
```sql
CREATE OR REPLACE FUNCTION admin_login_with_pin(p_pin text)
...
BEGIN
  SELECT id, is_active
  INTO v_user_id, v_is_active
  FROM admin_users
  WHERE pin_hash = v_pin_hash;  -- ❌ Ambiguous!
  ...
END;
```

### After (Explicit)
```sql
CREATE OR REPLACE FUNCTION admin_login_with_pin(p_pin text)
...
BEGIN
  SELECT u.id, u.is_active
  INTO v_user_id, v_is_active
  FROM admin_users u
  WHERE u.pin_hash = v_pin_hash;  -- ✅ Explicit!
  ...
END;
```

## Additional Notes

- The fix maintains backward compatibility - function signatures remain the same
- All existing sessions will continue to work
- No data migration required
- The functions are recreated with `CREATE OR REPLACE`, so they automatically update

## Test Credentials
After applying the fix, test with:
- **Email**: admin@asknyumbani.com
- **Password**: Admin@2025
- **PIN**: 2025

## Troubleshooting

If you still see errors after applying the fix:

1. **Check function exists**:
   ```sql
   SELECT routine_name, routine_type
   FROM information_schema.routines
   WHERE routine_schema = 'public'
   AND routine_name LIKE 'admin_login%';
   ```

2. **Check for syntax errors**:
   ```sql
   SELECT * FROM pg_stat_user_functions
   WHERE funcname LIKE 'admin_login%';
   ```

3. **Re-run the fix script** - It's safe to run multiple times

4. **Check permissions**:
   ```sql
   SELECT * FROM pg_proc
   WHERE proname LIKE 'admin_login%';
   ```

## Support
If issues persist:
1. Check Supabase logs: Dashboard → Logs → PostgreSQL Logs
2. Look for error details in the browser console (F12)
3. Run `node scripts/diagnose-login.js` for detailed diagnostics
