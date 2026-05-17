"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { useFavorites } from "@/store/favorites";
import { useLocale } from "@/i18n/provider";
import { sampleProducts } from "@/lib/sample-data";

export default function FavoritesPage() {
  const { t } = useLocale();
  const ids = useFavorites((s) => s.ids);
  const items = sampleProducts.filter((p) => ids.includes(p.id));

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-soft">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {t.nav.favorites}
          </h1>
          <p className="text-muted-foreground text-sm">
            {items.length} {t.nav.favorites.toLowerCase()}
          </p>
        </div>
      </motion.div>

      {items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-5xl mb-3">💔</p>
          <p className="text-muted-foreground mb-6">
            {t.nav.favorites}: 0
          </p>
          <Link href="/menu">
            <Button>{t.cart.browse}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
