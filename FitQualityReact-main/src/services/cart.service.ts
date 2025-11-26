import { storage } from "./storage.service";
import type { CartItem } from "../types/cart";
const CART_KEY = "sf_cart";

export const cartService = {
  all(): CartItem[] {
    return storage.get<CartItem[]>(CART_KEY, []);
  },
  save(items: CartItem[]) {
    storage.set(CART_KEY, items);
  },
  add(item: Omit<CartItem, "qty"> & { qty?: number }) {
    const list = cartService.all();
    const i = list.findIndex((x) => x.id === item.id);
    if (i >= 0) list[i].qty += item.qty ?? 1;
    else list.push({ ...item, qty: item.qty ?? 1 });
    cartService.save(list);
  },
  remove(id: string) {
    cartService.save(cartService.all().filter((x) => x.id !== id));
  },
  setQty(id: string, qty: number) {
    cartService.save(
      cartService.all().map((x) => (x.id === id ? { ...x, qty } : x)).filter((x) => x.qty > 0)
    );
  },
  clear() {
    storage.remove(CART_KEY);
  },
  count() {
    return cartService.all().reduce((s, i) => s + i.qty, 0);
  },
  total() {
    return cartService.all().reduce((s, i) => s + i.price * i.qty, 0);
  },
};