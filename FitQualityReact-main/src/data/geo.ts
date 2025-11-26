export const regionesComunas = [
  { region: "Metropolitana de Santiago", comunas: ["Santiago","Providencia","Las Condes","Maipú","Puente Alto"] },
  { region: "Valparaíso", comunas: ["Valparaíso","Viña del Mar","Quilpué","Villa Alemana"] },
  { region: "Biobío", comunas: ["Concepción","Talcahuano","Chiguayante","San Pedro de la Paz"] },
];

export const getRegions = () => regionesComunas.map(r => r.region);
export const getComunas = (region: string) =>
  (regionesComunas.find(r => r.region === region)?.comunas ?? []);