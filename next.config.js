/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/llm/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/llm/:path*"
            : "/api/llm/",
      },
    ];
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/api/llm/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         { key: "Access-Control-Allow-Methods", value: "GET, POST" },
  //         { key: "Access-Control-Allow-Headers", value: "Content-Type" },
  //       ]
  //     }
  //   ]
  // }
};

module.exports = nextConfig;
