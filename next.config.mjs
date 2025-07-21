/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export',
    distDir: 'dist',
    reactStrictMode: true,
    images: {
        unoptimized: true, // Disable default image optimization
    },
    assetPrefix: isProd ? '/phasercraft/dist/' : '',
    basePath: isProd ? '/phasercraft/dist' : '',
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                process: false,
                buffer: false,
                crypto: false,
                stream: false,
                util: false,
                os: false
            };
        }
        return config;
    }
};

export default nextConfig;
