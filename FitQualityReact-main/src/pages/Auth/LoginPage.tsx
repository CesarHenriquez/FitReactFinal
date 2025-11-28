import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api"; 
import toast from 'react-hot-toast'; // Librería de notificaciones

export function LoginPage() {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Evitar doble clic
    if (loading) return;
    
    // 1. Mostrar notificación de carga (Spinner)
    const toastId = toast.loading("Verificando credenciales...");
    setLoading(true);

    try {
      // 2. Llamada al Microservicio de Autenticación (8021)
      console.log("Enviando login para:", email);
      const data = await api.login(email.trim(), pass.trim());

      // Pequeña espera artificial (1.5s) para mejorar la UX
      // Esto permite que el usuario lea "Verificando..." antes de cambiar de pantalla
      await new Promise(resolve => setTimeout(resolve, 1500));

      
      localStorage.setItem("token", data.token);

      // 5. Lógica de Mapeo de Roles (Backend -> Frontend)
      
      const backendRole = data.user.rol?.nombre;
      let frontendRole = "cliente"; // Rol por defecto

      if (backendRole === "ADMINISTRADOR") {
        frontendRole = "admin";
      } else if (backendRole === "DELIVERY") {
        frontendRole = "vendedor"; 
      }

      // 6. Crear y guardar objeto de sesión
      const sessionData = {
        id: data.user.id,         // ID numérico para vincular ventas
        email: data.user.correo,  // Correo para mostrar en el header
        role: frontendRole,       // Rol adaptado para la navegación
        originalRole: backendRole // Rol original por si se necesita
      };
      localStorage.setItem("fq_session", JSON.stringify(sessionData));

      // Notificación de éxito
      toast.dismiss(toastId); 
      toast.success(`¡Bienvenido de nuevo, ${data.user.nickname || "Usuario"}!`, {
        duration: 3000,
      });

      // 8. Redirección inteligente según el rol
      if (frontendRole === "admin") {
        navigate("/admin");
      } else if (frontendRole === "vendedor") {
        navigate("/vendedor");
      } else {
        navigate("/"); // Clientes van al Home
      }

    } catch (error) {
      console.error("Error en login:", error);
      
      // Espera breve también en error para evitar parpadeos
      await new Promise(resolve => setTimeout(resolve, 500));

      // Notificación de error
      toast.dismiss(toastId);
      toast.error("Credenciales incorrectas o servidor no disponible.");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid page-wrap">
      <div className="container page-narrow">
        <h1 className="page-title">Ingresar</h1>
        
        <form className="form" onSubmit={submit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="ejemplo@gmail.com"
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={pass} 
              onChange={(e) => setPass(e.target.value)} 
              required 
              placeholder="********"
            />
          </div>
          
          <button className="btn w-100" type="submit" disabled={loading}>
            {loading ? "Accediendo..." : "Ingresar"}
          </button>

          <div className="mt-3 text-center">
            <small>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></small>
          </div>
        </form>
      </div>
    </main>
  );
}