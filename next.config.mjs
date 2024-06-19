/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    prependData: `@import "@/styles/abstracts/_variables.scss";`,
  },
};

export default nextConfig;
