"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/lib/pricing";

export type CartItem =
  | { kind: "catalog"; key: string; productId: string; qty: number }
  | {
      kind: "link";
      key: string;
      url: string;
      platform?: string;
      title: string;
      variant?: string;
      image?: string;
      price: number;
      currency: Currency;
      qty: number;
    };

type CartState = {
  items: CartItem[];
  addProduct: (productId: string, qty?: number) => void;
  addLink: (item: Omit<Extract<CartItem, { kind: "link" }>, "kind" | "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addProduct: (productId, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.kind === "catalog" && i.productId === productId);
          if (existing) {
            return { items: s.items.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i)) };
          }
          return { items: [...s.items, { kind: "catalog", key: `c-${productId}`, productId, qty }] };
        }),
      addLink: (item) =>
        set((s) => ({ items: [...s.items, { ...item, kind: "link", key: `l-${Date.now().toString(36)}` }] })),
      setQty: (key, qty) =>
        set((s) => ({ items: s.items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    { name: "world-auto-cart" }
  )
);
