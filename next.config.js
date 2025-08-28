/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'bro.mypinata.cloud',
            },
            {
                protocol: 'https',
                hostname: 'okbro.mypinata.cloud',
            },
            {
                protocol: 'https',
                hostname: 'ipfs.io',
            },
            {
                protocol: 'https',
                hostname: 'gateway.pinata.cloud',
            }
        ],
    },
};

module.exports = nextConfig;
