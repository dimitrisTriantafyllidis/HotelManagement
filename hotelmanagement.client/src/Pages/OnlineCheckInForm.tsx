import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
  Modal,
  Paper,
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  Badge as BadgeIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { el } from 'date-fns/locale';
import SignatureCanvas from 'react-signature-canvas';
import { useFormik } from 'formik';
import * as yup from 'yup';

interface BookingMembersInfo {
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  identityNo: string;
  dateOfBirth: Date | null;
  nationality: string;
  countryOfOrigin: string;
  address: string;
  phoneNumber: string;
  email: string;
  appartment: string;
  dateOfArrival: Date | null;
  dateOfDeparture: Date | null;
  agree: boolean;
  signatureData: string;
}

const OnlineCheckInForm: React.FC = () => {
  const [openTerms, setOpenTerms] = useState(false);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const validationSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    fatherName: yup.string(),
    motherName: yup.string(),
    identityNo: yup.string().required('ID number is required'),
    dateOfBirth: yup.date().required('Date of birth is required').nullable(),
    nationality: yup.string().required('Nationality is required'),
    countryOfOrigin: yup.string().required('Country of origin is required'),
    address: yup.string().required('Address is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    appartment: yup.string().required('Apartment is required'),
    dateOfArrival: yup.date().required('Arrival date is required').nullable(),
    dateOfDeparture: yup.date()
      .required('Departure date is required')
      .nullable()
      .when('dateOfArrival', (dateOfArrival, schema) => {
        if (dateOfArrival) {
          return schema.min(dateOfArrival, 'Departure must be after arrival');
        }
        return schema;
      }),
    agree: yup.boolean().oneOf([true], 'You must agree to the terms'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      fatherName: '',
      motherName: '',
      identityNo: '',
      dateOfBirth: null,
      nationality: '',
      countryOfOrigin: '',
      address: '',
      phoneNumber: '',
      email: '',
      appartment: '',
      dateOfArrival: null,
      dateOfDeparture: null,
      agree: false,
      signatureData: '',
    } as BookingMembersInfo,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (signatureRef.current && !signatureRef.current.isEmpty()) {
        const signatureData = signatureRef.current.toDataURL();
        values.signatureData = signatureData;
        console.log('Form submitted:', values);
        // Handle form submission here
      } else {
        alert('Please provide your signature before submitting.');
      }
    },
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={el}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h4" component="div" sx={{ color: 'white', textAlign: 'center' }}>
                <BadgeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Online Check-In
              </Typography>
            }
            sx={{
              bgcolor: 'primary.main',
              py: 3,
              background: 'linear-gradient(45deg, #4361ee 30%, #3a56d4 90%)'
            }}
          />

          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <form onSubmit={formik.handleSubmit}>
              {/* Personal Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                    helperText={formik.touched.firstName && formik.errors.firstName}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />

                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    id="fatherName"
                    name="fatherName"
                    label="Father's Name"
                    value={formik.values.fatherName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fatherName && Boolean(formik.errors.fatherName)}
                    helperText={formik.touched.fatherName && formik.errors.fatherName}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />

                  <TextField
                    fullWidth
                    id="motherName"
                    name="motherName"
                    label="Mother's Name"
                    value={formik.values.motherName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.motherName && Boolean(formik.errors.motherName)}
                    helperText={formik.touched.motherName && formik.errors.motherName}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />
                </Box>
              </Box>

              {/* Identification Details Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Identification Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    id="identityNo"
                    name="identityNo"
                    label="ID Number"
                    value={formik.values.identityNo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.identityNo && Boolean(formik.errors.identityNo)}
                    helperText={formik.touched.identityNo && formik.errors.identityNo}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />

                  <DatePicker
                    label="Date of Birth"
                    value={formik.values.dateOfBirth}
                    onChange={(value) => formik.setFieldValue('dateOfBirth', value)}
                    maxDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth),
                        helperText: formik.touched.dateOfBirth && formik.errors.dateOfBirth,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    id="nationality"
                    name="nationality"
                    label="Nationality"
                    value={formik.values.nationality}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nationality && Boolean(formik.errors.nationality)}
                    helperText={formik.touched.nationality && formik.errors.nationality}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />

                  <TextField
                    fullWidth
                    id="countryOfOrigin"
                    name="countryOfOrigin"
                    label="Country of Origin"
                    value={formik.values.countryOfOrigin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.countryOfOrigin && Boolean(formik.errors.countryOfOrigin)}
                    helperText={formik.touched.countryOfOrigin && formik.errors.countryOfOrigin}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />
                </Box>
              </Box>

              {/* Contact Information Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    id="address"
                    name="address"
                    label="Address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />

                  <TextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />
                </Box>

                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  variant="outlined"
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 2, height: 56 }
                  }}
                />
              </Box>

              {/* Booking Details Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Booking Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    id="appartment"
                    name="appartment"
                    label="Apartment"
                    value={formik.values.appartment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.appartment && Boolean(formik.errors.appartment)}
                    helperText={formik.touched.appartment && formik.errors.appartment}
                    variant="outlined"
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <DatePicker
                    label="Arrival Date"
                    value={formik.values.dateOfArrival}
                    onChange={(value) => formik.setFieldValue('dateOfArrival', value)}
                    minDate={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.dateOfArrival && Boolean(formik.errors.dateOfArrival),
                        helperText: formik.touched.dateOfArrival && formik.errors.dateOfArrival,
                      },
                    }}
                  />

                  <DatePicker
                    label="Departure Date"
                    value={formik.values.dateOfDeparture}
                    onChange={(value) => formik.setFieldValue('dateOfDeparture', value)}
                    minDate={formik.values.dateOfArrival || new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.dateOfDeparture && Boolean(formik.errors.dateOfDeparture),
                        helperText: formik.touched.dateOfDeparture && formik.errors.dateOfDeparture,
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Signature Section */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Signature
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>Please sign below:</Typography>
                  <Box
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      height: 180,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <SignatureCanvas
                      ref={signatureRef}
                      penColor="black"
                      canvasProps={{
                        width: windowSize.width > 600 ? 500 : 300,
                        height: 180,
                        className: 'sigCanvas',
                        style: { width: '100%', height: '100%' }
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<ClearIcon />}
                      onClick={clearSignature}
                      sx={{ borderRadius: 2 }}
                    >
                      Clear Signature
                    </Button>
                    <Typography variant="caption" sx={{ alignSelf: 'center' }}>
                      Draw your signature above
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Terms and Submit */}
              <Box sx={{ mb: 4 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.agree}
                      onChange={formik.handleChange}
                      name="agree"
                      color="primary"
                    />
                  }
                  label={
                    <Typography>
                      I agree to the{' '}
                      <Button 
                        variant="text" 
                        size="small" 
                        onClick={() => setOpenTerms(true)}
                        sx={{ p: 0, minWidth: 'auto' }}
                      >
                        Terms and Conditions
                      </Button>
                    </Typography>
                  }
                />
                {formik.touched.agree && formik.errors.agree && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {formik.errors.agree}
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                startIcon={<CheckCircleIcon />}
                sx={{ py: 2, borderRadius: 2 }}
              >
                Submit Check-In
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Terms and Conditions Modal */}
        <Modal
          open={openTerms}
          onClose={() => setOpenTerms(false)}
          aria-labelledby="terms-modal-title"
          aria-describedby="terms-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', md: '70%' },
              maxHeight: '80vh',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              overflow: 'auto',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography id="terms-modal-title" variant="h5" component="h2">
                Terms and Conditions
              </Typography>
              <IconButton onClick={() => setOpenTerms(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography id="terms-modal-description" variant="body1" sx={{ mb: 3 }}>
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                1. Introduction
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Welcome to our service. By using our platform, you agree to these terms and conditions. Please read them carefully.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                2. User Responsibilities
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                You agree to use our service only for lawful purposes and in a way that does not infringe the rights of others.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                3. Privacy Policy
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Your data will be handled according to our Privacy Policy. We collect only necessary information and protect it with industry-standard measures.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                4. Account Security
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                5. Service Modifications
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                We reserve the right to modify or discontinue any service feature at any time without prior notice.
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                6. Limitation of Liability
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                We shall not be liable for any indirect, incidental, special or consequential damages resulting from your use of our services.
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenTerms(false)}
              sx={{ mt: 2 }}
            >
              I Understand
            </Button>
          </Box>
        </Modal>
      </Container>
    </LocalizationProvider>
  );
};

export default OnlineCheckInForm;