import api from '@/lib/api';

export const serviceDiscoveryService = {
  getAllServices: (params?: Record<string, string>) =>
    api.get('/services/services', params),

  getProviderPublicProfile: (providerId: string) =>
    api.get(`/services/provider/${providerId}`),
};
