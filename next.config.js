/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        // https://icons8.com/icon/z3YMXqHDYl9X/brain
        protocol: "https",
        hostname: "img.icons8.com",
        port: "",
      }
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/llm/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/llm/:path*"
            : "/api/",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/llm/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://www.youtube.com" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ]
      }
    ]
  }
};

module.exports = nextConfig;
