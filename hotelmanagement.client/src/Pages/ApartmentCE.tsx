import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Stack
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
  Apartment as ApartmentIcon,
  Numbers as NumbersIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';

const apartmentStatuses = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Maintenance' }
];

const validationSchema = yup.object({
  name: yup.string().required('Apartment name is required'),
  number: yup.string()
    .required('Apartment number is required')
    .matches(/^[0-9]+$/, 'Must be a valid number'),
  status: yup.string().required('Status is required')
});

const ApartmentFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);

  const formik = useFormik({
    initialValues: {
      name: '',
      number: '',
      status: 'available'
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Simulate API call
      setTimeout(() => {
        enqueueSnackbar(
          isEditMode ? 'Apartment updated successfully' : 'Apartment created successfully',
          { variant: 'success' }
        );
        navigate('/apartments');
      }, 500);
    },
  });

  // Load data in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchApartment = async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 600));
          const mockApartment = {
            name: 'Deluxe Suite',
            number: '101',
            status: 'available'
          };
          formik.setValues(mockApartment);
        } catch (error) {
          enqueueSnackbar('Failed to load apartment data', { variant: 'error' });
        } finally {
          setLoading(false);
        }
      };

      fetchApartment();
    }
  }, [id, isEditMode]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            width: 56, 
            height: 56,
            boxShadow: 2
          }}>
            <ApartmentIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {isEditMode ? 'Edit Apartment' : 'Create New Apartment'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isEditMode ? 'Update apartment details' : 'Fill in the form to add a new apartment'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid >
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Apartment Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <HomeIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid>
              <TextField
                fullWidth
                id="number"
                name="number"
                label="Apartment Number"
                value={formik.values.number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.number && Boolean(formik.errors.number)}
                helperText={formik.touched.number && formik.errors.number}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <NumbersIcon color="action" sx={{ mr: 1 }} />
                  ),
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  label="Status"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                >
                  {apartmentStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: 
                            status.value === 'available' ? 'success.main' :
                            status.value === 'occupied' ? 'warning.main' : 'error.main'
                        }} />
                        <span>{status.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/apartments')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={loading || !formik.dirty}
                >
                  {isEditMode ? 'Update' : 'Create'} Apartment
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ApartmentFormPage;