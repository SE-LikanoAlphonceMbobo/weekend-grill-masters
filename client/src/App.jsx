import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';          // NEW
import AboutUs from './pages/AboutUs';    // NEW
import Contact from './pages/Contact';    // NEW
import Rentals from './pages/Rentals';
import BookingForm from './pages/BookingForm';

function App() {
  const { user, logout, loading } = React.useContext(AuthContext);

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
          
          {/* Main Navigation Links */}
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/rentals">Rentals</Button>
          <Button color="inherit" component={Link} to="/about">About Us</Button>
          <Button color="inherit" component={Link} to="/contact">Contact</Button>

          {/* Auth Links */}
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
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} /> {/* Home is now the root */}
          <Route path="/rentals" element={<Rentals />} /> {/* Rentals moved */}
          <Route path="/about" element={<AboutUs />} /> {/* NEW */}
          <Route path="/contact" element={<Contact />} /> {/* NEW */}
          
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
          
          {/* Protected Routes */}
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