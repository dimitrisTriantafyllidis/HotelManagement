import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, CircularProgress, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, IconButton,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  PictureAsPdf as PdfIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { getPendingCheckIns, getAllCheckIns, approveCheckIn, rejectCheckIn, downloadCheckInPdf, getIdDocumentUrl, getSelfieUrl } from '../Services/CheckInSessionService';
import { CheckInSessionDto } from '../models/types';
import { useLanguage } from '../i18n/LanguageContext';

const AdminCheckInReview: React.FC = () => {
  const { t } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const [sessions, setSessions] = useState<CheckInSessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CheckInSessionDto | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [pdfLanguage, setPdfLanguage] = useState<'en' | 'el'>('en');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = showAll ? await getAllCheckIns() : await getPendingCheckIns();
      setSessions(data);
    } catch {
      enqueueSnackbar(t('admin.actionFailed'), { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(); }, [showAll]);

  const handleAction = async () => {
    if (!selectedSession || !actionType) return;
    setActionLoading(true);
    try {
      if (actionType === 'approve') {
        await approveCheckIn(selectedSession.id, notes || undefined);
      } else {
        await rejectCheckIn(selectedSession.id, notes || undefined);
      }
      setDialogOpen(false);
      setNotes('');
      setSelectedSession(null);
      enqueueSnackbar(t('admin.actionSuccess'), { variant: 'success' });
      fetchSessions();
    } catch {
      enqueueSnackbar(t('admin.actionFailed'), { variant: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPdf = async (id: string, lang: string = pdfLanguage) => {
    try {
      const blob = await downloadCheckInPdf(id, lang);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CheckIn_${id}_${lang}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      enqueueSnackbar(t('admin.pdfFailed'), { variant: 'error' });
    }
  };

  const openDialog = (session: CheckInSessionDto, type: 'approve' | 'reject') => {
    setSelectedSession(session);
    setActionType(type);
    setNotes('');
    setDialogOpen(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1100, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h2" sx={{ color: 'var(--text-primary)' }}>{t('admin.checkinReview')}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant={showAll ? 'outlined' : 'contained'} size="small" onClick={() => setShowAll(false)}
            sx={!showAll ? { bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } } : {}}>
            {t('admin.pending')}
          </Button>
          <Button variant={showAll ? 'contained' : 'outlined'} size="small" onClick={() => setShowAll(true)}
            sx={showAll ? { bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } } : {}}>
            {t('admin.showAll')}
          </Button>
          <IconButton onClick={fetchSessions} size="small" sx={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 2 }}>
            <RefreshIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress sx={{ color: '#C4704B' }} /></Box>
      ) : sessions.length === 0 ? (
        <Typography sx={{ color: 'var(--text-secondary)', textAlign: 'center', py: 4 }}>
          {showAll ? t('admin.noSessions') : t('admin.noPendingSessions')}
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {sessions.map((session) => (
            <Grid size={12} key={session.id}>
              <Box sx={{
                borderRadius: 3, border: '1px solid var(--border)', bgcolor: 'var(--bg-surface)',
                p: 3, transition: 'all 0.15s ease',
                '&:hover': { borderColor: 'var(--border-strong)', boxShadow: 'var(--shadow-sm)' },
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: 1, minWidth: 280 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                        {session.fatherName || session.identityNo || 'Guest'}
                      </Typography>
                      <StatusChip session={session} t={t} />
                    </Box>

                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      <InfoItem label={t('admin.bookingId')} value={session.bookingId} />
                      <InfoItem label={t('admin.identityNo')} value={session.identityNo} />
                      <InfoItem label={t('admin.fatherName')} value={session.fatherName} />
                      <InfoItem label={t('admin.motherName')} value={session.motherName} />
                      <InfoItem label={t('admin.dateOfBirth')} value={session.dateOfBirth ? new Date(session.dateOfBirth).toLocaleDateString() : undefined} />
                      <InfoItem label={t('admin.nationality')} value={session.nationality} />
                      <InfoItem label={t('admin.country')} value={session.countryOfOrigin} />
                      <InfoItem label={t('admin.address')} value={session.address} />
                      <InfoItem label={t('admin.submitted')} value={session.verifiedAt ? new Date(session.verifiedAt).toLocaleString() : undefined} />
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Button size="small" variant="outlined" startIcon={<ViewIcon sx={{ fontSize: 14 }} />}
                        onClick={() => window.open(getIdDocumentUrl(session.id), '_blank')}>
                        {t('admin.idDocument')}
                      </Button>
                      <Button size="small" variant="outlined" startIcon={<ViewIcon sx={{ fontSize: 14 }} />}
                        onClick={() => window.open(getSelfieUrl(session.id), '_blank')}>
                        {t('admin.selfie')}
                      </Button>
                      {session.signatureData && (
                        <Button size="small" variant="outlined" startIcon={<ViewIcon sx={{ fontSize: 14 }} />}
                          onClick={() => {
                            const w = window.open('', '_blank');
                            if (w) { w.document.write(`<img src="data:image/png;base64,${session.signatureData}" />`); }
                          }}>
                          {t('admin.signatureLabel')}
                        </Button>
                      )}
                      {session.isAdminApproved && (
                        <>
                          <Button size="small" variant="outlined" startIcon={<PdfIcon sx={{ fontSize: 14 }} />}
                            onClick={() => handleDownloadPdf(session.id)}>
                            {t('admin.downloadPdf')}
                          </Button>
                          <Box sx={{ display: 'flex', gap: 0.5, ml: 0.5 }}>
                            <Chip label="EN" size="small" clickable
                              onClick={() => { setPdfLanguage('en'); handleDownloadPdf(session.id, 'en'); }}
                              sx={{ fontWeight: 600, fontSize: '0.625rem', bgcolor: pdfLanguage === 'en' ? '#C4704B18' : 'transparent', color: pdfLanguage === 'en' ? '#C4704B' : 'var(--text-muted)', border: '1px solid var(--border)' }} />
                            <Chip label="EL" size="small" clickable
                              onClick={() => { setPdfLanguage('el'); handleDownloadPdf(session.id, 'el'); }}
                              sx={{ fontWeight: 600, fontSize: '0.625rem', bgcolor: pdfLanguage === 'el' ? '#C4704B18' : 'transparent', color: pdfLanguage === 'el' ? '#C4704B' : 'var(--text-muted)', border: '1px solid var(--border)' }} />
                          </Box>
                        </>
                      )}
                    </Box>

                    {session.adminNotes && (
                      <Typography variant="body2" sx={{ color: 'var(--text-muted)', mt: 1, fontStyle: 'italic', fontSize: '0.8125rem' }}>
                        {t('admin.adminNotes')}: {session.adminNotes}
                      </Typography>
                    )}
                  </Box>

                  {session.isVerified && !session.isAdminApproved && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button variant="contained" startIcon={<ApproveIcon sx={{ fontSize: 16 }} />}
                        onClick={() => openDialog(session, 'approve')}
                        sx={{ bgcolor: '#22C55E', '&:hover': { bgcolor: '#16A34A' } }}>
                        {t('admin.approve')}
                      </Button>
                      <Button variant="outlined" color="error" startIcon={<RejectIcon sx={{ fontSize: 16 }} />}
                        onClick={() => openDialog(session, 'reject')}>
                        {t('admin.reject')}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' ? t('admin.approveCheckin') : t('admin.rejectCheckin')}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
            {actionType === 'approve' ? t('admin.approveMessage') : t('admin.rejectMessage')}
          </Typography>
          <TextField fullWidth multiline rows={3} label={t('admin.notes')}
            value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder={actionType === 'reject' ? t('admin.rejectReason') : t('admin.anyNotes')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleAction} disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : null}
            sx={actionType === 'approve'
              ? { bgcolor: '#22C55E', '&:hover': { bgcolor: '#16A34A' } }
              : { bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }
            }>
            {actionType === 'approve' ? t('admin.approve') : t('admin.reject')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const StatusChip: React.FC<{ session: CheckInSessionDto; t: (key: any) => string }> = ({ session, t }) => {
  if (session.isAdminApproved) return <Chip label={t('admin.status.approved')} size="small"
    sx={{ bgcolor: '#22C55E18', color: '#22C55E', border: '1px solid #22C55E30', fontWeight: 600, fontSize: '0.625rem' }} />;
  if (session.isVerified) return <Chip label={t('admin.status.pendingApproval')} size="small"
    sx={{ bgcolor: '#EAB30818', color: '#EAB308', border: '1px solid #EAB30830', fontWeight: 600, fontSize: '0.625rem' }} />;
  if (session.adminNotes && !session.isVerified) return <Chip label={t('admin.status.rejected')} size="small"
    sx={{ bgcolor: '#EF444418', color: '#EF4444', border: '1px solid #EF444430', fontWeight: 600, fontSize: '0.625rem' }} />;
  return <Chip label={t('admin.status.inProgress')} size="small"
    sx={{ bgcolor: 'var(--bg-surface-secondary)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 600, fontSize: '0.625rem' }} />;
};

const InfoItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} >
      <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.8125rem' }}>{value}</Typography>
    </Grid>
  );
};

export default AdminCheckInReview;
