import { Routes, Route } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Importation des Pages ---
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BannedPage from './pages/BannedPage';

// --- Importation des Composants ---
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalSocketListener from './components/GlobalSocketListener';

function App() {
  return (
    <>
      <CssBaseline />
      <GlobalSocketListener />
      <Navbar />
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          {/* --- Routes Publiques --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/banned" element={<BannedPage />} />

          {/* --- Route Protégée pour les Admins --- */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
}

export default App;