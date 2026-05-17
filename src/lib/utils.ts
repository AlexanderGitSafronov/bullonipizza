import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "₴") {
  return `${amount.toFixed(0)} ${currency}`;
}

export function generateOrderNumber() {
  const date = new Date();
  const stamp = date.getTime().toString().slice(-6);
  return `BP-${stamp}`;
}
