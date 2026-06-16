import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Typography, Avatar, Tooltip, Divider, Dialog,
  DialogContent, TextField, InputAdornment, List as MuiList,
  ListItem, useMediaQuery, useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  Hotel as HotelIcon,
  CleaningServices as CleanIcon,
  Login as CheckInIcon,
  FactCheck as ReviewIcon,
  Menu as MenuIcon,
  ChevronLeft as CollapseIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Language as LangIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { useThemeMode } from '../contexts/ThemeContext';

const SIDEBAR_WIDTH = 248;
const SIDEBAR_COLLAPSED = 64;

interface NavItem {
  label: string;
  labelKey: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
  roles?: string[];
}

const allNavItems: NavItem[] = [
  { label: 'Dashboard', labelKey: 'nav.dashboard', path: '/', icon: <DashboardIcon />, section: 'Main', roles: ['Admin', 'Manager'] },
  { label: 'Occupancy Timeline', labelKey: 'nav.timeline', path: '/dashboard', icon: <CalendarIcon />, section: 'Main', roles: ['Admin', 'Manager'] },
  { label: 'Bookings', labelKey: 'nav.bookings', path: '/bookings', icon: <CalendarIcon />, section: 'Manage', roles: ['Admin', 'Manager'] },
  { label: 'New Booking', labelKey: 'nav.newBooking', path: '/bookingform', icon: <AddIcon />, section: 'Manage', roles: ['Admin', 'Manager'] },
  { label: 'Properties', labelKey: 'nav.properties', path: '/apartmentlist', icon: <HotelIcon />, section: 'Manage', roles: ['Admin'] },
  { label: 'Check-In Review', labelKey: 'nav.checkinReview', path: '/checkin-review', icon: <ReviewIcon />, section: 'Manage', roles: ['Admin', 'Manager'] },
  { label: 'Guest Check-In', labelKey: 'nav.guestCheckin', path: '/guest-checkin', icon: <CheckInIcon />, section: 'Operations' },
  { label: 'Turnover Board', labelKey: 'nav.cleanerView', path: '/cleaner', icon: <CleanIcon />, section: 'Operations', roles: ['Admin', 'Manager', 'User'] },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdSearch, setCmdSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, hasAnyRole, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { mode, toggleTheme } = useThemeMode();

  const isPublicPage = ['/login', '/register', '/guest-checkin'].includes(location.pathname);

  const navItems = allNavItems.filter(item => {
    if (!item.roles) return true;
    if (!isAuthenticated) return false;
    return hasAnyRole(...(item.roles as any));
  });

  const commandItems = [
    ...navItems,
    { label: 'Add Property', labelKey: 'property.addNew', path: '/apartmentform', icon: <HotelIcon /> },
  ];

  useEffect(() => {
    if (isMobile) setCollapsed(true);
  }, [isMobile]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCmdOpen(prev => !prev);
      setCmdSearch('');
    }
    if (e.key === 'Escape') setCmdOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const filteredCommands = commandItems.filter(item =>
    item.label.toLowerCase().includes(cmdSearch.toLowerCase())
  );

  const handleNav = (path: string) => {
    navigate(path);
    setCmdOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isPublicPage) return <>{children}</>;
  if (!isAuthenticated) return <>{children}</>;

  const drawerWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;
  const sections = ['Main', 'Manage', 'Operations'];
  const sectionLabels: Record<string, string> = {
    Main: t('nav.main'),
    Manage: t('nav.manage'),
    Operations: t('nav.operations'),
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: 'width 0.2s ease',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            transition: 'width 0.2s ease',
            bgcolor: 'var(--bg-surface)',
            borderRight: '1px solid var(--border)',
            overflow: 'hidden',
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', minHeight: 56 }}>
          {!collapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg, #C4704B 0%, #D4A853 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8125rem', fontWeight: 700, color: '#fff',
              }}>
                V
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Velora
              </Typography>
            </Box>
          )}
          <IconButton size="small" onClick={() => setCollapsed(c => !c)} sx={{ color: 'var(--text-muted)' }}>
            {collapsed ? <MenuIcon sx={{ fontSize: 18 }} /> : <CollapseIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>

        {/* Command bar trigger */}
        {!collapsed && (
          <Box sx={{ px: 2, mb: 1 }}>
            <Box
              onClick={() => setCmdOpen(true)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75,
                borderRadius: 2, cursor: 'pointer',
                bgcolor: 'var(--bg-surface-secondary)',
                border: '1px solid var(--border)',
                '&:hover': { borderColor: 'var(--border-strong)' },
                transition: 'all 0.15s ease',
              }}
            >
              <SearchIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
              <Typography variant="body2" sx={{ color: 'var(--text-muted)', flex: 1, fontSize: '0.75rem' }}>{t('common.search')}</Typography>
              <Typography sx={{
                color: 'var(--text-muted)', bgcolor: 'var(--bg-kbd)',
                px: 0.75, py: 0.25, borderRadius: '4px',
                fontSize: '0.5625rem', fontWeight: 600, fontFamily: 'monospace',
                border: '1px solid var(--border)',
              }}>
                {'\u2318'}K
              </Typography>
            </Box>
          </Box>
        )}

        <Divider />

        {/* Nav items */}
        <List sx={{ px: 1, pt: 0.5, flex: 1 }}>
          {sections.map(section => {
            const items = navItems.filter(i => i.section === section);
            if (items.length === 0) return null;
            return (
              <React.Fragment key={section}>
                {!collapsed && (
                  <Typography sx={{
                    px: 1.5, pt: 1.5, pb: 0.5, display: 'block',
                    color: 'var(--text-muted)', fontSize: '0.625rem',
                    fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    {sectionLabels[section]}
                  </Typography>
                )}
                {items.map(item => {
                  const active = location.pathname === item.path;
                  return (
                    <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right">
                      <ListItemButton
                        onClick={() => navigate(item.path)}
                        sx={{
                          borderRadius: 2, mb: 0.25, py: 0.75, px: 1.5,
                          minHeight: 36,
                          justifyContent: collapsed ? 'center' : 'flex-start',
                          bgcolor: active ? (mode === 'dark' ? 'rgba(196,112,75,0.12)' : 'rgba(196,112,75,0.08)') : 'transparent',
                          color: active ? '#C4704B' : 'var(--text-secondary)',
                          '&:hover': {
                            bgcolor: active
                              ? (mode === 'dark' ? 'rgba(196,112,75,0.15)' : 'rgba(196,112,75,0.1)')
                              : 'var(--bg-surface-hover)',
                          },
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <ListItemIcon sx={{
                          minWidth: collapsed ? 0 : 32,
                          color: 'inherit',
                          justifyContent: 'center',
                          '& svg': { fontSize: 18 },
                        }}>
                          {item.icon}
                        </ListItemIcon>
                        {!collapsed && (
                          <ListItemText
                            primary={t(item.labelKey as any)}
                            primaryTypographyProps={{
                              fontSize: '0.8125rem',
                              fontWeight: active ? 600 : 400,
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  );
                })}
              </React.Fragment>
            );
          })}
        </List>

        <Divider />

        {/* Bottom actions */}
        <Box sx={{ px: collapsed ? 0.5 : 2, py: 1, display: 'flex', flexDirection: collapsed ? 'column' : 'row', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'} placement="right">
            <IconButton size="small" onClick={toggleTheme} sx={{ color: 'var(--text-muted)' }}>
              {mode === 'dark' ? <LightModeIcon sx={{ fontSize: 16 }} /> : <DarkModeIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
          <Tooltip title={language === 'en' ? 'Greek' : 'English'} placement="right">
            <IconButton
              size="small"
              onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
              sx={{ color: 'var(--text-muted)' }}
            >
              <LangIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        {/* User */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <Avatar sx={{
            width: 30, height: 30,
            bgcolor: 'rgba(196,112,75,0.12)', color: '#C4704B',
            fontSize: '0.75rem', fontWeight: 600,
          }}>
            {user?.fullName?.charAt(0) || 'A'}
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                {user?.fullName || 'Admin'}
              </Typography>
              <Typography noWrap sx={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                {user?.roles?.[0] || 'User'}
              </Typography>
            </Box>
          )}
          {!collapsed && (
            <Tooltip title={t('auth.signOut')}>
              <IconButton size="small" onClick={handleLogout} sx={{ color: 'var(--text-muted)' }}>
                <LogoutIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{ minHeight: '100vh' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Command Palette (Ctrl+K) */}
      <Dialog
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            mt: '-10vh',
          },
        }}
        slotProps={{
          backdrop: { sx: { bgcolor: 'var(--overlay)', backdropFilter: 'blur(4px)' } },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <TextField
            autoFocus
            fullWidth
            placeholder={`${t('common.search')}...`}
            value={cmdSearch}
            onChange={(e) => setCmdSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'var(--text-muted)', fontSize: 18 }} /></InputAdornment>,
              sx: { borderRadius: 0, border: 'none', '& fieldset': { border: 'none' }, py: 0.5, px: 2, fontSize: '0.875rem' },
            }}
          />
          <Divider />
          <MuiList sx={{ maxHeight: 320, overflow: 'auto', py: 0.5, px: 0.5 }}>
            {filteredCommands.map(item => (
              <ListItem
                key={item.path}
                component="div"
                onClick={() => handleNav(item.path)}
                sx={{
                  borderRadius: 2, cursor: 'pointer', py: 0.75, px: 1.5,
                  '&:hover': { bgcolor: 'var(--bg-surface-hover)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: 'var(--text-muted)', '& svg': { fontSize: 18 } }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.8125rem' }} />
                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.625rem', fontWeight: 500 }}>
                  Navigate
                </Typography>
              </ListItem>
            ))}
            {filteredCommands.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
                {t('common.noResults')}
              </Typography>
            )}
          </MuiList>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AppLayout;
