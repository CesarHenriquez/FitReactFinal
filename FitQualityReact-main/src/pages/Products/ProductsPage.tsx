import { ProductCard } from "../../components/ProductCard";
import { getFullCatalog } from "../../services/admin-catalog.service";

export function ProductsPage() {
  const items = Object.values(getFullCatalog());
  return (
    <main className="grid">
      <div className="container">
        <h2>Todos los productos</h2>
        <p className="muted" style={{ marginTop: -6 }}>
          Haz clic en <em>Añadir</em> o abre el <em>detalle</em>.
        </p>
        <div className="row g-3">
          {items.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-lg-4">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}