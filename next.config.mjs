import { execSync } from "child_process";
import withPWA from "next-pwa";
import withVercelToolbar from "@vercel/toolbar/plugins/next";

// starts a command line process to get the git hash
const commitHash = execSync('git log --pretty=format:"%h" -n1').toString().trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    emotion: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  env: {
    LATEST_COMMIT_HASH: commitHash,
    PACKAGE_VERSION: process.env.npm_package_version,
  },
};

const configWithToolbar = withVercelToolbar()(nextConfig)

export default process.env.NODE_ENV === "development" ? configWithToolbar : withPWA({
  dest: "public",
})(configWithToolbar);

