import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getSession, clearSession } from "../services/auth.service";
import toast from 'react-hot-toast'; // 1. Importar toast

export function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  
  const session = getSession();

  // ⬇️ NUEVA LÓGICA DE LOGOUT CON TOAST PERSONALIZADO ⬇️
  const handleLogout = () => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontWeight: 500 }}>¿Estás seguro de cerrar sesión?</span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          
          {/* Botón Cancelar */}
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: 'transparent',
              border: '1px solid #555',
              color: '#ccc',
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
          >
            Cancelar
          </button>

          {/* Botón Confirmar (Salir) */}
          <button
            onClick={() => {
              toast.dismiss(t.id); // Cierra el toast de pregunta
              clearSession();      // Borra sesión
              navigate("/login");  // Redirige
              toast.success("Sesión cerrada correctamente"); // Confirma éxito
            }}
            style={{
              background: '#ef4444', // Rojo para acción destructiva
              border: 'none',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9em',
              fontWeight: 'bold'
            }}
          >
            Salir
          </button>
        </div>
      </div>
    ), {
      duration: 5000, // Se va solo a los 5 segundos si no haces nada
      position: "top-center",
      style: {
        background: '#1f2937',
        color: '#fff',
        border: '1px solid #374151',
        padding: '12px 16px',
      },
    });
  };
  // ⬆️ FIN LÓGICA ⬆️

  return (
    <header className="header border-bottom">
      <div className="container d-flex align-items-center justify-content-between py-2">
        
        <Link to="/" className="logo d-inline-flex align-items-center">
          <img src="/assets/fitquality.png" alt="FitQuality" style={{ height: 50 }} />
        </Link>

        <nav className="nav d-flex align-items-center gap-3">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>

          {session ? (
            <>
              {session.role === "admin" && (
                 <NavLink to="/admin" className="btn btn-sm btn-outline-light ms-2">
                    Admin
                 </NavLink>
              )}
              
              {session.role === "vendedor" && (
                 <NavLink 
                    to="/vendedor" 
                    className="btn btn-sm ms-2"
                    style={{ 
                        backgroundColor: '#22c55e', 
                        borderColor: '#22c55e',
                        color: '#000000',
                        fontWeight: 'bold',
                        textDecoration: 'none'
                    }}
                 >
                    Vendedor
                 </NavLink>
              )}

              <button 
                className="btn btn-sm btn-outline-light ms-2"
                onClick={handleLogout}
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', transition: 'none' }}
              >
                Salir ({session.role})
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-sm btn-outline-light ms-2">Ingresar</NavLink>
          )}

          <NavLink to="/cart" className="ms-2">
            Carrito <span className="badge bg-success ms-1">{count}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}