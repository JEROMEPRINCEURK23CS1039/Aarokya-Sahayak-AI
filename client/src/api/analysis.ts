import api from './axios';

export interface AnalysisData {
  symptoms: string[];
  age: number;
  gender: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  chronicConditions?: string[];
  medications?: string[];
  allergies?: string[];
}

export const analysisAPI = {
  getSymptoms: () => api.get('/analysis/symptoms'),
  analyzeSymptoms: (data: AnalysisData) => api.post('/analysis/predict', data),
  getHistory: (userId: string, params?: any) => api.get(`/analysis/history/${userId}`, { params }),
  submitFeedback: (id: string, data: any) => api.post(`/analysis/${id}/feedback`, data)
};
