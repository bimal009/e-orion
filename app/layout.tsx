import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";


import SessionWrapper from "@/lib/providers/SessionWrapper";
import Providers from "@/lib/providers/QueryProviders";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "E-ORION - Command The Game, Conquer The Rankings",
  description:
    "Live esports production with real-time stats, rankings, and domination tracking – powered by innovation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${roboto.className} antialiased mx-auto bg-background`}
      >
        <NuqsAdapter>
        <SessionWrapper>
          <Providers>

          {children}
          </Providers>
        </SessionWrapper>
        </NuqsAdapter>
      </body>
    </html>
  );
}
