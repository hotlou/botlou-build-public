import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "botlou build public - agent team demo",
  description:
    "An educational, interactive build-in-public demo for a Telegram-directed agent team."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
