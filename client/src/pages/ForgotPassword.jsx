import React, { useState } from 'react';
import { 
  Container, Card, CardContent, TextField, Button, Typography, Box, Alert, 
  Paper, IconButton, InputAdornment 
} from '@mui/material';
import { CopyAll } from '@mui/icons-material'; // Icon for copy button
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Question, 3: Code & Reset
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [generatedCode, setGeneratedCode] = useState(''); // State to hold the code from server
  const [userTypedCode, setUserTypedCode] = useState(''); // State for what user types
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // STEP 1: Enter Email
  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password/step1', { email });
      if(res.data.security_question) setQuestion(res.data.security_question);
      setStep(2);
    } catch (err) {
      setError('Server error');
    }
  };

  // STEP 2: Answer Question
  const handleStep2 = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password/step2', { email, security_answer: answer });
      
      // CHANGE HERE: Save the code returned from server and move to Step 3
      setGeneratedCode(res.data.code);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect answer.');
    }
  };

  // STEP 3: Reset Password
  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', { 
        email, 
        code: userTypedCode, // Send what the user TYPED
        newPassword 
      });
      setMessage('Password updated successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setMessage('Code copied to clipboard!');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Security Check'}
            {step === 3 && 'Reset Password'}
          </Typography>
          
          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* STEP 1 FORM */}
          {step === 1 && (
            <form onSubmit={handleStep1}>
              <TextField fullWidth label="Email Address" type="email" margin="normal" required value={email} onChange={e => setEmail(e.target.value)} />
              <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Next</Button>
            </form>
          )}

          {/* STEP 2 FORM */}
          {step === 2 && (
            <form onSubmit={handleStep2}>
              <Alert severity="info" sx={{ mb: 2 }}>Question: {question}</Alert>
              <TextField fullWidth label="Answer" margin="normal" required value={answer} onChange={e => setAnswer(e.target.value)} />
              <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Verify Answer</Button>
              <Button fullWidth onClick={() => setStep(1)} sx={{ mt: 1 }}>Back</Button>
            </form>
          )}

          {/* STEP 3 FORM: DISPLAY CODE + INPUT */}
          {step === 3 && (
            <form onSubmit={handleReset}>
              
              {/* 1. DISPLAY THE GENERATED CODE */}
              <Paper 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  bgcolor: '#e3f2fd', // Light blue background
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">Your Reset Code:</Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    {generatedCode}
                  </Typography>
                </Box>
                <IconButton color="primary" onClick={copyToClipboard}>
                  <CopyAll />
                </IconButton>
              </Paper>

              {/* 2. USER INPUT FIELD */}
              <TextField 
                fullWidth 
                label="Enter the Code above" 
                margin="normal" 
                required 
                value={userTypedCode} 
                onChange={e => setUserTypedCode(e.target.value)} 
              />
              
              <TextField 
                fullWidth 
                label="New Password" 
                type="password" 
                margin="normal" 
                required 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
              />

              <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>Update Password</Button>
              <Button fullWidth onClick={() => setStep(2)} sx={{ mt: 1 }}>Back</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}