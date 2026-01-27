import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, TextField, Box, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

export default function BookingForm() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Find price from inventory based on ID (Simple lookup)
  // In a real app, you might fetch item details first
  const itemPrices = { '1': 450, '2': 800 }; // Map ID to Price from Inventory Data
  const price = itemPrices[itemId] || 0; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Complete Booking</Typography>
        {msg && <Alert severity={msg.includes('Error') ? 'error' : 'success'} sx={{ mb: 2 }}>{msg}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            label="Event Date" 
            name="date"
            type="date" 
            InputLabelProps={{ shrink: true }} 
            sx={{ mb: 2 }} 
            required 
          />
          <TextField 
            fullWidth 
            label="Location" 
            name="location"
            sx={{ mb: 2 }} 
            required 
          />
          <Typography variant="body1" sx={{ mb: 2 }}>
            Total Cost: <strong>R{price}</strong>
          </Typography>
          <Button fullWidth variant="contained" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Confirm Booking'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}