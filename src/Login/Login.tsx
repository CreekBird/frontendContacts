import React, { useState } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { green } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  token: string;
  username: string;
  roles: string[];
}

interface ErrorResponse {
  message: string;
  status: number;
}

type Props = {
  onLogin: (token: string, username: string) => void;
};

export default function Login({ onLogin = () => {} }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add request verification
    console.log('Attempting login with:', { username, password });

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
      }

      const data = await response.json();
      console.log('Received token:', data.token);

      localStorage.setItem('authToken', data.token);
      window.location.href = '/contacts';
    } catch (error) {
      console.error('Full error:', error);
      alert('Login failed. Please check console for details.');
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      gap={2}
    >
      <Typography variant="h4" color={green[800]}>
        LOGIN
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        variant="outlined"
        required
        disabled={isLoading}
        fullWidth
        sx={{ maxWidth: 300 }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        required
        disabled={isLoading}
        fullWidth
        sx={{ maxWidth: 300 }}
      />

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={isLoading}
        sx={{ bgcolor: green[800], '&:hover': { bgcolor: green[900] } }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
      </Button>
    </Box>
  );
}
