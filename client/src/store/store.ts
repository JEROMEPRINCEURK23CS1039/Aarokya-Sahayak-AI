import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import analysisReducer from './slices/analysisSlice';
import hospitalReducer from './slices/hospitalSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    analysis: analysisReducer,
    hospital: hospitalReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['analysis/setPredictions'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
