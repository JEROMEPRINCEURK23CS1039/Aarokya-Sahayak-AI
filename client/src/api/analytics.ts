import api from './axios';

export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getDiseaseTrends: (params?: any) => api.get('/analytics/disease-trends', { params }),
  getOutbreaks: (params?: any) => api.get('/analytics/outbreaks', { params }),
  getFeedbackStats: () => api.get('/analytics/feedback-stats')
};
