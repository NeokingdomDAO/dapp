/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
});

// module.exports = withPWA({
//   reactStrictMode: false,
//   compiler: {
//     emotion: true,
//   },
//   typescript: {
//     // !! WARN !!
//     // Dangerously allow production builds to successfully complete even if
//     // your project has type errors.
//     // !! WARN !!
//     ignoreBuildErrors: true,
//   },
// });

module.exports = {
  reactStrictMode: false,
  compiler: {
    emotion: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
