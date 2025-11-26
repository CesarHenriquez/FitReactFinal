import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailGmailValido, betweenLen, findUserByEmail, login } from "../../services/auth.service";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!emailGmailValido(email) || !betweenLen(email, 1, 100)) {
      return alert("Correo inválido. Solo @gmail.com");
    }
    if (!betweenLen(pass, 4, 10)) {
      return alert("La contraseña debe tener entre 4 y 10 caracteres.");
    }

    const user = findUserByEmail(email.trim().toLowerCase());
    if (!user) {
      return alert("No existe una cuenta con ese correo.");
    }

    if (user.password !== pass) {
      return alert("La contraseña es incorrecta.");
    }

    const role = login(email.trim().toLowerCase(), pass);
    if (role === "admin") navigate("/admin");
    else navigate("/"); // Redirige a home si es cliente
  };

  return (
    <main className="grid page-wrap">
      <div className="container page-narrow">
        <h1 className="page-title">Ingresar</h1>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} required />
          </div>
          <button className="btn" type="submit">Ingresar</button>
        </form>
      </div>
    </main>
  );
}