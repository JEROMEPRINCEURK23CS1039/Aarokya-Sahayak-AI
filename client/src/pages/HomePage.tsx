import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom align="center">
            Aarogya Sahayak
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            AI-Powered Healthcare Assistant for Rural India
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Get instant symptom analysis, find nearby hospitals, and access emergency services
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/register"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              component={RouterLink}
              to="/login"
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Comprehensive healthcare solutions at your fingertips
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Symptom Checker
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI-powered disease prediction based on your symptoms with multilingual support
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" component={RouterLink} to="/analysis">
                  Try Now
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <LocalHospitalIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Find Hospitals
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Locate nearby hospitals with real-time bed availability and directions
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" component={RouterLink} to="/hospitals">
                  Search
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <MedicalServicesIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Emergency Services
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quick access to ambulance services and emergency hotlines
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" color="error">
                  Call 108
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <AssessmentIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Health Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track disease trends and outbreak alerts in your region
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" component={RouterLink} to="/dashboard">
                  View Trends
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 6, mb: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">
                1000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Users Served
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">
                500+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hospitals Listed
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">
                50+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Diseases Detected
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h3" color="primary">
                7
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Languages Supported
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Join thousands of users who trust Aarogya Sahayak for their healthcare needs
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={RouterLink}
          to="/register"
          sx={{ mt: 2 }}
        >
          Create Free Account
        </Button>
      </Container>
    </Box>
  );
};

export default HomePage;
