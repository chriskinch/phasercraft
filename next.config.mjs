/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'dist',
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
