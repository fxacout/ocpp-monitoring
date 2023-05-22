/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL:"http://localhost:3000",
    BACKEND_URL:"http://monitoring_log:3000"
  }
}

module.exports = nextConfig
