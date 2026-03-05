import api from '@/lib/api';

export const verificationService = {
  getPendingProviders: () =>
    api.get('/verification/pending-providers'),

  getProviderDetails: (providerId: string) =>
    api.get(`/verification/provider/${providerId}`),

  approveProvider: (providerId: string) =>
    api.put(`/verification/approve/${providerId}`),

  rejectProvider: (providerId: string) =>
    api.put(`/verification/reject/${providerId}`),

  getAnalytics: () =>
    api.get('/verification/analytics'),

  // Document review
  reviewDocuments: (providerId: string, data: any) =>
    api.put(`/provider-docs/review/${providerId}`, data),
};
