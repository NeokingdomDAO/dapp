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

// next.config.mjs
import { withSentryConfig } from "@sentry/nextjs";

const configWithSentry = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "neok",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);

const configWithToolbar = withVercelToolbar()(configWithSentry)

export default process.env.NODE_ENV === "development" ? configWithToolbar : withPWA({
  dest: "public",
})(configWithToolbar);


