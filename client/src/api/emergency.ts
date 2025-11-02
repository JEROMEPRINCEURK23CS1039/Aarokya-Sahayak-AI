import api from './axios';

export interface AmbulanceRequest {
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    condition: string;
    symptoms: string[];
  };
  contactNumber: string;
  emergencyType: string;
}

export const emergencyAPI = {
  requestAmbulance: (data: AmbulanceRequest) => 
    api.post('/emergency/ambulance', data),
  
  getHotlines: () => api.get('/emergency/hotlines'),
  
  getNearestER: (latitude: number, longitude: number) => 
    api.get('/emergency/nearest-er', { params: { latitude, longitude } })
};
