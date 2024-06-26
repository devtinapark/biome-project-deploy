import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { initConfig } from "@joyid/ckb";

const inter = Inter({ subsets: ["latin"] });

initConfig({
  name: "JoyID demo",
  logo: "https://fav.farm/🆔",
  network: "testnet",
  joyidAppURL: "https://testnet.joyid.dev",
});

export const metadata: Metadata = {
  title: "BiomeProject",
  description: "GMVietnam 2024: Green Token Project by Tina Park",
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
