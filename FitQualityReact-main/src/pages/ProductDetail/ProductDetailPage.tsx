import { useParams, Link } from "react-router-dom";
import { OPTION_SETS } from "../../data/catalog";
import { getProductById } from "../../services/admin-catalog.service";
import { useState, useMemo, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { reviewService } from "../../services/review.service";
import type { Review } from "../../types/review";
import { getSession } from "../../services/auth.service";

// Componente para renderizar las estrellas de calificación
const RatingStars = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    
    let color = i <= rating ? "#ffc107" : "#e5e7eb";
    
   
    const fraction = rating - (i - 1);
    
    if (fraction > 0 && fraction < 1 && i === Math.ceil(rating)) {
      
      color = "#ffc107"; 
    }

    stars.push(
      <span key={i} style={{ color: color, fontSize: '1.2em' }}>
        ★
      </span>
    );
  }
  return <div style={{ display: 'inline-block', lineHeight: 1 }}>{stars}</div>;
};

// Componente para el formulario de reseña
function ReviewForm({ productId, onReviewAdded }: { productId: string, onReviewAdded: () => void }) {
  const session = getSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  
  // 'name' se calcula a partir de la sesión.
  const name = session?.email || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.email) {
      // Usa alert temporalmente
      alert("Debes iniciar sesión para dejar una reseña.");
      return;
    }
    if (comment.trim().length < 10) {
      // Usa alert temporalmente
      alert("El comentario debe tener al menos 10 caracteres.");
      return;
    }

    // Comprobar si ya existe una reseña del usuario
    const existingReviews = reviewService.getByProductId(productId);
    const clientName = name.split('@')[0];
    const hasExistingReview = existingReviews.some(r => r.clientName === clientName);

    if (hasExistingReview) {
      alert("Ya has dejado una reseña para este producto. No se permite dejar más de una.");
      return;
    }


    const newReview: Omit<Review, "date"> = {
      productId,
      clientName, // Usa la parte antes del @ como nombre
      rating,
      comment: comment.trim(),
    };

    reviewService.add(newReview);
    // Usa alert temporalmente
    alert("¡Reseña enviada con éxito!");
    
    // Limpiar formulario
    setComment("");
    setRating(5);
    onReviewAdded(); // Llama a la función para recargar las reseñas en el padre
  };
  
  if (!session) {
    return (
      <div className="card p-3 my-3 text-center">
        <p className="muted">Inicia sesión para dejar tu reseña.</p>
        <Link to="/login" className="btn btn--sm">Ingresar</Link>
      </div>
    );
  }

  return (
    <form className="form p-3 mt-3 w-100" onSubmit={handleSubmit} style={{ maxWidth: '100%', margin: 0 }}>
      <h3 style={{ marginBottom: 12 }}>Deja tu opinión</h3>
      <div className="form-group d-flex align-items-center gap-3">
        <label>Puntuación:</label>
        <div style={{ padding: '8px 0' }}>
            <RatingStars rating={rating} />
        </div>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-auto">
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} estrellas</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>Comentario</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          minLength={10}
          maxLength={500}
          required
        />
      </div>
      <button type="submit" className="btn">Enviar Reseña</button>
    </form>
  );
}


export function ProductDetailPage() {
  const { id = "" } = useParams();
  const p = getProductById(id);
  const { add } = useCart();
  
  // Obtener la sesión
  const session = getSession();
  const currentUserName = session?.email.split('@')[0];
  const isAdmin = session?.role === 'admin';

  // Estado y carga de reseñas
  const [reviews, setReviews] = useState<Review[]>([]);
  const loadReviews = () => {
    setReviews(reviewService.getByProductId(id));
  };
  
  useEffect(loadReviews, [id]); // Carga inicial al montar o cambiar de producto

  // Función para eliminar una reseña
  const handleDeleteReview = (reviewDateId: number, authorName: string) => {
    // Usa confirm temporalmente
    if (window.confirm(`¿Estás seguro de eliminar la reseña de ${authorName}?`)) {
      reviewService.remove(reviewDateId);
      loadReviews(); // Recarga las reseñas
      alert("Reseña eliminada.");
    }
  };


  // Calcular calificación promedio
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Redondea a un decimal
  }, [reviews]);


  if (!p) {
    return (
      <main className="grid">
        <div className="container">
          <p className="muted">Producto no encontrado.</p>
          <Link className="btn btn--outline mt-2" to="/productos">← Volver al catálogo</Link>
        </div>
      </main>
    );
  }

  const optSet = p.optionKey !== "none" ? OPTION_SETS[p.optionKey] : null;
  const [currentOpt, setCurrentOpt] = useState<string | null>(
    optSet ? optSet.values[0] : p.fixedTag ?? null
  );

  const itemId = currentOpt ? `${p.id}-${currentOpt}` : p.id;
  const itemName = currentOpt ? `${p.nombre} (${currentOpt})` : p.nombre;
  
  // Estilo para el layout de detalle 

  return (
    <main className="grid">
      <div className="container" style={{ alignItems: 'flex-start' }}>
        
        {/* Sección de Detalle: Imagen y Descripción */}
        <div className="product-detail-layout" style={{ width: '100%', margin: '0 auto 32px' }}>
          
          {/* Columna de Imagen */}
          <div className="product-detail-layout__image-wrapper">
            <img src={p.img} alt={p.nombre} className="product-detail-image" />
          </div>

          {/* Columna de Información */}
          <div className="product-detail-layout__info">
            <h1 className="page-title" style={{ textAlign: 'left', marginBottom: 6 }}>{p.nombre.toUpperCase()}</h1>
            
            <div className="d-flex align-items-center gap-3 mb-2">
                 <RatingStars rating={Math.round(averageRating)} />
                 <span className="muted">{averageRating} / 5 ({reviews.length} reseñas)</span>
            </div>


            {p.material && (
              <p className="muted" style={{ marginBottom: 12 }}>
                Calidad de material: <strong>{p.material}</strong>
              </p>
            )}

            <ul className="bullets" style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
              {p.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            
            {/* Opciones de producto (Color/Peso) */}
            {optSet && (
              <>
                <p className="muted" style={{ marginTop: 20, marginBottom: 6 }}>{optSet.label}:</p>
                <div className="size-picker d-flex gap-2" role="group" aria-label={optSet.label}>
                  {optSet.values.map((v) => (
                    <button
                      key={v}
                      className={`chip btn btn--outline btn--sm ${currentOpt === v ? "is-active" : ""}`}
                      onClick={() => setCurrentOpt(v)}
                      type="button"
                      style={currentOpt === v ? { borderColor: 'var(--primary)', color: 'var(--primary)' } : {}}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </>
            )}

            {p.fixedTag && (
              <p className="muted" style={{ marginTop: 20, marginBottom: 0 }}>
                Peso: <strong>{p.fixedTag}</strong>
              </p>
            )}

            <p className="price" style={{ fontSize: '1.8em', fontWeight: 'bold', marginTop: 12 }}>
              PRECIO: ${p.precio.toFixed(0)}
            </p>

            {/* Botones de acción */}
            <button
              className="btn w-100"
              onClick={() => add({ id: itemId, name: itemName, price: p.precio })}
            >
              Añadir al carrito
            </button>

            <div className="detail-actions d-flex gap-2 mt-2">
              <Link className="btn btn--outline w-50" to="/productos">
                ← Volver a productos
              </Link>
              <Link className="btn w-50" to="/cart">
                🛒 Ir al carrito
              </Link>
            </div>
          </div>
        </div>

        {/* Separador visual */}
        <hr style={{ width: '100%', borderColor: 'var(--border)', margin: '40px 0' }}/>
        
        {/* Sección de Reseñas */}
        <section style={{ width: '100%', margin: '0 auto 40px' }}>
          <h2 style={{ marginBottom: 20 }}>Reseñas de Clientes ({reviews.length})</h2>

          <div className="d-flex flex-wrap gap-4">
             {/* Columna de Formulario */}
            <div style={{ flex: '1 1 300px' }}>
               <ReviewForm productId={p.id} onReviewAdded={loadReviews} />
            </div>

            {/* Columna de Listado de Reseñas */}
            <div style={{ flex: '2 1 400px', maxWidth: '100%' }}>
              {reviews.length === 0 ? (
                <div className="card p-3" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="muted">Sé el primero en dejar una reseña para este producto.</p>
                </div>
              ) : (
                <div className="d-grid gap-3">
                  {reviews.map((r) => {
                    // Determinar si el usuario actual es el autor o un admin
                    const isAuthor = currentUserName === r.clientName;
                    const canDelete = isAuthor || isAdmin;

                    return (
                      <div key={r.date} className="card p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <strong style={{ color: 'var(--primary)' }}>{r.clientName}</strong>
                            {isAuthor && <small className="muted ms-2">(Tú)</small>}
                          </div>
                          <small className="muted">{new Date(r.date).toLocaleDateString()}</small>
                        </div>
                        <RatingStars rating={r.rating} />
                        <p className="mt-2" style={{ margin: 0 }}>{r.comment}</p>
                        
                        {canDelete && (
                          <div className="mt-2 d-flex justify-content-end">
                            <button 
                              className="btn btn--outline btn--sm"
                              onClick={() => handleDeleteReview(r.date, r.clientName)}
                              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}