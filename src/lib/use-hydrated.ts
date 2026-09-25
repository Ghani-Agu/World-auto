"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** true only on the client after hydration — use to guard localStorage-backed UI */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
