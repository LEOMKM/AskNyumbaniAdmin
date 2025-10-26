# AskNyumbani Admin Panel Overview

## Purpose
The AskNyumbani admin panel is a Next.js 14 dashboard that moderates property imagery, monitors approval metrics, and manages admin-only tasks. It consumes the same Supabase backend as the mobile app while layering access control through custom RPC functions and RLS-safe queries.

## Core Flows
1. **Authentication**
   - Email/password or PIN-based login using `admin_login` and `admin_login_with_pin` Supabase functions.
   - Session tokens persisted in local storage and validated by `validate_admin_session`.
2. **Pending Image Review**
   - `pending_image_reviews` view streams unmoderated images.
   - Quick approve executes a single RPC (`approve_property_image`) without requiring comments.
   - Reject enforces a textual reason and purges the object from Supabase Storage plus Postgres via `reject_property_image`.
3. **Bulk Operations**
   - Select multiple pending images, confirm bulk approval, and log the action.
4. **Activity Visibility**
   - Real-time cards show counts of pending/approved/total images.
   - Recent activity timeline decorates each admin action with metadata and timestamps.
5. **History & Audit**
   - `image_review_history` view surfaces completed decisions with reviewer identity and timestamps.

## Feature Highlights
- Designed with shadcn/ui and Tailwind for responsive cards, modals, and grids.
- Activity log overlay records metadata for approvals, rejections, and bulk actions.
- Storage cleanup is automatic for rejected items, avoiding orphaned public assets.
- Type-safe Supabase client wrappers in `lib/hooks` and `lib/types` keep RPC calls predictable.

## Architecture
- **components/** – Dashboard widgets, review cards, filters, modals.
- **lib/hooks/** – React Query data hooks for stats, pending queues, mutations, and activity log.
- **lib/contexts/** – Auth provider for handling session tokens.
- **supabase/** – SQL functions and policies (to be applied manually alongside the provided schema script).
- **scripts/** – Node utilities to seed admin users or run diagnostic tasks.

## Activity Logging Flow
- Approvals invoke `logAdminActivity` helper, writing to `admin_activity_log` with structured metadata.
- Rejects capture the reason, image URL, and property identifiers before deletion.
- Bulk approvals log count and the array of image IDs for audit trails.
- Dashboard fetches the last 8 entries, showing relative timestamps to keep moderators informed.

## Deployment Notes
- Requires Node 18+, npm or pnpm, and configured `.env.local` with Supabase anon URL/key plus admin defaults.
- Recommended commands:
  - `npm install`
  - `npm run dev`
  - `npm run lint` (after accepting Next.js ESLint config once)
- Deploy behind secure networks; restrict Supabase policies to trusted admin accounts.
- Sync Supabase migrations (or SQL in `ADMIN_PANEL_REFERENCE.sql`) before launch.

## Testing Checklist
- Verify login via email/password and PIN flows.
- Approve an image and confirm it surfaces in the mobile app.
- Reject an image, ensure it disappears from storage and activity log records the reason.
- Exercise bulk approval to ensure counts update and logs capture the batch.
- Validate activity feed renders expected metadata for each action.
