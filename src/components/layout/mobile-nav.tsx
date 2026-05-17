"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pizza, Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocale } from "@/i18n/provider";
import { useCart } from "@/store/cart";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const itemCount = useCart((s) => s.itemCount());
  const openCart = useCart((s) => s.open);

  const items = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/menu", label: t.nav.menu, icon: Pizza },
    { href: "/favorites", label: t.nav.favorites, icon: Heart },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 px-3 pb-3">
      <div className="glass rounded-3xl flex items-center justify-around p-2 shadow-card border border-border">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-colors min-w-[60px]",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="mobnav"
                  className="absolute inset-0 bg-accent rounded-2xl -z-10"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl min-w-[60px] text-muted-foreground"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </div>
          <span className="text-[10px] font-medium">{t.nav.cart}</span>
        </button>
      </div>
    </nav>
  );
}
