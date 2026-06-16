import './App.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { AuthProvider } from './auth/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';
import ProtectedRoute from './auth/ProtectedRoute';
import AppLayout from './components/AppLayout';

import './Services/AuthService';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import BookingList from './Pages/BookingList';
import BookingForm from './Pages/BookingForm';
import ApartmentListPage from './Pages/Appartment';
import ApartmentFormPage from './Pages/ApartmentCE';
import OwnerDashboard from './Pages/OwnerDashboard';
import GuestCheckIn from './Pages/GuestCheckIn';
import CleanerView from './Pages/CleanerView';
import AdminCheckInReview from './Pages/AdminCheckInReview';

function App() {
    return (
        <ThemeContextProvider>
            <CssBaseline />
            <AuthProvider>
                <LanguageProvider>
                    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <AppLayout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/guest-checkin" element={<GuestCheckIn />} />
                            <Route path="/checkin" element={<Navigate to="/guest-checkin" replace />} />

                            <Route path="/" element={<ProtectedRoute roles={['Admin', 'Manager']}><Home /></ProtectedRoute>} />
                            <Route path="/home" element={<ProtectedRoute roles={['Admin', 'Manager']}><Home /></ProtectedRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute roles={['Admin', 'Manager']}><OwnerDashboard /></ProtectedRoute>} />
                            <Route path="/bookings" element={<ProtectedRoute roles={['Admin', 'Manager']}><BookingList /></ProtectedRoute>} />
                            <Route path="/bookingform" element={<ProtectedRoute roles={['Admin', 'Manager']}><BookingForm /></ProtectedRoute>} />
                            <Route path="/bookingform/:id" element={<ProtectedRoute roles={['Admin', 'Manager']}><BookingForm /></ProtectedRoute>} />
                            <Route path="/checkin-review" element={<ProtectedRoute roles={['Admin', 'Manager']}><AdminCheckInReview /></ProtectedRoute>} />

                            <Route path="/apartmentlist" element={<ProtectedRoute roles={['Admin']}><ApartmentListPage /></ProtectedRoute>} />
                            <Route path="/apartmentform" element={<ProtectedRoute roles={['Admin']}><ApartmentFormPage /></ProtectedRoute>} />
                            <Route path="/apartmentform/:id" element={<ProtectedRoute roles={['Admin']}><ApartmentFormPage /></ProtectedRoute>} />

                            <Route path="/cleaner" element={<ProtectedRoute roles={['Admin', 'Manager', 'User']}><CleanerView /></ProtectedRoute>} />
                        </Routes>
                    </AppLayout>
                    </SnackbarProvider>
                </LanguageProvider>
            </AuthProvider>
        </ThemeContextProvider>
    );
}

export default App;
