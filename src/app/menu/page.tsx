"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { sampleCategories, sampleProducts } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="container py-12">Loading…</div>}>
      <MenuInner />
    </Suspense>
  );
}

function MenuInner() {
  const { t } = useLocale();
  const { nameOf } = useProductFields();
  const params = useSearchParams();
  const initialCat = params.get("cat") ?? "all";
  const [cat, setCat] = useState<string>(initialCat);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sampleProducts.filter((p) => {
      if (cat !== "all" && p.categorySlug !== cat) return false;
      if (!q) return true;
      return (
        p.nameUk.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.nameRu.toLowerCase().includes(q)
      );
    });
  }, [cat, query]);

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          {t.menu.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{t.menu.subtitle}</p>
      </motion.div>

      <div className="sticky top-16 md:top-20 z-20 -mx-4 px-4 py-4 bg-background/80 backdrop-blur-xl">
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.menu.search}
            className="pl-11"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <CategoryPill
            label={t.menu.all}
            icon="✨"
            active={cat === "all"}
            onClick={() => setCat("all")}
          />
          {sampleCategories.map((c) => (
            <CategoryPill
              key={c.slug}
              label={nameOf(c)}
              icon={c.icon}
              active={cat === c.slug}
              onClick={() => setCat(c.slug)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cat + query}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6"
        >
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <p className="text-5xl mb-3">🍕</p>
          <p>{t.menu.empty}</p>
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
        active
          ? "bg-foreground text-background"
          : "bg-secondary text-foreground hover:bg-accent"
      )}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
