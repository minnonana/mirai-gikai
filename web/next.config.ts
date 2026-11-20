import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  experimental: {
    serverSourceMaps: true,
  },
  typedRoutes: true,
  outputFileTracingIncludes: {
    "/api/og/report": ["../packages/shared/src/og/ogp-logo.png"],
  },
  redirects: async () => [
    {
      // データ利用規約を /developers 配下へ移動した際の旧URL互換
      source: "/interview-data-terms",
      destination: "/developers/interview-data-terms",
      permanent: true,
    },
    {
      // インタビューを /i/[id] へ移動した際の旧URL互換（配布済みのリンクやQRを生かす）
      source: "/bills/:id/interview/:path*",
      destination: "/i/:id/:path*",
      permanent: true,
    },
    {
      source: "/preview/bills/:id/interview/:path*",
      destination: "/preview/i/:id/:path*",
      permanent: true,
    },
  ],
  turbopack: {
    root: "../",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "127.0.0.1",
        pathname: "/storage/v1/object/public/bill-thumbnails/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/storage/v1/object/public/bill-thumbnails/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/bill-thumbnails/**",
      },
      ...(isDev
        ? [
            {
              protocol: "https" as const,
              hostname: "placehold.co",
            },
          ]
        : []),
    ],
    ...(isDev && {
      dangerouslyAllowSVG: true,
      contentDispositionType: "attachment" as const,
      contentSecurityPolicy:
        "default-src 'self'; script-src 'none'; sandbox;",
    }),
  },
};

export default nextConfig;
