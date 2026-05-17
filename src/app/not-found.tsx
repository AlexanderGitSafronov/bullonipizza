"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Pizza, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { sampleProducts } from "@/lib/sample-data";

export default function NotFound() {
  const { t } = useLocale();
  const { nameOf } = useProductFields();
  const popular = sampleProducts.filter((p) => p.isPopular).slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-warm-radial pointer-events-none" />
      <div
        className="absolute top-1/2 -right-40 -translate-y-1/2 h-[500px] w-[500px] rounded-full opacity-20 blur-3xl bg-brand-gradient pointer-events-none"
        aria-hidden
      />

      <div className="container relative py-12 md:py-20 grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
        {/* Left: text + actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="order-2 lg:order-1 text-center lg:text-left"
        >
          <motion.p
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
            className="font-display text-8xl md:text-[9rem] font-bold leading-none text-gradient inline-block"
          >
            {t.notFound.code}
          </motion.p>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight mt-3">
            {t.notFound.title}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-md lg:mx-0 mx-auto">
            {t.notFound.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link href="/">
              <Button size="lg">
                <Home className="h-4 w-4" />
                {t.notFound.home}
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="glass">
                <Pizza className="h-4 w-4" />
                {t.notFound.menu}
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-xs text-muted-foreground italic max-w-md lg:mx-0 mx-auto">
            💡 {t.notFound.funFact}
          </p>
        </motion.div>

        {/* Right: animated pizza with a bite */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="order-1 lg:order-2 relative h-[280px] md:h-[440px]"
        >
          {/* Rotating dashed ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-2 border-dashed border-primary/30"
          />

          {/* Floating pizza SVG */}
          <motion.div
            animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-10 drop-shadow-2xl"
          >
            <PizzaWithBite />
          </motion.div>

          {/* Missing slice flying off */}
          <motion.div
            initial={{ x: 60, y: -40, rotate: -20, opacity: 0 }}
            animate={{
              x: [60, 80, 100, 80, 60],
              y: [-40, -60, -40, -20, -40],
              rotate: [-20, -10, -20, -30, -20],
              opacity: 1,
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              opacity: { duration: 0.6, delay: 0.3 },
            }}
            className="absolute top-8 right-8 md:top-12 md:right-16"
          >
            <FlyingSlice />
          </motion.div>

          {/* Crumb particles */}
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-amber-400/60"
              style={{
                top: `${30 + i * 12}%`,
                right: `${25 + i * 6}%`,
              }}
              animate={{
                y: [0, 8, 0],
                opacity: [0.3, 0.9, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.4,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Popular pizzas section */}
      {popular.length > 0 && (
        <div className="container relative pb-20">
          <h2 className="font-display text-xl md:text-2xl font-bold mb-5 text-center lg:text-left">
            {t.notFound.popular}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
            {popular.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Link
                  href={`/menu/${p.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-3xl border border-border bg-card hover:bg-secondary/50 transition-colors"
                >
                  <div
                    className="h-16 w-16 shrink-0 rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-base truncate">
                      {nameOf(p)}
                    </p>
                    <p className="text-xs text-gradient font-bold mt-0.5">
                      {p.basePrice} ₴
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Pizza disc with a wedge cut out — the missing slice represents the missing page.
function PizzaWithBite() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="dough" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#FFE7B8" />
          <stop offset="0.6" stopColor="#F5C16F" />
          <stop offset="1" stopColor="#D9510C" />
        </radialGradient>
        <radialGradient id="cheese" cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#FFD27A" />
          <stop offset="1" stopColor="#E89B3C" />
        </radialGradient>
      </defs>

      {/* Crust ring with the wedge cut between 30° and 90° (10–12 o'clock) */}
      <path
        d="M100 4
           A 96 96 0 1 1 50 187
           L 100 100 Z
           M 100 100
           L 184 65
           A 96 96 0 0 0 100 4 Z"
        fill="url(#dough)"
      />

      {/* Cheese surface (smaller circle, same wedge) */}
      <path
        d="M100 20
           A 80 80 0 1 1 60 175
           L 100 100 Z
           M 100 100
           L 175 70
           A 80 80 0 0 0 100 20 Z"
        fill="url(#cheese)"
      />

      {/* Pepperoni discs */}
      <circle cx="62" cy="80" r="11" fill="#B33D0A" />
      <circle cx="60" cy="78" r="2" fill="#FFE7B8" opacity="0.6" />
      <circle cx="120" cy="60" r="10" fill="#B33D0A" />
      <circle cx="118" cy="58" r="2" fill="#FFE7B8" opacity="0.6" />
      <circle cx="140" cy="110" r="11" fill="#B33D0A" />
      <circle cx="138" cy="108" r="2" fill="#FFE7B8" opacity="0.6" />
      <circle cx="80" cy="140" r="10" fill="#B33D0A" />
      <circle cx="78" cy="138" r="2" fill="#FFE7B8" opacity="0.6" />
      <circle cx="110" cy="150" r="9" fill="#B33D0A" />
      <circle cx="108" cy="148" r="2" fill="#FFE7B8" opacity="0.6" />

      {/* Basil leaves */}
      <ellipse cx="92" cy="105" rx="5" ry="3" fill="#3F7D20" transform="rotate(-30 92 105)" />
      <ellipse cx="130" cy="85" rx="5" ry="3" fill="#3F7D20" transform="rotate(40 130 85)" />
      <ellipse cx="70" cy="115" rx="4" ry="2.5" fill="#3F7D20" transform="rotate(-60 70 115)" />

      {/* Sad-pizza face inside the bite area */}
      <g opacity="0.7">
        <circle cx="135" cy="50" r="2" fill="#5A2F0A" />
        <circle cx="155" cy="40" r="2" fill="#5A2F0A" />
        <path
          d="M 132 65 Q 145 58 158 65"
          stroke="#5A2F0A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function FlyingSlice() {
  return (
    <svg
      viewBox="0 0 60 60"
      className="h-12 w-12 md:h-16 md:w-16 drop-shadow-lg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 6 L54 50 L6 50 Z"
        fill="#F5C16F"
        stroke="#D9510C"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="36" r="4" fill="#B33D0A" />
      <circle cx="38" cy="36" r="4" fill="#B33D0A" />
      <circle cx="30" cy="22" r="3" fill="#B33D0A" />
    </svg>
  );
}
