import { storage } from "./storage.service";
import type { Review } from "../types/review";

const REVIEWS_KEY = "fq_reviews";

export const reviewService = {
  /** Obtiene todas las reseñas guardadas. */
  all(): Review[] {
    // Ordenar por fecha, del más nuevo al más viejo
    return storage.get<Review[]>(REVIEWS_KEY, []).sort((a, b) => b.date - a.date);
  },

  /** Guarda la lista completa de reseñas. */
  save(reviews: Review[]) {
    storage.set(REVIEWS_KEY, reviews);
  },

  /** Obtiene las reseñas para un producto específico. */
  getByProductId(productId: string): Review[] {
    return reviewService.all().filter(r => r.productId === productId);
  },

  /** Añade una nueva reseña. */
  add(review: Omit<Review, "date">) {
    const list = reviewService.all();
    const newReview: Review = {
      ...review,
      date: Date.now(), // Añade la fecha de creación (usada como ID único)
    };
    list.unshift(newReview); // Añadir al inicio para que aparezca primero
    reviewService.save(list);
  },
  
  /**  Elimina una reseña usando su timestamp (date) como ID. */
  remove(reviewDateId: number) {
    const list = reviewService.all().filter(r => r.date !== reviewDateId);
    reviewService.save(list);
  }
};