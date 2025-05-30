import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
})

export const metadata: Metadata = {
  title: "E-ORION - Command The Game, Conquer The Rankings",
  description: "Live esports production with real-time stats, rankings, and domination tracking – powered by innovation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${poppins.className} antialiased  mx-auto bg-gradient-to-b from-primary/20 to-background`}
        suppressHydrationWarning={true}
      >
        <Header/>
        {children}
      </body>
    </html>
  );
}