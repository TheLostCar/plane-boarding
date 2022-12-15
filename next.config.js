/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  eslint: {
    dirs:['pages', 'components', 'lib', 'hooks', 'models', 'util',]
  }
}

module.exports = nextConfig
