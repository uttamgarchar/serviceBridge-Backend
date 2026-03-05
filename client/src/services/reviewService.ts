import api from '@/lib/api';

export const reviewService = {
  addReview: (data: { bookingId: string; rating: number; comment: string }) =>
    api.post('/reviews/reviews', data),

  deleteReview: (reviewId: string) =>
    api.delete(`/reviews/${reviewId}`),

  getProviderReviews: (providerId: string) =>
    api.get(`/reviews/provider/${providerId}`),

  // Admin/Manager
  flagReview: (reviewId: string) =>
    api.put(`/reviews/flag/${reviewId}`),
};
