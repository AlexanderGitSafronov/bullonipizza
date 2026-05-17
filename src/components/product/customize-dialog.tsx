"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { useCart } from "@/store/cart";
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

export function CustomizeDialog({
  product,
  open,
  onOpenChange,
}: {
  product: SampleProduct;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useLocale();
  const { nameOf, descOf } = useProductFields();
  const addItem = useCart((s) => s.addItem);

  const [size, setSize] = useState<PizzaSize>("medium");
  const [crust, setCrust] = useState<PizzaCrust>("classic");
  const [extras, setExtras] = useState<Extra[]>([]);

  const price = calculateItemPrice({
    basePrice: product.basePrice,
    size: product.hasSize ? size : null,
    crust: product.hasCrust ? crust : null,
    extras,
    discount: product.discount ?? 0,
  });

  const toggleExtra = (e: Extra) =>
    setExtras((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );

  const handleAdd = () => {
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
    });
    toast.success(`${nameOf(product)} ✓`);
    onOpenChange(false);
  };

  const sizeScale: Record<PizzaSize, string> = {
    small: "scale-[0.72]",
    medium: "scale-[0.88]",
    large: "scale-100",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0">
        <div className="grid md:grid-cols-2">
          <div className="relative bg-gradient-to-br from-brand-50 via-accent to-secondary p-6 flex items-center justify-center min-h-[280px] md:min-h-full overflow-hidden">
            <div className="absolute inset-0 bg-warm-radial pointer-events-none" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 rounded-full border-2 border-dashed border-primary/20"
            />
            <motion.div
              key={size}
              animate={{ scale: 1 }}
              initial={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={cn(
                "relative aspect-square w-[80%] rounded-full overflow-hidden shadow-2xl transition-transform duration-500",
                product.hasSize && sizeScale[size]
              )}
            >
              <Image
                src={product.image}
                alt={nameOf(product)}
                fill
                sizes="(max-width: 768px) 80vw, 40vw"
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="p-6 md:p-8 space-y-5">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                {product.isPopular && (
                  <Badge variant="hot" className="text-[10px]">
                    🔥 {t.menu.popular}
                  </Badge>
                )}
                {product.discount && product.discount > 0 && (
                  <Badge variant="warning">−{product.discount}%</Badge>
                )}
              </div>
              <DialogTitle className="font-display">
                {nameOf(product)}
              </DialogTitle>
              <DialogDescription>
                {descOf(product)}
              </DialogDescription>
            </DialogHeader>

            {product.hasSize && (
              <div>
                <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                  {t.product.size}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "p-3 rounded-2xl text-sm font-medium border transition-all relative",
                        size === s
                          ? "border-primary bg-accent text-foreground"
                          : "border-border bg-card hover:bg-secondary"
                      )}
                    >
                      {size === s && (
                        <motion.div
                          layoutId="size-pill"
                          className="absolute inset-0 rounded-2xl border-2 border-primary"
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
              <div>
                <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                  {t.product.crust}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {CRUSTS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCrust(c)}
                      className={cn(
                        "p-3 rounded-2xl text-sm font-medium border transition-all",
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
              <div>
                <Label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
                  {t.product.extras}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {EXTRAS.map((e) => {
                    const active = extras.includes(e);
                    return (
                      <button
                        key={e}
                        onClick={() => toggleExtra(e)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
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

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t.product.total}
                </p>
                <p className="text-2xl font-display font-bold text-gradient">
                  {formatPrice(price)}
                </p>
              </div>
              <Button size="lg" onClick={handleAdd}>
                {t.product.addToCart}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
