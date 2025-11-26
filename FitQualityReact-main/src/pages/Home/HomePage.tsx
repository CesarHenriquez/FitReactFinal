import { Link } from "react-router-dom";
import { getFullCatalog } from "../../services/admin-catalog.service";
import { ProductCard } from "../../components/ProductCard";

export function HomePage() {
  const catalog = Object.values(getFullCatalog());

  // Productos destacados
  const preferidos = ["magnesio", "straps", "cinturon"];
  const destacados = [
    ...preferidos
      .map((id) => catalog.find((p) => p.id === id))
      .filter(Boolean) as typeof catalog,
  ];

  // si faltan, rellena con los primeros del catálogo
  while (destacados.length < 3 && destacados.length < catalog.length) {
    const next = catalog.find((p) => !destacados.some((d) => d.id === p.id));
    if (!next) break;
    destacados.push(next);
  }

  return (
    <main>
      {/* Hero con fondo difuminado a pantalla completa */}
      <section
        className="hero bg-cover"
        style={{
          ["--bg-url" as any]:
            "url(https://media.istockphoto.com/id/1391410249/es/foto/deportes-y-actividades-de-gimnasio.jpg?s=612x612&w=0&k=20&c=UVfqkA8dnim6qFRuSjLE6dQHFt7Tjo-AIkvnNVHNJUs=)",
        }}
      >
        <div className="container text-center">
          <h1>Implementación deportiva</h1>
          <p>
            Magnesio, straps, cinturones, rodilleras, coderas, mancuernas, discos
            y más.
          </p>
          <Link className="btn" to="/productos">
            Ver productos
          </Link>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="grid">
        <div className="container">
          <h2>Productos Destacados</h2>
          <div className="row g-3">
            {destacados.slice(0, 3).map((p) => (
              <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}