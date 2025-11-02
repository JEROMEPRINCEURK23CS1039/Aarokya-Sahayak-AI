import api from './axios';

export interface RegisterData {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    age?: number;
    gender?: string;
    state?: string;
    district?: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  updateMedicalHistory: (data: any) => api.put('/users/medical-history', data)
};
