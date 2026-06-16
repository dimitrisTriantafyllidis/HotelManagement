import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, TextField, Typography, IconButton, Link,
  CircularProgress, Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Language as LangIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { register } from '../Services/AuthService';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName) { setError(t('auth.nameRequired')); return; }
    if (!email) { setError(t('auth.emailRequired')); return; }
    if (!password || password.length < 6) { setError(t('auth.passwordMin')); return; }
    if (password !== confirmPassword) { setError(t('auth.passwordMismatch')); return; }
    setLoading(true);
    try {
      const result = await register({ fullName, email, password, organizationName: organization || undefined });
      authLogin(result);
      navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data;
      setError(Array.isArray(msg) ? msg.join(', ') : (typeof msg === 'string' ? msg : 'Registration failed'));
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
        <IconButton size="small" onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
          sx={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 2, px: 1, gap: 0.5 }}>
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
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2, mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #C4704B 0%, #D4A853 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 700, color: '#fff',
            }}>
              V
            </Box>
            <Typography variant="h3" sx={{ mb: 0.5, color: 'var(--text-primary)' }}>{t('auth.registerWelcome')}</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{t('auth.registerSubtitle')}</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--text-secondary)' }}>{t('auth.fullName')}</Typography>
            <TextField fullWidth value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" sx={{ mb: 2 }} autoFocus />

            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--text-secondary)' }}>{t('auth.email')}</Typography>
            <TextField fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" sx={{ mb: 2 }} autoComplete="email" />

            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--text-secondary)' }}>{t('auth.organization')} (optional)</Typography>
            <TextField fullWidth value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="My Properties LLC" sx={{ mb: 2 }} />

            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--text-secondary)' }}>{t('auth.password')}</Typography>
            <TextField fullWidth type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" sx={{ mb: 2 }} autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: 'var(--text-muted)' }}>
                    {showPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                  </IconButton>
                ),
              }}
            />

            <Typography variant="caption" sx={{ mb: 0.5, display: 'block', color: 'var(--text-secondary)' }}>{t('auth.confirmPassword')}</Typography>
            <TextField fullWidth type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" sx={{ mb: 3 }} autoComplete="new-password" />

            <Button type="submit" fullWidth variant="contained" disabled={loading}
              sx={{ py: 1.25, borderRadius: 2, bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } }}>
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : t('auth.signUp')}
            </Button>
          </Box>

          <Box sx={{ mt: 3, pt: 3, textAlign: 'center', borderTop: '1px solid var(--border)' }}>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              {t('auth.hasAccount')}{' '}
              <Link href="/login" underline="none" sx={{ color: '#C4704B', fontWeight: 600, '&:hover': { color: '#A85A38' } }}>
                {t('auth.signIn')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default RegisterPage;
