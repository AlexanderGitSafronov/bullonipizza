"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./auth";

export interface SavedAddress {
  id: string;
  label: string | null;
  address: string;
  isDefault: boolean;
  createdAt: string;
}

interface UseAddresses {
  addresses: SavedAddress[];
  loading: boolean;
  refresh: () => Promise<void>;
  create: (
    data: { label?: string; address: string; isDefault?: boolean }
  ) => Promise<SavedAddress | null>;
  update: (
    id: string,
    data: Partial<{ label: string; address: string; isDefault: boolean }>
  ) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
}

// Tiny hook around the addresses API — used by /profile and /checkout.
export function useAddresses(): UseAddresses {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/addresses", { cache: "no-store" });
      const body = await res.json();
      if (body.ok) setAddresses(body.addresses);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create: UseAddresses["create"] = async (data) => {
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        if (body.error === "too_many_addresses") {
          toast.error("Up to 10 addresses per profile");
        } else {
          toast.error("Save failed");
        }
        return null;
      }
      await refresh();
      return body.address as SavedAddress;
    } catch {
      toast.error("Save failed");
      return null;
    }
  };

  const update: UseAddresses["update"] = async (id, data) => {
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
      await refresh();
      return true;
    } catch {
      toast.error("Save failed");
      return false;
    }
  };

  const remove: UseAddresses["remove"] = async (id) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) return false;
      await refresh();
      return true;
    } catch {
      return false;
    }
  };

  return { addresses, loading, refresh, create, update, remove };
}
