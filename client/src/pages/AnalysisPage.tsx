import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Chip,
  Grid,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  LocalHospital,
  NavigateNext,
  NavigateBefore,
  MedicalServices
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RootState } from '../store/store';
import { showNotification } from '../store/slices/uiSlice';
import { analysisAPI, AnalysisData } from '../api/analysis';

interface Symptom {
  _id: string;
  name: string;
  category: string;
  severity: string;
  translations: any;
}

const steps = ['Select Symptoms', 'Patient Details', 'Results'];

const AnalysisPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  const [patientData, setPatientData] = useState({
    age: user?.profile?.age || '',
    gender: user?.profile?.gender || '',
    chronicConditions: '',
    medications: '',
    allergies: ''
  });

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    setLoading(true);
    try {
      const response = await analysisAPI.getSymptoms();
      if (response.data.success) {
        setSymptoms(response.data.symptoms);
      }
    } catch (error: any) {
      dispatch(showNotification({
        message: 'Failed to load symptoms',
        severity: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSymptomToggle = (symptomName: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomName)
        ? prev.filter(s => s !== symptomName)
        : [...prev, symptomName]
    );
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedSymptoms.length === 0) {
      dispatch(showNotification({
        message: 'Please select at least one symptom',
        severity: 'warning'
      }));
      return;
    }
    if (activeStep === 1) {
      handleAnalyze();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setActiveStep(2);
    
    try {
      const analysisData: AnalysisData = {
        symptoms: selectedSymptoms,
        age: parseInt(patientData.age as string) || user?.profile?.age || 30,
        gender: patientData.gender as string || user?.profile?.gender || 'Other',
        chronicConditions: patientData.chronicConditions ? 
          patientData.chronicConditions.split(',').map(c => c.trim()) : [],
        medications: patientData.medications ? 
          patientData.medications.split(',').map(m => m.trim()) : [],
        allergies: patientData.allergies ? 
          patientData.allergies.split(',').map(a => a.trim()) : []
      };

      const response = await analysisAPI.analyzeSymptoms(analysisData);
      
      if (response.data.success) {
        setAnalysisResult(response.data);
        dispatch(showNotification({
          message: 'Analysis completed successfully',
          severity: 'success'
        }));
      }
    } catch (error: any) {
      dispatch(showNotification({
        message: error.response?.data?.message || 'Analysis failed',
        severity: 'error'
      }));
      setActiveStep(1);
    } finally {
      setAnalyzing(false);
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

  const getTriageIcon = (level: string) => {
    switch (level) {
      case 'Emergency': return <ErrorIcon />;
      case 'Urgent': return <Warning />;
      default: return <CheckCircle />;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select your symptoms
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Choose all symptoms you are experiencing
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={1}>
                {symptoms.map((symptom) => (
                  <Grid item key={symptom._id}>
                    <Chip
                      label={symptom.name}
                      onClick={() => handleSymptomToggle(symptom.name)}
                      color={selectedSymptoms.includes(symptom.name) ? 'primary' : 'default'}
                      variant={selectedSymptoms.includes(symptom.name) ? 'filled' : 'outlined'}
                      sx={{ m: 0.5 }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            
            <Alert severity="info" sx={{ mt: 3 }}>
              Selected: {selectedSymptoms.length} symptom(s)
            </Alert>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Patient Details
            </Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={patientData.age}
                  onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                  required
                  inputProps={{ min: 1, max: 120 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Gender"
                  value={patientData.gender}
                  onChange={(e) => setPatientData({...patientData, gender: e.target.value})}
                  required
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chronic Conditions (comma-separated)"
                  value={patientData.chronicConditions}
                  onChange={(e) => setPatientData({...patientData, chronicConditions: e.target.value})}
                  placeholder="e.g., Diabetes, Hypertension"
                  helperText="Leave blank if none"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Medications (comma-separated)"
                  value={patientData.medications}
                  onChange={(e) => setPatientData({...patientData, medications: e.target.value})}
                  placeholder="e.g., Metformin, Aspirin"
                  helperText="Leave blank if none"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Allergies (comma-separated)"
                  value={patientData.allergies}
                  onChange={(e) => setPatientData({...patientData, allergies: e.target.value})}
                  placeholder="e.g., Penicillin, Peanuts"
                  helperText="Leave blank if none"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        if (analyzing) {
          return (
            <Box textAlign="center" py={6}>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Analyzing your symptoms...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our AI is processing your information
              </Typography>
            </Box>
          );
        }

        if (!analysisResult) return null;

        const chartData = analysisResult.predictions?.slice(0, 3).map((pred: any) => ({
          name: pred.disease,
          probability: parseFloat((pred.probability * 100).toFixed(1))
        })) || [];

        return (
          <Box>
            {/* Hero Result Card */}
            <Card 
              elevation={6}
              sx={{ 
                mb: 3,
                background: `linear-gradient(135deg, ${
                  analysisResult.triageLevel === 'Emergency' ? '#ff5252 0%, #f44336 100%' :
                  analysisResult.triageLevel === 'Urgent' ? '#ffa726 0%, #ff9800 100%' :
                  analysisResult.triageLevel === 'OPD' ? '#42a5f5 0%, #2196f3 100%' :
                  '#66bb6a 0%, #4caf50 100%'
                })`,
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%'
                }}
              />
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  {getTriageIcon(analysisResult.triageLevel)}
                  <Box flex={1}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {analysisResult.triageLevel} Priority
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      AI Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {analysisResult.recommendations?.message || ''}
                </Typography>
              </CardContent>
            </Card>

            {/* Disease Predictions with Bar Chart */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={3} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                      📊 Disease Probability
                    </Typography>
                    <Box sx={{ height: 280, mt: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip 
                            formatter={(value: any) => `${value}%`}
                            contentStyle={{ 
                              background: 'rgba(255,255,255,0.95)',
                              border: '1px solid #ccc',
                              borderRadius: 8
                            }}
                          />
                          <Bar dataKey="probability" fill="#1976d2" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={3} sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                      🎯 Top Predictions
                    </Typography>
                    {analysisResult.predictions?.slice(0, 3).map((pred: any, idx: number) => (
                      <Card 
                        key={idx}
                        elevation={2}
                        sx={{ 
                          mb: 2,
                          p: 2,
                          background: idx === 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                                     idx === 1 ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                                     'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          color: 'white',
                          transition: 'transform 0.2s',
                          '&:hover': { transform: 'translateY(-4px)' }
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              #{idx + 1} Most Likely
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {pred.disease}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="h4" fontWeight="bold">
                              {(pred.probability * 100).toFixed(1)}%
                            </Typography>
                            <Typography variant="caption">
                              Probability
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recommendations */}
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                  💡 Medical Recommendations
                </Typography>
                <Grid container spacing={2}>
                  {analysisResult.recommendations?.actions?.map((rec: string, idx: number) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Card 
                        elevation={1}
                        sx={{ 
                          p: 2,
                          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                          transition: 'all 0.3s',
                          '&:hover': { 
                            transform: 'translateY(-2px)',
                            boxShadow: 4
                          }
                        }}
                      >
                        <Box display="flex" alignItems="start" gap={2}>
                          <LocalHospital color="primary" sx={{ fontSize: 32 }} />
                          <Typography variant="body1" fontWeight="500">
                            {rec}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Warning Alert */}
            <Alert 
              severity="warning" 
              icon={<Warning />}
              sx={{ 
                mb: 3,
                '& .MuiAlert-message': { width: '100%' }
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Important Medical Disclaimer
              </Typography>
              <Typography variant="body2">
                This is an AI-based prediction using machine learning. It should NOT replace professional medical diagnosis. 
                Please consult a qualified healthcare professional for accurate diagnosis and treatment.
              </Typography>
            </Alert>

            {/* Action Buttons */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<LocalHospital />}
                  onClick={() => window.location.href = '/hospitals'}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                    }
                  }}
                >
                  Find Nearby Hospitals
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={() => {
                    setActiveStep(0);
                    setSelectedSymptoms([]);
                    setAnalysisResult(null);
                  }}
                  sx={{ py: 1.5 }}
                >
                  Start New Analysis
                </Button>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <MedicalServices sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          AI Symptom Analyzer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Get instant health insights powered by machine learning
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        {activeStep < 2 && (
          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<NavigateBefore />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<NavigateNext />}
            >
              {activeStep === steps.length - 2 ? 'Analyze' : 'Next'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AnalysisPage;
