"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/provider";
import { useCart } from "@/store/cart";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const { t } = useLocale();
  const pathname = usePathname();
  const itemCount = useCart((s) => s.itemCount());
  const openCart = useCart((s) => s.open);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/menu", label: t.nav.menu },
    { href: "/delivery", label: t.nav.delivery },
    { href: "/about", label: t.nav.about },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 md:h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 18 }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-soft"
          >
            <Pizza className="h-5 w-5" />
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold tracking-tight">
              BulloniPizza
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Italian taste
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-accent"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 md:gap-2">
          <Link href="/favorites">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button
            variant="default"
            size="sm"
            className="relative h-10 px-4"
            onClick={openCart}
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">{t.nav.cart}</span>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-primary px-1"
              >
                {itemCount}
              </motion.span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
