"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, ChefHat, Smartphone } from "lucide-react";
import { useLocale } from "@/i18n/provider";

export function Features() {
  const { t } = useLocale();

  const items = [
    {
      icon: Sparkles,
      title: t.features.items.fresh.title,
      desc: t.features.items.fresh.desc,
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: Zap,
      title: t.features.items.fast.title,
      desc: t.features.items.fast.desc,
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: ChefHat,
      title: t.features.items.italian.title,
      desc: t.features.items.italian.desc,
      color: "from-rose-500 to-red-600",
    },
    {
      icon: Smartphone,
      title: t.features.items.pwa.title,
      desc: t.features.items.pwa.desc,
      color: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <section className="relative py-16 md:py-24">
      <div className="absolute inset-0 bg-secondary/50" />
      <div className="container relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            {t.features.title}
          </h2>
          <p className="mt-2 text-muted-foreground">{t.features.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-card border border-border p-6 hover:shadow-soft transition-shadow"
            >
              <div
                className={`absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-10 bg-gradient-to-br ${item.color} group-hover:opacity-20 transition-opacity`}
              />
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-soft mb-4`}
              >
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-display text-lg font-bold mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
