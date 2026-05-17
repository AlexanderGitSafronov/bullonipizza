"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { sampleCategories, sampleProducts } from "@/lib/sample-data";

export function Categories() {
  const { t, locale } = useLocale();
  const { nameOf } = useProductFields();

  return (
    <section className="container py-16 md:py-24">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          {t.categories.title}
        </h2>
        <p className="mt-2 text-muted-foreground">{t.categories.subtitle}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {sampleCategories.map((c, i) => {
          const count = sampleProducts.filter(
            (p) => p.categorySlug === c.slug
          ).length;
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/menu?cat=${c.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-border bg-card p-6 hover:shadow-soft transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{c.icon}</div>
                <h3 className="font-display text-xl font-bold">
                  {nameOf(c)}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {count} {locale === "en" ? "items" : "позицій"}
                </p>
                <ArrowRight className="absolute top-6 right-6 h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                <div className="absolute inset-x-0 -bottom-px h-1 bg-brand-gradient scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
