import { useState } from "react";
import { betweenLen, emailGmailValido } from "../../services/auth.service";
import toast from 'react-hot-toast'; 

export function ContactPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    
    const styleError = { background: '#1f2937', color: '#fff', border: '1px solid #ef4444' };
    
    if (!betweenLen(nombre.trim(), 1, 100)) {
      return toast.error("Nombre requerido (máx. 100).", { style: styleError });
    }
    if (!emailGmailValido(correo) || !betweenLen(correo, 1, 100)) {
      return toast.error("Correo inválido. Solo @gmail.com", { style: styleError });
    }
    if (!betweenLen(comentario.trim(), 1, 500)) {
      return toast.error("Comentario requerido (máx. 500).", { style: styleError });
    }

    setLoading(true);

    
    const envioSimulado = new Promise((resolve) => setTimeout(resolve, 2000));

    // Toast 
    await toast.promise(
      envioSimulado,
      {
        loading: 'Enviando tu mensaje...',
        success: '¡Mensaje enviado! Te contactaremos pronto.',
        error: 'Hubo un error al enviar.',
      },
      {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #374151',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
      }
    );

    // Limpiar formulario
    setNombre("");
    setCorreo("");
    setComentario("");
    setLoading(false);
  };

  return (
    <main className="grid">
      <div className="container d-flex justify-content-center">
        <div className="page-narrow form w-100" style={{ maxWidth: 600 }}>
          <h1 className="page-title text-center">Contáctanos</h1>
          <p className="muted text-center mb-4">¿Tienes dudas? Escríbenos y te responderemos a la brevedad.</p>

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={e => setNombre(e.target.value)} 
                required 
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="form-group">
              <label>Correo electrónico</label>
              <input 
                type="email" 
                value={correo} 
                onChange={e => setCorreo(e.target.value)} 
                required 
                placeholder="ejemplo@gmail.com"
              />
            </div>

            <div className="form-group">
              <label>Comentario</label>
              <textarea 
                value={comentario} 
                onChange={e => setComentario(e.target.value)} 
                required 
                placeholder="Escribe tu mensaje aquí..."
                style={{ minHeight: '120px' }}
              />
            </div>

            <button className="btn w-100" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Mensaje"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}