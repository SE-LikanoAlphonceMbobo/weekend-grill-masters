import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom'; // Import Link
import { Container, AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Rentals from './pages/Rentals';
import BookingForm from './pages/BookingForm';

function App() {
  const { user, logout, loading } = React.useContext(AuthContext);

  // 1. Show a spinner while checking if user is logged in (Prevents Flicker)
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
          {user ? (
            <>
              {/* 2. Use "component={Link} to=..." instead of "href" for smooth SPA navigation */}
              <Button color="inherit" component={Link} to="/">Rentals</Button>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
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
          <Route path="/" element={<Rentals />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" />} 
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