import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

export function CartPage() {
  const { items, total, setQty, remove, clear } = useCart();

  return (
    <main className="grid">
      <div className="container">
        <h1 className="page-title">Tu carrito</h1>

        {items.length === 0 ? (
          <p className="muted">Tu carrito está vacío.</p>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>{i.name}</td>
                    <td>${i.price.toFixed(0)}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={i.qty}
                        onChange={(e) => setQty(i.id, Number(e.target.value))}
                      />
                    </td>
                    <td>${(i.price * i.qty).toFixed(0)}</td>
                    <td>
                      <button className="btn btn--outline" onClick={() => remove(i.id)}>Quitar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: "right" }}><strong>Total</strong></td>
                  <td colSpan={2}><strong>${total.toFixed(0)}</strong></td>
                </tr>
              </tfoot>
            </table>

            <div className="d-flex gap-2 justify-content-end mt-2">
              <button className="btn btn--outline" onClick={clear}>Vaciar carrito</button>
              <Link className="btn" to="/payment">Pagar</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}