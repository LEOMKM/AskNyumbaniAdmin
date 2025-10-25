# AskNyumbani Admin Panel

**Image Review & Approval System for AskNyumbani Real Estate App**

A modern React-based admin panel for reviewing and approving property images before they appear in the main AskNyumbani mobile application.

---

## 🎨 Design System

This admin panel follows the **AskNyumbani design system** with:

- **Primary Color**: Cyan (#00BCD4) - NyumbaniCyan
- **Background**: Soft white in light mode, very dark brown (#1A1412) in dark mode  
- **Surface**: White in light mode, dark surface (#312A27) in dark mode
- **Headers**: Cyan background with white text
- **Cards**: Clean white/dark surface with subtle elevation
- **Typography**: Consistent with Material Design 3

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment template and configure:

```bash
cp env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_EMAIL=admin@asknyumbani.com
```

### 3. Database Migration

Run the admin review migration to add the necessary fields:

```sql
-- Run this in your Supabase SQL Editor
-- File: supabase/migrations/20250115000000_add_admin_review_fields.sql
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the admin panel.

---

## 📋 Features

### Image Review Dashboard
- **Real-time Statistics**: Pending, approved, and rejected image counts
- **Filter System**: View images by status (pending, approved, rejected, all)
- **Bulk Actions**: Select and approve multiple images at once
- **Search & Filter**: Find specific images quickly

### Image Review Interface
- **High-Quality Preview**: Full-size image viewing with zoom
- **Property Context**: View property details and owner information
- **Quick Actions**: Approve or reject images with one click
- **Detailed Review**: Modal with comprehensive image information
- **Rejection Reasons**: Provide specific feedback for rejected images

### Admin Management
- **Review History**: Track all approval/rejection decisions
- **Audit Trail**: See who reviewed what and when
- **Status Tracking**: Monitor review progress in real-time
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## 🗄️ Database Schema

The admin system adds these fields to the existing `property_images` table:

```sql
-- Admin review fields
admin_approved BOOLEAN DEFAULT NULL,           -- NULL = pending, TRUE = approved, FALSE = rejected
admin_reviewed_at TIMESTAMPTZ DEFAULT NULL,    -- When the review was completed
admin_reviewed_by UUID DEFAULT NULL,           -- Which admin reviewed it
admin_rejection_reason TEXT DEFAULT NULL       -- Reason for rejection (if rejected)
```

### Database Views

**Pending Reviews View:**
```sql
SELECT * FROM pending_image_reviews
-- Shows all images awaiting review with property and owner details
```

**Review History View:**
```sql
SELECT * FROM image_review_history  
-- Shows all reviewed images with reviewer information
```

---

## 🔧 Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom AskNyumbani theme
- **UI Components**: shadcn/ui + custom components
- **State Management**: React Query (TanStack Query)
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Date Handling**: date-fns

---

## 📁 Project Structure

```
Admin(AN)/
├── app/                          # Next.js app directory
│   ├── globals.css              # Global styles with AskNyumbani theme
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main dashboard page
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── image-review-dashboard.tsx
│   ├── image-review-grid.tsx
│   ├── image-review-card.tsx
│   ├── image-review-modal.tsx
│   ├── image-review-filters.tsx
│   └── bulk-actions.tsx
├── lib/                         # Utilities and configurations
│   ├── hooks/                   # React Query hooks
│   ├── providers/               # Context providers
│   ├── supabase/                # Supabase client
│   └── types/                   # TypeScript types
├── supabase/                    # Database migrations
│   └── migrations/
└── README.md                    # This file
```

---

## 🎯 Usage Guide

### For Administrators

1. **Login**: Access the admin panel with your admin credentials
2. **Review Images**: 
   - View pending images in the main dashboard
   - Click on any image to see detailed information
   - Use quick approve/reject buttons or the detailed modal
3. **Bulk Actions**:
   - Select multiple images using checkboxes
   - Use bulk approve for multiple images at once
4. **Monitor Progress**:
   - Check statistics cards for overview
   - Use filters to view specific image statuses
   - Review history to see past decisions

### Image Review Process

1. **Property owners upload images** to their properties
2. **Images appear in admin panel** with "Pending" status
3. **Admin reviews each image**:
   - Checks image quality and appropriateness
   - Verifies it matches the property description
   - Approves or rejects with reason
4. **Approved images appear** in the main AskNyumbani app
5. **Rejected images are hidden** with feedback to the owner

---

## 🔒 Security & Permissions

### Row Level Security (RLS)

The admin system uses Supabase RLS policies:

```sql
-- Only verified agents/admins can review images
CREATE POLICY "Admins can view all images for review"
    ON public.property_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.user_type IN ('agent', 'both')
            AND profiles.is_verified = TRUE
        )
    );
```

### Admin Access Requirements

To access the admin panel, users must:
- Have a verified profile in the `profiles` table
- Have `user_type` set to `'agent'` or `'both'`
- Have `is_verified` set to `TRUE`

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add your Supabase credentials
3. **Deploy**: Automatic deployment on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

---

## 🔄 Integration with Main App

### Mobile App Changes Required

To integrate with the main AskNyumbani app, update the image queries:

```kotlin
// Only show approved images in the main app
val approvedImages = supabase
    .from("property_images")
    .select("*")
    .eq("admin_approved", true)  // Only approved images
    .eq("property_id", propertyId)
```

### Image Status Flow

1. **Upload**: Image uploaded with `admin_approved = NULL`
2. **Review**: Admin reviews and sets `admin_approved = TRUE/FALSE`
3. **Display**: Main app only shows `admin_approved = TRUE` images
4. **Feedback**: Rejected images can be re-uploaded by property owners

---

## 🐛 Troubleshooting

### Common Issues

**"Unable to connect to Supabase"**
- Check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Verify your Supabase project is active

**"No images showing"**
- Ensure the database migration has been run
- Check that images exist in the `property_images` table
- Verify RLS policies allow admin access

**"Permission denied"**
- Ensure your user profile has `user_type = 'agent'` and `is_verified = TRUE`
- Check Supabase RLS policies

### Debug Mode

Enable debug logging by adding to your environment:

```env
NEXT_PUBLIC_DEBUG=true
```

---

## 📈 Future Enhancements

- **AI-Powered Review**: Automatic image quality assessment
- **Batch Upload Review**: Review multiple images from same property
- **Email Notifications**: Notify property owners of review decisions
- **Advanced Analytics**: Review performance metrics and trends
- **Image Editing**: Basic crop/rotate tools for approved images
- **Custom Review Rules**: Configurable approval criteria

---

## 📞 Support

For technical support or questions:
- **Email**: admin@asknyumbani.com
- **Documentation**: See `/supabase/` folder for database docs
- **Issues**: Create GitHub issues for bugs or feature requests

---

## 📄 License

Copyright © 2025 Codzure Group. All rights reserved.

---

*Built with ❤️ for AskNyumbani Real Estate Platform*
