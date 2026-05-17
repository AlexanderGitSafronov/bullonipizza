"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/provider";
import { sampleProducts } from "@/lib/sample-data";

export function Popular() {
  const { t } = useLocale();
  const popular = sampleProducts.filter((p) => p.isPopular);

  return (
    <section className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
      >
        <div>
          <Badge variant="hot" className="mb-3">
            <Flame className="h-3 w-3" /> {t.popular.badge}
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            {t.popular.title}
          </h2>
          <p className="mt-2 text-muted-foreground max-w-xl">
            {t.popular.subtitle}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {popular.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
