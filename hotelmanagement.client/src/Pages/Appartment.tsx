import React, { useState, useEffect } from 'react';
import {
  Box, Typography, IconButton, Chip, Skeleton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, TextField,
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Hotel as HotelIcon, Refresh as RefreshIcon, Search as SearchIcon,
  Bed as BedIcon, Bathtub as BathIcon, People as PeopleIcon,
  Euro as EuroIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getApartments, deleteApartment } from '../Services/ApartmentService';
import { ApartmentDto } from '../models/types';
import { useLanguage } from '../i18n/LanguageContext';

const ApartmentListPage: React.FC = () => {
  const [apartments, setApartments] = useState<ApartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ApartmentDto | null>(null);
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getApartments();
      setApartments(data);
    } catch { /* silently fail */ }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteApartment(deleteTarget.id);
      setApartments(prev => prev.filter(a => a.id !== deleteTarget.id));
    } catch { /* silently fail */ }
    setDeleteTarget(null);
  };

  const filtered = apartments.filter(a =>
    (a.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.city || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPhotos = (apt: ApartmentDto): string[] => {
    if (!apt.photoUrls) return [];
    try { return JSON.parse(apt.photoUrls); } catch { return []; }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ color: 'var(--text-primary)' }}>{t('property.management')}</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {apartments.length} {t('nav.properties').toLowerCase()}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => navigate('/apartmentform')}
            sx={{
              bgcolor: '#C4704B14', color: '#C4704B',
              border: '1px solid #C4704B20',
              borderRadius: 2, px: 2, fontSize: '0.8rem',
              '&:hover': { bgcolor: '#C4704B22' },
            }}
          >
            {t('property.addNew')}
          </Button>
          <IconButton onClick={loadData} size="small" sx={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 2 }}>
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder={t('common.search')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'var(--text-muted)', fontSize: 18 }} />,
        }}
        sx={{ mb: 3, maxWidth: 400 }}
      />

      {/* Property cards grid */}
      <Grid container spacing={2}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
              <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
            </Grid>
          ))
        ) : filtered.length === 0 ? (
          <Grid size={12} >
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <HotelIcon sx={{ fontSize: 48, color: 'var(--text-muted)', mb: 1 }} />
              <Typography sx={{ color: 'var(--text-secondary)' }}>{t('common.noResults')}</Typography>
            </Box>
          </Grid>
        ) : (
          filtered.map((apt, i) => {
            const photos = getPhotos(apt);
            return (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={apt.id}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Box sx={{
                    borderRadius: 3, overflow: 'hidden',
                    bgcolor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    opacity: apt.isActive ? 1 : 0.6,
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 'var(--shadow-md)',
                      borderColor: 'var(--border-strong)',
                    },
                  }}>
                    {/* Photo */}
                    <Box sx={{
                      height: 140, bgcolor: 'var(--bg-surface-secondary)',
                      backgroundImage: photos[0] ? `url(${photos[0]})` : 'none',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                    }}>
                      {!photos[0] && <HotelIcon sx={{ fontSize: 40, color: 'var(--text-muted)', opacity: 0.3 }} />}
                      {photos.length > 1 && (
                        <Chip label={`+${photos.length - 1}`} size="small"
                          sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.65rem' }} />
                      )}
                      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 0.5 }}>
                        <Tooltip title={t('common.edit')}>
                          <IconButton size="small" onClick={() => navigate(`/apartmentform/${apt.id}`)}
                            sx={{ bgcolor: 'rgba(0,0,0,0.4)', color: '#fff', '&:hover': { bgcolor: '#C4704BDD' } }}>
                            <EditIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('common.delete')}>
                          <IconButton size="small" onClick={() => setDeleteTarget(apt)}
                            sx={{ bgcolor: 'rgba(0,0,0,0.4)', color: '#fff', '&:hover': { bgcolor: '#EF4444DD' } }}>
                            <DeleteIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Details */}
                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                            {apt.name || 'Unnamed'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            {apt.city ? `${apt.city}, ${apt.country || ''}` : apt.location || 'No location'}
                          </Typography>
                        </Box>
                        <Chip
                          label={apt.isActive ? t('property.active') : t('property.inactive')}
                          size="small"
                          sx={{
                            bgcolor: apt.isActive ? '#22C55E18' : '#9B9BAF18',
                            color: apt.isActive ? '#22C55E' : 'var(--text-muted)',
                            border: `1px solid ${apt.isActive ? '#22C55E30' : 'var(--border)'}`,
                            fontWeight: 600, fontSize: '0.625rem',
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EuroIcon sx={{ fontSize: 14, color: '#C4704B' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#C4704B' }}>
                            {apt.pricePerNight || 0}/{language === 'el' ? 'night' : 'night'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BedIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>{apt.bedrooms}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BathIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>{apt.bathrooms}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 14, color: 'var(--text-muted)' }} />
                          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>{apt.maxGuests}</Typography>
                        </Box>
                      </Box>

                      {apt.propertyType && (
                        <Chip label={apt.propertyType} size="small" sx={{
                          mt: 1, bgcolor: '#C4704B14', color: '#C4704B',
                          border: '1px solid #C4704B20',
                          fontSize: '0.625rem', fontWeight: 600,
                        }} />
                      )}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>{t('common.delete')}</DialogTitle>
        <DialogContent>
          <Typography>{t('property.deleteConfirm')}</Typography>
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>{deleteTarget?.name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>{t('common.cancel')}</Button>
          <Button onClick={handleDelete} color="error" variant="contained">{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApartmentListPage;
