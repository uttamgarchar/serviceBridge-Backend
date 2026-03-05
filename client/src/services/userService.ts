import api from '@/lib/api';

export const userService = {
  getProfile: () =>
    api.get('/user/profile'),

  updateProfile: (data: { name?: string; phone?: string }) =>
    api.put('/user/profile', data),
};
