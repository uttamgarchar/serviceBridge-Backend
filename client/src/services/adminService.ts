import api from '@/lib/api';

export const adminService = {
  // Users
  getAllUsers: () =>
    api.get('/admin/users'),

  searchUserByEmail: (email: string) =>
    api.get('/admin/users/search', { email }),

  assignRole: (data: { userId: string; role: string }) =>
    api.put('/admin/users/assign-role', data),

  // Providers
  getAllProviders: () =>
    api.get('/admin/providers'),

  // Stats
  getPlatformStats: () =>
    api.get('/admin/stats'),

  // Dashboard analytics
  getDashboardAnalytics: () =>
    api.get('/admin-analytics/dashboard/stats'),

  // Withdrawals
  updateWithdrawalStatus: (withdrawalId: string, data: any) =>
    api.put(`/admin/withdraw/${withdrawalId}`, data),
};
