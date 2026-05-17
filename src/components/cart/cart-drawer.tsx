"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/pricing";
import { useEffect } from "react";

export function CartDrawer() {
  const { t } = useLocale();
  const { nameOf } = useProductFields();
  const {
    items,
    isOpen,
    close,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryFee,
    total,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sub = subtotal();
  const fee = deliveryFee();
  const totalPrice = total();
  const toFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - sub);
  const progress = Math.min(100, (sub / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-md bg-background border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="text-xl font-display font-bold">
                  {t.cart.title}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {items.length === 0
                    ? t.cart.empty
                    : `${items.reduce((a, i) => a + i.quantity, 0)} ${t.cart.qty.toLowerCase()}`}
                </p>
              </div>
              <button
                onClick={close}
                className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center mb-6">
                  <ShoppingBag className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{t.cart.empty}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {t.cart.emptyDesc}
                </p>
                <Link href="/menu" onClick={close}>
                  <Button>{t.cart.browse}</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="px-5 pt-4">
                  <div className="text-xs text-muted-foreground mb-1.5">
                    {fee === 0
                      ? `🎉 ${t.cart.delivery}: ${t.cart.free}`
                      : `+${formatPrice(toFreeDelivery)} → ${t.cart.free} ${t.cart.delivery.toLowerCase()}`}
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-brand-gradient"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex gap-3 p-3 rounded-2xl bg-card border border-border"
                      >
                        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-secondary shrink-0">
                          <Image
                            src={item.image}
                            alt={nameOf(item)}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {nameOf(item)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {[
                                  item.size && t.product.sizes[item.size],
                                  item.crust && t.product.crusts[item.crust],
                                ]
                                  .filter(Boolean)
                                  .join(" • ")}
                              </p>
                              {item.extras.length > 0 && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  +{item.extras.length} {t.product.extras.toLowerCase()}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-destructive p-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-secondary rounded-full p-0.5">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="h-7 w-7 rounded-full bg-background flex items-center justify-center"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="font-display font-bold text-base">
                              {formatPrice(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-border p-5 space-y-3">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t.cart.subtotal}
                      </span>
                      <span>{formatPrice(sub)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t.cart.delivery}
                      </span>
                      <span>
                        {fee === 0 ? (
                          <span className="text-emerald-500 font-semibold">
                            {t.cart.free}
                          </span>
                        ) : (
                          formatPrice(fee)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                      <span>{t.cart.total}</span>
                      <span className="text-gradient font-display">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                  <Link href="/checkout" onClick={close}>
                    <Button size="lg" className="w-full">
                      {t.cart.checkout}
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
