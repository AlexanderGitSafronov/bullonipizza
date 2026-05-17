"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Extra, PizzaCrust, PizzaSize } from "@/lib/pricing";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  calculateItemPrice,
} from "@/lib/pricing";

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  nameUk: string;
  nameEn: string;
  nameRu: string;
  image: string;
  basePrice: number;
  size?: PizzaSize | null;
  crust?: PizzaCrust | null;
  extras: Extra[];
  quantity: number;
  unitPrice: number;
  discount?: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<CartItem, "id" | "unitPrice" | "quantity"> & {
    quantity?: number;
  }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
  itemCount: () => number;
}

function makeKey(it: {
  productId: string;
  size?: PizzaSize | null;
  crust?: PizzaCrust | null;
  extras: Extra[];
}) {
  return [
    it.productId,
    it.size ?? "",
    it.crust ?? "",
    [...it.extras].sort().join(","),
  ].join("|");
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (raw) => {
        const unitPrice = calculateItemPrice({
          basePrice: raw.basePrice,
          size: raw.size,
          crust: raw.crust,
          extras: raw.extras,
          discount: raw.discount,
        });
        const key = makeKey(raw);
        const items = [...get().items];
        const idx = items.findIndex(
          (i) =>
            makeKey({
              productId: i.productId,
              size: i.size,
              crust: i.crust,
              extras: i.extras,
            }) === key
        );
        if (idx >= 0) {
          items[idx] = {
            ...items[idx],
            quantity: items[idx].quantity + (raw.quantity ?? 1),
          };
        } else {
          items.push({
            ...raw,
            id: key + "-" + Math.random().toString(36).slice(2, 7),
            quantity: raw.quantity ?? 1,
            unitPrice,
          });
        }
        set({ items, isOpen: true });
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),

      clear: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0),

      deliveryFee: () => {
        const sub = get().items.reduce(
          (acc, i) => acc + i.unitPrice * i.quantity,
          0
        );
        if (sub === 0) return 0;
        return sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
      },

      total: () => {
        const sub = get().items.reduce(
          (acc, i) => acc + i.unitPrice * i.quantity,
          0
        );
        const fee = sub === 0 ? 0 : sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
        return sub + fee;
      },

      itemCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    }),
    {
      name: "bp_cart",
      partialize: (s) => ({ items: s.items }),
    }
  )
);
