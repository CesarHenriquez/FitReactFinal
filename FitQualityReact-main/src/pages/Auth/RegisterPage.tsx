import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  emailGmailValido,
  betweenLen,
  normalizarRun,
  upsertUser,
  setSession,
  type Role,
  type User,
} from "../../services/auth.service";

export function RegisterPage() {
  const navigate = useNavigate();

  // Campos mínimos (si tienes región/comuna/dirección, agrégalos igual que aquí)
  const [run, setRun] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [region, setRegion] = useState("");     // opcional (déjalo vacío si no lo usas)
  const [comuna, setComuna] = useState("");     // opcional
  const [direccion, setDireccion] = useState(""); // opcional
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas 
    if (!emailGmailValido(correo) || !betweenLen(correo, 1, 100)) {
      return alert("Correo inválido. Solo @gmail.com");
    }
    if (!betweenLen(password, 4, 10)) {
      return alert("La contraseña debe ser entre 4 y 10 caracteres.");
    }
    if (!betweenLen(nombre.trim(), 1, 50)) {
      return alert("Nombre requerido (máx. 50).");
    }
    if (!betweenLen(apellidos.trim(), 1, 100)) {
      return alert("Apellidos requeridos (máx. 100).");
    }
    

   
    // Si la contraseña es "admin123" => rol admin; si no => cliente
    const role: Role = password === "admin123" ? "admin" : "cliente";

    const user: User = {
      run: normalizarRun(run),
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      correo: correo.trim().toLowerCase(),
      region: region.trim(),
      comuna: comuna.trim(),
      direccion: direccion.trim(),
      role,
      password, // guarda para validarlo en el login
    };

    // Persiste en localStorage
    upsertUser(user);

    // Deja sesión iniciada y redirige según rol
    setSession(user.correo, role);
    if (role === "admin") navigate("/admin");
    else navigate("/");
  };

  return (
    <main className="grid page-wrap">
      <div className="container page-narrow">
        <h1 className="page-title">Crear cuenta</h1>

        <form className="form" onSubmit={submit}>
          <div className="form-group">
            <label>RUN</label>
            <input value={run} onChange={(e) => setRun(e.target.value)} maxLength={12} placeholder="12.345.678-K" />
          </div>

          <div className="form-group">
            <label>Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={50} required />
          </div>

          <div className="form-group">
            <label>Apellidos</label>
            <input value={apellidos} onChange={(e) => setApellidos(e.target.value)} maxLength={100} required />
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="ejemplo@gmail.com" required />
            <small className="form-text">Solo se permite el dominio <strong>@gmail.com</strong></small>
          </div>

          {/* Si aún no usa estos campos, dejar como opcional */}
          <div className="form-group">
            <label>Región (opcional)</label>
            <input value={region} onChange={(e) => setRegion(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Comuna (opcional)</label>
            <input value={comuna} onChange={(e) => setComuna(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Dirección (opcional)</label>
            <input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="4 a 10 caracteres"
              minLength={4}
              maxLength={10}
              required
            />
            <small className="form-text">
              Complete formulario para poder crear su cuenta. 
            </small>
          </div>

          <button className="btn" style={{ width: "100%" }}>Registrarme</button>
        </form>
      </div>
    </main>
  );
}