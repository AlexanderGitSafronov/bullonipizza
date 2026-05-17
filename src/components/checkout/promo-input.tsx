"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/i18n/provider";
import { formatPrice } from "@/lib/utils";

export interface AppliedPromo {
  code: string;
  kind: "PERCENT" | "FIXED";
  amount: number;
  discount: number;
}

export function PromoInput({
  subtotal,
  applied,
  onApply,
  onRemove,
}: {
  subtotal: number;
  applied: AppliedPromo | null;
  onApply: (promo: AppliedPromo) => void;
  onRemove: () => void;
}) {
  const { t } = useLocale();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const body = await res.json();
      if (!body.ok) {
        const msg =
          body.error === "expired"
            ? t.promo.expired
            : body.error === "exhausted"
              ? t.promo.exhausted
              : body.error === "min_order_not_met"
                ? `${t.promo.notMet}: ${formatPrice(body.minOrder)}`
                : t.promo.invalid;
        toast.error(msg);
        return;
      }
      onApply(body.promo);
      toast.success(t.promo.applied);
      setCode("");
    } catch {
      toast.error(t.promo.invalid);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {applied ? (
          <motion.div
            key="applied"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30"
          >
            <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 text-emerald-500" strokeWidth={3} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold font-mono truncate">
                {applied.code}
              </p>
              <p className="text-xs text-muted-foreground">
                −
                {applied.kind === "PERCENT"
                  ? `${applied.amount}%`
                  : formatPrice(applied.amount)}{" "}
                · −{formatPrice(applied.discount)}
              </p>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="h-9 w-9 rounded-full bg-background hover:bg-secondary flex items-center justify-center"
              aria-label={t.promo.remove}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="input"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            onSubmit={handleApply}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                inputMode="text"
                autoCapitalize="characters"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder={t.promo.placeholder}
                maxLength={30}
                className="pl-11 uppercase tracking-wider"
              />
            </div>
            <Button type="submit" disabled={submitting || !code.trim()}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.promo.apply
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
