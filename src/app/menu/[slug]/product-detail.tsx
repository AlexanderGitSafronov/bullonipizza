"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Flame,
  Heart,
  Plus,
  Minus,
  Truck,
  Clock,
  Leaf,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import { formatPrice, cn } from "@/lib/utils";
import {
  calculateItemPrice,
  EXTRA_PRICE,
  CRUST_PRICE,
  SIZE_MULTIPLIER,
  type Extra,
  type PizzaCrust,
  type PizzaSize,
} from "@/lib/pricing";
import type { SampleProduct } from "@/lib/sample-data";

const SIZES: PizzaSize[] = ["small", "medium", "large"];
const CRUSTS: PizzaCrust[] = ["classic", "thin", "cheese"];
const EXTRAS: Extra[] = [
  "mozzarella",
  "pepperoni",
  "mushrooms",
  "olives",
  "pepper",
  "parmesan",
];

export function ProductDetail({
  product,
  related,
}: {
  product: SampleProduct;
  related: SampleProduct[];
}) {
  const { t, locale } = useLocale();
  const { nameOf, descOf } = useProductFields();
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);
  const fav = useFavorites();

  const [size, setSize] = useState<PizzaSize>("medium");
  const [crust, setCrust] = useState<PizzaCrust>("classic");
  const [extras, setExtras] = useState<Extra[]>([]);
  const [qty, setQty] = useState(1);

  const isFav = fav.has(product.id);
  const name = nameOf(product);
  const desc = descOf(product);

  const unitPrice = calculateItemPrice({
    basePrice: product.basePrice,
    size: product.hasSize ? size : null,
    crust: product.hasCrust ? crust : null,
    extras,
    discount: product.discount ?? 0,
  });
  const total = unitPrice * qty;

  const toggleExtra = (e: Extra) =>
    setExtras((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );

  const handleAdd = (openAfter = false) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      nameUk: product.nameUk,
      nameEn: product.nameEn,
      nameRu: product.nameRu,
      image: product.image,
      basePrice: product.basePrice,
      size: product.hasSize ? size : null,
      crust: product.hasCrust ? crust : null,
      extras,
      discount: product.discount ?? 0,
      quantity: qty,
    });
    toast.success(`${name} × ${qty} ✓`);
    if (openAfter) openCart();
  };

  const sizeScale: Record<PizzaSize, string> = {
    small: "scale-[0.7]",
    medium: "scale-[0.88]",
    large: "scale-100",
  };

  const facts = [
    { icon: Clock, label: "30 мин" },
    { icon: Truck, label: t.delivery.free.split(" ")[0] + "+" },
    { icon: Leaf, label: locale === "en" ? "Fresh" : locale === "ru" ? "Свежие" : "Свіжі" },
  ];

  return (
    <div className="relative">
      <div className="container py-4 md:py-6">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t.product.backToMenu}
        </Link>
      </div>

      <section className="container pb-12 md:pb-20">
        <div className="grid lg:grid-cols-[1.05fr,1fr] gap-8 lg:gap-16 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-brand-50 via-accent to-secondary lg:sticky lg:top-24"
          >
            <div className="absolute inset-0 bg-warm-radial pointer-events-none" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-6 rounded-full border-2 border-dashed border-primary/20"
            />
            <motion.div
              key={size}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 180 }}
              className={cn(
                "absolute inset-0 m-auto h-[80%] w-[80%] rounded-full overflow-hidden shadow-2xl",
                product.hasSize && sizeScale[size]
              )}
            >
              <Image
                src={product.image}
                alt={name}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-cover"
              />
            </motion.div>

            <button
              onClick={() => fav.toggle(product.id)}
              className={cn(
                "absolute top-5 right-5 h-11 w-11 rounded-full backdrop-blur bg-background/80 flex items-center justify-center transition-colors z-10",
                isFav && "bg-primary text-white"
              )}
              aria-label="favorite"
            >
              <Heart className={cn("h-5 w-5", isFav && "fill-current")} />
            </button>

            <div className="absolute top-5 left-5 flex flex-col gap-1.5 z-10">
              {product.isPopular && (
                <Badge variant="hot">
                  <Flame className="h-3 w-3" />
                  {t.menu.popular}
                </Badge>
              )}
              {product.discount && product.discount > 0 && (
                <Badge variant="warning">−{product.discount}%</Badge>
              )}
            </div>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
              {name}
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              {desc}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {facts.map(({ icon: Icon, label }, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-full"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </span>
              ))}
            </div>

            {(product.hasSize ||
              product.hasCrust ||
              EXTRAS.length > 0) && (
              <div className="mt-8">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  {t.product.chooseOptions}
                </p>

                {product.hasSize && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold mb-2">
                      {t.product.size}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={cn(
                            "relative px-3 py-3 rounded-2xl text-sm font-medium border transition-all",
                            size === s
                              ? "border-primary bg-accent text-foreground"
                              : "border-border bg-card hover:bg-secondary"
                          )}
                        >
                          {size === s && (
                            <motion.div
                              layoutId="size-ring-pdp"
                              className="absolute inset-0 rounded-2xl border-2 border-primary"
                              transition={{
                                type: "spring",
                                duration: 0.4,
                              }}
                            />
                          )}
                          <span className="block">{t.product.sizes[s]}</span>
                          <span className="text-[10px] text-muted-foreground">
                            ×{SIZE_MULTIPLIER[s]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.hasCrust && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold mb-2">
                      {t.product.crust}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {CRUSTS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setCrust(c)}
                          className={cn(
                            "px-3 py-3 rounded-2xl text-sm font-medium border transition-all",
                            crust === c
                              ? "border-primary bg-accent text-foreground"
                              : "border-border bg-card hover:bg-secondary"
                          )}
                        >
                          <span className="block">{t.product.crusts[c]}</span>
                          {CRUST_PRICE[c] > 0 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{CRUST_PRICE[c]} ₴
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.hasSize && (
                  <div className="mb-5">
                    <p className="text-sm font-semibold mb-2">
                      {t.product.extras}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {EXTRAS.map((e) => {
                        const active = extras.includes(e);
                        return (
                          <button
                            key={e}
                            onClick={() => toggleExtra(e)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border transition-all",
                              active
                                ? "bg-primary text-white border-primary"
                                : "border-border bg-card hover:bg-secondary"
                            )}
                          >
                            {t.product.extras_list[e]}
                            <span className="opacity-70">
                              +{EXTRA_PRICE[e]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center bg-secondary rounded-full p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 rounded-full bg-background flex items-center justify-center"
                  aria-label="decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={qty}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 8, opacity: 0 }}
                    className="font-semibold text-base w-10 text-center"
                  >
                    {qty}
                  </motion.span>
                </AnimatePresence>
                <button
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center"
                  aria-label="increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-right ml-auto">
                <p className="text-xs text-muted-foreground">
                  {t.product.total}
                </p>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={total}
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 5, opacity: 0 }}
                    className="text-3xl font-display font-bold text-gradient"
                  >
                    {formatPrice(total)}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-[1fr,auto] gap-3">
              <Button
                size="lg"
                onClick={() => handleAdd(false)}
                className="w-full text-base"
              >
                <ShoppingBag className="h-5 w-5" />
                {t.product.addToCart}
              </Button>
              <Button
                size="lg"
                variant="glass"
                onClick={() => handleAdd(true)}
                className="text-base"
              >
                {locale === "en"
                  ? "Buy now"
                  : locale === "ru"
                    ? "Купить"
                    : "Купити"}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container pb-20">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
            {t.product.related}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
