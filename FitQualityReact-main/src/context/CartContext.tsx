import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartService } from "../services/cart.service";
import type { CartItem } from "../types/cart";

type CartStore = {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartCtx = createContext<CartStore | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => cartService.all());

  
  const refresh = () => setItems(cartService.all());

  useEffect(() => {
    const fn = () => refresh();
    window.addEventListener("storage", fn);
    return () => window.removeEventListener("storage", fn);
  }, []);

  const api = useMemo<CartStore>(
    () => ({
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.price * i.qty, 0),
      add: (it) => { cartService.add(it); refresh(); },
      remove: (id) => { cartService.remove(id); refresh(); },
      setQty: (id, qty) => { cartService.setQty(id, qty); refresh(); },
      clear: () => { cartService.clear(); refresh(); },
    }),
    [items]
  );

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};