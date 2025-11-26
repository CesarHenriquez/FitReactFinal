import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/fitquality.png"; 
import { getSession, clearSession } from "../services/auth.service"; 

export function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  
  // Obtener la sesión activa (si existe)
  const session = getSession();

  // Función para cerrar sesión
  const handleLogout = () => {
    // Usa alert temporalmente
    if (confirm("¿Estás seguro de cerrar sesión?")) {
      clearSession();
      // Redirigir al login después de cerrar sesión
      navigate("/login"); 
    }
  };

  return (
    <header className="header border-bottom">
      <div className="container d-flex align-items-center justify-content-between py-2">
        {/* Logo importado desde la carpeta assets */}
        <Link to="/" className="logo d-inline-flex align-items-center">
          <img src={logo} alt="FitQuality" style={{ height: 50 }} />
        </Link>
        <nav className="nav d-flex align-items-center gap-3">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/contacto">Contacto</NavLink>
          <NavLink to="/nosotros">Nosotros</NavLink>

          {/* Mostrar enlace/botón basado en el estado de la sesión */}
          {session ? (
            <>
              {/* Si es admin, mostrar enlace al panel de admin */}
              {session.role === "admin" && (
                 <NavLink to="/admin" className="btn btn-sm btn-outline-light ms-2">Admin</NavLink>
              )}
              {/* Botón de Cerrar Sesión */}
              <button 
                className="btn btn-sm btn-outline-light ms-2"
                onClick={handleLogout}
                style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)', transition: 'none' }}
              >
                Cerrar Sesión ({session.role})
              </button>
            </>
          ) : (
            // Si NO hay sesión, mostrar "Ingresar"
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