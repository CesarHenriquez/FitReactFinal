import { betweenLen, emailGmailValido } from "../../services/auth.service";
import { useState } from "react";

export function ContactPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [comentario, setComentario] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!betweenLen(nombre.trim(), 1, 100)) {
      return alert("Nombre requerido (máx. 100).");
    }
    if (!emailGmailValido(correo) || !betweenLen(correo, 1, 100)) {
      return alert("Correo inválido. Solo @gmail.com");
    }
    if (!betweenLen(comentario.trim(), 1, 500)) {
      return alert("Comentario requerido (máx. 500).");
    }

    alert("¡Gracias! Tu mensaje fue enviado (demo).");
    setNombre("");
    setCorreo("");
    setComentario("");
  };

  return (
    <main>
      <form onSubmit={submit}>
        <div>
          <label>Nombre</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Correo electrónico</label>
          <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} required />
        </div>
        <div>
          <label>Comentario</label>
          <textarea value={comentario} onChange={e => setComentario(e.target.value)} required />
        </div>
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
}