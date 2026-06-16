import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Typography, Button, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem, Divider,
  IconButton, CircularProgress, Switch, FormControlLabel,
} from '@mui/material';
import {
  Save as SaveIcon, ArrowBack as BackIcon,
  Person as PersonIcon, CalendarToday as CalendarIcon,
  Euro as EuroIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { el, enUS } from 'date-fns/locale';
import { useSnackbar } from 'notistack';
import { ApartmentDto } from '../models/types';
import { createBooking, getBooking, updateBooking } from '../Services/BookingsService';
import { getApartments } from '../Services/ApartmentService';
import { useLanguage } from '../i18n/LanguageContext';

const platforms = ['Direct', 'Airbnb', 'Booking.com', 'VRBO', 'Other'];
const paymentMethods = ['Cash', 'Card', 'BankTransfer', 'Online'];
const statuses = ['Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'];

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const [apartments, setApartments] = useState<ApartmentDto[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    apartmentId: '', checkInDate: null as Date | null, checkOutDate: null as Date | null,
    guestFirstName: '', guestLastName: '', guestEmail: '', guestPhone: '',
    numberOfGuests: 1, guestCountry: '', pricePerNight: 0, cleaningFee: 0, currency: 'EUR',
    platformSource: 'Direct', paymentMethod: '', notes: '', status: 'Confirmed', isPaid: false,
  });

  useEffect(() => { getApartments().then(setApartments).catch(() => {}); }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getBooking(id).then((b) => {
        setForm({
          apartmentId: b.apartmentId, checkInDate: new Date(b.checkInDate), checkOutDate: new Date(b.checkOutDate),
          guestFirstName: b.guestFirstName || '', guestLastName: b.guestLastName || '',
          guestEmail: b.guestEmail || '', guestPhone: b.guestPhone || '',
          numberOfGuests: b.numberOfGuests || 1, guestCountry: b.guestCountry || '',
          pricePerNight: b.pricePerNight || 0, cleaningFee: b.cleaningFee || 0, currency: b.currency || 'EUR',
          platformSource: b.platformSource || 'Direct', paymentMethod: b.paymentMethod || '',
          notes: b.notes || '', status: b.status || 'Confirmed', isPaid: b.isPaid || false,
        });
      }).catch(() => enqueueSnackbar('Failed to load booking', { variant: 'error' })).finally(() => setLoading(false));
    }
  }, [id]);

  const selectedApartment = apartments.find(a => a.id === form.apartmentId);
  useEffect(() => {
    if (selectedApartment && !isEdit) {
      setForm(prev => ({ ...prev, pricePerNight: selectedApartment.pricePerNight || prev.pricePerNight, cleaningFee: selectedApartment.cleaningFee || prev.cleaningFee, currency: selectedApartment.currency || prev.currency }));
    }
  }, [form.apartmentId]);

  const nights = useMemo(() => {
    if (!form.checkInDate || !form.checkOutDate) return 0;
    return Math.max(1, Math.ceil((form.checkOutDate.getTime() - form.checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
  }, [form.checkInDate, form.checkOutDate]);

  const totalPrice = form.pricePerNight * nights + form.cleaningFee;
  const handleChange = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.apartmentId || !form.checkInDate || !form.checkOutDate) return;
    setSaving(true);
    try {
      if (isEdit && id) { await updateBooking(id, { id, ...form, checkInDate: form.checkInDate!.toISOString(), checkOutDate: form.checkOutDate!.toISOString(), totalPrice }); }
      else { await createBooking({ ...form, checkInDate: form.checkInDate!.toISOString(), checkOutDate: form.checkOutDate!.toISOString(), totalPrice }); }
      enqueueSnackbar(t('booking.saved'), { variant: 'success' }); navigate('/bookings');
    } catch { enqueueSnackbar(isEdit ? 'Failed to update booking' : 'Failed to create booking', { variant: 'error' }); }
    setSaving(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}><CircularProgress sx={{ color: '#C4704B' }} /></Box>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={language === 'el' ? el : enUS}>
      <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 880, mx: 'auto' }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <IconButton size="small" onClick={() => navigate(-1)} sx={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 2 }}>
              <BackIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography variant="h2" sx={{ color: 'var(--text-primary)' }}>{isEdit ? t('booking.edit') : t('booking.new')}</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 3, p: 3 }}>
            <SectionTitle icon={<PersonIcon />} title={t('booking.guestDetails')} />
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }} ><TextField fullWidth label={t('booking.guestFirstName')} value={form.guestFirstName} onChange={(e) => handleChange('guestFirstName', e.target.value)} required /></Grid>
              <Grid size={{ xs: 12, md: 6 }} ><TextField fullWidth label={t('booking.guestLastName')} value={form.guestLastName} onChange={(e) => handleChange('guestLastName', e.target.value)} required /></Grid>
              <Grid size={{ xs: 12, md: 4 }} ><TextField fullWidth label={t('booking.guestEmail')} type="email" value={form.guestEmail} onChange={(e) => handleChange('guestEmail', e.target.value)} /></Grid>
              <Grid size={{ xs: 12, md: 4 }} ><TextField fullWidth label={t('booking.guestPhone')} value={form.guestPhone} onChange={(e) => handleChange('guestPhone', e.target.value)} /></Grid>
              <Grid size={{ xs: 6, md: 2 }} ><TextField fullWidth label={t('booking.numberOfGuests')} type="number" value={form.numberOfGuests} onChange={(e) => handleChange('numberOfGuests', parseInt(e.target.value) || 1)} inputProps={{ min: 1, max: selectedApartment?.maxGuests || 20 }} /></Grid>
              <Grid size={{ xs: 6, md: 2 }} ><TextField fullWidth label={t('booking.guestCountry')} value={form.guestCountry} onChange={(e) => handleChange('guestCountry', e.target.value)} /></Grid>
            </Grid>

            <SectionTitle icon={<CalendarIcon />} title={t('booking.bookingDetails')} />
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 4 }} >
                <FormControl fullWidth required size="small"><InputLabel>{t('booking.apartment')}</InputLabel>
                  <Select value={form.apartmentId} label={t('booking.apartment')} onChange={(e) => handleChange('apartmentId', e.target.value)}>
                    {apartments.map(apt => <MenuItem key={apt.id} value={apt.id}>{apt.name} {apt.pricePerNight ? `(${apt.pricePerNight}/night)` : ''}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }} ><DatePicker label={t('booking.checkIn')} value={form.checkInDate} onChange={(v) => handleChange('checkInDate', v)} slotProps={{ textField: { fullWidth: true, size: 'small' } }} /></Grid>
              <Grid size={{ xs: 6, md: 4 }} ><DatePicker label={t('booking.checkOut')} value={form.checkOutDate} onChange={(v) => handleChange('checkOutDate', v)} minDate={form.checkInDate || undefined} slotProps={{ textField: { fullWidth: true, size: 'small' } }} /></Grid>
              <Grid size={{ xs: 6, md: 4 }} >
                <FormControl fullWidth size="small"><InputLabel>{t('booking.platform')}</InputLabel>
                  <Select value={form.platformSource} label={t('booking.platform')} onChange={(e) => handleChange('platformSource', e.target.value)}>
                    {platforms.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }} >
                <FormControl fullWidth size="small"><InputLabel>{t('booking.paymentMethod')}</InputLabel>
                  <Select value={form.paymentMethod} label={t('booking.paymentMethod')} onChange={(e) => handleChange('paymentMethod', e.target.value)}>
                    <MenuItem value="">-</MenuItem>{paymentMethods.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              {isEdit && (
                <>
                  <Grid size={{ xs: 6, md: 4 }} >
                    <FormControl fullWidth size="small"><InputLabel>{t('booking.status')}</InputLabel>
                      <Select value={form.status} label={t('booking.status')} onChange={(e) => handleChange('status', e.target.value)}>
                        {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 6, md: 4 }} >
                    <FormControlLabel control={<Switch checked={form.isPaid} onChange={(e) => handleChange('isPaid', e.target.checked)} />} label={t('booking.isPaid')} sx={{ mt: 0.5 }} />
                  </Grid>
                </>
              )}
              <Grid size={12} ><TextField fullWidth label={t('booking.notes')} multiline rows={2} value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} /></Grid>
            </Grid>

            <SectionTitle icon={<EuroIcon />} title={t('booking.pricing')} />
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 6, md: 3 }} ><TextField fullWidth label={t('booking.pricePerNight')} type="number" value={form.pricePerNight} onChange={(e) => handleChange('pricePerNight', parseFloat(e.target.value) || 0)} /></Grid>
              <Grid size={{ xs: 6, md: 3 }} ><TextField fullWidth label={t('booking.cleaningFee')} type="number" value={form.cleaningFee} onChange={(e) => handleChange('cleaningFee', parseFloat(e.target.value) || 0)} /></Grid>
            </Grid>

            {nights > 0 && (
              <Box sx={{ p: 2, borderRadius: 2, mb: 3, bgcolor: 'var(--bg-surface-secondary)', border: '1px solid var(--border)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{form.pricePerNight} x {nights} {t('booking.nights')}</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>{(form.pricePerNight * nights).toFixed(2)}</Typography>
                </Box>
                {form.cleaningFee > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{t('booking.cleaningFee')}</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>{form.cleaningFee.toFixed(2)}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t('booking.totalPrice')}</Typography>
                  <Typography sx={{ fontWeight: 700, color: '#22C55E' }}>{totalPrice.toFixed(2)}</Typography>
                </Box>
              </Box>
            )}

            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="outlined" startIcon={<BackIcon sx={{ fontSize: 16 }} />} onClick={() => navigate(-1)}>{t('common.back')}</Button>
              <Button type="submit" variant="contained" disabled={saving || !form.apartmentId}
                startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveIcon sx={{ fontSize: 16 }} />}
                sx={{ bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } }}>
                {isEdit ? t('common.update') : t('common.create')}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </LocalizationProvider>
  );
};

const SectionTitle: React.FC<{ title: string; icon?: React.ReactNode }> = ({ title, icon }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, mt: 1 }}>
    {icon && <Box sx={{ color: '#C4704B', display: 'flex', '& svg': { fontSize: 16 } }}>{icon}</Box>}
    <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{title}</Typography>
  </Box>
);

export default BookingForm;
