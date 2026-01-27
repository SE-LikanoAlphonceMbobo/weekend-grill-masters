import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function AboutUs() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 5 }}>
        <Typography variant="h3" gutterBottom color="primary">
          About Weekend Grill Masters
        </Typography>
        
        <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Founded in 2023, Weekend Grill Masters was born out of a simple frustration: 
          <strong> buying a braai is expensive, but a good party needs one.</strong> 
          We noticed that people were buying cheap grills that rusted after one season or hiring expensive caterers.
        </Typography>

        <Typography paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          We are a team of grill enthusiasts based locally. We believe that every weekend gathering deserves 
          top-tier equipment without the hassle of maintenance and storage. Our mission is to bring the joy of a 
          perfect braai to every backyard, campsite, and function hall.
        </Typography>

        <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Our Promise
          </Typography>
          <ul>
            <li>100% Clean Equipment</li>
            <li>Reliable Delivery & Pickup</li>
            <li>Expert Support for Setup</li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
}