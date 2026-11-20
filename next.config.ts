import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 주소에 언어가 없으면 한국어로 보냅니다.
  async redirects() {
    return [
      { source: "/", destination: "/ko", permanent: false },
      { source: "/life", destination: "/ko/life", permanent: false },
    ];
  },
};

export default nextConfig;
