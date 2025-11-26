import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/catalog";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  return (
    <div className="card h-100">
      <img src={p.img} className="card-img-top" alt={p.nombre} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{p.nombre} ${p.precio.toFixed(0)}</h5>
        <p className="text-secondary small flex-grow-1">{p.material}</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light"
            onClick={() => add({ id: p.id, name: p.nombre, price: p.precio })}
          >
            Añadir
          </button>
          <Link className="btn btn-success" to={`/detalle/${encodeURIComponent(p.id)}`}>
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
}