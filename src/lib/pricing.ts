export type PizzaSize = "small" | "medium" | "large";
export type PizzaCrust = "classic" | "thin" | "cheese";
export type Extra =
  | "mozzarella"
  | "pepperoni"
  | "mushrooms"
  | "olives"
  | "pepper"
  | "parmesan";

export const SIZE_MULTIPLIER: Record<PizzaSize, number> = {
  small: 1,
  medium: 1.3,
  large: 1.6,
};

export const CRUST_PRICE: Record<PizzaCrust, number> = {
  classic: 0,
  thin: 0,
  cheese: 60,
};

export const EXTRA_PRICE: Record<Extra, number> = {
  mozzarella: 35,
  pepperoni: 45,
  mushrooms: 30,
  olives: 25,
  pepper: 25,
  parmesan: 40,
};

export const DELIVERY_FEE = 60;
export const FREE_DELIVERY_THRESHOLD = 400;

export function calculateItemPrice(opts: {
  basePrice: number;
  size?: PizzaSize | null;
  crust?: PizzaCrust | null;
  extras?: Extra[];
  discount?: number;
}) {
  const { basePrice, size, crust, extras = [], discount = 0 } = opts;
  let price = basePrice;
  if (size) price = price * SIZE_MULTIPLIER[size];
  if (crust) price += CRUST_PRICE[crust];
  for (const e of extras) price += EXTRA_PRICE[e];
  if (discount > 0) price = price * (1 - discount / 100);
  return Math.round(price);
}
