import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Prediction {
  disease: string;
  probability: number;
  icdCode?: string;
}

interface Analysis {
  _id: string;
  symptoms: string[];
  predictions: Prediction[];
  topDisease: string;
  topProbability: number;
  confidence: number;
  triageLevel: 'Emergency' | 'Urgent' | 'OPD' | 'HomeCare';
  severity: string;
  method: string;
  createdAt: string;
}

interface AnalysisState {
  currentAnalysis: Analysis | null;
  history: Analysis[];
  loading: boolean;
  error: string | null;
  symptoms: any[];
}

const initialState: AnalysisState = {
  currentAnalysis: null,
  history: [],
  loading: false,
  error: null,
  symptoms: []
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPredictions: (state, action: PayloadAction<Analysis>) => {
      state.currentAnalysis = action.payload;
      state.loading = false;
      state.error = null;
    },
    setHistory: (state, action: PayloadAction<Analysis[]>) => {
      state.history = action.payload;
    },
    setSymptoms: (state, action: PayloadAction<any[]>) => {
      state.symptoms = action.payload;
    },
    clearAnalysis: (state) => {
      state.currentAnalysis = null;
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setError,
  setPredictions,
  setHistory,
  setSymptoms,
  clearAnalysis
} = analysisSlice.actions;

export default analysisSlice.reducer;
