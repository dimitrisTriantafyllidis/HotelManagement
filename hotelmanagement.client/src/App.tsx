import { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { ThemeProvider } from '@mui/material/styles';
import theme from './Pages/theme';
import CssBaseline from '@mui/material/CssBaseline';
import BookingList from './Pages/BookingList';
import BookingForm from './Pages/BookingForm';
import OnlineCheckInForm from './Pages/OnlineCheckInForm';
import { Dashboard } from '@mui/icons-material';
import ApartmentListPage from './Pages/Appartment';
import ApartmentFormPage from './Pages/ApartmentCE';

function App() {
    const bookings = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          dateOfArrival: new Date('2023-05-07'),
          dateOfDeparture: new Date('2023-05-07'),
          appartment: { appartmentName: 'Apartment A' },
          otpCode: '1234',
          status: undefined
        },
        // ... more bookings
      ];    
      const initialBooking = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dateOfArrival: null,
        dateOfDeparture: null,
        appartmentId: '',
      };
    
      const appartments = [
        { id: '1', name: 'Διαμέρισμα Α' },
        { id: '2', name: 'Διαμέρισμα Β' },
        { id: '3', name: 'Διαμέρισμα Γ' },
      ];
    
      const handleSave = (booking: any) => {
        console.log('Saving booking:', booking);
        // Add your save logic here
      };
      return (
        <>
            <ThemeProvider theme={theme}>
            <CssBaseline />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/bookings" element={<BookingList bookings={bookings} />} />
                    <Route path="/bookingform" element={<BookingForm booking={initialBooking} appartments={appartments} onSave={handleSave} />} />
                    <Route path="/checkin" element={<OnlineCheckInForm />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/apartmentlist" element={<ApartmentListPage />} />
                    <Route path="/apartmentform" element={<ApartmentFormPage />} />

                </Routes>
           </ThemeProvider>
        </>
    );
}

export default App;