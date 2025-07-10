import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twibbonize - Summer Volunteer Campaign 2024",
  description:
    "Create your team profile picture for the Summer Volunteer Campaign 2024. Choose your team, upload your photo, and download your personalized profile picture with team frame.",
  keywords: [
    "volunteer",
    "campaign",
    "profile picture",
    "team",
    "summer",
    "2024",
  ],
  authors: [{ name: "Summer Volunteer Campaign Team" }],
  creator: "Summer Volunteer Campaign Team",
  publisher: "Summer Volunteer Campaign Team",
  openGraph: {
    title: "Twibbonize - Summer Volunteer Campaign 2024",
    description:
      "Create your team profile picture for the Summer Volunteer Campaign 2024",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Twibbonize - Summer Volunteer Campaign 2024",
    description:
      "Create your team profile picture for the Summer Volunteer Campaign 2024",
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
