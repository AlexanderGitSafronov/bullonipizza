"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Plus, Flame } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { useCart } from "@/store/cart";
import { useFavorites } from "@/store/favorites";
import { formatPrice, cn } from "@/lib/utils";
import { calculateItemPrice } from "@/lib/pricing";
import { CustomizeDialog } from "./customize-dialog";
import type { SampleProduct } from "@/lib/sample-data";

export function ProductCard({
  product,
  index = 0,
}: {
  product: SampleProduct;
  index?: number;
}) {
  const { t } = useLocale();
  const { nameOf, descOf } = useProductFields();
  const addItem = useCart((s) => s.addItem);
  const fav = useFavorites();
  const [open, setOpen] = useState(false);

  const name = nameOf(product);
  const desc = descOf(product);

  const minPrice = calculateItemPrice({
    basePrice: product.basePrice,
    size: product.hasSize ? "small" : null,
    crust: product.hasCrust ? "classic" : null,
    extras: [],
    discount: product.discount ?? 0,
  });

  // Quick-add: open the modal for customizable items, otherwise pop it
  // straight into the cart. The card body still routes to /menu/[slug]
  // so users can read the full description before committing.
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.hasSize || product.hasCrust) {
      setOpen(true);
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      nameUk: product.nameUk,
      nameEn: product.nameEn,
      nameRu: product.nameRu,
      image: product.image,
      basePrice: product.basePrice,
      size: null,
      crust: null,
      extras: [],
      discount: product.discount ?? 0,
    });
    toast.success(`${name} ✓`);
  };

  const isFav = fav.has(product.id);
  const href = `/menu/${product.slug}`;
  const outOfStock = product.inStock === false;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
        whileHover={{ y: -4 }}
        className="group relative flex flex-col overflow-hidden rounded-3xl bg-card border border-border shadow-card hover:shadow-soft transition-shadow"
      >
        {/* Whole-card link sits behind the interactive controls so it
            doesn't steal their clicks. */}
        <Link
          href={href}
          aria-label={name}
          className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-3xl"
        />

        <div className="relative aspect-square overflow-hidden bg-secondary pointer-events-none">
          <Image
            src={product.image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {outOfStock && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <Badge variant="outline" className="text-xs uppercase tracking-wider bg-background/95">
                {t.admin.outOfStock}
              </Badge>
            </div>
          )}

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isPopular && !outOfStock && (
              <Badge variant="hot">
                <Flame className="h-3 w-3" />
                {t.menu.popular}
              </Badge>
            )}
            {product.discount && product.discount > 0 && !outOfStock && (
              <Badge variant="warning">−{product.discount}%</Badge>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              fav.toggle(product.id);
            }}
            className={cn(
              "absolute top-3 right-3 h-9 w-9 rounded-full backdrop-blur bg-background/80 flex items-center justify-center transition-colors pointer-events-auto z-10",
              isFav && "bg-primary text-white"
            )}
            aria-label="favorite"
          >
            <Heart className={cn("h-4 w-4", isFav && "fill-current")} />
          </button>
        </div>

        <div className="relative flex flex-1 flex-col p-4 pointer-events-none">
          <h3 className="font-display font-bold text-lg leading-tight">
            {name}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">
            {desc}
          </p>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              {product.hasSize && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.product.from}
                </p>
              )}
              <p className="font-display font-bold text-xl text-gradient">
                {formatPrice(minPrice)}
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleQuickAdd}
              disabled={outOfStock}
              className="rounded-2xl shrink-0 pointer-events-auto relative z-10"
              aria-label={t.product.addToCart}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      {(product.hasSize || product.hasCrust) && (
        <CustomizeDialog
          product={product}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}
