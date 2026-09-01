import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";

import { siteConfig } from "../src/data";
import "./globals.css";

const ADSENSE_CLIENT = "ca-pub-5233282360340103";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.trencub.com"),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  verification: {
    google: "gdw8EYciIb9gWvNIljjlRZ_8TF8_GefDgauY26KLDM0",
    other: { "naver-site-verification": "d97735bd479411df550244e3d5787d3b7a937172" },
  },
  openGraph: {
    type: "website",
    url: "/",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script
          id="google-adsense"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        />
      </body>
    </html>
  );
}
