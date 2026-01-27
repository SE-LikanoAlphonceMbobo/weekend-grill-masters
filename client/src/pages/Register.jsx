import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box, InputAdornment, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What is your mother's maiden name?",
  "In what city were you born?",
  "What is your favorite movie?",
  "What was the make of your first car?"
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', question: '', answer: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    if (!formData.question || !formData.answer) return setError('Please select a security question and answer');

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        security_question: formData.question,
        security_answer: formData.answer
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
            <TextField fullWidth label="Name" margin="normal" required onChange={e => setFormData({ ...formData, name: e.target.value })} />
            <TextField fullWidth label="Email" type="email" margin="normal" required onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} margin="normal" required onChange={e => setFormData({ ...formData, password: e.target.value })} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment> }} />
            <TextField fullWidth label="Confirm Password" type="password" margin="normal" required onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
            
            {/* SECURITY QUESTION */}
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Security Question</InputLabel>
              <Select value={formData.question} label="Security Question" onChange={e => setFormData({ ...formData, question: e.target.value })}>
                {SECURITY_QUESTIONS.map((q, i) => <MenuItem key={i} value={q}>{q}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField fullWidth label="Answer" margin="normal" required onChange={e => setFormData({ ...formData, answer: e.target.value })} />

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