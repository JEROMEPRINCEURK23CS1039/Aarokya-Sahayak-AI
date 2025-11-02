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
  CircularProgress,
  MenuItem,
  Grid
} from '@mui/material';
import { Visibility, VisibilityOff, MedicalServices } from '@mui/icons-material';
import { registerSuccess, setLoading } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';
import { authAPI, RegisterData } from '../api/auth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    age: '',
    gender: '',
    state: '',
    district: ''
  });
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoadingState(true);
    setError(null);
    dispatch(setLoading(true));

    try {
      const registerData: RegisterData = {
        email: formData.email,
        password: formData.password,
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone || undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender || undefined,
          state: formData.state || undefined,
          district: formData.district || undefined
        }
      };

      const response = await authAPI.register(registerData);
      
      if (response.data.success) {
        dispatch(registerSuccess({
          user: response.data.user,
          token: response.data.accessToken
        }));
        dispatch(showNotification({
          message: 'Registration successful!',
          severity: 'success'
        }));
        navigate('/dashboard');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      dispatch(showNotification({ message: errorMsg, severity: 'error' }));
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <MedicalServices sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join Aarogya Sahayak for personalized healthcare
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required autoFocus />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Confirm Password" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91XXXXXXXXXX" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} inputProps={{ min: 1, max: 120 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="State" name="state" value={formData.state} onChange={handleChange} placeholder="e.g., Odisha" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="District" name="district" value={formData.district} onChange={handleChange} placeholder="e.g., Khordha" />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover" fontWeight="bold">
                  Sign In
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
