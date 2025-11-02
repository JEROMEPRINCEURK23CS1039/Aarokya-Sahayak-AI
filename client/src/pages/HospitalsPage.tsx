import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Search,
  LocationOn,
  Phone,
  LocalHospital,
  Star,
  Navigation,
  Warning
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { showNotification } from '../store/slices/uiSlice';
import { hospitalsAPI } from '../api/hospitals';

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Hospital {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  contact: {
    phone: string[];
    emergency: string;
    email: string;
  };
  specialties: string[];
  facilities: string[];
  operatingHours: any;
  distance?: number;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const HospitalsPage = () => {
  const dispatch = useDispatch();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([20.2961, 85.8245]); // Default: Bhubaneswar
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyHospitals();
    }
  }, [userLocation, searchRadius]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          dispatch(showNotification({
            message: 'Using default location. Enable location for better results.',
            severity: 'info'
          }));
        }
      );
    }
  };

  const fetchNearbyHospitals = async () => {
    setLoading(true);
    try {
      const response = await hospitalsAPI.getNearby({
        latitude: userLocation[0],
        longitude: userLocation[1],
        maxDistance: searchRadius * 1000,
        limit: 20,
        specialties: specialtyFilter ? [specialtyFilter] : undefined
      });

      if (response.data.success) {
        setHospitals(response.data.hospitals);
      }
    } catch (error: any) {
      dispatch(showNotification({
        message: 'Failed to load hospitals',
        severity: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (hospital: Hospital) => {
    const [lng, lat] = hospital.location.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const handleCallEmergency = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Find Nearby Hospitals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Locate healthcare facilities near you with real-time distance
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Map Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ height: '600px', position: 'relative' }}>
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.9)'
                }}
              >
                <LinearProgress />
              </Box>
            )}
            
            <MapContainer
              center={userLocation}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <MapUpdater center={userLocation} />
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* User Location Marker */}
              <Marker position={userLocation}>
                <Popup>Your Location</Popup>
              </Marker>

              {/* Hospital Markers */}
              {hospitals.map((hospital) => {
                const [lng, lat] = hospital.location.coordinates;
                return (
                  <Marker
                    key={hospital._id}
                    position={[lat, lng]}
                    eventHandlers={{
                      click: () => setSelectedHospital(hospital)
                    }}
                  >
                    <Popup>
                      <Box sx={{ minWidth: 200 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {hospital.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {hospital.location.address}
                        </Typography>
                        {hospital.distance && (
                          <Chip
                            label={`${hospital.distance.toFixed(2)} km away`}
                            size="small"
                            color="primary"
                            sx={{ mt: 1 }}
                          />
                        )}
                        <Button
                          size="small"
                          fullWidth
                          variant="contained"
                          sx={{ mt: 1 }}
                          onClick={() => handleGetDirections(hospital)}
                        >
                          Get Directions
                        </Button>
                      </Box>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </Paper>

          {/* Search Controls */}
          <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Search Radius (km)"
                  type="number"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    )
                  }}
                  inputProps={{ min: 1, max: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Filter by Specialty"
                  value={specialtyFilter}
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                  placeholder="e.g., Cardiology"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={fetchNearbyHospitals}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Search'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Hospital List */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '600px', overflow: 'auto' }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
              <Typography variant="h6" fontWeight="bold">
                Nearby Hospitals ({hospitals.length})
              </Typography>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : hospitals.length === 0 ? (
              <Box p={4} textAlign="center">
                <LocalHospital sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No hospitals found in this area
                </Typography>
              </Box>
            ) : (
              <List>
                {hospitals.map((hospital, index) => (
                  <Box key={hospital._id}>
                    <ListItem
                      button
                      selected={selectedHospital?._id === hospital._id}
                      onClick={() => setSelectedHospital(hospital)}
                      sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        py: 2
                      }}
                    >
                      <Box width="100%">
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {hospital.name}
                          </Typography>
                          {hospital.distance && (
                            <Chip
                              label={`${hospital.distance.toFixed(1)} km`}
                              size="small"
                              color="primary"
                            />
                          )}
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                          {hospital.location.address}, {hospital.location.city}
                        </Typography>

                        <Box display="flex" gap={1} flexWrap="wrap" my={1}>
                          {hospital.specialties.slice(0, 3).map((spec) => (
                            <Chip key={spec} label={spec} size="small" variant="outlined" />
                          ))}
                        </Box>

                        <Box display="flex" gap={1} mt={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Phone />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCallEmergency(hospital.contact.phone[0]);
                            }}
                          >
                            Call
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Navigation />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGetDirections(hospital);
                            }}
                          >
                            Directions
                          </Button>
                        </Box>
                      </Box>
                    </ListItem>
                    {index < hospitals.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </Paper>

          {/* Emergency Contact Card */}
          <Card sx={{ mt: 2 }} elevation={3}>
            <CardContent sx={{ bgcolor: 'error.main', color: 'white' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Warning />
                <Typography variant="h6" fontWeight="bold">
                  Emergency
                </Typography>
              </Box>
              <Typography variant="body2" gutterBottom>
                For immediate medical emergency, call:
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="inherit"
                size="large"
                sx={{ mt: 1, color: 'error.main', bgcolor: 'white', '&:hover': { bgcolor: 'grey.100' } }}
                startIcon={<Phone />}
                onClick={() => window.open('tel:108')}
              >
                Call 108 (Ambulance)
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HospitalsPage;
