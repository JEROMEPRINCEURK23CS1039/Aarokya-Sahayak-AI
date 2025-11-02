import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  language: 'en' | 'hi' | 'or' | 'ta' | 'kn' | 'ml' | 'mr';
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: true,
  language: 'en',
  notification: {
    open: false,
    message: '',
    severity: 'info'
  },
  theme: 'light'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLanguage: (state, action: PayloadAction<UIState['language']>) => {
      state.language = action.payload;
    },
    showNotification: (state, action: PayloadAction<{
      message: string;
      severity: 'success' | 'error' | 'warning' | 'info';
    }>) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity
      };
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    }
  }
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setLanguage,
  showNotification,
  hideNotification,
  setTheme
} = uiSlice.actions;

export default uiSlice.reducer;
