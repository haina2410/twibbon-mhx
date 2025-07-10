import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { campaignConfig } from "@/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: campaignConfig.title,
  description: campaignConfig.subtitle,
  keywords: [
    "volunteer",
    "campaign",
    "profile picture",
    "team",
    "summer",
    "2025",
    "Mùa hè Xanh",
    "Đại học Khoa học tự nhiên TP.HCM",
  ],
  authors: [{ name: "Ban Truyền thông Mùa hè Xanh 2025" }],
  creator: "Ban Truyền thông Mùa hè Xanh 2025",
  publisher: "Ban Truyền thông Mùa hè Xanh 2025",
  openGraph: {
    title: campaignConfig.title,
    description: campaignConfig.subtitle,
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: campaignConfig.title,
    description: campaignConfig.subtitle,
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
