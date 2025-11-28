import { storage } from "./storage.service";
import type { Review } from "../types/review";

const REVIEWS_KEY = "fq_reviews";

export const reviewService = {
 
  all(): Review[] {
   
    return storage.get<Review[]>(REVIEWS_KEY, []).sort((a, b) => b.date - a.date);
  },

 
  save(reviews: Review[]) {
    storage.set(REVIEWS_KEY, reviews);
  },

  
  getByProductId(productId: string): Review[] {
    return reviewService.all().filter(r => r.productId === productId);
  },


  add(review: Omit<Review, "date">) {
    const list = reviewService.all();
    const newReview: Review = {
      ...review,
      date: Date.now(),
    };
    list.unshift(newReview); 
    reviewService.save(list);
  },
  
  
  remove(reviewDateId: number) {
    const list = reviewService.all().filter(r => r.date !== reviewDateId);
    reviewService.save(list);
  }
};