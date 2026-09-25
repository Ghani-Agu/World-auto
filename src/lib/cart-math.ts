import type { CartItem } from "@/store/cart";
import { productById } from "./catalog";
import { quote } from "./pricing";

export function lineQuote(item: CartItem) {
  if (item.kind === "catalog") {
    const p = productById[item.productId];
    return quote(p ? p.priceCNY : 0, "CNY", item.qty);
  }
  return quote(item.price, item.currency, item.qty);
}

export function cartTotals(items: CartItem[]) {
  return items.reduce(
    (acc, i) => {
      const q = lineQuote(i);
      acc.base += q.base;
      acc.commission += q.commission;
      acc.total += q.total;
      acc.count += i.qty;
      return acc;
    },
    { base: 0, commission: 0, total: 0, count: 0 }
  );
}
