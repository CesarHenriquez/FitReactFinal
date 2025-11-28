import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";
import toast from 'react-hot-toast';

export function RegisterPage() {
  const navigate = useNavigate();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  
  // Campos visuales (opcionales en tu backend actual)
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [direccion, setDireccion] = useState("");
  
  const [password, setPassword] = useState("");
  
  // Estado para ver/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);

  // Estilo oscuro para los toasts
  const darkToastStyle = {
    background: '#1f2937',
    color: '#fff',
    border: '1px solid #374151',
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    // Validaciones
    if (!correo.includes("@") || !correo.includes(".")) {
        toast.error("Por favor, ingresa un correo válido.", { style: darkToastStyle });
        return;
    }
    if (password.length < 4) {
        toast.error("La contraseña es muy corta (mínimo 4 caracteres).", { style: darkToastStyle });
        return;
    }

    setLoading(true);

    try {
      const usuarioParaBackend = {
        nickname: `${nombre} ${apellidos}`.trim(),
        correo: correo.trim(),
        clave: password
      };

      await toast.promise(
        api.registro(usuarioParaBackend),
        {
          loading: 'Creando tu cuenta...',
          success: '¡Cuenta creada exitosamente! Redirigiendo...',
          error: 'Error al registrarse. El correo podría estar en uso.',
        },
        {
          style: darkToastStyle,
          success: {
            duration: 4000,
            iconTheme: { primary: '#22c55e', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          }
        }
      );

      // Redirigir al login
      setTimeout(() => {
          navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Error en registro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Estilo forzado para inputs (Legibilidad)
  const inputStyle = { 
    backgroundColor: '#ffffff', 
    color: '#000000',
    border: '1px solid #ced4da' 
  };

  return (
    <main className="grid page-wrap">
      <div className="container page-narrow">
        <h1 className="page-title">Crear cuenta</h1>

        <form className="form" onSubmit={submit}>
          
          <div className="form-group">
            <label>Nombre</label>
            <input 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                maxLength={50} 
                required 
                placeholder="Ej: Juan"
                style={inputStyle}
                className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Apellidos</label>
            <input 
                value={apellidos} 
                onChange={(e) => setApellidos(e.target.value)} 
                maxLength={100} 
                required 
                placeholder="Ej: Pérez"
                style={inputStyle}
                className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input 
                type="email" 
                value={correo} 
                onChange={(e) => setCorreo(e.target.value)} 
                required 
                placeholder="ejemplo@gmail.com" 
                style={inputStyle}
                className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Región (opcional)</label>
            <input value={region} onChange={(e) => setRegion(e.target.value)} style={inputStyle} className="form-control" />
          </div>

          <div className="form-group">
            <label>Comuna (opcional)</label>
            <input value={comuna} onChange={(e) => setComuna(e.target.value)} style={inputStyle} className="form-control" />
          </div>

          <div className="form-group">
            <label>Dirección (opcional)</label>
            <input value={direccion} onChange={(e) => setDireccion(e.target.value)} style={inputStyle} className="form-control" />
          </div>

          {/* CAMPO CONTRASEÑA CON BOTÓN SVG */}
          <div className="form-group">
            <label>Contraseña</label>
            <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  minLength={4}
                  required
                  style={{ ...inputStyle, paddingRight: '40px' }} 
                  className="form-control"
                />
                
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#6B7280', // Gris profesional
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                    {showPassword ? (
                        // Icono: Ojo Tachado (Ocultar)
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                            <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                    ) : (
                        // Icono: Ojo Abierto (Ver)
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    )}
                </button>
            </div>
          </div>

          <button className="btn w-100" type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarme"}
          </button>

          <div className="mt-3 text-center">
              <small>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></small>
          </div>

        </form>
      </div>
    </main>
  );
}