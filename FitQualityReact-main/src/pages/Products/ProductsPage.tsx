import { useEffect, useState } from "react";
import { ProductCard } from "../../components/ProductCard";

import { api, getImageUrl, type ApiProduct } from "../../services/api";

export function ProductsPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar desde Microservicio 8022
    api.getProductos()
      .then((data) => {
        // Adapta los datos del backend al formato que tu ProductCard espera
        const adaptados = data.map((p: ApiProduct) => ({
          id: p.id.toString(), 
          nombre: p.nombre,
          precio: p.precio,

         
          img: getImageUrl(p.imagenUri),

          material: p.descripcion,
         
          stock: p.stock, 
          optionKey: "none", 
          bullets: [`Stock: ${p.stock}`] 
        }));
        setProducts(adaptados);
      })
      .catch((err) => console.error("Error cargando productos", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mt-5">Cargando catálogo...</div>;

  return (
    <main className="grid">
      <div className="container">
        <h2>Todos los productos</h2>
        <div className="row g-3">
          {products.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-lg-4">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}