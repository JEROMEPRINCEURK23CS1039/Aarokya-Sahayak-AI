import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, MedicalServices } from '@mui/icons-material';
import { loginSuccess, setLoading } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';
import { authAPI } from '../api/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);
    setError(null);
    dispatch(setLoading(true));

    try {
      const response = await authAPI.login(formData);
      
      if (response.data.success) {
        dispatch(loginSuccess({
          user: response.data.user,
          token: response.data.accessToken
        }));
        dispatch(showNotification({
          message: 'Login successful!',
          severity: 'success'
        }));
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      dispatch(showNotification({ message: errorMsg, severity: 'error' }));
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <MedicalServices sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your health dashboard
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoFocus
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" underline="hover" fontWeight="bold">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
