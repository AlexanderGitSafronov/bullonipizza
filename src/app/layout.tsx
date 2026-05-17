import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteShell } from "@/components/layout/site-shell";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BulloniPizza — Authentic Italian pizza, delivered",
  description:
    "Premium Italian pizza delivery. Fresh ingredients, thin crust, secret Sicilian recipes. Order in 2 taps.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "BulloniPizza",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "BulloniPizza",
    description: "Authentic Italian pizza, delivered in 30 minutes.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF8F1" },
    { media: "(prefers-color-scheme: dark)", color: "#16100B" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen`}
      >
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
