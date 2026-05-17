"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Check,
  ChefHat,
  Truck,
  PackageCheck,
  Radio,
} from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";

type Status =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: Status;
  customerName: string;
  phone: string;
  address: string;
  total: string;
  createdAt: string;
  items: { id: string; quantity: number }[];
}

const ACTIVE_COLUMNS: Status[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERING",
];

const NEXT_STATUS: Record<Status, Status | null> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "DELIVERING",
  DELIVERING: "COMPLETED",
  COMPLETED: null,
  CANCELLED: null,
};

const STATUS_ICON: Record<Status, typeof Clock> = {
  PENDING: Clock,
  CONFIRMED: Check,
  PREPARING: ChefHat,
  DELIVERING: Truck,
  COMPLETED: PackageCheck,
  CANCELLED: Clock,
};

const STATUS_TONE: Record<Status, string> = {
  PENDING: "text-amber-500 bg-amber-500/10 border-amber-500/30",
  CONFIRMED: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  PREPARING: "text-orange-500 bg-orange-500/10 border-orange-500/30",
  DELIVERING: "text-violet-500 bg-violet-500/10 border-violet-500/30",
  COMPLETED: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
  CANCELLED: "text-rose-500 bg-rose-500/10 border-rose-500/30",
};

export function OrdersBoard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-store" });
      const body = await res.json();
      if (body.ok) setOrders(body.orders);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    void load();
    const interval = setInterval(load, 8_000);
    return () => clearInterval(interval);
  }, []);

  const advance = async (order: AdminOrder, next: Status) => {
    setUpdating(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        toast.error(body.error || "Update failed");
        return;
      }
      toast.success(`→ ${next}`);
      await load();
    } catch (err) {
      toast.error((err as Error).message || "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const cancel = async (order: AdminOrder) => {
    if (!confirm(`Cancel ${order.orderNumber}?`)) return;
    await advance(order, "CANCELLED");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Radio className="h-3 w-3 text-primary animate-pulse" />
        Live · refreshes every 8s · {orders.length} active
      </div>

      <div className="grid lg:grid-cols-4 gap-3">
        {ACTIVE_COLUMNS.map((col) => {
          const list = orders.filter((o) => o.status === col);
          const Icon = STATUS_ICON[col];
          return (
            <div
              key={col}
              className={cn(
                "rounded-3xl border p-3 min-h-[200px]",
                STATUS_TONE[col]
              )}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    {col}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {list.length}
                </Badge>
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {list.map((o) => {
                    const next = NEXT_STATUS[o.status];
                    return (
                      <motion.div
                        key={o.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl bg-card border border-border p-3 shadow-card"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-mono text-[10px] text-muted-foreground">
                            {o.orderNumber}
                          </p>
                          <p className="text-xs font-bold text-gradient">
                            {formatPrice(Number(o.total))}
                          </p>
                        </div>
                        <p className="text-sm font-semibold truncate">
                          {o.customerName}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {o.address}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {o.items.reduce((a, it) => a + it.quantity, 0)} pcs ·{" "}
                          {new Date(o.createdAt).toLocaleTimeString("uk", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="mt-2 flex gap-1">
                          {next && (
                            <Button
                              size="sm"
                              onClick={() => advance(o, next)}
                              disabled={updating === o.id}
                              className="flex-1 h-7 text-[11px]"
                            >
                              → {next}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => cancel(o)}
                            disabled={updating === o.id}
                            className="h-7 px-2 text-[11px]"
                          >
                            ✕
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {list.length === 0 && (
                  <p className="text-[11px] text-muted-foreground/60 px-1 py-2 italic">
                    — empty —
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
