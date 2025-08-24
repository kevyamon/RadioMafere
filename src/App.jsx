// src/App.jsx
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Importation des Pages ---
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BannedPage from './pages/BannedPage';
import AgendaPage from './pages/AgendaPage';
import LandingPage from './pages/LandingPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import MessagesPage from './pages/MessagesPage'; // <-- NOUVEL IMPORT

// --- Importation des Composants ---
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalSocketListener from './components/GlobalSocketListener';
import AudioPlayer from './components/AudioPlayer';

const AppLayout = () => {
  const location = useLocation();
  const hideNavbarOn = ['/landing'];

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <Container component="main" sx={{ mt: 4, mb: 4, pb: 10 }}>
        <Routes>
            {/* --- Routes Protégées pour les Utilisateurs Connectés --- */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']} />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/messages" element={<MessagesPage />} /> {/* <-- NOUVELLE ROUTE */}
            </Route>

            {/* --- Route Protégée pour les Admins --- */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* --- Routes Publiques --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/banned" element={<BannedPage />} />
            
            <Route path="/landing" element={<LandingPage />} />

            <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Container>
    </>
  );
};

const RootRedirect = () => {
    const { userInfo } = useSelector((state) => state.auth);
    return <Navigate to={userInfo ? "/home" : "/landing"} replace />;
};

function App() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <CssBaseline />
      <GlobalSocketListener />
      <AppLayout />
      {userInfo && <AudioPlayer />} 
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
}

export default App;