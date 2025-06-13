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
  // The experimental.turbopack option was removed as it's invalid for Next.js 15.3.3
  // Turbopack is default for `next dev` in v15. If explicit opt-out is needed,
  // it's usually done via CLI flags like `--no-turbo` in package.json script,
  // but the config option itself was causing the error.
};

export default nextConfig;
