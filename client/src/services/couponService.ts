import api from '@/lib/api';

export const couponService = {
  // Admin
  createCoupon: (data: any) =>
    api.post('/coupons', data),

  getAllCoupons: () =>
    api.get('/coupons'),

  // User
  validateCoupon: (data: { code: string; amount: number }) =>
    api.post('/coupons/validate', data),
};
