"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocale } from "@/i18n/provider";
import { useAddresses, type SavedAddress } from "@/store/addresses";

export function AddressDialog({
  open,
  onOpenChange,
  initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: SavedAddress | null;
}) {
  const { t } = useLocale();
  const { create, update } = useAddresses();
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setLabel(initial.label ?? "");
      setAddress(initial.address);
      setIsDefault(initial.isDefault);
    } else {
      setLabel("");
      setAddress("");
      setIsDefault(false);
    }
  }, [open, initial]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim().length < 5) return;
    setSubmitting(true);
    const ok = initial
      ? await update(initial.id, { label, address, isDefault })
      : !!(await create({ label, address, isDefault }));
    setSubmitting(false);
    if (ok) {
      toast.success(t.addresses.saved);
      onOpenChange(false);
    }
  };

  const presets = [t.addresses.house, t.addresses.work, t.addresses.other];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <DialogHeader>
            <DialogTitle>
              {initial ? t.addresses.edit : t.addresses.addNew}
            </DialogTitle>
          </DialogHeader>

          <div>
            <Label htmlFor="addr-label">{t.addresses.label}</Label>
            <Input
              id="addr-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t.addresses.labelPh}
              maxLength={40}
              className="mt-1.5"
            />
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setLabel(p)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-secondary hover:bg-accent transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="addr-text">{t.addresses.address}</Label>
            <Input
              id="addr-text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t.addresses.addressPh}
              maxLength={200}
              required
              className="mt-1.5"
              autoComplete="street-address"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-2xl border border-border bg-secondary/30">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm">{t.addresses.setDefault}</span>
          </label>

          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t.addresses.cancel}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? t.addresses.saving : t.addresses.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
