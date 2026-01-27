import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: '3.5rem' }}>
            Weekend Grill Masters
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Premium Braai Equipment Rentals. Delivered Clean, Ready to Fire.
          </Typography>
          <Button 
            component={Link} 
            to="/rentals" 
            variant="contained" 
            size="large" 
            sx={{ 
              bgcolor: '#d84315', 
              '&:hover': { bgcolor: '#bf360c' }, 
              px: 4, py: 1.5, fontSize: '1.2rem' 
            }}
          >
            Browse Equipment
          </Button>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Why Choose Us?
        </Typography>
              <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <LocalShippingIcon sx={{ fontSize: 60, color: '#d84315' }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>We Deliver</Typography>
            <Typography color="text.secondary">
              We drop off the equipment at your venue day before your event.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <AttachMoneyIcon sx={{ fontSize: 60, color: '#d84315' }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Affordable</Typography>
            <Typography color="text.secondary">
              Premium quality grills at a fraction of cost of buying.
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <VerifiedIcon sx={{ fontSize: 60, color: '#d84315' }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Clean & Safe</Typography>
            <Typography color="text.secondary">
              All gear is professionally cleaned and safety-checked.
            </Typography>
          </Box>
        </Grid>
      </Grid>
      </Container>
    </>
  );
}