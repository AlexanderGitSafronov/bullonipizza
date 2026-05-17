"use client";

import { create as createStore } from "zustand";
import toast from "react-hot-toast";

export interface SavedAddress {
  id: string;
  label: string | null;
  address: string;
  isDefault: boolean;
  createdAt: string;
}

interface AddressesStore {
  addresses: SavedAddress[];
  loading: boolean;
  refresh: () => Promise<void>;
  reset: () => void;
  create: (data: {
    label?: string;
    address: string;
    isDefault?: boolean;
  }) => Promise<SavedAddress | null>;
  update: (
    id: string,
    data: Partial<{ label: string; address: string; isDefault: boolean }>
  ) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
}

// Single shared store — every component subscribing to `useAddresses` reads
// the same state. AuthProvider triggers refresh on login and reset on logout,
// so the list is always in sync with the current user across pages.
export const useAddresses = createStore<AddressesStore>((set, get) => ({
  addresses: [],
  loading: false,

  reset: () => set({ addresses: [], loading: false }),

  refresh: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/addresses", { cache: "no-store" });
      if (!res.ok) {
        set({ addresses: [] });
        return;
      }
      const body = await res.json();
      if (body.ok) set({ addresses: body.addresses });
    } catch {
      /* ignore */
    } finally {
      set({ loading: false });
    }
  },

  create: async (data) => {
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        toast.error(
          body.error === "too_many_addresses"
            ? "Up to 10 addresses per profile"
            : "Save failed"
        );
        return null;
      }
      await get().refresh();
      return body.address as SavedAddress;
    } catch {
      toast.error("Save failed");
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        toast.error("Save failed");
        return false;
      }
      await get().refresh();
      return true;
    } catch {
      toast.error("Save failed");
      return false;
    }
  },

  remove: async (id) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      await get().refresh();
      return true;
    } catch {
      return false;
    }
  },
}));
