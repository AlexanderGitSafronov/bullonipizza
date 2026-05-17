"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/provider";

export function CTA() {
  const { t } = useLocale();

  return (
    <section className="container py-16 md:py-24">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-card border border-border p-8 md:p-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -right-32 -top-32 h-[400px] w-[400px] opacity-90 hidden md:block"
        >
          <Image
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80"
            alt=""
            fill
            sizes="400px"
            className="object-cover rounded-full"
          />
        </motion.div>

        <div className="absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-brand-gradient opacity-30 blur-3xl hidden md:block" />

        <div className="relative max-w-xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            {t.cta.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            {t.cta.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Link href="/menu">
              <Button size="lg" className="group">
                {t.cta.button}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
