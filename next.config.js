/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/llm-api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/llm-api/:path*"
            : "/llm-api/",
      },
    ];
  },
};

module.exports = nextConfig;
