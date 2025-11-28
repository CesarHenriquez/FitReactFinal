import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProductCard } from "../../components/ProductCard";
import { api, getImageUrl, type ApiProduct } from "../../services/api";

export function HomePage() {
  const [destacados, setDestacados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pide todos los productos al backend
    api.getProductos()
      .then((data) => {
        
        const allProducts = data.map((p: ApiProduct) => ({
          id: p.id.toString(),
          nombre: p.nombre,
          precio: p.precio,
          img: getImageUrl(p.imagenUri), // Construye la ruta de la imagen
          material: p.descripcion,
          stock: p.stock, 
          optionKey: "none"
        }));

        
        const keywords = ["Cinturón", "Magnesio", "Straps"];
        
        let featured = allProducts.filter(p => 
            keywords.some(k => p.nombre.toLowerCase().includes(k.toLowerCase()))
        );

       
        if (featured.length < 3) {
            const otros = allProducts.filter(p => !featured.includes(p));
            featured = [...featured, ...otros].slice(0, 3);
        }

        setDestacados(featured.slice(0, 3)); 
      })
      .catch((err) => console.error("Error cargando home:", err))
      .finally(() => setLoading(false));
  }, []);

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

      {/* Productos Destacados Dinámicos */}
      <section className="grid">
        <div className="container">
          <h2>Productos Destacados</h2>
          
          {loading ? (
             <p className="text-center">Cargando destacados...</p>
          ) : (
            <div className="row g-3">
                {destacados.map((p) => (
                <div key={p.id} className="col-12 col-sm-6 col-lg-4">
                    {/* Al usar el mismo ProductCard, el botón "Ver Detalle" funcionará automáticamente */}
                    <ProductCard p={p} />
                </div>
                ))}
            </div>
          )}

        </div>
      </section>
    </main>
  );
}