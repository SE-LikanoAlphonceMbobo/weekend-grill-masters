import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' } 
            }}
          >
            Weekend Grill Masters
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, display: { xs: 'none', sm: 'block' }}}>
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
              px: 4, 
              py: 1.5, 
              fontSize: '1.2rem',
              width: { xs: '100%', sm: 'auto' } 
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
                We drop off the equipment at your venue.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <AttachMoneyIcon sx={{ fontSize: 60, color: '#d84315' }} />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Affordable</Typography>
              <Typography color="text.secondary">
                Premium quality at a fraction of the cost.
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ textAlign: 'center' }}>
              <VerifiedIcon sx={{ fontSize: 60, color: '#d84315' }} />
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>Clean & Safe</Typography>
              <Typography color="text.secondary">
                All gear is professionally cleaned and checked.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* TESTIMONIALS */}
      <Container sx={{ py: 8, bgcolor: '#f9f9f9' }}>
        <Typography variant="h4" align="center" gutterBottom>Happy Customers</Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Avatar src="https://i.pravatar.cc/150?img=1" sx={{ width: 60, height: 60, margin: '0 auto' }} />
                <Rating value={5} readOnly sx={{ my: 1 }} />
                <Typography variant="body1">"The easiest braai setup ever."</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>- Sipho D.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Avatar src="https://i.pravatar.cc/150?img=8" sx={{ width: 60, height: 60, margin: '0 auto' }} />
                <Rating value={5} readOnly sx={{ my: 1 }} />
                <Typography variant="body1">"Prices are unbeatable."</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>- Thembi M.</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ textAlign: 'center', height: '100%' }}>
              <CardContent>
                <Avatar src="https://i.pravatar.cc/150?img=3" sx={{ width: 60, height: 60, margin: '0 auto' }} />
                <Rating value={4} readOnly sx={{ my: 1 }} />
                <Typography variant="body1">"Great service."</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>- John K.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* FAQ */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>Frequently Asked Questions</Typography>
        <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Do I need to clean the equipment?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                No. Please just scrape off excess food, but the cleaning is on us.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">What if equipment malfunctions?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Call us immediately. We will replace yours within an hour.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">How long is the rental period?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Standard rentals are for 24 hours.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>

      {/* CTA */}
      <Box sx={{ bgcolor: '#d84315', color: 'white', py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h4" gutterBottom>Ready to Host?</Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>Book now to secure your date.</Typography>
          <Button component={Link} to="/rentals" variant="outlined" sx={{ color: 'white', borderColor: 'white' }}>Check Availability</Button>
        </Container>
      </Box>
    </>
  );
}