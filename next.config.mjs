/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["172.16.12.69"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
