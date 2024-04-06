/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => [
      {
        source: "/anthropic/:path*",
        destination: "https://api.anthropic.com/:path*"
      },
      {
        source: "/openai/:path*",
        destination: "https://api.openai.com/v1/:path*"
      },
  ],
    
};
export default nextConfig;
