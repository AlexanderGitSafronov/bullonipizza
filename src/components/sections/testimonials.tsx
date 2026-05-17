"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLocale } from "@/i18n/provider";

export function Testimonials() {
  const { t, locale } = useLocale();

  const reviews = {
    uk: [
      {
        name: "Анна П.",
        role: "Постійний клієнт",
        text: "Найкраща піца в місті! Завжди гаряча, тісто бомбезне, доставка швидка. Замовляю щотижня.",
      },
      {
        name: "Дмитро К.",
        role: "Гурман",
        text: "Пепероні просто вогонь. Якість на рівні італійських ресторанів, ціна — приємний бонус.",
      },
      {
        name: "Олена С.",
        role: "Мама двох дітей",
        text: "Діти в захваті від маргарити. Зручний додаток, оформлюю замовлення за 30 секунд!",
      },
    ],
    en: [
      {
        name: "Anna P.",
        role: "Regular customer",
        text: "Best pizza in town! Always hot, the crust is amazing, fast delivery. I order weekly.",
      },
      {
        name: "Dmytro K.",
        role: "Foodie",
        text: "Pepperoni is fire. Quality matches Italian restaurants, the price is a nice bonus.",
      },
      {
        name: "Olena S.",
        role: "Mother of two",
        text: "Kids love the margherita. Handy app, I place an order in 30 seconds!",
      },
    ],
    ru: [
      {
        name: "Анна П.",
        role: "Постоянный клиент",
        text: "Лучшая пицца в городе! Всегда горячая, тесто бомбовое, доставка быстрая. Заказываю каждую неделю.",
      },
      {
        name: "Дмитрий К.",
        role: "Гурман",
        text: "Пепперони — огонь. Качество на уровне итальянских ресторанов, цена — приятный бонус.",
      },
      {
        name: "Елена С.",
        role: "Мама двоих детей",
        text: "Дети в восторге от маргариты. Удобное приложение, оформляю заказ за 30 секунд!",
      },
    ],
  }[locale];

  return (
    <section className="container py-16 md:py-24">
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          {t.testimonials.title}
        </h2>
        <p className="mt-2 text-muted-foreground">{t.testimonials.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {reviews.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="relative rounded-3xl border border-border bg-card p-6 shadow-card"
          >
            <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
            <div className="flex items-center gap-1 mb-3 text-amber-500">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              "{r.text}"
            </p>
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm">
                {r.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
