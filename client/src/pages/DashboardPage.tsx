import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  MedicalServices,
  LocalHospital,
  Timeline,
  Warning,
  TrendingUp,
  Assessment,
  Phone,
  CheckCircle
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RootState } from '../store/store';
import { showNotification } from '../store/slices/uiSlice';
import { analysisAPI } from '../api/analysis';
import { analyticsAPI } from '../api/analytics';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [outbreaks, setOutbreaks] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, outbreaksRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        analyticsAPI.getOutbreaks({ limit: 3 })
      ]);

      if (dashboardRes.data.success) {
        setDashboardData(dashboardRes.data.dashboard);
      }
      
      // Try to get analysis history if user ID is available
      if (user?._id) {
        try {
          const analysisRes = await analysisAPI.getHistory({ limit: 5 });
          if (analysisRes.data.success) {
            setRecentAnalyses(analysisRes.data.analyses || []);
          }
        } catch (err) {
          // Ignore history errors, dashboard can load without it
          console.log('Could not load analysis history');
        }
      }

      if (outbreaksRes.data.success) {
        setOutbreaks(outbreaksRes.data.hotspots || []);
      }
    } catch (error: any) {
      dispatch(showNotification({
        message: 'Failed to load dashboard data',
        severity: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'Emergency': return 'error';
      case 'Urgent': return 'warning';
      case 'Standard': return 'info';
      default: return 'success';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Welcome back, {user?.profile?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your health dashboard and insights
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3} 
            sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}
            onClick={() => navigate('/analysis')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <MedicalServices sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Symptom Checker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                AI-powered analysis
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3} 
            sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}
            onClick={() => navigate('/hospitals')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <LocalHospital sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Find Hospitals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Locate nearby facilities
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ bgcolor: 'error.light' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Phone sx={{ fontSize: 48, color: 'white', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold" color="white">
                Emergency
              </Typography>
              <Button
                variant="contained"
                color="inherit"
                size="small"
                sx={{ mt: 1, color: 'error.main', bgcolor: 'white' }}
                onClick={() => window.open('tel:108')}
              >
                Call 108
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={3} 
            sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', transition: 'all 0.3s' } }}
            onClick={() => navigate('/profile')}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Assessment sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                My Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Medical history
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Statistics Overview */}
        <Grid item xs={12} md={8}>
          {dashboardData && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Health Statistics Overview
              </Typography>
              <Grid container spacing={2} mt={1}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {dashboardData.totalAnalyses || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Analyses
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {dashboardData.totalUsers || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {dashboardData.averageAge || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Age
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      {dashboardData.totalFeedbacks || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Feedbacks
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Disease Trends Chart */}
          {dashboardData?.topDiseases && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top Predicted Diseases
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardData.topDiseases}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="disease" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          )}
        </Grid>

        {/* Recent Analyses & Outbreaks */}
        <Grid item xs={12} md={4}>
          {/* Outbreak Alerts */}
          {outbreaks.length > 0 && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold" color="error">
                <Warning sx={{ verticalAlign: 'middle', mr: 1 }} />
                Outbreak Alerts
              </Typography>
              <List dense>
                {outbreaks.map((outbreak: any, idx: number) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <Warning color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={outbreak._id?.disease || outbreak.disease || 'Unknown'}
                      secondary={`${outbreak._id?.district || outbreak.location || outbreak._id?.state || 'Unknown location'} - ${outbreak.count || outbreak.cases || 0} cases`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Recent Analyses */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Recent Analyses
            </Typography>
            {recentAnalyses.length === 0 ? (
              <Box textAlign="center" py={4}>
                <MedicalServices sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No analyses yet
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/analysis')}
                >
                  Start Analysis
                </Button>
              </Box>
            ) : (
              <List>
                {recentAnalyses.map((analysis: any, idx: number) => (
                  <Box key={analysis._id}>
                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2">
                              {analysis.predictions?.[0]?.disease || 'Analysis'}
                            </Typography>
                            <Chip
                              label={analysis.triage?.level}
                              size="small"
                              color={getTriageColor(analysis.triage?.level)}
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(analysis.createdAt).toLocaleDateString()}
                            </Typography>
                            <Box mt={0.5}>
                              {analysis.symptoms?.slice(0, 3).map((symptom: string) => (
                                <Chip
                                  key={symptom}
                                  label={symptom}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mr: 0.5, mt: 0.5 }}
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {idx < recentAnalyses.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Health Tips */}
      <Paper elevation={3} sx={{ p: 3, mt: 3, bgcolor: 'success.light' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <CheckCircle sx={{ fontSize: 40, color: 'success.dark' }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" color="success.dark">
              Daily Health Tip
            </Typography>
            <Typography variant="body2" color="success.dark">
              Stay hydrated! Drink at least 8 glasses of water daily for optimal health. Regular exercise and balanced diet are key to wellness.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
