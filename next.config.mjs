/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google OAuth avatars
    ],
  },
  // Required for pdf-parse-new to work in serverless functions
  serverExternalPackages: ['pdf-parse-new'],
};

export default nextConfig;
