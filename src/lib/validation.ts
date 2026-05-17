import { z } from "zod";

// Match ASCII control chars (U+0000-U+001F and U+007F).
// Built via RegExp constructor so the source stays printable.
const CONTROL_CHARS = new RegExp("[\\u0000-\\u001F\\u007F]", "g");

// Strip control chars + HTML angle brackets, collapse whitespace.
export function sanitize(input: string): string {
  return input
    .normalize("NFC")
    .replace(CONTROL_CHARS, "")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const nameRe = /^[\p{L}\p{M}\s'’\-.]{2,60}$/u;

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s()\-.]/g, "");
}
const phoneRe = /^\+?\d{7,15}$/;

export const checkoutSchema = z.object({
  name: z
    .string()
    .transform(sanitize)
    .pipe(z.string().regex(nameRe, { message: "name" })),
  phone: z
    .string()
    .transform((v) => normalizePhone(sanitize(v)))
    .pipe(z.string().regex(phoneRe, { message: "phone" })),
  address: z
    .string()
    .transform(sanitize)
    .pipe(z.string().min(5).max(200)),
  comment: z
    .string()
    .transform((v) => sanitize(v).slice(0, 500))
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, { errorMap: () => ({ message: "consent" }) }),
  age: z.literal(true, { errorMap: () => ({ message: "age" }) }),
  // Honeypot — must remain empty.
  website: z.string().max(0).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderItemSchema = z.object({
  productId: z.string().min(1).max(64),
  slug: z.string().min(1).max(64),
  nameUk: z.string().max(120),
  nameEn: z.string().max(120),
  nameRu: z.string().max(120),
  image: z.string().url().max(500),
  quantity: z.number().int().min(1).max(50),
  size: z.enum(["small", "medium", "large"]).nullable().optional(),
  crust: z.enum(["classic", "thin", "cheese"]).nullable().optional(),
  extras: z.array(z.string().max(40)).max(20).default([]),
  price: z.number().min(0).max(100000),
});

export const orderApiSchema = z.object({
  orderNumber: z.string().regex(/^BP-[A-Z0-9]{4,20}$/i),
  name: z.string().max(80),
  phone: z.string().max(20),
  address: z.string().max(200),
  comment: z.string().max(500).optional().or(z.literal("")),
  items: z.array(orderItemSchema).min(1).max(50),
  subtotal: z.number().min(0).max(1_000_000),
  deliveryFee: z.number().min(0).max(10_000),
  total: z.number().min(0).max(1_000_000),
  createdAt: z.number().int().min(0),
});

export type OrderApiInput = z.infer<typeof orderApiSchema>;
