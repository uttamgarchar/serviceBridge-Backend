import api from '@/lib/api';

export const reportService = {
  // User/Provider
  createReport: (data: any) =>
    api.post('/reports/reports', data),

  getMyReports: () =>
    api.get('/reports/my'),

  // Admin/Manager
  getAllReports: () =>
    api.get('/reports'),

  updateReportStatus: (reportId: string, data: { status: string }) =>
    api.put(`/reports/${reportId}`, data),
};
