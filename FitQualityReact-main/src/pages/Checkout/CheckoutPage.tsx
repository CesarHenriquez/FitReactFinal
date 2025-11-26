import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";

type Metodo = "webpay" | "transferencia" | "wallets";

export function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [mp, setMp] = useState<Metodo>("webpay");
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      alert("Tu carrito está vacío. Agrega productos antes de pagar.");
      navigate("/productos");
    }
  }, [items.length, navigate]);

  const btnLabel = useMemo(() => {
    switch (mp) {
      case "webpay": return "Pagar con Webpay";
      case "transferencia": return "Ir a Transferencia Bancaria";
      case "wallets": return "Pagar con billetera";
      default: return "Pagar ahora";
    }
  }, [mp]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Demo: redirigiendo a ${btnLabel}…`);
    clear();
    navigate("/");
  };

  return (
    <main className="grid">
      <div className="container d-flex justify-content-center">
        <div className="page-narrow form w-100" style={{ maxWidth: 520 }}>
          <h1 className="page-title text-center">Método de pago</h1>
          <p className="muted text-center mb-3">Selecciona tu medio de pago preferido.</p>

          <form onSubmit={onSubmit}>
            <div className="card mb-2">
              <label className="pay-option" style={{ cursor: "pointer" }}>
                <input
                  type="radio" name="mp" value="webpay"
                  checked={mp === "webpay"} onChange={() => setMp("webpay")}
                />
                <div>
                  <strong>Tarjetas (Webpay / Transbank)</strong>
                  <div className="pay-logos">
                    <span className="pay-badge">Webpay</span>
                    <span className="pay-badge">Visa</span>
                    <span className="pay-badge">Mastercard</span>
                    <span className="pay-badge">Redcompra</span>
                    <span className="pay-badge">Prepago</span>
                    <span className="pay-badge">Onepay</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="card mb-2">
              <label className="pay-option" style={{ cursor: "pointer" }}>
                <input
                  type="radio" name="mp" value="transferencia"
                  checked={mp === "transferencia"} onChange={() => setMp("transferencia")}
                />
                <div>
                  <strong>Transferencia Bancaria</strong>
                  <div className="pay-logos"><span className="pay-badge">Transferencia</span></div>
                </div>
              </label>
            </div>

            <div className="card mb-2">
              <label className="pay-option" style={{ cursor: "pointer" }}>
                <input
                  type="radio" name="mp" value="wallets"
                  checked={mp === "wallets"} onChange={() => setMp("wallets")}
                />
                <div>
                  <strong>Billeteras digitales</strong>
                  <div className="pay-logos">
                    <span className="pay-badge">Mercado Pago</span>
                    <span className="pay-badge">Fpay</span>
                    <span className="pay-badge">MACH</span>
                    <span className="pay-badge">Onepay</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="card mb-2 d-flex justify-content-between align-items-center px-3 py-2">
              <span>Total a pagar</span>
              <strong>${total.toFixed(0)}</strong>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <Link className="btn btn--outline" to="/cart">Volver al carrito</Link>
              <button type="submit" className="btn">{btnLabel}</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}