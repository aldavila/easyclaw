import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EasyClaw — Deploy OpenClaw in 60 Seconds",
  description: "One-click deployment for OpenClaw. Get your personal AI assistant running on Telegram, Discord, and WhatsApp in under a minute. No servers, no SSH, no CLI.",
  openGraph: {
    title: "EasyClaw — Deploy OpenClaw in 60 Seconds",
    description: "One-click deployment for OpenClaw. Personal AI assistant on Telegram, Discord & WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
