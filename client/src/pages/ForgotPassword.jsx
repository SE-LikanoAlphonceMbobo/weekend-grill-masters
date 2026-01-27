import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code & Pass
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError('Server error');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { email, code, newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </Typography>
          
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {step === 1 ? (
            <form onSubmit={handleSendCode}>
              <TextField 
                fullWidth label="Email Address" type="email" margin="normal" required
                value={email} onChange={e => setEmail(e.target.value)}
                helperText="Enter your email to receive a recovery code."
              />
              <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Send Code</Button>
              <Button fullWidth onClick={() => navigate('/login')} sx={{ mt: 1 }}>Back to Login</Button>
            </form>
          ) : (
            <form onSubmit={handleReset}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Check your SERVER TERMINAL for the code (Email Simulation).
              </Typography>
              <TextField fullWidth label="Recovery Code" margin="normal" required
                value={code} onChange={e => setCode(e.target.value)}
              />
              <TextField fullWidth label="New Password" type="password" margin="normal" required
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
              />
              <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Update Password</Button>
              <Button fullWidth onClick={() => setStep(1)} sx={{ mt: 1 }}>Back</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}