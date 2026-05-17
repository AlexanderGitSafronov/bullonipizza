"use client";

import { motion } from "framer-motion";
import { Truck, Clock, CreditCard, MapPin } from "lucide-react";
import { useLocale } from "@/i18n/provider";

export function DeliveryInfo() {
  const { t } = useLocale();
  const cards = [
    { icon: Truck, text: t.delivery.free },
    { icon: Clock, text: t.delivery.time },
    { icon: CreditCard, text: t.delivery.payment },
    { icon: MapPin, text: t.delivery.area },
  ];

  return (
    <section className="container py-16 md:py-24">
      <div className="rounded-[2.5rem] overflow-hidden relative bg-brand-gradient p-8 md:p-14 text-white">
        <div
          className="absolute inset-0 grain opacity-30 pointer-events-none"
          aria-hidden
        />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
              {t.delivery.title}
            </h2>
            <p className="mt-3 text-white/80 text-lg">{t.delivery.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {cards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/20"
              >
                <c.icon className="h-6 w-6 mb-2" />
                <p className="text-sm font-medium leading-tight">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
