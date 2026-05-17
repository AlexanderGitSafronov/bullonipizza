"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  Home,
  RefreshCw,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/provider";
import { useProductFields } from "@/hooks/use-product-fields";
import { formatPrice, cn } from "@/lib/utils";
import { sampleProducts } from "@/lib/sample-data";

type Status =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";

type OrderItem = {
  id?: string;
  productId: string;
  nameUk?: string;
  nameEn?: string;
  nameRu?: string;
  image?: string;
  quantity: number;
  size?: "small" | "medium" | "large" | null;
  crust?: "classic" | "thin" | "cheese" | null;
  extras?: string[];
  price: number | string;
};

interface UnifiedOrder {
  orderNumber: string;
  status: Status;
  address: string;
  createdAt: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: OrderItem[];
  source: "api" | "local";
}

const STEPS: { key: Status; icon: typeof Clock }[] = [
  { key: "PENDING", icon: Clock },
  { key: "CONFIRMED", icon: Check },
  { key: "PREPARING", icon: ChefHat },
  { key: "DELIVERING", icon: Truck },
  { key: "COMPLETED", icon: PackageCheck },
];

function deriveLocalStatus(createdAt: number): Status {
  const elapsed = (Date.now() - createdAt) / 1000;
  if (elapsed < 10) return "PENDING";
  if (elapsed < 60) return "CONFIRMED";
  if (elapsed < 240) return "PREPARING";
  if (elapsed < 600) return "DELIVERING";
  return "COMPLETED";
}

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useLocale();
  const { nameOf } = useProductFields();
  const [order, setOrder] = useState<UnifiedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [pulsing, setPulsing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const polling = useRef<NodeJS.Timeout | null>(null);

  // Load image lookup from sample data so we have something to show for
  // DB-backed orders (the API returns minimal item rows without images).
  const productLookup = new Map(sampleProducts.map((p) => [p.id, p]));
  const slugLookup = new Map(sampleProducts.map((p) => [p.slug, p]));

  const fetchOrder = async (showPulse = false) => {
    if (showPulse) setPulsing(true);
    try {
      const res = await fetch(`/api/orders/${id}`, { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        if (body.ok && body.order) {
          const o = body.order;
          setOrder({
            orderNumber: o.orderNumber,
            status: o.status as Status,
            address: o.address,
            createdAt: new Date(o.createdAt).getTime(),
            subtotal: Number(o.subtotal),
            deliveryFee: Number(o.deliveryFee),
            total: Number(o.total),
            items: o.items.map((it: any) => {
              const meta =
                productLookup.get(it.productId) ??
                slugLookup.get(it.productId);
              return {
                id: it.id,
                productId: it.productId,
                quantity: it.quantity,
                size: it.size,
                crust: it.crust,
                extras: it.extras,
                price: Number(it.price),
                nameUk: meta?.nameUk,
                nameEn: meta?.nameEn,
                nameRu: meta?.nameRu,
                image: meta?.image,
              };
            }),
            source: "api",
          });
          setLastUpdate(Date.now());
          setLoading(false);
          return;
        }
      }
      // API miss → try local storage (guest order)
      try {
        const stored = JSON.parse(localStorage.getItem("bp_orders") ?? "{}");
        const local = stored[id];
        if (local) {
          const status = deriveLocalStatus(local.createdAt);
          setOrder({
            orderNumber: local.orderNumber,
            status,
            address: local.address,
            createdAt: local.createdAt,
            subtotal: local.subtotal,
            deliveryFee: local.deliveryFee,
            total: local.total,
            items: local.items,
            source: "local",
          });
          setLastUpdate(Date.now());
        }
      } catch {
        /* ignore */
      }
    } finally {
      setLoading(false);
      if (showPulse) setTimeout(() => setPulsing(false), 600);
    }
  };

  useEffect(() => {
    void fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Live polling — slows down once delivered/cancelled.
  useEffect(() => {
    if (!order) return;
    if (polling.current) clearInterval(polling.current);
    const isTerminal =
      order.status === "COMPLETED" || order.status === "CANCELLED";
    const interval = isTerminal ? null : order.source === "api" ? 10_000 : 5_000;
    if (interval) {
      polling.current = setInterval(() => {
        if (order.source === "api") {
          void fetchOrder();
        } else {
          // Local progression
          setOrder((prev) =>
            prev
              ? { ...prev, status: deriveLocalStatus(prev.createdAt) }
              : prev
          );
          setLastUpdate(Date.now());
        }
      }, interval);
    }
    return () => {
      if (polling.current) clearInterval(polling.current);
    };
    // Intentionally narrow deps — re-arm only on status/source changes,
    // not on every fetchOrder recreate (would cause an infinite loop).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.status, order?.source]);

  if (loading) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        {t.common.loading}
      </div>
    );
  }

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

  const stepIndex = Math.max(
    0,
    STEPS.findIndex((s) => s.key === order.status)
  );
  const isCancelled = order.status === "CANCELLED";
  const isDone = order.status === "COMPLETED";
  const isActive = !isCancelled && !isDone;
  const stages = [
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "DELIVERING",
    "COMPLETED",
  ];
  const progress = isCancelled
    ? 0
    : Math.min(100, ((stepIndex + (isDone ? 0 : 0.5)) / (stages.length - 1)) * 100);
  const eta = new Date(order.createdAt + 30 * 60 * 1000);

  const stageHeadline = isCancelled
    ? t.tracking.cancelled
    : isDone
      ? t.tracking.completed
      : order.status === "PENDING"
        ? t.order.statuses.PENDING
        : order.status === "CONFIRMED"
          ? t.tracking.confirmed
          : order.status === "PREPARING"
            ? t.tracking.preparing
            : t.tracking.onTheWay;

  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={
            isActive ? { boxShadow: ["0 0 0 0 rgba(242,106,26,0.35)", "0 0 0 32px rgba(242,106,26,0)"] } : {}
          }
          transition={{ duration: 1.8, repeat: Infinity }}
          className="inline-flex h-20 w-20 rounded-full bg-brand-gradient items-center justify-center shadow-glow mb-4"
        >
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </motion.div>
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          {t.checkout.success}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t.order.number}:{" "}
          <span className="font-mono font-semibold text-foreground">
            {order.orderNumber}
          </span>
        </p>
      </motion.div>

      <motion.div
        layout
        className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card mb-6 overflow-hidden relative"
      >
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold">
              {t.tracking.title}
            </h2>
            {isActive && (
              <Badge variant="success" className="gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {t.tracking.live}
              </Badge>
            )}
          </div>
          <button
            onClick={() => fetchOrder(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            aria-label="refresh"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                pulsing && "animate-spin-slow"
              )}
            />
            <span className="hidden sm:inline">
              {pulsing ? t.tracking.refreshing : t.tracking.refresh}
            </span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={stageHeadline}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={cn(
              "text-sm font-medium mb-6",
              isCancelled ? "text-rose-500" : "text-primary"
            )}
          >
            {stageHeadline}
          </motion.p>
        </AnimatePresence>

        {/* Live animation panel */}
        <div className="relative h-32 mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary to-background border border-border">
          <div
            className="absolute inset-0 opacity-30 grain"
            aria-hidden
          />
          {order.status === "PREPARING" && <PreparingAnim />}
          {order.status === "DELIVERING" && <DeliveringAnim />}
          {order.status === "CONFIRMED" && <ConfirmedAnim />}
          {order.status === "PENDING" && <PendingAnim />}
          {isDone && <DoneAnim />}
          {isCancelled && <CancelledAnim />}
        </div>

        {/* Stages */}
        {!isCancelled && (
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
              className="absolute top-5 left-5 h-0.5 bg-brand-gradient"
              style={{ maxWidth: "calc(100% - 40px)" }}
            />
            <div className="relative grid grid-cols-5 gap-2">
              {STEPS.map((s, i) => {
                const done = i <= stepIndex;
                const isCurrent = i === stepIndex && isActive;
                const Icon = s.icon;
                return (
                  <div key={s.key} className="flex flex-col items-center">
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                      transition={{
                        duration: 1.5,
                        repeat: isCurrent ? Infinity : 0,
                      }}
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors relative",
                        done
                          ? "bg-brand-gradient text-white border-transparent shadow-soft"
                          : "bg-card text-muted-foreground border-border"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {isCurrent && (
                        <motion.div
                          animate={{
                            scale: [1, 1.6, 1.6],
                            opacity: [0.5, 0, 0],
                          }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className="absolute inset-0 rounded-full bg-primary"
                        />
                      )}
                    </motion.div>
                    <p
                      className={cn(
                        "mt-2 text-[10px] text-center leading-tight",
                        done
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {t.order.statuses[s.key]}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t.tracking.eta}</p>
            <p className="font-semibold">
              {eta.toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.order.address}</p>
            <p className="font-semibold truncate">{order.address}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t.tracking.updated}
            </p>
            <p className="font-semibold flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-primary" />
              {new Date(lastUpdate).toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-card">
        <h2 className="font-display text-xl font-bold mb-4">{t.order.items}</h2>
        <div className="space-y-3 mb-4">
          {order.items.map((it, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-secondary shrink-0">
                {it.image && (
                  <Image
                    src={it.image}
                    alt={nameOf(it) || "—"}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {nameOf(it) || it.productId}
                </p>
                <p className="text-xs text-muted-foreground">
                  ×{it.quantity}
                  {it.size && ` · ${t.product.sizes[it.size]}`}
                </p>
              </div>
              <span className="text-sm font-semibold">
                {formatPrice(Number(it.price) * it.quantity)}
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
              {order.deliveryFee === 0
                ? t.cart.free
                : formatPrice(order.deliveryFee)}
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

      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        <Link href="/orders">
          <Button variant="glass">
            <PackageCheck className="h-4 w-4" /> {t.auth.myOrders}
          </Button>
        </Link>
        <Link href="/">
          <Button variant="glass">
            <Home className="h-4 w-4" /> {t.order.backHome}
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ---- inline animation components ----

function PendingAnim() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <Clock className="h-12 w-12 text-amber-500" />
      </motion.div>
    </div>
  );
}

function ConfirmedAnim() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center"
      >
        <Check className="h-7 w-7 text-emerald-500" strokeWidth={3} />
      </motion.div>
    </div>
  );
}

function PreparingAnim() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Oven glow */}
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-orange-500/40 via-amber-500/20 to-transparent"
      />
      {/* Chef */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative z-10"
      >
        <ChefHat className="h-12 w-12 text-orange-400 drop-shadow" />
      </motion.div>
      {/* Pizza */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute right-6 bottom-3 text-3xl"
      >
        🍕
      </motion.div>
      {/* Heat shimmer */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [-4, -30], opacity: [0.6, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            delay: i * 0.4,
          }}
          className="absolute bottom-3 text-xs"
          style={{ left: `${30 + i * 14}%` }}
        >
          ✨
        </motion.span>
      ))}
    </div>
  );
}

function DeliveringAnim() {
  return (
    <div className="absolute inset-0">
      <div className="absolute bottom-3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <motion.div
        initial={{ x: "-20%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-3 flex items-end gap-2"
      >
        <Truck className="h-10 w-10 text-violet-400" />
        <span className="text-2xl mb-1">🍕</span>
      </motion.div>
      <div className="absolute top-3 right-4 flex flex-col items-end gap-0.5">
        <div className="text-xs font-semibold text-violet-300">
          {`30 min`}
        </div>
      </div>
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs uppercase tracking-widest text-muted-foreground"
      >
        en route
      </motion.div>
    </div>
  );
}

function DoneAnim() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
        className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center"
      >
        <PackageCheck className="h-8 w-8 text-white" />
      </motion.div>
      <motion.div
        animate={{ opacity: [0, 1, 0], y: [10, 0, -10] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute text-xs text-emerald-400 mt-24"
      >
        ✓ delivered
      </motion.div>
    </div>
  );
}

function CancelledAnim() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-rose-500/80">
      <div className="text-4xl">✗</div>
    </div>
  );
}
