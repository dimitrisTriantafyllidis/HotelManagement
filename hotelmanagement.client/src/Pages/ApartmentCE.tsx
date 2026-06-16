import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Divider,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  IconButton, Chip, CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon, ArrowBack as BackIcon, AddAPhoto as PhotoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getApartment, createApartment, updateApartment,
  uploadApartmentPhotos, getApartmentPhotos, deleteApartmentPhoto, getApartmentPhotoUrl,
} from '../Services/ApartmentService';
import { ApartmentPhotoDto } from '../models/types';
import { useLanguage } from '../i18n/LanguageContext';

const propertyTypes = ['Apartment', 'Villa', 'Studio', 'Suite', 'House', 'Room'];
const amenityOptions = ['WiFi', 'AC', 'Parking', 'Pool', 'Kitchen', 'Washer', 'TV', 'Balcony', 'Sea View', 'Garden', 'BBQ', 'Fireplace'];

const ApartmentFormPage: React.FC = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<ApartmentPhotoDto[]>([]);
  const photoInputRef = React.useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '', location: '', description: '', maxGuests: 4,
    pricePerNight: 0, cleaningFee: 0, currency: 'EUR',
    bedrooms: 1, bathrooms: 1, areaSqMeters: '',
    propertyType: 'Apartment', amenities: [] as string[],
    doorCode: '', wifiSsid: '', wifiPassword: '',
    checkInHour: 15, checkOutHour: 11,
    address: '', city: '', postalCode: '', country: 'Greece',
    houseRules: '', checkInInstructions: '',
    isActive: true, photoUrls: [] as string[],
  });

  useEffect(() => {
    if (isEdit && id) loadApartment(id);
  }, [id]);

  const loadApartment = async (aptId: string) => {
    try {
      const data = await getApartment(aptId);
      let legacyPhotos: string[] = [];
      try { legacyPhotos = data.photoUrls ? JSON.parse(data.photoUrls) : []; } catch {}
      let amenities: string[] = [];
      try { amenities = data.amenities ? JSON.parse(data.amenities) : []; } catch {}

      setForm({
        name: data.name || '', location: data.location || '', description: data.description || '',
        maxGuests: data.maxGuests || 4, pricePerNight: data.pricePerNight || 0,
        cleaningFee: data.cleaningFee || 0, currency: data.currency || 'EUR',
        bedrooms: data.bedrooms || 1, bathrooms: data.bathrooms || 1,
        areaSqMeters: data.areaSqMeters?.toString() || '',
        propertyType: data.propertyType || 'Apartment', amenities,
        doorCode: data.doorCode || '', wifiSsid: data.wifiSsid || '', wifiPassword: data.wifiPassword || '',
        checkInHour: data.checkInHour || 15, checkOutHour: data.checkOutHour || 11,
        address: data.address || '', city: data.city || '', postalCode: data.postalCode || '',
        country: data.country || 'Greece',
        houseRules: data.houseRules || '', checkInInstructions: data.checkInInstructions || '',
        isActive: data.isActive ?? true, photoUrls: legacyPhotos,
      });

      // Load uploaded photos
      try {
        const photos = await getApartmentPhotos(aptId);
        setExistingPhotos(photos);
      } catch {}
    } catch { /* silently fail */ }
    setLoading(false);
  };

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setPendingFiles(prev => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };

  const handleRemovePendingFile = (idx: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingPhoto = async (photo: ApartmentPhotoDto) => {
    try {
      await deleteApartmentPhoto(photo.apartmentId, photo.id);
      setExistingPhotos(prev => prev.filter(p => p.id !== photo.id));
    } catch { /* silently fail */ }
  };

  const handleRemoveLegacyPhoto = (idx: number) => {
    setForm(prev => ({ ...prev, photoUrls: prev.photoUrls.filter((_, i) => i !== idx) }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        areaSqMeters: form.areaSqMeters ? parseFloat(form.areaSqMeters) : null,
        photoUrls: JSON.stringify(form.photoUrls),
        amenities: JSON.stringify(form.amenities),
      };

      let apartmentId = id;
      if (isEdit && id) {
        await updateApartment(id, { id, ...payload });
      } else {
        const created = await createApartment(payload);
        apartmentId = created.id;
      }

      // Upload pending photo files
      if (pendingFiles.length > 0 && apartmentId) {
        await uploadApartmentPhotos(apartmentId, pendingFiles);
      }

      navigate('/apartmentlist');
    } catch (err) {
      console.error('Save failed:', err);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#C4704B' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 880, mx: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <IconButton size="small" onClick={() => navigate('/apartmentlist')} sx={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 2 }}>
            <BackIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="h2" sx={{ color: 'var(--text-primary)' }}>{isEdit ? t('property.edit') : t('property.addNew')}</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 3, p: 3 }}>
          {/* Basic Info */}
          <SectionTitle title={t('property.name')} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }} >
              <TextField fullWidth label={t('property.name')} value={form.name}
                onChange={(e) => handleChange('name', e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} >
              <FormControl fullWidth size="small">
                <InputLabel>{t('property.type')}</InputLabel>
                <Select value={form.propertyType} label={t('property.type')}
                  onChange={(e) => handleChange('propertyType', e.target.value)}>
                  {propertyTypes.map(pt => <MenuItem key={pt} value={pt}>{pt}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12} >
              <TextField fullWidth label={t('property.description')} multiline rows={3}
                value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
            </Grid>
          </Grid>

          {/* Location */}
          <SectionTitle title={t('property.location')} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }} >
              <TextField fullWidth label={t('property.address')} value={form.address}
                onChange={(e) => handleChange('address', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} >
              <TextField fullWidth label={t('property.city')} value={form.city}
                onChange={(e) => handleChange('city', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }} >
              <TextField fullWidth label={t('property.country')} value={form.country}
                onChange={(e) => handleChange('country', e.target.value)} />
            </Grid>
          </Grid>

          {/* Pricing */}
          <SectionTitle title={t('booking.pricing')} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.pricePerNight')} type="number"
                value={form.pricePerNight} onChange={(e) => handleChange('pricePerNight', parseFloat(e.target.value) || 0)} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.cleaningFee')} type="number"
                value={form.cleaningFee} onChange={(e) => handleChange('cleaningFee', parseFloat(e.target.value) || 0)} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} >
              <FormControl fullWidth size="small">
                <InputLabel>Currency</InputLabel>
                <Select value={form.currency} label="Currency"
                  onChange={(e) => handleChange('currency', e.target.value)}>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Details */}
          <SectionTitle title="Details" />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.maxGuests')} type="number"
                value={form.maxGuests} onChange={(e) => handleChange('maxGuests', parseInt(e.target.value) || 1)} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.bedrooms')} type="number"
                value={form.bedrooms} onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 1)} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.bathrooms')} type="number"
                value={form.bathrooms} onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || 1)} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.area')} type="number"
                value={form.areaSqMeters} onChange={(e) => handleChange('areaSqMeters', e.target.value)} />
            </Grid>
          </Grid>

          {/* Amenities */}
          <SectionTitle title={t('property.amenities')} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {amenityOptions.map(amenity => (
              <Chip
                key={amenity}
                label={amenity}
                size="small"
                onClick={() => toggleAmenity(amenity)}
                sx={{
                  cursor: 'pointer',
                  bgcolor: form.amenities.includes(amenity) ? '#C4704B14' : 'transparent',
                  color: form.amenities.includes(amenity) ? '#C4704B' : 'var(--text-muted)',
                  border: `1px solid ${form.amenities.includes(amenity) ? '#C4704B30' : 'var(--border)'}`,
                  fontWeight: form.amenities.includes(amenity) ? 600 : 400,
                }}
              />
            ))}
          </Box>

          {/* Photos */}
          <SectionTitle title={t('property.photos')} />
          <input ref={photoInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" hidden onChange={handleAddPhotos} />
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
            {/* Existing uploaded photos */}
            {existingPhotos.map((photo) => (
              <Box key={photo.id} sx={{
                width: 100, height: 80, borderRadius: 2, overflow: 'hidden',
                position: 'relative', border: '1px solid var(--border)',
              }}>
                <Box component="img" src={getApartmentPhotoUrl(photo.apartmentId, photo.id)}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton size="small" onClick={() => handleRemoveExistingPhoto(photo)}
                  sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', width: 20, height: 20 }}>
                  <CloseIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}
            {/* Legacy URL photos */}
            {form.photoUrls.map((url, i) => (
              <Box key={`legacy-${i}`} sx={{
                width: 100, height: 80, borderRadius: 2, overflow: 'hidden',
                position: 'relative', border: '1px solid var(--border)',
              }}>
                <Box component="img" src={url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton size="small" onClick={() => handleRemoveLegacyPhoto(i)}
                  sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', width: 20, height: 20 }}>
                  <CloseIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}
            {/* Pending file previews */}
            {pendingFiles.map((file, i) => (
              <Box key={`pending-${i}`} sx={{
                width: 100, height: 80, borderRadius: 2, overflow: 'hidden',
                position: 'relative', border: '1px solid #C4704B40',
              }}>
                <Box component="img" src={URL.createObjectURL(file)}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <IconButton size="small" onClick={() => handleRemovePendingFile(i)}
                  sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', width: 20, height: 20 }}>
                  <CloseIcon sx={{ fontSize: 12 }} />
                </IconButton>
              </Box>
            ))}
            {/* Add photo button */}
            <Box
              onClick={() => photoInputRef.current?.click()}
              sx={{
                width: 100, height: 80, borderRadius: 2, cursor: 'pointer',
                border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: 'var(--bg-surface-secondary)',
                '&:hover': { borderColor: '#C4704B', bgcolor: '#C4704B08' },
              }}
            >
              <PhotoIcon sx={{ color: '#C4704B', fontSize: 24 }} />
            </Box>
          </Box>

          {/* Access & Check-in/out */}
          <SectionTitle title="Access & Check-in" />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.doorCode')} value={form.doorCode}
                onChange={(e) => handleChange('doorCode', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.wifi')} value={form.wifiSsid}
                onChange={(e) => handleChange('wifiSsid', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }} >
              <TextField fullWidth label={t('property.wifiPassword')} value={form.wifiPassword}
                onChange={(e) => handleChange('wifiPassword', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 3, md: 1.5 }} >
              <TextField fullWidth label={t('property.checkInHour')} type="number"
                value={form.checkInHour} onChange={(e) => handleChange('checkInHour', parseInt(e.target.value) || 15)} />
            </Grid>
            <Grid size={{ xs: 3, md: 1.5 }} >
              <TextField fullWidth label={t('property.checkOutHour')} type="number"
                value={form.checkOutHour} onChange={(e) => handleChange('checkOutHour', parseInt(e.target.value) || 11)} />
            </Grid>
          </Grid>

          {/* House Rules */}
          <SectionTitle title={t('property.houseRules')} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }} >
              <TextField fullWidth label={t('property.houseRules')} multiline rows={3}
                value={form.houseRules} onChange={(e) => handleChange('houseRules', e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} >
              <TextField fullWidth label={t('property.checkInInstructions')} multiline rows={3}
                value={form.checkInInstructions} onChange={(e) => handleChange('checkInInstructions', e.target.value)} />
            </Grid>
          </Grid>

          {/* Active toggle */}
          <FormControlLabel
            control={<Switch checked={form.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} />}
            label={form.isActive ? t('property.active') : t('property.inactive')}
            sx={{ mb: 3 }}
          />

          {/* Actions */}
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" startIcon={<BackIcon sx={{ fontSize: 16 }} />} onClick={() => navigate('/apartmentlist')}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" variant="contained" disabled={saving}
              startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveIcon sx={{ fontSize: 16 }} />}
              sx={{ bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } }}>
              {isEdit ? t('common.update') : t('common.create')}
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Typography variant="caption" sx={{ display: 'block', color: 'var(--text-muted)', mb: 1.5, mt: 1 }}>
    {title}
  </Typography>
);

export default ApartmentFormPage;
