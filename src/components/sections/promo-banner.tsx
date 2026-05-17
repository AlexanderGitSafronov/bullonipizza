"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLocale } from "@/i18n/provider";

export function PromoBanner() {
  const { t, locale } = useLocale();
  const text = {
    uk: "🍕 -20% на першу піцу • Промокод BULLONI20 • Безкоштовна доставка від 400 ₴",
    en: "🍕 -20% on your first pizza • Code BULLONI20 • Free delivery from 400 UAH",
    ru: "🍕 -20% на первую пиццу • Промокод BULLONI20 • Бесплатная доставка от 400 ₴",
  }[locale];

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-brand-gradient text-white overflow-hidden"
    >
      <div className="container py-2.5 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
        <Sparkles className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{text}</span>
      </div>
    </motion.div>
  );
}
