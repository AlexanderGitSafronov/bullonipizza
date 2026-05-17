"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Check,
  ChefHat,
  Truck,
  PackageCheck,
  XCircle,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/i18n/provider";
import { useAuth } from "@/store/auth";
import { formatPrice, cn } from "@/lib/utils";

type Status =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";

interface Order {
  id: string;
  orderNumber: string;
  status: Status;
  total: string | number;
  createdAt: string;
  items: { id: string; quantity: number }[];
  address: string;
}

const statusMeta: Record<Status, { icon: typeof Clock; tone: string }> = {
  PENDING: { icon: Clock, tone: "text-amber-500" },
  CONFIRMED: { icon: Check, tone: "text-blue-500" },
  PREPARING: { icon: ChefHat, tone: "text-orange-500" },
  DELIVERING: { icon: Truck, tone: "text-violet-500" },
  COMPLETED: { icon: PackageCheck, tone: "text-emerald-500" },
  CANCELLED: { icon: XCircle, tone: "text-rose-500" },
};

export default function OrdersListPage() {
  const { t, locale } = useLocale();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?next=/orders");
      return;
    }
    let cancelled = false;
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/mine", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        setOrders(data.orders ?? []);
      } finally {
        if (!cancelled) setLoadingOrders(false);
      }
    };
    void fetchOrders();
    const interval = setInterval(fetchOrders, 15_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [user, loading, router]);

  if (loading || (!user && loadingOrders)) {
    return (
      <div className="container py-20 text-center text-muted-foreground">
        {t.common.loading}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center gap-3"
      >
        <div className="h-12 w-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-soft">
          <ShoppingBag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            {t.auth.myOrders}
          </h1>
          <p className="text-muted-foreground text-sm">
            {orders.length} · {user.email}
          </p>
        </div>
      </motion.div>

      {orders.length === 0 && !loadingOrders ? (
        <div className="py-16 text-center">
          <p className="text-5xl mb-3">🍕</p>
          <h2 className="font-display text-xl font-bold mb-1">
            {t.tracking.empty}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {t.tracking.placeFirst}
          </p>
          <Link href="/menu">
            <Button>{t.cart.browse}</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => {
            const Icon = statusMeta[order.status].icon;
            const active =
              order.status === "PREPARING" || order.status === "DELIVERING";
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="group flex items-center gap-4 rounded-3xl border border-border bg-card p-4 md:p-5 shadow-card hover:shadow-soft transition-all hover:-translate-y-0.5"
                >
                  <div
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center relative shrink-0",
                      active
                        ? "bg-brand-gradient text-white"
                        : "bg-secondary"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        active ? "text-white" : statusMeta[order.status].tone
                      )}
                    />
                    {active && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl bg-primary"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        {order.orderNumber}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {t.order.statuses[order.status]}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium truncate">
                      {order.items.reduce(
                        (a, it) => a + it.quantity,
                        0
                      )}{" "}
                      ·{" "}
                      <span className="text-muted-foreground truncate">
                        {order.address}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.createdAt).toLocaleString(locale, {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-bold text-lg text-gradient">
                      {formatPrice(Number(order.total))}
                    </p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground inline-block group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
