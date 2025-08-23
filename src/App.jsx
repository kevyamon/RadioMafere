// src/App.jsx
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, CssBaseline } from '@mui/material';
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
import AnnouncementsPage from './pages/AnnouncementsPage'; // <-- On importe la nouvelle page

// --- Importation des Composants ---
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalSocketListener from './components/GlobalSocketListener';

// Un petit composant pour gérer l'affichage conditionnel de la Navbar
const AppLayout = () => {
  const location = useLocation();
  const hideNavbarOn = ['/landing']; // Routes où on ne veut pas de Navbar

  return (
    <>
      {!hideNavbarOn.includes(location.pathname) && <Navbar />}
      <Container component="main" sx={{ mt: 4, mb: 4 }}>
        <Routes>
            {/* --- Routes Protégées pour les Utilisateurs Connectés --- */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin', 'super_admin']} />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} /> {/* <-- LA SEULE LIGNE AJOUTÉE */}
            </Route>

            {/* --- Route Protégée pour les Admins --- */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'super_admin']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* --- Routes Publiques --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/banned" element={<BannedPage />} />
            
            {/* La page d'accueil par défaut */}
            <Route path="/landing" element={<LandingPage />} />

            {/* Redirection magique en fonction du statut de connexion */}
            <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Container>
    </>
  );
};


// Ce composant va rediriger l'utilisateur au bon endroit
const RootRedirect = () => {
    const { userInfo } = useSelector((state) => state.auth);
    // Si l'utilisateur est connecté, on le redirige vers /home (le fil d'actu)
    // Sinon, on le redirige vers /landing (la page d'accueil visiteur)
    return <Navigate to={userInfo ? "/home" : "/landing"} replace />;
};


function App() {
  return (
    <>
      <CssBaseline />
      <GlobalSocketListener />
      <AppLayout />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
      />
    </>
  );
}

export default App;