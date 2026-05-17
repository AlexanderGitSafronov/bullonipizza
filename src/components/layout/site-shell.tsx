"use client";

import { Header } from "./header";
import { Footer } from "./footer";
import { MobileNav } from "./mobile-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { StickyCartButton } from "@/components/cart/sticky-cart-button";
import { InstallPwaPrompt } from "./install-prompt";
import { CookieBanner } from "@/components/legal/cookie-banner";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <StickyCartButton />
      <InstallPwaPrompt />
      <CookieBanner />
    </div>
  );
}
