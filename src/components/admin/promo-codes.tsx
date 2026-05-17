"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/i18n/provider";
import { formatPrice } from "@/lib/utils";

interface PromoCodeRow {
  id: string;
  code: string;
  kind: "PERCENT" | "FIXED";
  amount: string | number;
  minOrder: string | number;
  maxUses: number | null;
  uses: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

export function PromoCodesAdmin() {
  const { t, locale } = useLocale();
  const [codes, setCodes] = useState<PromoCodeRow[]>([]);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/promocodes", { cache: "no-store" });
      const body = await res.json();
      if (body.ok) setCodes(body.codes);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggleActive = async (c: PromoCodeRow) => {
    await fetch(`/api/admin/promocodes/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    void refresh();
  };

  const remove = async (c: PromoCodeRow) => {
    if (!confirm(`Delete promo "${c.code}"?`)) return;
    await fetch(`/api/admin/promocodes/${c.id}`, { method: "DELETE" });
    void refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {locale === "en"
            ? "Manage promo codes — customers enter them on checkout."
            : locale === "ru"
              ? "Управление промокодами — клиенты вводят их на оформлении."
              : "Керування промокодами — клієнти вводять їх при оформленні."}
        </p>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          {t.promo.label}
        </Button>
      </div>

      <div className="rounded-3xl border border-border bg-card overflow-hidden">
        {codes.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            —
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr className="text-left text-xs text-muted-foreground uppercase">
                  <th className="p-4">Code</th>
                  <th className="p-4">{t.promo.discount}</th>
                  <th className="p-4">{t.promo.minOrder}</th>
                  <th className="p-4">Uses</th>
                  <th className="p-4 w-1"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {codes.map((c) => (
                    <motion.tr
                      key={c.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`border-t border-border ${
                        !c.isActive ? "opacity-50" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">
                            {c.code}
                          </span>
                          {!c.isActive && (
                            <Badge variant="outline" className="text-[10px]">
                              off
                            </Badge>
                          )}
                          {c.expiresAt &&
                            new Date(c.expiresAt) < new Date() && (
                              <Badge variant="warning" className="text-[10px]">
                                {t.promo.expired}
                              </Badge>
                            )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold">
                        {c.kind === "PERCENT"
                          ? `${Number(c.amount)}%`
                          : formatPrice(Number(c.amount))}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {Number(c.minOrder) > 0
                          ? formatPrice(Number(c.minOrder))
                          : "—"}
                      </td>
                      <td className="p-4 text-muted-foreground">
                        {c.uses}
                        {c.maxUses ? ` / ${c.maxUses}` : ""}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toggleActive(c)}
                            title={c.isActive ? "Disable" : "Enable"}
                          >
                            <Power
                              className={`h-4 w-4 ${
                                c.isActive ? "text-emerald-500" : "text-muted-foreground"
                              }`}
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => remove(c)}
                          >
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NewPromoDialog open={open} onOpenChange={setOpen} onSaved={refresh} />
    </div>
  );
}

function NewPromoDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [code, setCode] = useState("");
  const [kind, setKind] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [amount, setAmount] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(0);
  const [maxUses, setMaxUses] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCode("");
    setKind("PERCENT");
    setAmount(10);
    setMinOrder(0);
    setMaxUses("");
    setExpiresAt("");
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/promocodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          kind,
          amount,
          minOrder,
          maxUses: maxUses ? Number(maxUses) : null,
          expiresAt: expiresAt
            ? new Date(expiresAt + "T23:59:59").toISOString()
            : null,
          isActive: true,
        }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        toast.error(body.error === "code_taken" ? "Code already exists" : "Save failed");
        return;
      }
      toast.success("Promo created ✓");
      onSaved();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={submit} className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle>{t.promo.label}</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="pc-code">Code</Label>
            <Input
              id="pc-code"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
              }
              placeholder="BULLONI20"
              maxLength={30}
              className="font-mono mt-1.5"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Type</Label>
              <div className="grid grid-cols-2 gap-1 mt-1.5">
                {(["PERCENT", "FIXED"] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-medium border ${
                      kind === k
                        ? "border-primary bg-accent"
                        : "border-border bg-card"
                    }`}
                  >
                    {k === "PERCENT" ? "%" : "₴"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="pc-amount">{t.promo.discount}</Label>
              <Input
                id="pc-amount"
                type="number"
                min={0}
                max={kind === "PERCENT" ? 95 : 100000}
                step={kind === "PERCENT" ? 1 : 5}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                required
                className="mt-1.5"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="pc-min">{t.promo.minOrder}</Label>
              <Input
                id="pc-min"
                type="number"
                min={0}
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value) || 0)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="pc-max">Max uses</Label>
              <Input
                id="pc-max"
                type="number"
                min={1}
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="∞"
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="pc-exp">Expires</Label>
            <Input
              id="pc-exp"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.addresses.cancel}
            </Button>
            <Button type="submit" disabled={submitting || !code}>
              {submitting ? t.admin.saving : t.admin.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
