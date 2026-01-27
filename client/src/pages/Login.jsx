import React, { useContext, useState } from 'react';
import { Card, CardContent, TextField, Button, Typography, Alert, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">Login</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" margin="normal" required
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField
              fullWidth label="Password" type="password" margin="normal" required
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
              Sign In
            </Button>
          </form>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Button onClick={() => navigate('/register')} sx={{ textTransform: 'none' }}>
              Don't have an account? Register
            </Button>
            <Button onClick={() => navigate('/forgot-password')} color="primary" sx={{ textTransform: 'none' }}>
              Forgot Password?
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}