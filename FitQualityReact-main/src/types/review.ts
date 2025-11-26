export interface Review {
  productId: string; // ID del producto al que pertenece la reseña
  clientName: string; // Nombre del cliente que dejó la reseña
  rating: number; // Puntuación de 1 a 5
  comment: string; // Comentario de la reseña
  date: number; // Timestamp para ordenar por fecha
}