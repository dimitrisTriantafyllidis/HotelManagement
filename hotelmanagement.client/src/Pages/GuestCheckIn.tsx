import React, { useState, useRef } from 'react';
import {
  Typography, TextField, Button, Box, Stepper, Step, StepLabel,
  Alert, CircularProgress, Divider, StepConnector, stepConnectorClasses,
  styled, Grid
} from '@mui/material';
import {
  Badge as BadgeIcon,
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  CloudUpload as CloudUploadIcon,
  ArrowForward as ArrowIcon,
  ArrowBack as BackIcon,
  Verified as VerifiedIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import SignatureCanvas from 'react-signature-canvas';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { createCheckInSession, signCheckInSession, verifyCheckInSession, uploadIdDocument, uploadSelfie } from '../Services/CheckInSessionService';
import { useLanguage } from '../i18n/LanguageContext';

const WarmConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 20 },
  [`&.${stepConnectorClasses.active}`]: { [`& .${stepConnectorClasses.line}`]: { background: 'linear-gradient(90deg, #C4704B 0%, #EAB308 100%)' } },
  [`&.${stepConnectorClasses.completed}`]: { [`& .${stepConnectorClasses.line}`]: { background: 'linear-gradient(90deg, #22C55E 0%, #86EFAC 100%)' } },
  [`& .${stepConnectorClasses.line}`]: { height: 3, border: 0, backgroundColor: 'var(--border)', borderRadius: 2 },
}));

const StepIcon: React.FC<{ active: boolean; completed: boolean; icon: React.ReactNode; step: number }> = ({ active, completed }) => (
  <Box sx={{
    width: 40, height: 40, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
    bgcolor: completed ? '#22C55E' : active ? '#C4704B' : 'var(--bg-surface-secondary)',
    color: completed || active ? '#fff' : 'var(--text-muted)',
    transition: 'all 0.3s ease',
    fontSize: '0.875rem', fontWeight: 700,
  }}>
    {completed ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : null}
  </Box>
);

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const GuestCheckIn: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const idFileRef = useRef<HTMLInputElement>(null);
  const selfieFileRef = useRef<HTMLInputElement>(null);

  const steps = [
    t('checkin.step.verifyIdentity'),
    t('checkin.step.personalDetails'),
    t('checkin.step.signTerms'),
    t('checkin.step.submitted'),
  ];

  const formik = useFormik({
    initialValues: {
      bookingId: '',
      idDocumentUrl: '',
      selfieUrl: '',
      fatherName: '',
      motherName: '',
      identityNo: '',
      dateOfBirth: '',
      nationality: '',
      countryOfOrigin: '',
      address: '',
    },
    validationSchema: yup.object({
      bookingId: yup.string().required(t('checkin.bookingIdRequired')),
      fatherName: yup.string().required(t('checkin.fatherNameRequired')),
      motherName: yup.string().required(t('checkin.motherNameRequired')),
      identityNo: yup.string().required(t('checkin.identityNoRequired')),
      dateOfBirth: yup.string().required(t('checkin.dateOfBirthRequired')),
      nationality: yup.string().required(t('checkin.nationalityRequired')),
      countryOfOrigin: yup.string().required(t('checkin.countryRequired')),
      address: yup.string().required(t('checkin.addressRequired')),
    }),
    onSubmit: () => {},
  });

  const handleStep0Submit = async () => {
    formik.setFieldTouched('bookingId', true);
    if (!formik.values.bookingId) return;
    setDirection(1);
    setActiveStep(1);
  };

  const handleStep1Submit = async () => {
    const personalFields = ['fatherName', 'motherName', 'identityNo', 'dateOfBirth', 'nationality', 'countryOfOrigin', 'address'] as const;
    personalFields.forEach(f => formik.setFieldTouched(f, true));
    const errors = await formik.validateForm();
    const hasPersonalErrors = personalFields.some(f => errors[f]);
    if (hasPersonalErrors) return;

    setLoading(true);
    setError('');
    try {
      const session = await createCheckInSession({
        bookingId: formik.values.bookingId,
        hasSignedTerms: false,
        fatherName: formik.values.fatherName,
        motherName: formik.values.motherName,
        identityNo: formik.values.identityNo,
        dateOfBirth: formik.values.dateOfBirth || undefined,
        nationality: formik.values.nationality,
        countryOfOrigin: formik.values.countryOfOrigin,
        address: formik.values.address,
      });
      setSessionId(session.id);

      // Upload files via multipart endpoints
      if (idFile) await uploadIdDocument(session.id, idFile);
      if (selfieFile) await uploadSelfie(session.id, selfieFile);

      setDirection(1);
      setActiveStep(2);
    } catch (err: any) {
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : msg?.title || 'Failed to create check-in session.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (type === 'id') {
      setIdFile(file);
      setIdPreview(previewUrl);
    } else {
      setSelfieFile(file);
      setSelfiePreview(previewUrl);
    }
  };

  const handleSignAndVerify = async () => {
    if (!sessionId) return;
    if (signatureRef.current?.isEmpty()) { setError(t('checkin.signatureRequired')); return; }
    setLoading(true);
    setError('');
    try {
      const signatureData = signatureRef.current!.toDataURL('image/png');
      await signCheckInSession(sessionId, signatureData);
      await verifyCheckInSession(sessionId);
      setDirection(1);
      setActiveStep(3);
    } catch (err: any) {
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : msg?.title || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 3 }, bgcolor: 'var(--bg-primary)' }}>
      <Box sx={{ maxWidth: 560, width: '100%' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2, mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #C4704B 0%, #D4A853 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BadgeIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, color: 'var(--text-primary)' }}>{t('checkin.title')}</Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{t('checkin.subtitle')}</Typography>
          </Box>
        </motion.div>

        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel connector={<WarmConnector />} sx={{ mb: 4 }}>
          {steps.map((label, i) => (
            <Step key={i}>
              <StepLabel StepIconComponent={() => <StepIcon active={activeStep === i} completed={activeStep > i} icon={null} step={i} />}>
                <Typography variant="body2" sx={{ color: activeStep >= i ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: activeStep === i ? 600 : 400, fontSize: '0.75rem' }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 0: ID Verification */}
          {activeStep === 0 && (
            <motion.div key="step0" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <TextField
                  fullWidth id="bookingId" name="bookingId" label={t('checkin.bookingId')}
                  value={formik.values.bookingId} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  error={formik.touched.bookingId && Boolean(formik.errors.bookingId)}
                  helperText={formik.touched.bookingId && formik.errors.bookingId}
                  sx={{ mb: 3 }}
                />

                <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-primary)' }}>
                  <BadgeIcon sx={{ fontSize: 16, color: '#C4704B' }} /> {t('checkin.uploadId')}
                </Typography>
                <input ref={idFileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => handleFileUpload(e, 'id')} />
                <Box
                  onClick={() => idFileRef.current?.click()}
                  sx={{
                    p: 4, mb: 3, textAlign: 'center', cursor: 'pointer', borderRadius: 2,
                    minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed var(--border)', bgcolor: 'var(--bg-surface-secondary)',
                    '&:hover': { borderColor: '#C4704B', bgcolor: '#C4704B08' },
                  }}
                >
                  {idPreview ? (
                    <Box component="img" src={idPreview} sx={{ maxWidth: '100%', maxHeight: 160, borderRadius: 2 }} />
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 40, color: 'var(--text-muted)', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{t('checkin.uploadIdHint')}</Typography>
                    </>
                  )}
                </Box>

                <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-primary)' }}>
                  <PhotoCameraIcon sx={{ fontSize: 16, color: '#C4704B' }} /> {t('checkin.takeSelfie')}
                </Typography>
                <input ref={selfieFileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="user" hidden onChange={(e) => handleFileUpload(e, 'selfie')} />
                <Box
                  onClick={() => selfieFileRef.current?.click()}
                  sx={{
                    p: 4, mb: 3, textAlign: 'center', cursor: 'pointer', borderRadius: 2,
                    minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed var(--border)', bgcolor: 'var(--bg-surface-secondary)',
                    '&:hover': { borderColor: '#C4704B', bgcolor: '#C4704B08' },
                  }}
                >
                  {selfiePreview ? (
                    <Box component="img" src={selfiePreview} sx={{ maxWidth: 120, maxHeight: 120, borderRadius: '50%', border: '3px solid #C4704B' }} />
                  ) : (
                    <>
                      <PhotoCameraIcon sx={{ fontSize: 40, color: 'var(--text-muted)', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{t('checkin.takeSelfieHint')}</Typography>
                    </>
                  )}
                </Box>

                <Button variant="contained" fullWidth size="large" onClick={handleStep0Submit}
                  endIcon={<ArrowIcon />}
                  sx={{ py: 1.5, borderRadius: 2, bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } }}
                >
                  {t('checkin.continue')}
                </Button>
              </Box>
            </motion.div>
          )}

          {/* Step 1: Personal Details */}
          {activeStep === 1 && (
            <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-primary)' }}>
                  <PersonIcon sx={{ fontSize: 16, color: '#C4704B' }} /> {t('checkin.personalInfo')}
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField fullWidth name="fatherName" label={t('checkin.fatherName')}
                      value={formik.values.fatherName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
                      helperText={formik.touched.fatherName && formik.errors.fatherName} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField fullWidth name="motherName" label={t('checkin.motherName')}
                      value={formik.values.motherName} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      error={formik.touched.motherName && Boolean(formik.errors.motherName)}
                      helperText={formik.touched.motherName && formik.errors.motherName} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField fullWidth name="identityNo" label={t('checkin.identityNo')}
                      value={formik.values.identityNo} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      error={formik.touched.identityNo && Boolean(formik.errors.identityNo)}
                      helperText={formik.touched.identityNo && formik.errors.identityNo} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField fullWidth name="dateOfBirth" label={t('checkin.dateOfBirth')} type="date"
                      InputLabelProps={{ shrink: true }}
                      value={formik.values.dateOfBirth} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                      helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField fullWidth name="nationality" label={t('checkin.nationality')}
                      value={formik.values.nationality} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      error={formik.touched.nationality && Boolean(formik.errors.nationality)}
                      helperText={formik.touched.nationality && formik.errors.nationality} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} >
                    <TextField fullWidth name="countryOfOrigin" label={t('checkin.countryOfOrigin')}
                      value={formik.values.countryOfOrigin} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      error={formik.touched.countryOfOrigin && Boolean(formik.errors.countryOfOrigin)}
                      helperText={formik.touched.countryOfOrigin && formik.errors.countryOfOrigin} />
                  </Grid>
                  <Grid size={12} >
                    <TextField fullWidth name="address" label={t('checkin.address')} multiline rows={2}
                      value={formik.values.address} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      error={formik.touched.address && Boolean(formik.errors.address)}
                      helperText={formik.touched.address && formik.errors.address} />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                  <Button variant="outlined" onClick={() => { setDirection(-1); setActiveStep(0); }} startIcon={<BackIcon />}
                    sx={{ flex: 1, py: 1.25, borderRadius: 2 }}>
                    {t('checkin.back')}
                  </Button>
                  <Button variant="contained" onClick={handleStep1Submit} disabled={loading}
                    endIcon={loading ? <CircularProgress size={16} /> : <ArrowIcon />}
                    sx={{ flex: 2, py: 1.25, borderRadius: 2, bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } }}
                  >
                    {t('checkin.continue')}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Step 2: Sign Terms */}
          {activeStep === 2 && (
            <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <Box sx={{ p: 2.5, borderRadius: 2, bgcolor: 'var(--bg-surface-secondary)', border: '1px solid var(--border)', mb: 3, maxHeight: 180, overflow: 'auto' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'var(--text-primary)' }}>{t('checkin.rentalAgreement')}</Typography>
                  <Divider sx={{ mb: 1.5 }} />
                  <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.7 }}>
                    {t('checkin.agreementText')}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, color: 'var(--text-primary)' }}>
                  <EditIcon sx={{ fontSize: 16, color: '#C4704B' }} /> {t('checkin.drawSignature')}
                </Typography>
                <Box sx={{ border: '1px solid var(--border)', borderRadius: 2, bgcolor: 'var(--bg-surface)', height: 150, mb: 1, overflow: 'hidden' }}>
                  <SignatureCanvas ref={signatureRef} penColor="#C4704B"
                    canvasProps={{ width: 460, height: 150, style: { width: '100%', height: '100%' } }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                  <Button variant="text" color="error" size="small" startIcon={<ClearIcon />} onClick={() => signatureRef.current?.clear()}>
                    {t('checkin.clear')}
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button variant="outlined" onClick={() => { setDirection(-1); setActiveStep(1); }} startIcon={<BackIcon />}
                    sx={{ flex: 1, py: 1.25, borderRadius: 2 }}>
                    {t('checkin.back')}
                  </Button>
                  <Button variant="contained" onClick={handleSignAndVerify} disabled={loading}
                    endIcon={loading ? <CircularProgress size={16} /> : <VerifiedIcon />}
                    sx={{ flex: 2, py: 1.25, borderRadius: 2, bgcolor: '#C4704B', '&:hover': { bgcolor: '#A85A38' } }}
                  >
                    {t('checkin.signAndVerify')}
                  </Button>
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Step 3: Submitted */}
          {activeStep === 3 && (
            <motion.div key="step3" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: 'easeInOut' }}>
              <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, bgcolor: 'var(--bg-surface)', border: '1px solid var(--border)', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}>
                  <Box sx={{
                    width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2,
                    bgcolor: '#22C55E',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <VerifiedIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </Box>
                </motion.div>

                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, color: 'var(--text-primary)' }}>{t('checkin.submittedTitle')}</Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 3 }}>
                  {t('checkin.submittedMessage')}
                </Typography>

                <Alert severity="info" sx={{ textAlign: 'left' }}>
                  {t('checkin.submittedInfo')}
                </Alert>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default GuestCheckIn;
