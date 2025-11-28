import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";


export function ProductCard({ p }: { p: any }) { 
  const { add, items } = useCart(); 

  const handleAdd = () => {
    const itemInCart = items.find((i) => i.id === p.id);
    const currentQty = itemInCart ? itemInCart.qty : 0;

    if (currentQty >= p.stock) {
        alert("Stock máximo alcanzado para este producto.");
        return;
    }
    add({ id: p.id, name: p.nombre, price: p.precio });
  };

  return (
    <div className="card h-100">
      <img src={p.img} className="card-img-top" alt={p.nombre} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{p.nombre} ${p.precio.toFixed(0)}</h5>
        
        {/* Mostrar aviso visual de stock */}
        <p className="small mb-2" style={{ color: p.stock < 5 ? '#ffc107' : '#aaa' }}>
            {p.stock === 0 ? "AGOTADO" : `Stock: ${p.stock}`}
        </p>

        <p className="text-secondary small flex-grow-1">{p.material}</p>
        
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light"
            onClick={handleAdd}
            disabled={p.stock === 0} 
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