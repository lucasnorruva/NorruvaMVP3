import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/norruva.firebasestorage.app/o/**',
      },
    ],
  },
  allowedDevOrigins: [
    'https://9003-firebase-studio-1749131649534.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev',
    'https://9000-firebase-studio-1749754683363.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev',
    'https://9003-firebase-studio-1749754683363.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev', // Added this line
  ],
};

export default nextConfig;
