import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  useTheme,
  Avatar,
  Stack,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CalendarToday,
  CalendarViewMonth,
  CalendarViewWeek,
  Today,
  ChevronLeft,
  ChevronRight,
  Person,
  Phone,
  Home,
  Edit,
  Delete,
  Description,
  Send,
  AddCircle,
  Search,
  FilterList,
  MoreVert,
  Refresh
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import elLocale from '@fullcalendar/core/locales/el';
import { EventClickArg } from '@fullcalendar/core';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface Appartment {
  appartmentName: string;
}

interface Booking {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfArrival: Date;
  dateOfDeparture: Date;
  appartment?: Appartment;
  otpCode?: string;
  status?: 'confirmed' | 'pending' | 'cancelled';
}

interface BookingListProps {
  bookings: Booking[];
}

const StatusChip = ({ status }: { status: string }) => {
  const theme = useTheme();
  const statusColors = {
    confirmed: theme.palette.success.main,
    pending: theme.palette.warning.main,
    cancelled: theme.palette.error.main
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: statusColors[status as keyof typeof statusColors] || theme.palette.grey[300],
        color: theme.palette.getContrastText(statusColors[status as keyof typeof statusColors] || theme.palette.grey[300]),
        textTransform: 'capitalize',
        fontWeight: 500
      }}
    />
  );
};

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
  const theme = useTheme();
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking =>
    `${booking.firstName} ${booking.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.phoneNumber.includes(searchTerm) ||
    booking.appartment?.appartmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'table' | 'calendar'
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleCalendarViewChange = (
    newView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'
  ) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
      setCalendarView(newView);
    }
  };

  const handleNavClick = (direction: 'prev' | 'next') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (direction === 'prev') {
        calendarApi.prev();
      } else {
        calendarApi.next();
      }
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    setSelectedBooking({
      id: info.event.extendedProps.id,
      firstName: info.event.title.split(' ')[0],
      lastName: info.event.title.split(' ')[1],
      phoneNumber: info.event.extendedProps.phone,
      dateOfArrival: new Date(info.event.start!),
      dateOfDeparture: new Date(info.event.end!),
      appartment: { appartmentName: info.event.title.match(/\((.*?)\)/)?.[1] || '' }
    });
  };

  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Handle delete logic here
    console.log('Deleting booking:', selectedBooking);
    setDeleteDialogOpen(false);
  };

  const calendarEvents = filteredBookings.map((booking: Booking) => ({
    title: `${booking.firstName} ${booking.lastName} (${booking.appartment?.appartmentName || ''})`,
    start: booking.dateOfArrival,
    end: booking.dateOfDeparture,
    extendedProps: {
      phone: booking.phoneNumber,
      id: booking.id,
      status: booking.status || 'confirmed'
    },
    backgroundColor: booking.status === 'confirmed' ? theme.palette.success.main :
                   booking.status === 'pending' ? theme.palette.warning.main :
                   booking.status === 'cancelled' ? theme.palette.error.main :
                   theme.palette.primary.main,
    borderColor: 'transparent',
    textColor: theme.palette.getContrastText(
      booking.status === 'confirmed' ? theme.palette.success.main :
      booking.status === 'pending' ? theme.palette.warning.main :
      booking.status === 'cancelled' ? theme.palette.error.main :
      theme.palette.primary.main
    )
  }));

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ 
              bgcolor: theme.palette.primary.main,
              width: 56, 
              height: 56 
            }}>
              <CalendarToday fontSize="medium" />
            </Avatar>
            <div>
              <Typography variant="h4" component="h1" fontWeight="bold">
                Booking Management
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Manage all your property bookings in one place
              </Typography>
            </div>
          </Stack>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            href="/BookingForm"
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4]
              }
            }}
          >
            New Booking
          </Button>
        </Box>

        {/* Toolbar Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
          >
            <ToggleButton 
              value="table" 
              aria-label="table view"
              sx={{
                textTransform: 'none',
                px: 3,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarViewWeek /> 
                <span>Table View</span>
              </Stack>
            </ToggleButton>
            <ToggleButton 
              value="calendar" 
              aria-label="calendar view"
              sx={{
                textTransform: 'none',
                px: 3,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarViewMonth /> 
                <span>Calendar View</span>
              </Stack>
            </ToggleButton>
          </ToggleButtonGroup>

          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
              sx={{ width: 300 }}
            />
            
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Filters
            </Button>
            
            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={() => setFilterMenuAnchor(null)}
            >
              <MenuItem>Confirmed</MenuItem>
              <MenuItem>Pending</MenuItem>
              <MenuItem>Cancelled</MenuItem>
            </Menu>
            
            <Tooltip title="Refresh data">
              <IconButton sx={{ borderRadius: 2 }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Main Content */}
        <Card sx={{ 
          borderRadius: 4,
          boxShadow: theme.shadows[3],
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`
        }}>
          {view === 'table' ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ 
                  backgroundColor: theme.palette.grey[100],
                  borderBottom: `2px solid ${theme.palette.divider}`
                }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Guest</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Dates</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Apartment</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow 
                      key={booking.id} 
                      hover
                      sx={{ '&:last-child td': { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ 
                            bgcolor: theme.palette.primary.light,
                            color: theme.palette.primary.dark,
                            width: 36,
                            height: 36
                          }}>
                            {booking.firstName.charAt(0)}{booking.lastName.charAt(0)}
                          </Avatar>
                          <div>
                            <Typography fontWeight={500}>
                              {booking.firstName} {booking.lastName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              #{booking.id.toString().padStart(5, '0')}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography>{booking.phoneNumber}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2">
                            {format(booking.dateOfArrival, 'MMM dd, yyyy')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            to {format(booking.dateOfDeparture, 'MMM dd, yyyy')}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={booking.appartment?.appartmentName || 'N/A'}
                          size="small"
                          sx={{ 
                            backgroundColor: theme.palette.grey[200],
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <StatusChip status={booking.status || 'confirmed'} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              sx={{ 
                                backgroundColor: theme.palette.primary.light,
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText
                                }
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              sx={{ 
                                backgroundColor: theme.palette.error.light,
                                color: theme.palette.error.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.error.main,
                                  color: theme.palette.error.contrastText
                                }
                              }}
                              onClick={() => handleDeleteClick(booking)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Check-In Form">
                            <IconButton
                              size="small"
                              sx={{ 
                                backgroundColor: 'lemonchiffon',
                                color: 'brown',
                                '&:hover': {
                                  backgroundColor: 'darkkhaki'
                                }
                              }}
                            >
                              <Description fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send OTP">
                            <IconButton
                              size="small"
                              sx={{ 
                                backgroundColor: theme.palette.secondary.light,
                                color: theme.palette.secondary.main,
                                '&:hover': {
                                  backgroundColor: theme.palette.secondary.main,
                                  color: theme.palette.secondary.contrastText
                                }
                              }}
                            >
                              <Send fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <CardContent sx={{ p: 0 }}>
              {/* Calendar View Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                p: 3,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <IconButton 
                    onClick={() => handleNavClick('prev')}
                    sx={{ borderRadius: 2 }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant="h6" component="div" id="calendarTitle" fontWeight={600}>
                    {calendarView === 'dayGridMonth' ? 
                      format(new Date(), 'MMMM yyyy') : 
                      'Calendar View'}
                  </Typography>
                  <IconButton 
                    onClick={() => handleNavClick('next')}
                    sx={{ borderRadius: 2 }}
                  >
                    <ChevronRight />
                  </IconButton>
                </Stack>
                
                <ToggleButtonGroup
                  value={calendarView}
                  exclusive
                  onChange={(e, newView) => newView && handleCalendarViewChange(newView)}
                  aria-label="calendar view"
                >
                  <ToggleButton 
                    value="dayGridMonth" 
                    aria-label="month view"
                    sx={{
                      textTransform: 'none',
                      px: 2,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }
                    }}
                  >
                    Month
                  </ToggleButton>
                  <ToggleButton 
                    value="timeGridWeek" 
                    aria-label="week view"
                    sx={{
                      textTransform: 'none',
                      px: 2,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }
                    }}
                  >
                    Week
                  </ToggleButton>
                  <ToggleButton 
                    value="timeGridDay" 
                    aria-label="day view"
                    sx={{
                      textTransform: 'none',
                      px: 2,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                      }
                    }}
                  >
                    Day
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              {/* Calendar Component */}
              <Box sx={{ p: 3 }}>
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  locales={[elLocale]}
                  locale="el"
                  headerToolbar={false}
                  height={600}
                  events={calendarEvents}
                  eventClick={handleEventClick}
                  datesSet={(info) => {
                    const titleElement = document.getElementById('calendarTitle');
                    if (titleElement) {
                      titleElement.textContent = format(info.view.currentStart, 'MMMM yyyy');
                    }
                  }}
                  eventContent={(arg) => (
                    <Box sx={{ 
                      p: 0.5, 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '0.8rem'
                    }}>
                      <strong>{arg.timeText}</strong> {arg.event.title}
                    </Box>
                  )}
                />
              </Box>
              
              {/* Calendar Legend */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 3,
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`
              }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: theme.palette.success.main,
                    borderRadius: '4px'
                  }} />
                  <Typography variant="body2">Confirmed</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: theme.palette.warning.main,
                    borderRadius: '4px'
                  }} />
                  <Typography variant="body2">Pending</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    width: 16, 
                    height: 16, 
                    backgroundColor: theme.palette.error.main,
                    borderRadius: '4px'
                  }} />
                  <Typography variant="body2">Cancelled</Typography>
                </Stack>
              </Box>
            </CardContent>
          )}
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the booking for {selectedBooking?.firstName} {selectedBooking?.lastName}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              sx={{ textTransform: 'none' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default BookingList;