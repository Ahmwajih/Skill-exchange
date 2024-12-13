/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: "/api/socket",
                headers: [
                    { key: "Connection", value: "Upgrade" },
                    { key: "Upgrade", value: "websocket" },
                ],
            },
        ];
    },
    images: {
        domains: ['cdn.builder.io'],
        dangerouslyAllowSVG: true,
    },
};

module.exports = nextConfig;
