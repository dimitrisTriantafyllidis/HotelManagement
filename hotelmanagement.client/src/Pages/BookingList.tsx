import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  ToggleButton, ToggleButtonGroup, Typography, useTheme, Avatar, Stack,
  Chip, Tooltip, TextField, InputAdornment, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Skeleton,
  Switch, FormControlLabel,
} from '@mui/material';
import {
  CalendarViewMonth, CalendarViewWeek,
  ChevronLeft, ChevronRight, Edit, Delete, Description, Send,
  AddCircle, Search, FilterList, Refresh, PictureAsPdf,
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import elLocale from '@fullcalendar/core/locales/el';
import { EventClickArg } from '@fullcalendar/core';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { getBookings, deleteBooking, downloadBookingCheckInPdf, sendBookingNotification } from '../Services/BookingsService';
import { BookingDto } from '../models/types';
import { useLanguage } from '../i18n/LanguageContext';

const StatusChip = ({ status, t }: { status: string; t: (key: any) => string }) => {
  const theme = useTheme();
  const statusColors: Record<string, string> = {
    confirmed: theme.palette.success.main,
    pending: theme.palette.warning.main,
    cancelled: theme.palette.error.main,
    checkedin: theme.palette.info.main,
    checkedout: theme.palette.grey[500],
  };
  const color = statusColors[status.toLowerCase()] || theme.palette.grey[400];
  const statusLabels: Record<string, string> = {
    confirmed: t('booking.status.confirmed'), checkedin: t('booking.status.checkedIn'),
    checkedout: t('booking.status.checkedOut'), cancelled: t('booking.status.cancelled'),
    pending: t('booking.status.pending'),
  };
  return <Chip label={statusLabels[status.toLowerCase()] || status} size="small"
    sx={{ bgcolor: `${color}18`, color, fontWeight: 600, border: `1px solid ${color}30` }} />;
};

const BookingList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [calendarView, setCalendarView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(null);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [notifyForm, setNotifyForm] = useState({ subject: '', message: '', sendEmail: true, sendSms: false });
  const [notifySending, setNotifySending] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setLoading(true);
    try { setBookings(await getBookings()); }
    catch { enqueueSnackbar('Failed to load bookings', { variant: 'error' }); }
    finally { setLoading(false); }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = !searchTerm ||
      `${b.guestFirstName} ${b.guestLastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.guestPhone || '').includes(searchTerm) ||
      (b.apartmentName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || (b.status || '').toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => (b.status || '').toLowerCase() === 'confirmed').length;
  const pendingBookings = bookings.filter(b => (b.status || '').toLowerCase() === 'pending' || (b.status || '').toLowerCase() === 'checkedin').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const handleDeleteClick = (booking: BookingDto) => { setSelectedBooking(booking); setDeleteDialogOpen(true); };
  const handleDeleteConfirm = async () => {
    if (!selectedBooking) return;
    try { await deleteBooking(selectedBooking.id); setBookings(prev => prev.filter(b => b.id !== selectedBooking.id)); enqueueSnackbar(t('booking.deleted'), { variant: 'success' }); }
    catch { enqueueSnackbar('Failed to delete booking', { variant: 'error' }); }
    setDeleteDialogOpen(false); setSelectedBooking(null);
  };
  const handleCheckInAction = (booking: BookingDto) => {
    if (booking.checkIn) { navigate('/checkin-review'); }
    else { navigator.clipboard.writeText(`${window.location.origin}/guest-checkin?bookingId=${booking.id}`); enqueueSnackbar(t('booking.copyCheckInLink'), { variant: 'info' }); }
  };
  const handleDownloadPdf = async (booking: BookingDto) => {
    try { const blob = await downloadBookingCheckInPdf(booking.id); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `CheckIn_${booking.id}.pdf`; a.click(); URL.revokeObjectURL(url); }
    catch { enqueueSnackbar(t('booking.noPdf'), { variant: 'warning' }); }
  };
  const handleOpenNotify = (booking: BookingDto) => { setSelectedBooking(booking); setNotifyForm({ subject: '', message: '', sendEmail: true, sendSms: false }); setNotifyDialogOpen(true); };
  const handleSendNotification = async () => {
    if (!selectedBooking) return; setNotifySending(true);
    try { await sendBookingNotification(selectedBooking.id, notifyForm); enqueueSnackbar(t('booking.notificationSent'), { variant: 'success' }); setNotifyDialogOpen(false); }
    catch { enqueueSnackbar('Failed to send notification', { variant: 'error' }); }
    setNotifySending(false);
  };

  const calendarEvents = filteredBookings.map((b) => ({
    title: `${b.guestFirstName} ${b.guestLastName} (${b.apartmentName || ''})`,
    start: b.checkInDate, end: b.checkOutDate,
    extendedProps: { id: b.id, status: b.status || 'confirmed' },
    backgroundColor: (b.status || '').toLowerCase() === 'confirmed' ? theme.palette.success.main : (b.status || '').toLowerCase() === 'cancelled' ? theme.palette.error.main : theme.palette.warning.main,
    borderColor: 'transparent',
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h2" sx={{ color: 'var(--text-primary)' }}>{t('booking.management')}</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{t('booking.subtitle')}</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddCircle sx={{ fontSize: 16 }} />} onClick={() => navigate('/bookingform')}
            sx={{ bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } }}>
            {t('booking.new')}
          </Button>
        </Box>

        {/* Stats Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          {loading ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={76} sx={{ borderRadius: 3 }} />
          )) : [
            { label: t('booking.total'), value: totalBookings, color: '#C4704B' },
            { label: t('booking.confirmed'), value: confirmedBookings, color: '#22C55E' },
            { label: t('booking.pending'), value: pendingBookings, color: '#EAB308' },
            { label: t('booking.revenue'), value: `${totalRevenue.toFixed(0)}`, color: '#3B82F6' },
          ].map((stat) => (
            <Box key={stat.label} sx={{
              p: 2, borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)',
              transition: 'all 0.15s ease', '&:hover': { borderColor: 'var(--border-strong)' },
            }}>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{stat.label}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
            </Box>
          ))}
        </Box>

        {/* Toolbar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
          <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small">
            <ToggleButton value="table" sx={{ px: 2, '&.Mui-selected': { bgcolor: '#C4704B', color: '#fff', '&:hover': { bgcolor: '#A85A38' } } }}>
              <CalendarViewWeek sx={{ fontSize: 16, mr: 0.5 }} /> {t('booking.tableView')}
            </ToggleButton>
            <ToggleButton value="calendar" sx={{ px: 2, '&.Mui-selected': { bgcolor: '#C4704B', color: '#fff', '&:hover': { bgcolor: '#A85A38' } } }}>
              <CalendarViewMonth sx={{ fontSize: 16, mr: 0.5 }} /> {t('booking.calendarView')}
            </ToggleButton>
          </ToggleButtonGroup>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField variant="outlined" size="small" placeholder={t('booking.search')}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16, color: 'var(--text-muted)' }} /></InputAdornment> }}
              sx={{ width: 240 }} />
            <Button variant="outlined" size="small" startIcon={<FilterList sx={{ fontSize: 16 }} />}
              onClick={(e) => setFilterMenuAnchor(e.currentTarget)}>
              {t('common.filters')}{statusFilter ? `: ${statusFilter}` : ''}
            </Button>
            <Menu anchorEl={filterMenuAnchor} open={Boolean(filterMenuAnchor)} onClose={() => setFilterMenuAnchor(null)}>
              <MenuItem onClick={() => { setStatusFilter(null); setFilterMenuAnchor(null); }}>{t('common.all')}</MenuItem>
              <MenuItem onClick={() => { setStatusFilter('Confirmed'); setFilterMenuAnchor(null); }}>{t('booking.status.confirmed')}</MenuItem>
              <MenuItem onClick={() => { setStatusFilter('Pending'); setFilterMenuAnchor(null); }}>{t('booking.status.pending')}</MenuItem>
              <MenuItem onClick={() => { setStatusFilter('CheckedIn'); setFilterMenuAnchor(null); }}>{t('booking.status.checkedIn')}</MenuItem>
              <MenuItem onClick={() => { setStatusFilter('Cancelled'); setFilterMenuAnchor(null); }}>{t('booking.status.cancelled')}</MenuItem>
            </Menu>
            <Tooltip title={t('common.refresh')}>
              <IconButton size="small" onClick={loadBookings} sx={{ border: '1px solid var(--border)', borderRadius: 2 }}>
                <Refresh sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Data Table / Calendar */}
        <Card>
          {view === 'table' ? (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('booking.guest')}</TableCell>
                    <TableCell>{t('booking.contact')}</TableCell>
                    <TableCell>{t('booking.dates')}</TableCell>
                    <TableCell>{t('booking.apartment')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                    <TableCell align="right">{t('common.actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => (<TableCell key={j}><Skeleton variant="text" /></TableCell>))}</TableRow>
                  )) : filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ bgcolor: '#C4704B18', color: '#C4704B', width: 32, height: 32, fontSize: '0.75rem' }}>
                            {(booking.guestFirstName || '?').charAt(0)}{(booking.guestLastName || '').charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 500, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{booking.guestFirstName} {booking.guestLastName}</Typography>
                            <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>#{booking.id.substring(0, 8)}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{booking.guestPhone || '-'}</Typography>
                        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>{booking.guestEmail || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.8125rem', color: 'var(--text-primary)' }}>{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</Typography>
                        <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>to {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={booking.apartmentName || 'N/A'} size="small"
                          sx={{ bgcolor: 'var(--bg-surface-secondary)', border: '1px solid var(--border)', fontWeight: 500 }} />
                      </TableCell>
                      <TableCell><StatusChip status={booking.status || 'confirmed'} t={t} /></TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          {[
                            { icon: <Edit />, tip: t('common.edit'), onClick: () => navigate(`/bookingform/${booking.id}`), color: '#C4704B' },
                            { icon: <Delete />, tip: t('common.delete'), onClick: () => handleDeleteClick(booking), color: '#EF4444' },
                            { icon: <Description />, tip: 'Check-In', onClick: () => handleCheckInAction(booking), color: '#EAB308' },
                            { icon: <PictureAsPdf />, tip: t('booking.downloadPdf'), onClick: () => handleDownloadPdf(booking), color: '#3B82F6' },
                            { icon: <Send />, tip: t('booking.sendNotification'), onClick: () => handleOpenNotify(booking), color: '#22C55E' },
                          ].map((action, idx) => (
                            <Tooltip key={idx} title={action.tip}>
                              <IconButton size="small" onClick={action.onClick}
                                sx={{ color: 'var(--text-muted)', '&:hover': { color: action.color, bgcolor: `${action.color}10` } }}>
                                {React.cloneElement(action.icon, { sx: { fontSize: 16 } })}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid var(--border)' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton size="small" onClick={() => { calendarRef.current?.getApi()?.prev(); }}><ChevronLeft /></IconButton>
                  <Typography variant="h6" id="calendarTitle" fontWeight={600}>{format(new Date(), 'MMMM yyyy')}</Typography>
                  <IconButton size="small" onClick={() => { calendarRef.current?.getApi()?.next(); }}><ChevronRight /></IconButton>
                </Stack>
                <ToggleButtonGroup value={calendarView} exclusive size="small"
                  onChange={(_, nv) => { if (nv) { calendarRef.current?.getApi()?.changeView(nv); setCalendarView(nv); } }}>
                  {(['dayGridMonth', 'timeGridWeek', 'timeGridDay'] as const).map(v => (
                    <ToggleButton key={v} value={v} sx={{ px: 1.5, '&.Mui-selected': { bgcolor: '#C4704B', color: '#fff' } }}>
                      {v === 'dayGridMonth' ? 'Month' : v === 'timeGridWeek' ? 'Week' : 'Day'}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
              <Box sx={{ p: 2 }}>
                <FullCalendar ref={calendarRef} plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth" locales={[elLocale]} locale="el" headerToolbar={false} height={550}
                  events={calendarEvents}
                  eventClick={(info: EventClickArg) => navigate(`/bookingform/${info.event.extendedProps.id}`)}
                  datesSet={(info) => { const el = document.getElementById('calendarTitle'); if (el) el.textContent = format(info.view.currentStart, 'MMMM yyyy'); }}
                  eventContent={(arg) => (
                    <Box sx={{ p: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.75rem' }}>
                      <strong>{arg.timeText}</strong> {arg.event.title}
                    </Box>
                  )}
                />
              </Box>
            </CardContent>
          )}
        </Card>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>{t('common.delete')}</DialogTitle>
          <DialogContent>
            <Typography variant="body2">{t('booking.confirmDelete')}</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: 'var(--text-primary)' }}>
              {selectedBooking?.guestFirstName} {selectedBooking?.guestLastName}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">{t('common.delete')}</Button>
          </DialogActions>
        </Dialog>

        {/* Notification Dialog */}
        <Dialog open={notifyDialogOpen} onClose={() => setNotifyDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{t('booking.sendNotification')}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
              {selectedBooking?.guestFirstName} {selectedBooking?.guestLastName} ({selectedBooking?.guestEmail || 'No email'})
            </Typography>
            <TextField fullWidth label={t('booking.notificationSubject')} value={notifyForm.subject}
              onChange={(e) => setNotifyForm(prev => ({ ...prev, subject: e.target.value }))} sx={{ mb: 2 }} />
            <TextField fullWidth label={t('booking.notificationMessage')} multiline rows={4}
              value={notifyForm.message} onChange={(e) => setNotifyForm(prev => ({ ...prev, message: e.target.value }))} sx={{ mb: 2 }} />
            <Stack direction="row" spacing={2}>
              <FormControlLabel control={<Switch checked={notifyForm.sendEmail} onChange={(e) => setNotifyForm(prev => ({ ...prev, sendEmail: e.target.checked }))} />} label={t('booking.sendEmail')} />
              <FormControlLabel control={<Switch checked={notifyForm.sendSms} onChange={(e) => setNotifyForm(prev => ({ ...prev, sendSms: e.target.checked }))} />} label={t('booking.sendSms')} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNotifyDialogOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSendNotification} variant="contained" disabled={notifySending || !notifyForm.subject}
              sx={{ bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } }}>{t('booking.sendNotification')}</Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
};

export default BookingList;
