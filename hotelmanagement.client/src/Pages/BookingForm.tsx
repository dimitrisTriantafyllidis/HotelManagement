import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Box,
  Divider,
  FormHelperText
} from '@mui/material';
import {
  Edit as EditIcon,
  AddCircle as AddCircleIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { enUS, el } from 'date-fns/locale';

interface Appartment {
  id: string;
  name: string;
}

interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfArrival: Date | null;
  dateOfDeparture: Date | null;
  appartmentId: string;
}

interface BookingFormProps {
  booking: Booking;
  appartments: Appartment[];
  onSave: (booking: Booking) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ booking, appartments, onSave }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = yup.object({
    firstName: yup.string().required('Το όνομα είναι απαραίτητο'),
    lastName: yup.string().required('Το επώνυμο είναι απαραίτητο'),
    email: yup.string().email('Εισάγετε ένα έγκυρο email').required('Το email είναι απαραίτητο'),
    phoneNumber: yup.string().required('Το τηλέφωνο είναι απαραίτητο'),
    dateOfArrival: yup.date().required('Η ημερομηνία άφιξης είναι απαραίτητη').nullable(),
    dateOfDeparture: yup.date()
      .required('Η ημερομηνία αναχώρησης είναι απαραίτητη')
      .nullable()
      .when('dateOfArrival', (dateOfArrival, schema) => {
        if (dateOfArrival) {
          return schema.min(dateOfArrival, 'Η αναχώρηση πρέπει να είναι μετά την άφιξη');
        }
        return schema;
      }),
    appartmentId: yup.string().required('Η επιλογή διαμερίσματος είναι απαραίτητη')
  });

  const formik = useFormik({
    initialValues: booking,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);
      onSave(values);
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={el}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
          <CardHeader
            title={
              <Typography variant="h4" component="div" sx={{ color: 'white', textAlign: 'center' }}>
                {booking.id ? (
                  <>
                    <EditIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Επεξεργασία Κράτησης
                  </>
                ) : (
                  <>
                    <AddCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Δημιουργία Κράτησης
                  </>
                )}
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
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Στοιχεία Πελάτη
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="Όνομα"
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
                    label="Επώνυμο"
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
                    InputProps={{
                      sx: { borderRadius: 2, height: 56 }
                    }}
                  />

                  <TextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Τηλέφωνο"
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
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                  Πληροφορίες Κράτησης
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                  <DatePicker
                    label="Άφιξη"
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
                    label="Αναχώρηση"
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

                <FormControl fullWidth sx={{ mb: 2 }} error={formik.touched.appartmentId && Boolean(formik.errors.appartmentId)}>
                  <InputLabel id="appartment-label">Διαμέρισμα</InputLabel>
                  <Select
                    labelId="appartment-label"
                    id="appartmentId"
                    name="appartmentId"
                    value={formik.values.appartmentId}
                    label="Διαμέρισμα"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    sx={{ borderRadius: 2, height: 56 }}
                  >
                    <MenuItem value="" disabled>
                      -- Επιλογή Διαμερίσματος --
                    </MenuItem>
                    {appartments.map((appartment) => (
                      <MenuItem key={appartment.id} value={appartment.id}>
                        {appartment.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.appartmentId && formik.errors.appartmentId && (
                    <FormHelperText>{formik.errors.appartmentId}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  sx={{ borderRadius: 2, px: 3 }}
                >
                  Πίσω
                </Button>

                {booking.id ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<CheckCircleIcon />}
                    disabled={isSubmitting}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Ενημέρωση
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Δημιουργία
                  </Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </LocalizationProvider>
  );
};

export default BookingForm;