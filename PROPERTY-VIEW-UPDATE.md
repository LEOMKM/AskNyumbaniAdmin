# Property-Based View Implementation

## ✅ What's Been Done

### 1. Database Structure Analysis
- Confirmed `properties` table with all property fields
- Confirmed `property_images` table with `property_id` foreign key
- Verified join relationship works correctly

### 2. Created New Hooks (`lib/hooks/use-property-reviews.ts`)
- `usePropertiesWithPendingImages()` - Fetches properties with pending images
- `useAllPropertiesWithImages(filter)` - Fetches all properties filtered by approval status
- `useApprovePropertyImages()` - Approves all images for a property
- `useRejectPropertyImages()` - Rejects images for a property
- `usePropertyReviewStats()` - Gets statistics for dashboard

### 3. Created PropertyCard Component (`components/property-card.tsx`)
- Shows property with image carousel
- Displays: title, location, price, bedrooms, bathrooms, sq meters
- Shows pending images count badge
- Carousel navigation (prev/next buttons)
- Image status badges (pending/approved/rejected)
- Click to open property details

---

## 🚧 What Needs to Be Created

### 1. Property Detail Modal
**File:** `components/property-detail-modal.tsx`

**Features Needed:**
- Full-screen modal with property details
- Large image carousel with all images
- Property information panel:
  - Title, description, address
  - Price, bedrooms, bathrooms, kitchen_areas
  - Square feet/meters
  - Property type, deal type, status
- Image review section for each image:
  - Approve/Reject individual images
  - Or approve/reject all images at once
  - Add comments
  - See existing admin comments/rejection reasons
- Close button
- Keyboard navigation (Esc to close, arrows for carousel)

### 2. Properties Grid Component
**File:** `components/properties-review-grid.tsx`

**Features:**
- Grid layout of PropertyCard components
- Filter by pending/approved/rejected
- Loading state
- Empty state (no properties)
- Error handling

### 3. Update Dashboard
**File:** `components/image-review-dashboard.tsx`

**Changes:**
- Replace `ImageReviewGrid` with `PropertiesReviewGrid`
- Update stats to use `usePropertyReviewStats`
- Update filters to work with properties

---

## 📋 Implementation Steps

### Step 1: Create Property Detail Modal

```tsx
// components/property-detail-modal.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { PropertyWithImages } from '@/lib/hooks/use-property-reviews'
import useEmblaCarousel from 'embla-carousel-react'
// ... full carousel with property details and approve/reject buttons
```

**Key Features:**
- Full image carousel
- Property details sidebar
- Approve/Reject buttons for:
  - All pending images
  - Individual images
- Comment input for approval/rejection
- Rejection reason dropdown

### Step 2: Create Properties Grid

```tsx
// components/properties-review-grid.tsx
'use client'

import { useState } from 'react'
import { PropertyCard } from '@/components/property-card'
import { PropertyDetailModal } from '@/components/property-detail-modal'
import { usePropertiesWithPendingImages, useAllPropertiesWithImages } from '@/lib/hooks/use-property-reviews'

export function PropertiesReviewGrid({ filter }: { filter: 'pending' | 'approved' | 'rejected' | 'all' }) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithImages | null>(null)

  // Fetch data based on filter
  // Show grid of PropertyCard
  // Handle click to open PropertyDetailModal
}
```

### Step 3: Update Dashboard

Replace the old image-based grid with the new property-based grid:

```tsx
// components/image-review-dashboard.tsx

import { PropertiesReviewGrid } from '@/components/properties-review-grid'
import { usePropertyReviewStats } from '@/lib/hooks/use-property-reviews'

// Update stats to use new hook
// Replace ImageReviewGrid with PropertiesReviewGrid
```

---

## 🎨 UI/UX Improvements

### Property Card
- ✅ Image carousel with indicators
- ✅ Pending images count badge
- ✅ Property details (bedrooms, price, location)
- ✅ Hover effects and transitions
- ✅ Click to open full details

### Property Detail Modal
- 🔲 Large image carousel (center)
- 🔲 Property info panel (right sidebar)
- 🔲 Image-by-image review option
- 🔲 Bulk approve/reject all pending
- 🔲 Comments/notes section
- 🔲 Previous admin actions history

### Dashboard
- 🔲 Same stats cards (pending, approved, rejected)
- 🔲 Filters work with properties
- 🔲 Grid shows properties not individual images

---

## 🔧 Technical Details

### Database Query Optimization

The new hook uses:
```sql
SELECT properties.*, property_images.*
FROM properties
INNER JOIN property_images ON properties.id = property_images.property_id
WHERE property_images.admin_approved IS NULL
```

This groups images by property automatically.

### Carousel Library

Using `embla-carousel-react`:
- Smooth touch/mouse dragging
- Loop through images
- Programmatic navigation
- Responsive
- Lightweight

---

## 🚀 How to Complete

### Quick Implementation:

1. **Create Property Detail Modal** (30 min)
   - Copy carousel code from PropertyCard
   - Add larger image display
   - Add property info panel
   - Add approve/reject buttons

2. **Create Properties Grid** (15 min)
   - Map through properties
   - Render PropertyCard for each
   - Handle modal open/close

3. **Update Dashboard** (10 min)
   - Import new components
   - Replace old grid
   - Update stats hook

### Test Flow:

1. Open dashboard → See properties (not individual images)
2. Click property → Opens modal with all images
3. Review images → Approve/Reject
4. Close modal → Property disappears from pending

---

## 📊 Before vs After

### Before (Wrong):
```
Dashboard
  ├─ Image Card 1 (Property A, Image 1)
  ├─ Image Card 2 (Property A, Image 2)
  ├─ Image Card 3 (Property A, Image 3)
  ├─ Image Card 4 (Property B, Image 1)
  └─ Image Card 5 (Property B, Image 2)
```

Each image shown separately - confusing!

### After (Correct):
```
Dashboard
  ├─ Property Card A
  │   └─ Carousel: [Image 1, Image 2, Image 3]
  └─ Property Card B
      └─ Carousel: [Image 1, Image 2]
```

Click Property Card → Opens Property Detail Modal with full carousel

---

## 🎯 Next Steps

I'll now create the remaining components:
1. Property Detail Modal
2. Properties Review Grid
3. Update Dashboard

Would you like me to proceed with creating these components?
