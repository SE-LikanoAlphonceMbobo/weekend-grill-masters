import React from 'react';
import { Container, Typography, Box, Paper, Grid, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SecurityIcon from '@mui/icons-material/Security';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* HERO / MISSION */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" gutterBottom color="primary">
          More Than Just Rentals
        </Typography>
        <Typography paragraph sx={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem' }}>
          At Weekend Grill Masters, we believe that every gathering is special. We are not just renting you metal and gas; we are providing the foundation for memories.
          Our mission is to remove the stress of hosting so you can focus on what matters most: connecting with friends and family.
        </Typography><br/>
        <Button variant="contained" size="large" onClick={() => navigate('/rentals')}>Start Hosting</Button>
      </Box>

      {/* VALUES GRID */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2, bgcolor: '#fff' }}>
            <CardContent>
              <EmojiEventsIcon sx={{ fontSize: 48, color: '#d84315', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Excellence</Typography>
              <Typography color="text.secondary">
                We don't settle for "good enough." Every piece of equipment in our inventory is industry-leading standard.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2, bgcolor: '#fff' }}>
            <CardContent>
              <SecurityIcon sx={{ fontSize: 48, color: '#d84315', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Safety First</Typography>
              <Typography color="text.secondary">
                Regular gas checks and electrical inspections ensure that your equipment is safe to use right out of the box.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2, bgcolor: '#fff' }}>
            <CardContent>
              <AccessibilityIcon sx={{ fontSize: 48, color: '#d84315', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Community</Typography>
              <Typography color="text.secondary">
                We are locally owned and operated. When you book with us, you are supporting local businesses.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* STATS SECTION */}
      <Paper sx={{ p: 5, mb: 8, bgcolor: '#263238', color: 'white' }}>
        <Typography variant="h4" align="center" gutterBottom>Our Impact So Far</Typography>
        <Grid container spacing={2} sx={{ mt: 4, textAlign: 'center' }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ffab91' }}>50+</Typography>
            <Typography>Events Catered</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ffab91' }}>100+</Typography>
            <Typography>Happy Customers</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ffab91' }}>5.0</Typography>
            <Typography>Star Rating</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#ffab91' }}>24/7</Typography>
            <Typography>Support</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* CTA */}
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h5" gutterBottom>Still have questions?</Typography>
        <Button variant="outlined" size="large" onClick={() => navigate('/contact')}>
          Get in Touch
        </Button>
      </Box>
    </Container>
  );
}