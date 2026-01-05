import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans_KR, Noto_Serif_KR, Space_Mono } from "next/font/google";
import "./globals.css";

import SiteHeader from "@/components/nav/site-header";
import TopActionsMenu from "@/components/nav/top-actions-menu";
import ToastEvents from "@/components/notifications/toast-events";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

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
  title: "AutoWorld 자동화 커뮤니티",
  description:
    "사무업무 자동화를 공유하고 공감받는 커뮤니티. 이메일/비밀번호로 참여합니다.",
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
      </body>
    </html>
  );
}
