import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import toast from 'react-hot-toast'; 

type Metodo = "webpay" | "transferencia" | "wallets";

export function CheckoutPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  
  // Estados del formulario
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [mp, setMp] = useState<Metodo>("webpay");
  const [loading, setLoading] = useState(false);

  const sessionStr = localStorage.getItem("fq_session");
  const session = sessionStr ? JSON.parse(sessionStr) : null;

  // Validaciones iniciales con Toasts
  useEffect(() => {
    // Validar Carrito Vacío
    if (items.length === 0) {
      toast.error("Tu carrito está vacío.\nAgrega productos para continuar.", {
        icon: '🛒',
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
          textAlign: 'center'
        },
        duration: 4000,
      });
      navigate("/productos");
    }
    
    // Validar Sesión
    if (!session || !session.id) {
        toast("Debes iniciar sesión para comprar", { 
            icon: '🔒',
            style: { background: '#1f2937', color: '#fff' } 
        });
        navigate("/login");
    }
  }, [items, navigate, session]);

  // Proceso de Compra
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const toastId = toast.loading("Procesando tu pedido...");
    setLoading(true);

    try {
      // Guardar Dirección (MS 8024)
      const direccionData = {
        calle: calle,
        codigoPostal: numero,
        usuarioId: session.id,
        comunaId: 1 
      };

      const direccionGuardada: any = await api.crearDireccion(direccionData);
      const direccionIdReal = direccionGuardada.id;

      // Crear Venta (MS 8023) vinculada a la dirección
      const pedido = {
        usuarioId: session.id,
        direccionId: direccionIdReal,
        detalles: items.map((item) => ({
          productoId: Number(item.id),
          cantidad: item.qty
        }))
      };

      await api.crearVenta(pedido);

      // Éxito
      toast.dismiss(toastId);
      toast.success("¡Compra realizada con éxito!", {
        duration: 5000,
        style: { background: '#1f2937', color: '#fff', border: '1px solid #22c55e' }
      });
      
      clear(); // Limpiar carrito
      navigate("/"); // Volver al home

    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Error al procesar la compra. Verifica los datos.", {
        style: { background: '#1f2937', color: '#fff' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid">
      <div className="container d-flex justify-content-center">
        <div className="page-narrow form w-100" style={{ maxWidth: 600 }}>
          <h1 className="page-title text-center">Finalizar Compra</h1>
          <p className="muted text-center mb-4">Completa los datos de envío y pago.</p>
          
          <form onSubmit={onSubmit}>
            {/* Sección Dirección */}
            <div className="card p-3 mb-3" style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
                <h3 className="mb-3" style={{ color: '#22c55e' }}>1. Dirección de Envío</h3>
                <div className="form-group">
                    <label>Calle y Pasaje</label>
                    <input 
                      value={calle} 
                      onChange={e => setCalle(e.target.value)} 
                      required 
                      placeholder="Ej: Av. Siempre Viva" 
                      className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Número / Depto</label>
                    <input 
                      value={numero} 
                      onChange={e => setNumero(e.target.value)} 
                      required 
                      placeholder="Ej: 742" 
                      className="form-control"
                    />
                </div>
            </div>

            {/* Sección Pago */}
            <div className="card p-3 mb-3" style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
                 <h3 className="mb-3" style={{ color: '#22c55e' }}>2. Medio de Pago</h3>
                 
                 <label className="pay-option mb-2" style={{ cursor: "pointer", display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="radio" name="mp" value="webpay" checked={mp === "webpay"} onChange={() => setMp("webpay")} />
                    <div>
                      <strong>Webpay / Transbank</strong>
                      <div className="pay-logos mt-1">
                        <span className="pay-badge">Visa</span> <span className="pay-badge">Mastercard</span>
                      </div>
                    </div>
                 </label>

                 <label className="pay-option" style={{ cursor: "pointer", display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="radio" name="mp" value="transferencia" checked={mp === "transferencia"} onChange={() => setMp("transferencia")} />
                    <div><strong>Transferencia Bancaria</strong></div>
                 </label>
            </div>

            {/* Sección Resumen */}
            <div className="card p-3 mb-4 d-flex flex-row justify-content-between align-items-center" style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
                <span className="muted">Total a pagar:</span>
                <strong style={{ fontSize: '1.5em', color: '#fff' }}>${total.toLocaleString('es-CL')}</strong>
            </div>

            {/* Botones */}
            <div className="d-flex gap-2">
                <Link 
                  to="/cart" 
                  className="btn btn--outline w-50 text-center"
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    ← Volver
                </Link>

                <button className="btn w-50" disabled={loading}>
                    {loading ? "Procesando..." : "Pagar Ahora"}
                </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}