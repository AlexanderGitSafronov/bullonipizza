"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { formatPrice, cn } from "@/lib/utils";

type StoredOrder = {
  orderNumber: string;
  name: string;
  phone: string;
  address: string;
  comment?: string;
  items: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: number;
};

const STEPS = [
  { key: "PENDING", icon: Clock },
  { key: "CONFIRMED", icon: Check },
  { key: "PREPARING", icon: ChefHat },
  { key: "DELIVERING", icon: Truck },
  { key: "COMPLETED", icon: PackageCheck },
] as const;

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useLocale();
  const { nameOf } = useProductFields();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("bp_orders") ?? "{}");
      setOrder(stored[id] ?? null);
    } catch {
      setOrder(null);
    }
  }, [id]);

  useEffect(() => {
    if (!order) return;
    const elapsed = Math.floor((Date.now() - order.createdAt) / 1000);
    let s = 0;
    if (elapsed > 5) s = 1;
    if (elapsed > 30) s = 2;
    if (elapsed > 120) s = 3;
    if (elapsed > 300) s = 4;
    setStep(s);
    const interval = setInterval(() => {
      const e = Math.floor((Date.now() - order.createdAt) / 1000);
      let ns = 0;
      if (e > 5) ns = 1;
      if (e > 30) ns = 2;
      if (e > 120) ns = 3;
      if (e > 300) ns = 4;
      setStep(ns);
    }, 5000);
    return () => clearInterval(interval);
  }, [order]);

  if (!order) {
    return (
      <div className="container py-20 text-center">
        <p className="text-5xl mb-4">🤔</p>
        <h1 className="font-display text-2xl font-bold mb-2">
          {t.common.error}
        </h1>
        <Link href="/">
          <Button>{t.order.backHome}</Button>
        </Link>
      </div>
    );
  }

  const eta = new Date(order.createdAt + 30 * 60 * 1000);

  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <div className="inline-flex h-20 w-20 rounded-full bg-brand-gradient items-center justify-center shadow-glow mb-4">
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          {t.checkout.success}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t.order.number}: <span className="font-mono font-semibold text-foreground">{order.orderNumber}</span>
        </p>
      </motion.div>

      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold">{t.order.status}</h2>
          <Badge variant="success">
            {t.order.statuses[STEPS[step].key]}
          </Badge>
        </div>

        <div className="relative">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="absolute top-5 left-5 h-0.5 bg-brand-gradient"
            style={{ maxWidth: "calc(100% - 40px)" }}
          />
          <div className="relative grid grid-cols-5 gap-2">
            {STEPS.map((s, i) => {
              const done = i <= step;
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      scale: i === step ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: i === step ? Infinity : 0,
                    }}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors",
                      done
                        ? "bg-brand-gradient text-white border-transparent shadow-soft"
                        : "bg-card text-muted-foreground border-border"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>
                  <p
                    className={cn(
                      "mt-2 text-[10px] text-center leading-tight",
                      done ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    {t.order.statuses[s.key]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t.order.estimated}</p>
            <p className="font-semibold">
              {eta.toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.order.address}</p>
            <p className="font-semibold">{order.address}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
        <h2 className="font-display text-xl font-bold mb-4">{t.order.items}</h2>
        <div className="space-y-3 mb-4">
          {order.items.map((it, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                <Image
                  src={it.image}
                  alt={nameOf(it)}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{nameOf(it)}</p>
                <p className="text-xs text-muted-foreground">×{it.quantity}</p>
              </div>
              <span className="text-sm font-semibold">
                {formatPrice(it.price * it.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-border space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.cart.subtotal}</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t.cart.delivery}</span>
            <span>
              {order.deliveryFee === 0 ? t.cart.free : formatPrice(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
            <span>{t.cart.total}</span>
            <span className="text-gradient font-display text-xl">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="glass" size="lg">
            <Home className="h-4 w-4" /> {t.order.backHome}
          </Button>
        </Link>
      </div>
    </div>
  );
}
