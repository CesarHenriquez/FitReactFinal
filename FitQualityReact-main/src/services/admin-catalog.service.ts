import { PRODUCTOS, type Product } from "../data/catalog";
import { storage } from "./storage.service";

const ADMIN_PRODUCTS_KEY = "admin_products";

export function getAdminProducts(): Product[] {
  return storage.get<Product[]>(ADMIN_PRODUCTS_KEY, []);
}

export function saveAdminProducts(list: Product[]) {
  storage.set(ADMIN_PRODUCTS_KEY, list ?? []);
}


export function getFullCatalog(): Record<string, Product> {
  const extra = getAdminProducts();
  const out: Record<string, Product> = { ...PRODUCTOS };
  for (const p of extra) out[p.id] = p;
  return out;
}

export function getProductById(id: string): Product | null {
  return getFullCatalog()[id] ?? null;
}