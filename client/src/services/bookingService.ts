import api from '@/lib/api';

export const bookingService = {
  // User
  createBooking: (data: { service: string; provider: string; priceAtBooking: number; serviceOtp: string }) =>
    api.post('/bookings/bookings', data),

  getUserBookings: () =>
    api.get('/bookings/user'),

  cancelBooking: (bookingId: string) =>
    api.put(`/bookings/cancel/${bookingId}`),

  // Provider
  getProviderBookings: () =>
    api.get('/bookings/provider'),

  acceptBooking: (bookingId: string) =>
    api.put(`/bookings/accept/${bookingId}`),

  completeBooking: (bookingId: string, otp: string) =>
    api.put(`/bookings/complete/${bookingId}`, { otp }),
};
