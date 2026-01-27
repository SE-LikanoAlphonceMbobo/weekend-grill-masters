import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, TextField, Box, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

export default function BookingForm() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  // State variables
  const [loading, setLoading] = useState(true); 
  const [submitting, setSubmitting] = useState(false); 
  const [msg, setMsg] = useState('');
  const [price, setPrice] = useState(0); 
  const [today, setToday] = useState(''); 

  // 1. FETCH ITEM DETAILS ON LOAD
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/inventory/${itemId}`);
        setPrice(res.data.price);
        setLoading(false);
      } catch (err) {
        setMsg('Failed to load item details.');
        setLoading(false);
      }
    };
    fetchItem();

    // Set today's date
    const currentDate = new Date().toLocaleDateString('en-CA');
    setToday(currentDate);
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.target);
    
    const bookingData = {
      event_date: formData.get('date'),
      location: formData.get('location'),
      total_price: price 
    };

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://localhost:5000/api/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 201) {
        setMsg('Booking Successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error(err);
      setMsg('Error booking item.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Complete Booking</Typography>
        {msg && <Alert severity={msg.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>{msg}</Alert>}
        
        <form onSubmit={handleSubmit}>
          
          {/* DATE: Separate Label */}
          <Typography variant="body1" gutterBottom>Event Date</Typography>
          <TextField 
            fullWidth 
            name="date"
            type="date" 
            inputProps={{ min: today }}
            sx={{ mb: 4 }} 
            required 
          />

          {/* LOCATION: Separate Label */}
          <Typography variant="body1" gutterBottom>Location</Typography>
          <TextField 
            fullWidth 
            name="location"
            sx={{ mb: 4 }} 
            required 
          />
          
          <Typography variant="h6" sx={{ mb: 2, color: 'primary' }}>
            Total Cost: <strong>R{price}</strong>
          </Typography>
          
          <Button 
            fullWidth 
            variant="contained" 
            type="submit" 
            disabled={submitting}
            sx={{ mt: 2 }}
          >
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}