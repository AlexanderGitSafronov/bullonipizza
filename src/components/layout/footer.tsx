"use client";

import Link from "next/link";
import { Pizza, Instagram, Facebook, Send } from "lucide-react";
import { useLocale } from "@/i18n/provider";

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="relative mt-24 border-t border-border bg-secondary/40">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-soft">
              <Pizza className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold">BulloniPizza</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            {t.brand.tagline}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">{t.nav.menu}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/menu?cat=pizza" className="hover:text-foreground">{t.nav.menu}</Link></li>
            <li><Link href="/menu?cat=drinks" className="hover:text-foreground">Drinks</Link></li>
            <li><Link href="/menu?cat=desserts" className="hover:text-foreground">Desserts</Link></li>
            <li><Link href="/favorites" className="hover:text-foreground">{t.nav.favorites}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">{t.nav.contacts}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t.footer.address}</li>
            <li>
              <a href="tel:+380671234567" className="hover:text-foreground">
                {t.footer.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${t.footer.email}`}
                className="hover:text-foreground"
              >
                {t.footer.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">{t.footer.follow}</h4>
          <div className="flex gap-2">
            {[
              { icon: Instagram, href: "#" },
              { icon: Facebook, href: "#" },
              { icon: Send, href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-4 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} BulloniPizza. {t.footer.rights}.</span>
          <nav className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/legal/privacy" className="hover:text-foreground">
              {t.legal.privacy}
            </Link>
            <Link href="/legal/cookies" className="hover:text-foreground">
              {t.legal.cookies}
            </Link>
            <Link href="/legal/terms" className="hover:text-foreground">
              {t.legal.terms}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
