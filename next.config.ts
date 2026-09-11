import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    "@prisma/client",
    "better-sqlite3",
    "@prisma/adapter-better-sqlite3",
    "bcryptjs",
  ],
};

export default nextConfig;
