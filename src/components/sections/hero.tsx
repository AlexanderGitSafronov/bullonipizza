"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/provider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-warm-radial pointer-events-none" />
      <div
        className="absolute top-1/2 -right-40 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl bg-brand-gradient pointer-events-none"
        aria-hidden
      />

      <div className="container relative pt-10 md:pt-20 pb-16 md:pb-28 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <Badge variant="glass" className="mb-5">
            {t.hero.badge}
          </Badge>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            {t.hero.title}
            <br />
            <span className="text-gradient">{t.hero.titleAccent}</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl lg:mx-0 mx-auto">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link href="/menu">
              <Button size="lg" className="group">
                {t.hero.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="glass">
                {t.hero.secondary}
              </Button>
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md lg:mx-0 mx-auto">
            {[
              { icon: Pizza, value: "50+", label: t.hero.stats.pizzas },
              { icon: Truck, value: "30", label: t.hero.stats.delivery },
              { icon: Star, value: "4.9", label: t.hero.stats.rating },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-center lg:text-left"
              >
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <s.icon className="h-4 w-4 text-primary" />
                  <span className="font-display text-2xl font-bold">
                    {s.value}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative h-[420px] md:h-[560px]"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-6 md:inset-10 rounded-full overflow-hidden shadow-glow"
          >
            <Image
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80"
              alt="Hero pizza"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute top-8 left-0 glass rounded-2xl p-3 shadow-card flex items-center gap-3 max-w-[200px]"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Truck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold">30 min</p>
              <p className="text-[10px] text-muted-foreground">
                {t.delivery.time}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-10 right-0 glass rounded-2xl p-3 shadow-card flex items-center gap-3 max-w-[200px]"
          >
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold">4.9 / 5.0</p>
              <p className="text-[10px] text-muted-foreground">
                10,000+ {t.hero.stats.rating.toLowerCase()}
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
