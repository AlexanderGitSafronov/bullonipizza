"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/i18n/provider";
import { Testimonials } from "@/components/sections/testimonials";
import { Features } from "@/components/sections/features";

export default function AboutPage() {
  const { locale } = useLocale();
  const text = {
    uk: {
      title: "Наша історія",
      body: "BulloniPizza — це команда італійських кулінарів та локальних пристрасних піцайоло. Ми створюємо піцу з душею Сицилії та сучасним відчуттям. Свіже тісто щодня, фермерські інгредієнти та десятки рецептів, які ми любимо самі.",
    },
    en: {
      title: "Our story",
      body: "BulloniPizza is a crew of Italian chefs and passionate local pizzaiolos. We craft pizza with a soul of Sicily and a modern vibe — fresh dough every day, farm ingredients, and dozens of recipes we love ourselves.",
    },
    ru: {
      title: "Наша история",
      body: "BulloniPizza — команда итальянских поваров и страстных локальных пиццайоло. Мы готовим пиццу с душой Сицилии и современным вайбом — свежее тесто каждый день, фермерские ингредиенты и десятки рецептов, которые мы любим сами.",
    },
  }[locale];

  return (
    <>
      <section className="container py-12 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            {text.title}
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl">
            {text.body}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[400px] rounded-3xl overflow-hidden shadow-card"
        >
          <Image
            src="https://images.unsplash.com/photo-1593504049359-74330189a345?w=1200&q=80"
            alt="BulloniPizza kitchen"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </section>
      <Features />
      <Testimonials />
    </>
  );
}
