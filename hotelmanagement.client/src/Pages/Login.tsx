import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, IconButton, Link,
  CircularProgress, Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Language as LangIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { login } from '../Services/AuthService';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError(t('auth.emailRequired')); return; }
    setLoading(true);
    try {
      const result = await login({ email, password });
      authLogin(result);
      navigate('/');
    } catch {
      setError(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'var(--bg-primary)',
    }}>
      <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
        <IconButton
          size="small"
          onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
          sx={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 2, px: 1, gap: 0.5 }}
        >
          <LangIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontWeight: 600, fontSize: '0.625rem' }}>{language === 'en' ? 'EL' : 'EN'}</Typography>
        </IconButton>
      </Box>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Box sx={{
          width: { xs: 340, sm: 400 }, p: { xs: 3, sm: 4 }, borderRadius: 3,
          bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
        }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2, mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #C4704B 0%, #D4A853 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: '#fff',
            }}>
              V
            </Box>
            <Typography variant="h3" sx={{ mb: 0.5, color: 'var(--text-primary)' }}>{t('auth.loginWelcome')}</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{t('auth.loginSubtitle')}</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--text-secondary)' }}>{t('auth.email')}</Typography>
            <TextField fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@velora.com" sx={{ mb: 2 }} autoFocus autoComplete="email" />

            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--text-secondary)' }}>{t('auth.password')}</Typography>
            <TextField fullWidth type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: 'var(--text-muted)' }}>
                    {showPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                  </IconButton>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button type="submit" fullWidth variant="contained" disabled={loading}
              sx={{
                py: 1.25, borderRadius: 2,
                bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' },
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : t('auth.signIn')}
            </Button>
          </Box>

          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Link href="#" underline="none" sx={{ color: 'var(--text-muted)', fontSize: '0.8125rem', '&:hover': { color: '#C4704B' } }}>
              {t('auth.forgotPassword')}
            </Link>
          </Box>

          <Box sx={{ mt: 3, pt: 3, textAlign: 'center', borderTop: '1px solid var(--border)' }}>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {t('auth.noAccount')}{' '}
              <Link href="/register" underline="none" sx={{ color: '#C4704B', fontWeight: 600, '&:hover': { color: '#A85A38' } }}>
                {t('auth.signUp')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
