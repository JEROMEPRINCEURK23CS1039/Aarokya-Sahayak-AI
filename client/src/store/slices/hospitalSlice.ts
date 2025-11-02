import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Hospital {
  _id: string;
  name: string;
  type: string;
  address: {
    street: string;
    district: string;
    state: string;
    pincode: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
  contact: {
    phone: string;
    emergency?: string;
    website?: string;
    email?: string;
  };
  specialties: string[];
  facilities: string[];
  isAvailable: boolean;
  rating: number;
  totalRatings: number;
  beds: {
    total: number;
    available: number;
  };
  distance?: number;
}

interface HospitalState {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  loading: boolean;
  error: string | null;
  userLocation: {
    latitude: number;
    longitude: number;
  } | null;
  filters: {
    type: string;
    specialty: string;
    radius: number;
  };
}

const initialState: HospitalState = {
  hospitals: [],
  selectedHospital: null,
  loading: false,
  error: null,
  userLocation: null,
  filters: {
    type: '',
    specialty: '',
    radius: 10
  }
};

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setHospitals: (state, action: PayloadAction<Hospital[]>) => {
      state.hospitals = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedHospital: (state, action: PayloadAction<Hospital | null>) => {
      state.selectedHospital = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.userLocation = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearHospitals: (state) => {
      state.hospitals = [];
      state.selectedHospital = null;
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setError,
  setHospitals,
  setSelectedHospital,
  setUserLocation,
  setFilters,
  clearHospitals
} = hospitalSlice.actions;

export default hospitalSlice.reducer;
