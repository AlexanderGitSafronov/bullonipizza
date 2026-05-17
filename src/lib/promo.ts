import { z } from "zod";

export const promoCodeRe = /^[A-Z0-9_-]{3,30}$/;

export const promoCreateSchema = z.object({
  code: z
    .string()
    .transform((v) => v.trim().toUpperCase())
    .pipe(z.string().regex(promoCodeRe, { message: "code" })),
  kind: z.enum(["PERCENT", "FIXED"]),
  amount: z.number().min(0).max(100_000),
  minOrder: z.number().min(0).max(1_000_000).default(0),
  maxUses: z.number().int().min(1).max(1_000_000).nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const promoUpdateSchema = promoCreateSchema.partial();

export const promoApplySchema = z.object({
  code: z
    .string()
    .transform((v) => v.trim().toUpperCase())
    .pipe(z.string().regex(promoCodeRe)),
  subtotal: z.number().min(0).max(1_000_000),
});

export type PromoApplyInput = z.infer<typeof promoApplySchema>;

export function calculateDiscount(
  kind: "PERCENT" | "FIXED",
  amount: number,
  subtotal: number
): number {
  if (kind === "PERCENT") {
    return Math.round((subtotal * Math.min(amount, 95)) / 100);
  }
  return Math.min(Math.round(amount), subtotal);
}
