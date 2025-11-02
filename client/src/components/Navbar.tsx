import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/slices/authSlice';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          component={RouterLink}
          to="/"
          sx={{ mr: 2 }}
        >
          <LocalHospitalIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          Aarogya Sahayak
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={RouterLink} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={RouterLink} to="/analysis">
                Symptom Checker
              </Button>
              <Button color="inherit" component={RouterLink} to="/hospitals">
                Find Hospitals
              </Button>
              <Button color="inherit" component={RouterLink} to="/profile">
                Profile
              </Button>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
