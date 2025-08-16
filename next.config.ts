import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Desabilitar cache para desenvolvimento
  experimental: {
    // Força re-renderização em desenvolvimento
    optimizePackageImports: [],
  },
  
  // Configurações de cache
  generateEtags: false,
  
  // Headers para desabilitar cache
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  
  // Configurações para PWA
  compress: false,
  
  // Configurações de build
  output: 'standalone',
  
  // Configurações de imagem
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
