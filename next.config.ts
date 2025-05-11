import type { NextConfig } from "next";


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'veqtcxckwjcfwgepkrmw.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}





export default nextConfig;


