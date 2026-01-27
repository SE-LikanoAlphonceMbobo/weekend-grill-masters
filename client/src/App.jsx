import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  CircularProgress, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  useMediaQuery,
  useTheme,
  Container // <--- THIS WAS MISSING, CAUSING THE ERROR
} from '@mui/material';
import { AuthContext } from './context/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Rentals from './pages/Rentals';
import BookingForm from './pages/BookingForm';

function App() {
  const { user, logout, loading } = React.useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Navigation Items
  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Rentals', path: '/rentals' },
    { text: 'About Us', path: '/about' },
    { text: 'Contact', path: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = () => {
    setMobileOpen(false); // Close menu on click
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Weekend Grill Masters
          </Typography>

          {/* Desktop Menu: Visible on PC/Tablet */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.map((item) => (
                <Button key={item.text} color="inherit" component={Link} to={item.path}>
                  {item.text}
                </Button>
              ))}

              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <Button color="inherit" component={Link} to="/admin">Admin</Button>
                  ) : (
                    <Button color="inherit" component={Link} to="/dashboard">My Bookings</Button>
                  )}
                  <Button color="inherit" onClick={logout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login">Login</Button>
                  <Button color="inherit" component={Link} to="/register">Register</Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile Menu Button: Visible on Phone */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer: Hides on Desktop */}
      <Drawer
        variant="temporary"
        anchor="right" // Opens from right
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' }, 
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', padding: 2 }}>
          <Typography variant="h6" color="textSecondary">Menu</Typography>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} button component={Link} to={item.path} onClick={handleMenuClick}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          
          {/* Auth Links in Mobile Drawer */}
          {user ? (
             <>
               <ListItem button component={Link} to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={handleMenuClick}>
                 <ListItemText primary={user.role === 'admin' ? 'Admin' : 'My Bookings'} />
               </ListItem>
               <ListItem button onClick={() => { logout(); handleMenuClick(); }}>
                 <ListItemText primary="Logout" />
               </ListItem>
             </>
          ) : (
             <>
               <ListItem button component={Link} to="/login" onClick={handleMenuClick}>
                 <ListItemText primary="Login" />
               </ListItem>
               <ListItem button component={Link} to="/register" onClick={handleMenuClick}>
                 <ListItemText primary="Register" />
               </ListItem>
             </>
          )}
        </List>
      </Drawer>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
          <Route 
            path="/dashboard" 
            element={
              user && user.role !== 'admin' 
              ? <Dashboard /> 
              : <Navigate to="/" />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user && user.role === 'admin' 
              ? <AdminDashboard /> 
              : <Navigate to="/" />
            } 
          />
          <Route 
            path="/book/:itemId" 
            element={user ? <BookingForm /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;