export interface CartItem {
  id: string;    // puede incluir variante, ej: "mancuernas-10KG"
  name: string;  // ej: "Mancuernas (10KG)"
  price: number;
  qty: number;
}