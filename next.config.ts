import type { NextConfig } from "next";

// Site 100% estático: gerado em arquivos e hospedado na Cloudflare Pages.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
