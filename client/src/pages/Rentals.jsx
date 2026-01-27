import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Rentals() {
  const [items, setItems] = useState([]);
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/inventory').then(res => setItems(res.data));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Our Equipment</Typography>
      <Grid container spacing={4}>
  {items.map(item => (
    <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>  {/* Added key={item.id} */}
      <Card>
        <CardMedia component="img" height="200" image={item.image_url} alt={item.name} />
        <CardContent>
          <Typography variant="h6">{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">{item.description}</Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>R{item.price}</Typography>
        </CardContent>
        <CardActions>
          <Button 
            size="small" 
            variant="contained"
            fullWidth
            disabled={!user}
            onClick={() => navigate(`/book/${item.id}`)}
          >
            {user ? 'Rent Now' : 'Login to Rent'}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ))}
</Grid>
    </div>
  );
}