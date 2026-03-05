import api from '@/lib/api';

export const paymentService = {
  createOrder: (bookingId: string) =>
    api.post('/payment/create-order', { bookingId }),

  verifyPayment: (data: {
    bookingId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    api.post('/payment/verify', data),

  refundPayment: (paymentId: string) =>
    api.post(`/payment/refund/${paymentId}`),
};
