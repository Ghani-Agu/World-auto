"use client";

import { useState } from "react";
import clsx from "clsx";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/store/cart";
import { useI18n } from "@/i18n/provider";

export default function AddToCart({ productId, size = "sm", className }: { productId: string; size?: "sm" | "lg"; className?: string }) {
  const add = useCart((s) => s.addProduct);
  const { dict } = useI18n();
  const [done, setDone] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        add(productId);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-95",
        done ? "bg-jade text-ink" : "bg-signal text-white hover:bg-signal-2",
        size === "sm" ? "h-10 w-10" : "h-12 px-6 text-sm",
        className
      )}
      aria-label={dict.common.addToCart}
    >
      {done ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      {size === "lg" && <span>{done ? dict.common.added : dict.common.addToCart}</span>}
    </button>
  );
}
