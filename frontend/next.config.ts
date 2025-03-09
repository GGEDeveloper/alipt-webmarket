/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000", // Ajuste se o backend estiver rodando em outra porta
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
