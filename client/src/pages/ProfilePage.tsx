import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Edit,
  Save,
  Cancel,
  MedicalServices,
  History,
  LocalHospital
} from '@mui/icons-material';
import { RootState } from '../store/store';
import { setUser } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';
import { authAPI } from '../api/auth';
import { analysisAPI } from '../api/analysis';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    age: user?.profile?.age || '',
    gender: user?.profile?.gender || '',
    phone: user?.profile?.phone || '',
    state: user?.profile?.state || '',
    district: user?.profile?.district || ''
  });

  useEffect(() => {
    if (user?._id) {
      fetchAnalysisHistory();
    }
  }, [user?._id]);

  const fetchAnalysisHistory = async () => {
    if (!user?._id) {
      console.log('No user ID available');
      return;
    }
    
    try {
      const response = await analysisAPI.getHistory(user._id, { limit: 10 });
      console.log('Analysis history response:', response.data);
      if (response.data.success) {
        setAnalysisHistory(response.data.analyses || []);
      }
    } catch (error: any) {
      console.error('Failed to fetch history:', error.response?.data || error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authAPI.updateProfile({
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: formData.age ? parseInt(formData.age as string) : undefined,
          gender: formData.gender,
          phone: formData.phone,
          state: formData.state,
          district: formData.district
        }
      });

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        dispatch(showNotification({
          message: 'Profile updated successfully',
          severity: 'success'
        }));
        setEditing(false);
      }
    } catch (error: any) {
      dispatch(showNotification({
        message: error.response?.data?.message || 'Failed to update profile',
        severity: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      age: user?.profile?.age || '',
      gender: user?.profile?.gender || '',
      phone: user?.profile?.phone || '',
      state: user?.profile?.state || '',
      district: user?.profile?.district || ''
    });
    setEditing(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '150px',
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                zIndex: 0
              }
            }}
          >
            <Box position="relative" zIndex={1}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto',
                  mb: 2,
                  fontSize: 48,
                  border: '4px solid #141B2D',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                }}
              >
                {user?.profile?.firstName?.charAt(0)}
                {user?.profile?.lastName?.charAt(0)}
              </Avatar>
            </Box>
            
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>

            <Box mt={2}>
              <Chip
                label={user?.role || 'User'}
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.875rem'
                }}
              />
            </Box>

            {!editing && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                fullWidth
                sx={{ 
                  mt: 3,
                  py: 1.5,
                  fontSize: '1rem'
                }}
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Paper>

          <Card sx={{ 
            mt: 3,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                <MedicalServices sx={{ mr: 1, color: 'primary.main' }} />
                Quick Stats
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%)',
                      textAlign: 'center',
                      border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}
                  >
                    <Typography variant="h3" fontWeight="bold" sx={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {analysisHistory.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Analyses
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, rgba(102, 187, 106, 0.15) 0%, rgba(56, 142, 60, 0.15) 100%)',
                      textAlign: 'center',
                      border: '1px solid rgba(102, 187, 106, 0.2)'
                    }}
                  >
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      {user?.profile?.age || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      Age
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Personal Information */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 3,
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                Personal Information
              </Typography>
              {editing && (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? undefined : <Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                  </Button>
                </Box>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!editing}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Analysis History */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3,
              background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <History sx={{ mr: 1, color: 'primary.main' }} />
              Recent Analysis History
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {analysisHistory.length === 0 ? (
              <Box textAlign="center" py={4}>
                <LocalHospital sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No analysis history yet
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => window.location.href = '/analysis'}
                >
                  Start Analysis
                </Button>
              </Box>
            ) : (
              <List>
                {analysisHistory.map((analysis, idx) => (
                  <Card 
                    key={analysis._id}
                    sx={{ 
                      mb: 2,
                      p: 2.5,
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(8px)',
                        borderColor: 'rgba(99, 102, 241, 0.4)',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)'
                      }
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ 
                          background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {analysis.predictions?.[0]?.disease || 'Health Analysis'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {new Date(analysis.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                      <Chip
                        label={analysis.triageLevel || analysis.triage?.level || 'N/A'}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          background: analysis.triageLevel === 'Emergency' || analysis.triage?.level === 'Emergency' ? 
                            'linear-gradient(135deg, #FF5252 0%, #D32F2F 100%)' :
                            analysis.triageLevel === 'Urgent' || analysis.triage?.level === 'Urgent' ?
                            'linear-gradient(135deg, #FFA726 0%, #F57C00 100%)' :
                            'linear-gradient(135deg, #29B6F6 0%, #0288D1 100%)',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                    </Box>
                    
                    {analysis.predictions && analysis.predictions.length > 0 && (
                      <Box mb={1.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Confidence:
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          {((analysis.predictions[0].probability || analysis.confidence || 0) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    )}
                    
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {analysis.symptoms?.slice(0, 5).map((symptom: string, sIdx: number) => (
                        <Chip
                          key={`${symptom}-${sIdx}`}
                          label={symptom}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            borderColor: 'rgba(99, 102, 241, 0.3)',
                            color: '#818CF8',
                            fontWeight: 600
                          }}
                        />
                      ))}
                      {analysis.symptoms && analysis.symptoms.length > 5 && (
                        <Chip
                          label={`+${analysis.symptoms.length - 5} more`}
                          size="small"
                          sx={{ 
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: '#818CF8',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                  </Card>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
