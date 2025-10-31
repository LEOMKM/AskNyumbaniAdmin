# AskNyumbani Admin Dashboard

A modern, responsive admin dashboard for managing the AskNyumbani real estate platform. Built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

- 🖼️ **Image Management** - Review, approve, and reject property images
- 🏠 **Property Management** - View and manage property listings
- 📊 **Analytics Dashboard** - Track platform activity and metrics
- 🔐 **Secure Authentication** - Admin-only access with Supabase Auth
- 🌓 **Dark Mode** - Automatic theme switching
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Real-time Updates** - Live data synchronization with Supabase

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Backend:** Supabase (PostgreSQL + Storage)
- **State Management:** React Query (TanStack Query)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase account and project
- Admin email configured in Supabase

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yqilhwaexdehmrcdblgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
NEXT_PUBLIC_ADMIN_EMAIL=admin@asknyumbani.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

### Project Structure

```
AskNyumbani(Admin)/
├── app/                    # Next.js App Router
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard home
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin-header.tsx   # Header component
│   ├── admin-activity-log.tsx
│   └── ui/               # Reusable UI components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client
│   └── utils.ts          # Helper functions
├── public/               # Static assets
├── .env.local           # Environment variables (not committed)
├── netlify.toml         # Netlify configuration
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Deployment

### Deploy to Netlify (Recommended)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**

1. Push code to Git repository
2. Connect to Netlify
3. Set environment variables
4. Deploy!

Or use the deployment script:

```bash
./deploy-to-netlify.sh
```

### Manual Build

```bash
# Build the application
npm run build

# Test production build locally
npm start
```

## Configuration

### Supabase Setup

1. **Create Tables**
   - `properties` - Property listings
   - `property_images` - Property images with approval status

2. **Storage Buckets**
   - `property-images` - Public bucket for property images

3. **Row Level Security**
   - Configure RLS policies for admin access
   - Set up authentication rules

4. **Admin User**
   - Create admin user in Supabase Auth
   - Use email matching `NEXT_PUBLIC_ADMIN_EMAIL`

### Image Domains

Configure allowed image domains in `next.config.js`:

```javascript
images: {
  domains: ['yqilhwaexdehmrcdblgz.supabase.co'],
}
```

## Features Guide

### Image Review

- View pending property images
- Approve or reject images with one click
- See image metadata and property details
- Real-time updates as images are submitted

### Property Management

- View all properties in the system
- Filter by status, type, location
- Edit property details
- Delete properties

### Activity Log

- Track all admin actions
- View system events
- Monitor property submissions
- Audit trail for compliance

## Security

- Environment variables for sensitive data
- Admin-only authentication
- Row-level security in Supabase
- HTTPS enforced in production
- Security headers configured
- No API keys in client code

## Performance

- Static page generation where possible
- Image optimization with Next.js Image
- Code splitting and lazy loading
- Compression enabled
- CDN delivery via Netlify

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Build Errors

**Module not found:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

**TypeScript errors:**
```bash
npm run type-check
```

### Runtime Issues

**Images not loading:**
- Check Supabase URL in environment variables
- Verify image domains in `next.config.js`
- Check Supabase storage bucket is public

**Authentication fails:**
- Verify Supabase anon key is correct
- Check admin email matches environment variable
- Clear browser cache and cookies

**Data not updating:**
- Check Supabase connection
- Verify RLS policies are correct
- Check browser console for errors

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Admin user email | ✅ |

## License

© 2024 Codzure Solutions Limited. All rights reserved.

Private - AskNyumbani Real Estate Platform

## Company

**Codzure Solutions Limited**
Building innovative real estate technology solutions for Kenya and beyond.

## Support

For issues or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review Supabase logs for backend issues
- Check Netlify logs for deployment issues

## Related Projects

- **AskNyumbani Android App** - Mobile application for property browsing
- **AskNyumbani Backend** - Supabase configuration and database schema

---

Built with ❤️ by **Codzure Solutions Limited**
AskNyumbani Real Estate Platform
