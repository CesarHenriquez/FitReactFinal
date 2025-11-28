import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { api, getImageUrl, type ApiProduct } from "../../services/api";

export function ProductDetailPage() {
  const { id = "" } = useParams();
  
  // 1. Obtiene 'items' del carrito 
  const { add, items } = useCart(); 

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getProductById(id)
      .then((data: ApiProduct) => {
        const adaptado = {
          id: data.id.toString(),
          nombre: data.nombre,
          precio: data.precio,
          img: getImageUrl(data.imagenUri),
          material: data.descripcion,
          bullets: [`Stock disponible: ${data.stock}`],
          
          // 2. GUARDA EL STOCK REAL COMO NÚMERO
          stock: data.stock, 
          
          optionKey: "none"
        };
        setProduct(adaptado);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // FUNCIÓN PARA AGREGAR
  const handleAddToCart = () => {
    // Busca si este producto ya está en el carrito
    const itemInCart = items.find((i) => i.id === product.id);
    const currentQty = itemInCart ? itemInCart.qty : 0;

    // Valida
    if (currentQty >= product.stock) {
        alert(`¡No puedes agregar más! Solo quedan ${product.stock} unidades.`);
        return;
    }

    // Si pasa la validación, agrega
    add({ id: product.id, name: product.nombre, price: product.precio });
  };

  if (loading) return <div className="container py-5">Cargando...</div>;
  if (error || !product) return <div className="container py-5">Error al cargar.</div>;

  return (
    <main className="grid">
      <div className="container" style={{ alignItems: 'flex-start' }}>
        <div className="product-detail-layout" style={{ width: '100%', margin: '0 auto 32px' }}>
          <div className="product-detail-layout__image-wrapper">
            <img src={product.img} alt={product.nombre} className="product-detail-image" />
          </div>

          <div className="product-detail-layout__info">
            <h1 className="page-title" style={{ textAlign: 'left', marginBottom: 6 }}>{product.nombre}</h1>
            <p className="price" style={{ fontSize: '1.8em', fontWeight: 'bold', marginTop: 12, color: 'var(--primary)' }}>
              ${product.precio.toFixed(0)}
            </p>

            {/* Mostramos el stock visualmente */}
            <p className="text-secondary small">
                {product.stock > 0 ? `Stock: ${product.stock} unidades` : "AGOTADO"}
            </p>

            {/* ... bullets y descripción ... */}

            <div className="mt-4">
              <button
                className="btn w-100 mb-2"
                onClick={handleAddToCart}
                
                disabled={product.stock === 0}
                style={product.stock === 0 ? { backgroundColor: '#555', cursor: 'not-allowed' } : {}}
              >
                {product.stock === 0 ? "Sin Stock" : "Añadir al carrito"}
              </button>

              <div className="d-flex gap-2">
                <Link className="btn btn--outline w-50" to="/productos">← Volver</Link>
                <Link className="btn w-50" to="/cart" style={{background: '#333', border: 'none'}}>🛒 Ir al carrito</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}