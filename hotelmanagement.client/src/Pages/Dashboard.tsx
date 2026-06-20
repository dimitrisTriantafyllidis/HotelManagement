import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Button
} from '@mui/material';
import {
  Hotel as HotelIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data
const recentBookings = [
  { id: 1, name: 'John Smith', apartment: 'Sea View Suite', checkIn: '2023-06-15', checkOut: '2023-06-20', status: 'confirmed' },
  { id: 2, name: 'Maria Garcia', apartment: 'Mountain Retreat', checkIn: '2023-06-18', checkOut: '2023-06-25', status: 'confirmed' },
  { id: 3, name: 'David Johnson', apartment: 'City Loft', checkIn: '2023-06-20', checkOut: '2023-06-22', status: 'pending' },
  { id: 4, name: 'Sarah Williams', apartment: 'Garden Villa', checkIn: '2023-06-22', checkOut: '2023-06-30', status: 'confirmed' },
  { id: 5, name: 'Michael Brown', apartment: 'Luxury Penthouse', checkIn: '2023-06-25', checkOut: '2023-07-05', status: 'cancelled' },
];

const apartments = [
  { id: 1, name: 'Sea View Suite', type: 'Deluxe', occupancy: 4, status: 'available' },
  { id: 2, name: 'Mountain Retreat', type: 'Standard', occupancy: 2, status: 'occupied' },
  { id: 3, name: 'City Loft', type: 'Premium', occupancy: 3, status: 'maintenance' },
  { id: 4, name: 'Garden Villa', type: 'Deluxe', occupancy: 6, status: 'available' },
  { id: 5, name: 'Luxury Penthouse', type: 'Luxury', occupancy: 4, status: 'available' },
];

const occupancyData = [
  { name: 'Jan', occupancy: 65 },
  { name: 'Feb', occupancy: 59 },
  { name: 'Mar', occupancy: 80 },
  { name: 'Apr', occupancy: 81 },
  { name: 'May', occupancy: 76 },
  { name: 'Jun', occupancy: 92 },
  { name: 'Jul', occupancy: 95 },
];

const statusData = [
  { name: 'Confirmed', value: 75 },
  { name: 'Pending', value: 15 },
  { name: 'Cancelled', value: 10 },
];

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

const bookingColumns: GridColDef[] = [
  { field: 'name', headerName: 'Guest Name', width: 200 },
  { field: 'apartment', headerName: 'Apartment', width: 180 },
  { field: 'checkIn', headerName: 'Check-In', width: 150 },
  { field: 'checkOut', headerName: 'Check-Out', width: 150 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 130,
    renderCell: (params:any) => {
      let color: 'success' | 'warning' | 'error' | 'default' = 'default';
      if (params.value === 'confirmed') color = 'success';
      if (params.value === 'pending') color = 'warning';
      if (params.value === 'cancelled') color = 'error';
      
      return (
        <Chip 
          label={params.value} 
          color={color}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      );
    }
  },
  { 
    field: 'action', 
    headerName: 'Actions', 
    width: 100,
    renderCell: () => (
      <IconButton size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>
    )
  },
];

const apartmentColumns: GridColDef[] = [
  { field: 'name', headerName: 'Apartment Name', width: 200 },
  { field: 'type', headerName: 'Type', width: 150 },
  { field: 'occupancy', headerName: 'Occupancy', width: 120 },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 150,
    renderCell: (params) => {
      let color: 'success' | 'warning' | 'error' | 'default' = 'default';
      if (params.value === 'available') color = 'success';
      if (params.value === 'occupied') color = 'warning';
      if (params.value === 'maintenance') color = 'error';
      
      return (
        <Chip 
          label={params.value} 
          color={color}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      );
    }
  },
];

const Dashboard = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Booking Management Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="text.secondary" gutterBottom>
                    Total Bookings
                  </Typography>
                  <Typography variant="h4" component="div">
                    124
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowUpIcon color="success" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      12% from last month
                    </Typography>
                  </Box>
                </div>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <HotelIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="text.secondary" gutterBottom>
                    Active Guests
                  </Typography>
                  <Typography variant="h4" component="div">
                    42
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowUpIcon color="success" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      5% from last week
                    </Typography>
                  </Box>
                </div>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                  <PersonIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="text.secondary" gutterBottom>
                    Available Apartments
                  </Typography>
                  <Typography variant="h4" component="div">
                    8
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowDownIcon color="error" />
                    <Typography variant="body2" color="error.main" sx={{ ml: 0.5 }}>
                      2% from yesterday
                    </Typography>
                  </Box>
                </div>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <HotelIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Typography color="text.secondary" gutterBottom>
                    Occupancy Rate
                  </Typography>
                  <Typography variant="h4" component="div">
                    82%
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <ArrowUpIcon color="success" />
                    <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                      7% from last month
                    </Typography>
                  </Box>
                </div>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <CalendarIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardHeader title="Monthly Occupancy Rate" />
            <CardContent sx={{ height: 'calc(100% - 72px)' }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occupancy" fill="#4361ee" name="Occupancy %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardHeader title="Booking Status" />
            <CardContent sx={{ height: 'calc(100% - 72px)' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent } : any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Bookings */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid>
      <Card elevation={3}>
            <CardHeader 
              title="Recent Bookings" 
              action={
                <Button size="small" color="primary">
                  View All
                </Button>
              }
            />
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={recentBookings}
                columns={bookingColumns}
              />
            </Box>
          </Card>
        </Grid>

        <Grid>
          <Card elevation={3}>
            <CardHeader title="Upcoming Check-Ins" />
            <CardContent>
              <List sx={{ width: '100%' }}>
                {recentBookings.slice(0, 4).map((booking) => (
                  <React.Fragment key={booking.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          {booking.status === 'confirmed' ? (
                            <CheckCircleIcon color="success" />
                          ) : booking.status === 'pending' ? (
                            <WarningIcon color="warning" />
                          ) : (
                            <InfoIcon color="error" />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={booking.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              {booking.apartment}
                            </Typography>
                            {` — ${booking.checkIn}`}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Apartments */}
      <Grid container spacing={3}>
        <Grid>
          <Card elevation={3}>
            <CardHeader 
              title="Apartment Inventory" 
              subheader="Current status of all apartments"
              action={
                <Button size="small" color="primary">
                  Manage Apartments
                </Button>
              }
            />
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={apartments}
                columns={apartmentColumns}
                disableRowSelectionOnClick
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;