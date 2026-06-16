import { createTheme, PaletteMode } from '@mui/material/styles';

export const createAppTheme = (mode: PaletteMode) => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode,
      primary: { main: '#C4704B', light: '#D4936F', dark: '#A85A38', contrastText: '#fff' },
      secondary: { main: '#D4A853', light: '#E0C07A', dark: '#B8903D', contrastText: '#fff' },
      background: {
        default: isLight ? '#F8F9FB' : '#0E0E12',
        paper: isLight ? '#FFFFFF' : '#18181F',
      },
      text: {
        primary: isLight ? '#111827' : '#E5E7EB',
        secondary: isLight ? '#6B7280' : '#9CA3AF',
      },
      success: { main: '#22C55E', light: '#86EFAC', dark: '#16A34A' },
      warning: { main: '#EAB308', light: '#FDE68A', dark: '#CA8A04' },
      error: { main: '#EF4444', light: '#FCA5A5', dark: '#DC2626' },
      info: { main: '#3B82F6', light: '#93C5FD', dark: '#2563EB' },
      divider: isLight ? '#E5E7EB' : '#27272F',
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"DM Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 },
      h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 },
      h3: { fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.3 },
      h4: { fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35 },
      h5: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
      h6: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.45 },
      body1: { fontSize: '0.875rem', lineHeight: 1.6, letterSpacing: '0.01em' },
      body2: { fontSize: '0.8125rem', lineHeight: 1.55, letterSpacing: '0.01em' },
      caption: { fontSize: '0.6875rem', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' as const },
      button: { textTransform: 'none' as const, fontWeight: 600, fontSize: '0.8125rem' },
      overline: { fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': { width: 6, height: 6 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)',
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            transition: 'all 0.15s ease',
          },
          sizeSmall: { padding: '5px 12px', fontSize: '0.75rem' },
          sizeLarge: { padding: '12px 24px', fontSize: '0.875rem' },
          contained: {
            '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
          },
          outlined: {
            borderColor: isLight ? '#D1D5DB' : '#374151',
            color: isLight ? '#374151' : '#D1D5DB',
            '&:hover': {
              borderColor: isLight ? '#9CA3AF' : '#6B7280',
              backgroundColor: isLight ? '#F9FAFB' : 'rgba(255,255,255,0.04)',
            },
          },
          text: {
            color: isLight ? '#6B7280' : '#9CA3AF',
            '&:hover': { backgroundColor: isLight ? '#F3F4F6' : 'rgba(255,255,255,0.06)' },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: isLight ? '#fff' : '#1F1F28',
              fontSize: '0.8125rem',
              '& fieldset': { borderColor: isLight ? '#D1D5DB' : '#374151' },
              '&:hover fieldset': { borderColor: isLight ? '#9CA3AF' : '#6B7280' },
              '&.Mui-focused fieldset': { borderColor: '#C4704B', borderWidth: 1.5 },
            },
            '& .MuiInputLabel-root': { fontSize: '0.8125rem' },
          },
        },
      },
      MuiSelect: {
        defaultProps: { size: 'small' },
        styleOverrides: {
          root: { borderRadius: 8, fontSize: '0.8125rem' },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
            border: `1px solid ${isLight ? '#E5E7EB' : '#27272F'}`,
          },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
            border: `1px solid ${isLight ? '#E5E7EB' : '#27272F'}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6, fontWeight: 600, fontSize: '0.6875rem', height: 24 },
          sizeSmall: { height: 22, fontSize: '0.625rem' },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: isLight ? '#E5E7EB' : '#27272F',
            padding: '12px 16px',
            fontSize: '0.8125rem',
          },
          head: {
            fontWeight: 600,
            fontSize: '0.6875rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase' as const,
            color: isLight ? '#6B7280' : '#9CA3AF',
            backgroundColor: isLight ? '#F9FAFB' : '#111118',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': { backgroundColor: isLight ? '#F9FAFB' : 'rgba(255,255,255,0.02)' },
            '&:last-child td': { borderBottom: 0 },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 14,
            border: `1px solid ${isLight ? '#E5E7EB' : '#27272F'}`,
            boxShadow: isLight
              ? '0 20px 60px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)'
              : '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: isLight ? '#111827' : '#F9FAFB',
            color: isLight ? '#F9FAFB' : '#111827',
            fontSize: '0.6875rem',
            fontWeight: 500,
            borderRadius: 6,
            padding: '6px 10px',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: { width: 36, height: 36, fontSize: '0.8125rem', fontWeight: 600 },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': { color: '#C4704B' },
            '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C4704B' },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isLight ? '#E5E7EB' : '#27272F' },
        },
      },
      MuiSkeleton: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: isLight ? '#fff' : '#1F1F28',
            border: `1px solid ${isLight ? '#E5E7EB' : '#27272F'}`,
            boxShadow: isLight
              ? '0 8px 24px rgba(0,0,0,0.08)'
              : '0 8px 24px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '0.8125rem',
            borderRadius: 6,
            margin: '2px 4px',
            '&:hover': { backgroundColor: isLight ? '#F3F4F6' : 'rgba(255,255,255,0.06)' },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 10, fontSize: '0.8125rem' },
        },
      },
    },
  });
};

const theme = createAppTheme('dark');
export default theme;
