import api from './axios';

export interface NearbyHospitalsParams {
  latitude: number;
  longitude: number;
  maxDistance?: number;
  limit?: number;
  specialties?: string[];
}

export const hospitalsAPI = {
  getNearby: (params: NearbyHospitalsParams) => 
    api.get('/hospitals/nearby', { params }),
  
  getById: (id: string) => api.get(`/hospitals/${id}`),
  
  getSpecialties: () => api.get('/hospitals/specialties'),
  
  getLocations: () => api.get('/hospitals/locations'),
  
  filterHospitals: (params: any) => api.get('/hospitals/filter', { params })
};
