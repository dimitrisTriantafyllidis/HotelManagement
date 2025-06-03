import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  styled,
  Avatar,
  Stack,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Hotel as HotelIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Assignment as BookingIcon,
  Login as CheckInIcon,
  HowToReg as RegisterIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon
} from '@mui/icons-material';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Dashboard cards data
  const cards = [
    { 
      title: 'Bookings', 
      path: '/bookings', 
      icon: <BookingIcon fontSize="large" />,
      count: 124,
      trend: '12%',
      isUp: true,
      color: theme.palette.primary.main
    },
    { 
      title: 'Active Guests', 
      path: '/guests', 
      icon: <PersonIcon fontSize="large" />,
      count: 42,
      trend: '5%',
      isUp: true,
      color: theme.palette.success.main
    },
    { 
      title: 'Apartments', 
      path: '/apartmentlist', 
      icon: <HomeIcon fontSize="large" />,
      count: 15,
      trend: '2%',
      isUp: false,
      color: theme.palette.warning.main
    },
    { 
      title: 'Occupancy Rate', 
      path: '/analytics', 
      icon: <TrendingIcon fontSize="large" />,
      count: '82%',
      trend: '7%',
      isUp: true,
      color: theme.palette.info.main
    },
    { 
      title: 'Online Check-In', 
      path: '/checkin', 
      icon: <CheckInIcon fontSize="large" />,
      description: 'Guest self check-in',
      color: theme.palette.secondary.main
    },
    { 
      title: 'Registration', 
      path: '/register', 
      icon: <RegisterIcon fontSize="large" />,
      description: 'New guest registration',
      color: theme.palette.error.main
    }
  ];

  // Quick actions
  const quickActions = [
    { title: 'New Booking', icon: <BookingIcon />, path: '/bookingform' },
    { title: 'Add Apartment', icon: <HomeIcon />, path: '/apartmentform' },
    { title: 'Check-In Guest', icon: <CheckInIcon />, path: '/checkin' },
    { title: 'View Reports', icon: <TrendingIcon />, path: '/reports' }
  ];

  // Styled Paper component
  const DashboardCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    height: '100%',
    transition: 'all 0.3s ease',
    boxShadow: theme.shadows[4],
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
      cursor: 'pointer'
    }
  }));

  // Styled quick action button
  const ActionButton = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    textAlign: 'center',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'scale(1.05)'
    }
  }));

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Welcome back! Here's what's happening with your properties today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {cards.map((card, index) => (
          <Grid key={index}>
            <Link to={card.path} style={{ textDecoration: 'none' }}>
              <DashboardCard 
                sx={{ 
                  backgroundColor: card.color,
                  background: `linear-gradient(135deg, ${card.color} 0%, ${theme.palette.background.paper} 100%)`
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Avatar sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    width: 56, 
                    height: 56,
                    mb: 2
                  }}>
                    {card.icon}
                  </Avatar>
                  {card.trend && (
                    <Chip
                      label={card.trend}
                      size="small"
                      icon={card.isUp ? <TrendingIcon /> : <TrendingIcon style={{ transform: 'rotate(180deg)' }} />}
                      color={card.isUp ? 'success' : 'error'}
                      sx={{ alignSelf: 'flex-start' }}
                    />
                  )}
                </Stack>
                <Typography variant="h5" fontWeight="bold" color="white" gutterBottom>
                  {card.count || card.title}
                </Typography>
                <Typography variant="body2" color="white">
                  {card.description || card.title}
                </Typography>
              </DashboardCard>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, index) => (
            <Grid key={index}>
              <Link to={action.path} style={{ textDecoration: 'none' }}>
                <ActionButton elevation={3}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    width: 40,
                    height: 40,
                    mb: 1,
                    mx: 'auto'
                  }}>
                    {action.icon}
                  </Avatar>
                  <Typography variant="subtitle2" color="text.primary">
                    {action.title}
                  </Typography>
                </ActionButton>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Activity */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Recent Activity
        </Typography>
        <DashboardCard elevation={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <StarIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontWeight="bold">
              New booking received for Sea View Suite
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              3 guests checked in today
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Mountain Retreat maintenance scheduled
            </Typography>
          </Box>
        </DashboardCard>
      </Box>

      {/* Performance */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
          Monthly Performance
        </Typography>
        <DashboardCard elevation={3} sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Occupancy Rate
              </Typography>
              <Box sx={{ 
                height: 10, 
                backgroundColor: theme.palette.grey[200],
                borderRadius: 5,
                mb: 2
              }}>
                <Box sx={{ 
                  height: '100%', 
                  width: '82%',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 5
                }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                82% occupancy this month (7% increase from last month)
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Revenue
              </Typography>
              <Box sx={{ 
                height: 10, 
                backgroundColor: theme.palette.grey[200],
                borderRadius: 5,
                mb: 2
              }}>
                <Box sx={{ 
                  height: '100%', 
                  width: '65%',
                  background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
                  borderRadius: 5
                }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                $24,500 revenue this month (12% increase from last month)
              </Typography>
            </Grid>
          </Grid>
        </DashboardCard>
      </Box>
    </Box>
  );
};

export default HomePage;