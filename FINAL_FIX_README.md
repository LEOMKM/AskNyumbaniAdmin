# Final Fix - Complete Solution

## Problem Discovered

When testing approval and rejection, we found:
```
❌ Could not choose the best candidate function between:
   - approve_property_image(p_image_id, p_admin_user_id)
   - approve_property_image(p_image_id, p_admin_user_id, p_comment)
```

This means there were **duplicate versions** of the functions in the database!

## Root Cause

The database had **multiple versions** of the same functions:
1. Old version: `approve_property_image(UUID, UUID, TEXT)` - with comment parameter
2. New version: `approve_property_image(UUID, UUID)` - without comment parameter

PostgreSQL couldn't decide which one to use, causing approval/rejection to fail.

## Complete Solution

Run this ONE script to fix everything:

### File: `COMPLETE_FIX_ALL_ISSUES.sql`

This script fixes:
1. ✅ RLS infinite recursion
2. ✅ Ambiguous email column reference in login functions
3. ✅ Duplicate approval/rejection functions
4. ✅ Hardcoded email in PIN login
5. ✅ Admin user creation/update

## How to Apply the Fix

### Step 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard
2. Select your AskNyumbani project
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### Step 2: Run the Complete Fix
1. Open file: `Admin(AN)/COMPLETE_FIX_ALL_ISSUES.sql`
2. Copy **ALL** content (it's a long script)
3. Paste into SQL Editor
4. Click **Run** or press `Ctrl+Enter`
5. Wait for success messages

### Step 3: Verify the Fix
Run the test script to verify everything works:

```bash
cd Admin\(AN\)
node scripts/test-approval-rejection.js
```

Expected output:
```
✅ Approve function works!
✅ Reject function works!
```

## What This Script Does

### Part 1: Fix RLS
- Drops problematic RLS policies
- Disables RLS on admin tables
- Uses SECURITY DEFINER functions instead

### Part 2: Admin User
- Creates admin user if doesn't exist
- Updates existing admin with correct credentials
- PIN: 2025, Password: Admin@2025

### Part 3: Fix Login Functions
- Adds table aliases (`au`) to prevent ambiguous column references
- Hardcodes email in PIN login
- Both login methods work correctly

### Part 4: Fix Duplicate Functions
**CRITICAL FIX:**
```sql
-- Drop ALL old versions
DROP FUNCTION IF EXISTS public.approve_property_image(UUID, UUID);
DROP FUNCTION IF EXISTS public.approve_property_image(UUID, UUID, TEXT);

-- Create ONE clean version
CREATE FUNCTION approve_property_image(
    p_image_id UUID,
    p_admin_user_id UUID  -- No comment parameter!
)
```

### Part 5: Verification
- Confirms admin user exists
- Shows login credentials
- Lists all changes applied

## Function Signatures After Fix

```sql
-- Approval (NO comments)
approve_property_image(
  p_image_id UUID,
  p_admin_user_id UUID
) → BOOLEAN

-- Rejection (requires reason)
reject_property_image(
  p_image_id UUID,
  p_admin_user_id UUID,
  p_rejection_reason TEXT
) → BOOLEAN
```

## Testing the Complete System

### 1. Test Login
```bash
cd Admin\(AN\)
node scripts/diagnose-login.js
```

Expected:
```
✅ PASS: Login successful!
✅ PASS: PIN login successful!
```

### 2. Test Approval/Rejection
```bash
node scripts/test-approval-rejection.js
```

Expected:
```
✅ Approve function works!
✅ Reject function works!
```

### 3. Test in Browser
1. Go to: http://localhost:3000/login
2. Enter PIN: **2025**
3. Should redirect to dashboard
4. Click on a pending image
5. Click "Approve Image" - should work
6. Or enter rejection reason and click "Reject & Delete" - should work

## Frontend is Ready

The frontend code has been updated to:
- ✅ Use actual admin user ID from auth context (not hardcoded UUID)
- ✅ No comment field for approval
- ✅ Rejection requires reason
- ✅ Properly delete images from storage + database

**File:** `lib/hooks/use-image-reviews.ts`
```typescript
// Uses real admin ID
const { user } = useAuth()

// Approval - no comments
await supabase.rpc('approve_property_image', {
  p_image_id: imageId,
  p_admin_user_id: user.id,  // ✅ Real ID
})

// Rejection - requires reason
await supabase.rpc('reject_property_image', {
  p_image_id: imageId,
  p_admin_user_id: user.id,  // ✅ Real ID
  p_rejection_reason: rejectionReason.trim()
})
```

## Common Issues & Solutions

### Issue: "Could not choose the best candidate function"
**Cause:** Duplicate function versions in database
**Fix:** Run `COMPLETE_FIX_ALL_ISSUES.sql` - it drops all duplicates

### Issue: "User not authenticated"
**Cause:** Not logged in or session expired
**Fix:** Login again with PIN 2025

### Issue: "Rejection reason is required"
**Cause:** Trying to reject without entering a reason
**Fix:** Enter a reason in the textarea before clicking reject

### Issue: Image still visible after rejection
**Cause:** Database not deleting the image
**Fix:** Check the reject function was created correctly by the script

## Files Created/Updated

### SQL Scripts:
- ✅ `COMPLETE_FIX_ALL_ISSUES.sql` - All-in-one fix (USE THIS ONE)
- ✅ `FIX_ADMIN_LOGIN.sql` - Login fixes only
- ✅ `FIX_DUPLICATE_FUNCTIONS.sql` - Function fixes only
- ✅ `FIX_AMBIGUOUS_EMAIL.sql` - Email ambiguity fix only

### Frontend Code:
- ✅ `lib/hooks/use-image-reviews.ts` - Updated to use real admin ID
- ✅ `components/image-review-modal.tsx` - Already correct (no comments for approval)
- ✅ `lib/contexts/auth-context.tsx` - Already correct (provides user ID)

### Test Scripts:
- ✅ `scripts/diagnose-login.js` - Test login functions
- ✅ `scripts/test-approval-rejection.js` - Test approval/rejection functions

### Documentation:
- ✅ `FINAL_FIX_README.md` - This file
- ✅ `APPROVAL_REJECTION_FIX.md` - Frontend fix details
- ✅ `LOGIN_FIX_SUMMARY.md` - Login fix details

## Next Steps

1. **Run the SQL script:**
   ```
   File: Admin(AN)/COMPLETE_FIX_ALL_ISSUES.sql
   Location: Supabase SQL Editor
   ```

2. **Verify with tests:**
   ```bash
   node scripts/diagnose-login.js
   node scripts/test-approval-rejection.js
   ```

3. **Test in browser:**
   ```
   Login: http://localhost:3000/login
   PIN: 2025
   ```

4. **Start reviewing images:**
   - Approve with one click
   - Reject with a reason

---

## Summary

✅ **Login:** Fixed ambiguous email, hardcoded email in PIN login
✅ **Approval:** No comments required, one-click approval
✅ **Rejection:** Requires reason, deletes image permanently
✅ **Database:** Removed duplicate functions, clean signatures
✅ **Frontend:** Uses real admin ID from auth context

**Everything is ready. Just run the SQL script and test!**
