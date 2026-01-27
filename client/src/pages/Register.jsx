import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Create Account</Typography>
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Name" margin="normal" required
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField fullWidth label="Email" type="email" margin="normal" required
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField 
              fullWidth 
              label="Password" 
              type={showPassword ? 'text' : 'password'} 
              margin="normal" 
              required
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField 
              fullWidth 
              label="Confirm Password" 
              type="password" 
              margin="normal" 
              required
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 3 }}>Register</Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={() => navigate('/login')}>Already have an account? Login</Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}