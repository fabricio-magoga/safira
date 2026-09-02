import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["unpdf", "pdfjs-dist"],
  allowedDevOrigins: ["127.0.0.1", "localhost", "10.18.8.63"],
};

export default nextConfig;
