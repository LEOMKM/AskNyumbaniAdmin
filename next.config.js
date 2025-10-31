/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization for Supabase storage
  images: {
    domains: ['yqilhwaexdehmrcdblgz.supabase.co'],
    // Optimize for Netlify deployment
    unoptimized: process.env.NETLIFY === 'true' ? true : false,
  },

  // Output configuration for Netlify
  output: process.env.NETLIFY === 'true' ? 'standalone' : undefined,

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // React strict mode for better development experience
  reactStrictMode: true,

  // Compress pages for better performance
  compress: true,

  // Environment variable validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_ADMIN_EMAIL: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for module not found errors
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
}

module.exports = nextConfig
