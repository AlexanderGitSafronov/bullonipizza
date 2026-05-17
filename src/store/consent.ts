"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export interface ConsentState {
  decided: boolean;
  decidedAt: number | null;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  setPartial: (next: Partial<Pick<ConsentState, "analytics" | "marketing">>) => void;
  reset: () => void;
}

export const useConsent = create<ConsentState>()(
  persist(
    (set) => ({
      decided: false,
      decidedAt: null,
      necessary: true,
      analytics: false,
      marketing: false,
      acceptAll: () =>
        set({
          decided: true,
          decidedAt: Date.now(),
          analytics: true,
          marketing: true,
        }),
      rejectAll: () =>
        set({
          decided: true,
          decidedAt: Date.now(),
          analytics: false,
          marketing: false,
        }),
      setPartial: (next) =>
        set((s) => ({
          ...s,
          ...next,
          decided: true,
          decidedAt: Date.now(),
        })),
      reset: () =>
        set({
          decided: false,
          decidedAt: null,
          analytics: false,
          marketing: false,
        }),
    }),
    { name: "bp_consent" }
  )
);
