/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
  typescript: {
    // Disable type checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
