import api from '@/lib/api';

export const providerService = {
  // Apply as provider (User role)
  apply: (data: { serviceType: string; address: string; city: string; pincode: string }) =>
    api.post('/provider/apply', data),

  // Services
  addService: (data: any) =>
    api.post('/provider/service', data),

  updateService: (serviceId: string, data: any) =>
    api.put(`/provider/service/${serviceId}`, data),

  getMyServices: () =>
    api.get('/provider/providerServices'),

  // Bookings
  getBookings: () =>
    api.get('/provider/bookings'),

  // Withdrawal
  requestWithdrawal: (data: any) =>
    api.post('/provider/withdraw', data),

  // Documents
  uploadDocuments: (data: any) =>
    api.post('/provider-docs/upload', data),
};
