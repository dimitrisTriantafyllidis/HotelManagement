import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  CssBaseline, 
  Grid, 
  Link, 
  TextField, 
  Typography 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { LoginDto } from '../models/types';
import { login } from '../Services/AuthService';

// Default Material UI theme
const defaultTheme = createTheme();

const LoginPage: React.FC = () => {

  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
    const [error, setError] = useState('');

  const [credentials, setCredentials] = useState<LoginDto>({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    let isValid = true;

    // Email validation
    if (!credentials.email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!credentials.password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (credentials.password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      // Here you would typically make an API call to authenticate the user
      try {
            const result = await login(credentials);
            localStorage.setItem('token', result.token);
            navigate('/home');
          } catch (err) {
            setError('Invalid login credentials');
            console.error(err);
          }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={credentials.email}
              onChange={handleChange}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button><form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}

            </form>
            <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
            <Grid>
                <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
                Forgot password?
                </Link>
            </Grid>
            <Grid>
                <Link href="/register" variant="body2" sx={{ textDecoration: 'none' }}>
                Don't have an account? Sign Up
                </Link>
            </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;