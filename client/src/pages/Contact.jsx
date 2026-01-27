import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Paper, Grid } from '@mui/material';

export default function Contact() {
  const [messageSent, setMessageSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would post this to a backend API
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom align="center">
        Get in Touch
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Contact Information</Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1"><strong>Email:</strong> info@weekendgrillmasters.com</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}><strong>Phone:</strong> +27 12 345 6789</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}><strong>Address:</strong> 123 Flame Road, Braai City, ZA</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            {messageSent ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h5" color="success.main">Message Sent!</Typography>
                <Typography>We will get back to you shortly.</Typography>
              </Box>
            ) : (
              <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Name" variant="outlined" sx={{ mb: 2 }} required />
                <TextField fullWidth label="Email" type="email" variant="outlined" sx={{ mb: 2 }} required />
                <TextField 
                  fullWidth 
                  label="Message" 
                  multiline 
                  rows={4} 
                  variant="outlined" 
                  sx={{ mb: 2 }} 
                  required 
                />
                <Button fullWidth variant="contained" type="submit" size="large">
                  Send Message
                </Button>
              </form>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}