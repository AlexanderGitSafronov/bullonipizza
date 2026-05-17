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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "./image-upload";

export interface ProductRow {
  id: string;
  slug: string;
  nameUk: string;
  nameEn: string;
  nameRu: string;
  descUk: string;
  descEn: string;
  descRu: string;
  image: string;
  basePrice: number | string;
  categoryId: string;
  isPopular: boolean;
  isAvailable: boolean;
  hasSize: boolean;
  hasCrust: boolean;
  discount: number;
}

export interface CategoryRow {
  id: string;
  slug: string;
  nameUk: string;
  nameEn: string;
  nameRu: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: ProductRow | null;
  categories: CategoryRow[];
  onSaved: () => void;
}

const emptyDraft = {
  slug: "",
  nameUk: "",
  nameEn: "",
  nameRu: "",
  descUk: "",
  descEn: "",
  descRu: "",
  image: "",
  basePrice: 199,
  categoryId: "",
  isPopular: false,
  isAvailable: true,
  hasSize: true,
  hasCrust: true,
  discount: 0,
};

export function ProductEditor({
  open,
  onOpenChange,
  product,
  categories,
  onSaved,
}: Props) {
  const [draft, setDraft] = useState<typeof emptyDraft>(emptyDraft);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setDraft({
        slug: product.slug,
        nameUk: product.nameUk,
        nameEn: product.nameEn,
        nameRu: product.nameRu,
        descUk: product.descUk,
        descEn: product.descEn,
        descRu: product.descRu,
        image: product.image,
        basePrice: Number(product.basePrice),
        categoryId: product.categoryId,
        isPopular: product.isPopular,
        isAvailable: product.isAvailable,
        hasSize: product.hasSize,
        hasCrust: product.hasCrust,
        discount: product.discount,
      });
    } else {
      setDraft({
        ...emptyDraft,
        categoryId: categories[0]?.id ?? "",
      });
    }
  }, [open, product, categories]);

  const set = <K extends keyof typeof draft>(
    k: K,
    v: (typeof draft)[K]
  ) => setDraft((d) => ({ ...d, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.image) {
      toast.error("Image required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        product
          ? `/api/admin/products/${product.id}`
          : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );
      const body = await res.json();
      if (!res.ok || !body.ok) {
        toast.error(body.error || "Save failed");
        return;
      }
      toast.success(product ? "Updated ✓" : "Created ✓");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error((err as Error).message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-5">
          <DialogHeader>
            <DialogTitle>
              {product ? `Edit · ${product.nameUk}` : "New product"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-[1fr,1.2fr] gap-6">
            <ImageUpload
              value={draft.image}
              onChange={(url) => set("image", url)}
            />

            <div className="space-y-3">
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={draft.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="margherita"
                  pattern="[a-z0-9-]+"
                  disabled={!!product}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={draft.categoryId}
                  onChange={(e) => set("categoryId", e.target.value)}
                  className="flex h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameUk}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="price">Base price ₴</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.basePrice}
                    onChange={(e) =>
                      set("basePrice", Number(e.target.value) || 0)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount %</Label>
                  <Input
                    id="discount"
                    type="number"
                    min={0}
                    max={95}
                    value={draft.discount}
                    onChange={(e) =>
                      set("discount", Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            {(["Uk", "En", "Ru"] as const).map((lang) => (
              <div key={lang} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {lang}
                </p>
                <Input
                  placeholder={`Name (${lang})`}
                  value={(draft as any)[`name${lang}`]}
                  onChange={(e) =>
                    set(`name${lang}` as any, e.target.value)
                  }
                  required
                />
                <Textarea
                  placeholder={`Description (${lang})`}
                  value={(draft as any)[`desc${lang}`]}
                  onChange={(e) =>
                    set(`desc${lang}` as any, e.target.value)
                  }
                  rows={3}
                  required
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[
              { k: "isPopular" as const, label: "Popular" },
              { k: "isAvailable" as const, label: "Available" },
              { k: "hasSize" as const, label: "Has sizes" },
              { k: "hasCrust" as const, label: "Has crust" },
            ].map(({ k, label }) => (
              <label
                key={k}
                className="flex items-center gap-2 p-3 rounded-2xl border border-border bg-secondary/30 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={draft[k]}
                  onChange={(e) => set(k, e.target.checked as never)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex gap-2 justify-end pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : product
                  ? "Save changes"
                  : "Create product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
