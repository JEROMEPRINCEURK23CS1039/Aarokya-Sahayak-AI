import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Snackbar, Alert } from '@mui/material';
import { RootState } from './store/store';
import { useDispatch } from 'react-redux';
import { hideNotification } from './store/slices/uiSlice';
import { setUser, logout } from './store/slices/authSlice';
import { authAPI } from './api/auth';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import HospitalsPage from './pages/HospitalsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Navbar from './components/Navbar';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { notification } = useSelector((state: RootState) => state.ui);

  // Fetch user profile on app load if token exists but user is not loaded
  useEffect(() => {
    const loadUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (token && !user) {
        try {
          const response = await authAPI.getProfile();
          if (response.data.success) {
            dispatch(setUser(response.data.user));
          }
        } catch (error) {
          // Token is invalid, clear auth state
          dispatch(logout());
        }
      }
    };

    loadUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseNotification = () => {
    dispatch(hideNotification());
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/analysis"
            element={isAuthenticated ? <AnalysisPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/hospitals"
            element={isAuthenticated ? <HospitalsPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>

      {/* Global Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
