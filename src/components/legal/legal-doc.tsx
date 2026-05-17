"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/i18n/provider";

type Doc = {
  updated: string;
  intro: string;
  sections: { title: string; body: string[] }[];
};

export function LegalDoc({
  title,
  doc,
}: {
  title: string;
  doc: Record<"uk" | "en" | "ru", Doc>;
}) {
  const { locale, t } = useLocale();
  const d = doc[locale];

  return (
    <div className="container py-8 md:py-16 max-w-3xl">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-muted-foreground mt-3">
          {locale === "en" ? "Updated" : locale === "ru" ? "Обновлено" : "Оновлено"}:{" "}
          {d.updated}
        </p>
        <p className="mt-6 text-base text-foreground/80 leading-relaxed">
          {d.intro}
        </p>

        <div className="mt-10 space-y-8">
          {d.sections.map((s, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <h2 className="font-display text-xl font-bold mb-3">
                {s.title}
              </h2>
              <div className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
