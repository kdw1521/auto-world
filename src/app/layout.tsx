import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans_KR, Noto_Serif_KR, Space_Mono } from "next/font/google";
import "./globals.css";

import SiteHeader from "@/components/nav/site-header";
import TopActionsMenu from "@/components/nav/top-actions-menu";
import ToastEvents from "@/components/notifications/toast-events";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import SiteFooter from "@/components/sections/site-footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";
const siteName = "AutoWorld 자동화 커뮤니티";
const siteDescription =
  "사무업무 자동화를 공유하고 공감받는 커뮤니티. 이메일/비밀번호로 참여합니다.";

const notoSans = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerif = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "사무 자동화",
    "업무 자동화",
    "자동화 커뮤니티",
    "업무 팁",
    "업무 프로세스",
  ],
  authors: [{ name: "AutoWorld" }],
  creator: "AutoWorld",
  publisher: "AutoWorld",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName,
    title: siteName,
    description: siteDescription,
    images: [
      {
        url: "/hero-automation.svg",
        width: 1200,
        height: 900,
        alt: "AutoWorld 자동화 커뮤니티",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: ["/hero-automation.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSans.variable} ${notoSerif.variable} ${spaceMono.variable} antialiased`}
      >
        <SiteHeader />
        {children}
        <TopActionsMenu />
        <Suspense fallback={null}>
          <ToastEvents />
        </Suspense>
        <Toaster />
        <Analytics />
        <SiteFooter />
      </body>
    </html>
  );
}
