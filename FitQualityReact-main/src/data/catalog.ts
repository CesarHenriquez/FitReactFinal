// Catálogo base + sets de opciones (adaptado de tu HTML/JS)
export type OptionKey = "none" | "colors" | "mancuernas" | "discos";

export interface Product {
  id: string;
  nombre: string;
  precio: number;
  img: string;
  bullets: string[];
  material?: string;
  optionKey: OptionKey;
  fixedTag?: string;
}

export const PRODUCTOS: Record<string, Product> = {
  magnesio: {
    id: "magnesio",
    nombre: "Magnesio Deportivo",
    precio: 2500,
    img: "https://biogymstore.cl/cdn/shop/products/MAGNESIODEPORTIVOCROSSFTICALISTENIAPORMAYORBIOGYMSTORECHILE_2048x.jpg?v=1679183264",
    bullets: [
      "Agarre superior en barras y kettlebells.",
      "Fórmula de alta pureza, baja humedad.",
      "Envase resellable para mayor durabilidad.",
    ],
    material: "Carbonato de magnesio de grado deportivo.",
    optionKey: "none",
  },
  straps: {
    id: "straps",
    nombre: "Straps de Entrenamiento",
    precio: 3500,
    img: "https://olimposports.cl/wp-content/uploads/2023/10/Copia-de-NUEVO-FORMATO-2025-01-16T110258.906.jpg",
    bullets: [
      "Soporte extra para tirones pesados.",
      "Costuras reforzadas anti-desgarro.",
      "Interior con grip antideslizante.",
    ],
    material: "Algodón grueso con refuerzo de neopreno.",
    optionKey: "colors",
  },
  cinturon: {
    id: "cinturon",
    nombre: "Cinturón Powerlifter",
    precio: 14990,
    img: "https://greatlhete.cl/wp-content/uploads/2022/10/powerliftingpalancaback.webp",
    bullets: [
      "Estabilidad lumbar en sentadillas y press.",
      "Hebilla de palanca de acero.",
      "Grosor uniforme para presión intraabdominal.",
    ],
    material: "Cuero sintético de alta densidad + acero.",
    optionKey: "colors",
  },
  rodilleras: {
    id: "rodilleras",
    nombre: "Rodilleras 7mm",
    precio: 5000,
    img: "https://http2.mlstatic.com/D_NQ_NP_610417-MLC90985245494_082025-O-par-de-rodilleras-7mm-compresion-crossfit-power-lifting.webp",
    bullets: ["Compresión y calor articular.", "Costuras planas anti-rozaduras.", "Apta para WODs y powerlifting."],
    material: "Neopreno 7mm de alta elasticidad.",
    optionKey: "colors",
  },
  coderas: {
    id: "coderas",
    nombre: "Coderas de Compresión",
    precio: 5000,
    img: "https://cdnx.jumpseller.com/sbd-chile/image/63911980/thumb/719/719?1748535528",
    bullets: ["Estabilidad en press y extensiones.", "Tejido transpirable.", "Ajuste anatómico."],
    material: "Mezcla elástica poliéster-spandex.",
    optionKey: "colors",
  },
  mancuernas: {
    id: "mancuernas",
    nombre: "Mancuernas (par)",
    precio: 19990,
    img: "https://xrs.cl/wp-content/uploads/2021/09/15.jpg",
    bullets: [
      "Revestimiento que protege el piso.",
      "Marcado de peso visible.",
      "Agarre cómodo con textura.",
    ],
    material: "Núcleo de hierro con recubrimiento vinílico.",
    optionKey: "mancuernas",
  },
  discos: {
    id: "discos",
    nombre: "Discos de Peso",
    precio: 29990,
    img: "https://dnkkaawggv0bs.cloudfront.net/7518-large_default/pack-150kg-discos-powerlifting-chromed-steel-xmaster.jpg",
    bullets: ["Diámetro estándar para barra olímpica.", "Alta durabilidad.", "Tolerancia de peso ±2%."],
    material: "Acero cromado / goma densa (según modelo).",
    optionKey: "discos",
  },
  barra: {
    id: "barra",
    nombre: "Barra Olímpica",
    precio: 34990,
    img: "https://www.inaturalfitness.com/gallery/barra-powerlifting-competencia.jpeg",
    bullets: ["Buena elasticidad y whip controlado.", "Moleteado con marcas olímpicas.", "Cojinetes para giro fluido."],
    material: "Acero aleado con recubrimiento resistente.",
    optionKey: "none",
    fixedTag: "20KG",
  },
};

export const OPTION_SETS: Record<
  Exclude<OptionKey, "none">,
  { label: string; values: string[] }
> = {
  colors: { label: "Color", values: ["Rojo", "Negro", "Azul", "Rosado"] },
  mancuernas: { label: "Peso (par)", values: ["2.5KG", "5KG", "8KG", "10KG", "15KG", "20KG"] },
  discos: { label: "Peso", values: ["5KG", "10KG", "15KG", "20KG"] },
};