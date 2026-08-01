/** @type {import('next').NextConfig} */
const nextConfig = {
  // Everything the product does happens in the browser: the catalog is a static
  // JSON bundle, projects live in localStorage, and share links carry their own
  // state in the URL. So we ship a fully static site — nothing to pay for,
  // nothing to keep running, and it deploys to any free static host.
  output: "export",

  // Static export has no image optimizer, and we don't need one:
  // scripts/build-images.mjs already emits sized WebP variants at build time.
  images: { unoptimized: true },

  // Emits /poses/index.html rather than /poses.html, which every static host
  // serves correctly with no redirect rules.
  trailingSlash: true,

  reactStrictMode: true,
};

export default nextConfig;
