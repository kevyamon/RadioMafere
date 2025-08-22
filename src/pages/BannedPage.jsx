import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useDispatch } from 'react-redux';
import { logOut } from '../features/auth/authSlice';
import io from 'socket.io-client';

const socket = io('https://radio-mafere-backend.onrender.com');

const BannedPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isReactivated, setIsReactivated] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    // ON RÉCUPÈRE LE TÉMOIN
    const bannedUserId = localStorage.getItem('bannedUserId');

    const handleStatusUpdate = ({ statut }) => {
      if (statut === 'actif') {
        setIsReactivated(true);
      }
    };
    socket.on('status_updated', handleStatusUpdate);

    // On s'identifie auprès du socket avec le témoin
    if (bannedUserId) {
       socket.emit('user_connected', bannedUserId);
    }

    return () => {
      socket.off('status_updated', handleStatusUpdate);
    };
  }, []);

  useEffect(() => {
    if (isReactivated) {
      if (countdown <= 0) {
        handleLogoutAndRedirect();
        return;
      }
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isReactivated, countdown]);
  
  const handleLogoutAndRedirect = () => {
    localStorage.removeItem('bannedUserId'); // On nettoie le témoin
    dispatch(logOut());
    navigate('/login');
  };

  if (isReactivated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f0f7f0' }}>
        <Paper elevation={6} sx={{ p: 4, maxWidth: 450, textAlign: 'center', borderRadius: 4, backgroundColor: 'white', border: '1px solid #c8e6c9' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4caf50' }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>Compte Réactivé !</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>Bonne nouvelle ! Votre compte a été réactivé.</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Vous allez être redirigé vers la page de connexion dans <strong>{countdown} secondes</strong> pour pouvoir vous reconnecter.</Typography>
          <Button variant="contained" fullWidth onClick={handleLogoutAndRedirect} sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#43a047' }, color: 'white', borderRadius: 2, py: 1.5 }}>Se reconnecter maintenant</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#fdf6e3' }}>
      <Paper elevation={6} sx={{ p: 4, maxWidth: 400, textAlign: 'center', borderRadius: 4, backgroundColor: '#fff9f0', border: '1px solid #e0e0e0' }}>
        <BlockIcon sx={{ fontSize: 60, color: '#c62828' }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>Accès Suspendu</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Votre compte a été temporairement suspendu. Si vous pensez qu'il s'agit d'une erreur, vous pouvez nous contacter.</Typography>
        <Button variant="contained" fullWidth sx={{ mb: 2, bgcolor: '#673ab7', '&:hover': { bgcolor: '#5e35b1' }, color: 'white', borderRadius: 2, py: 1.5 }}>Faire une réclamation</Button>
        <Button variant="contained" fullWidth onClick={handleLogoutAndRedirect} sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' }, color: 'white', borderRadius: 2, py: 1.5 }}>Se déconnecter</Button>
      </Paper>
    </Box>
  );
};

// Le code des vues pour la complétude
const BannedPageComplete = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isReactivated, setIsReactivated] = useState(false);
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    const bannedUserId = localStorage.getItem('bannedUserId');
    const handleStatusUpdate = ({ statut }) => {
      if (statut === 'actif') setIsReactivated(true);
    };
    socket.on('status_updated', handleStatusUpdate);
    if (bannedUserId) socket.emit('user_connected', bannedUserId);
    return () => { socket.off('status_updated', handleStatusUpdate); };
  }, []);

  useEffect(() => {
    if (isReactivated) {
      if (countdown <= 0) { handleLogoutAndRedirect(); return; }
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isReactivated, countdown]);
  
  const handleLogoutAndRedirect = () => {
    localStorage.removeItem('bannedUserId');
    dispatch(logOut());
    navigate('/login');
  };

  if (isReactivated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f0f7f0' }}>
        <Paper elevation={6} sx={{ p: 4, maxWidth: 450, textAlign: 'center', borderRadius: 4, backgroundColor: 'white', border: '1px solid #c8e6c9' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4caf50' }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>Compte Réactivé !</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>Bonne nouvelle ! Votre compte a été réactivé.</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Vous allez être redirigé vers la page de connexion dans <strong>{countdown} secondes</strong> pour pouvoir vous reconnecter.</Typography>
          <Button variant="contained" fullWidth onClick={handleLogoutAndRedirect} sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#43a047' }, color: 'white', borderRadius: 2, py: 1.5 }}>Se reconnecter maintenant</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#fdf6e3' }}>
        <Paper elevation={6} sx={{ p: 4, maxWidth: 400, textAlign: 'center', borderRadius: 4, backgroundColor: '#fff9f0', border: '1px solid #e0e0e0' }}>
            <BlockIcon sx={{ fontSize: 60, color: '#c62828' }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>Accès Suspendu</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Votre compte a été temporairement suspendu. Si vous pensez qu'il s'agit d'une erreur, vous pouvez nous contacter.</Typography>
            <Button variant="contained" fullWidth sx={{ mb: 2, bgcolor: '#673ab7', '&:hover': { bgcolor: '#5e35b1' }, color: 'white', borderRadius: 2, py: 1.5 }}>Faire une réclamation</Button>
            <Button variant="contained" fullWidth onClick={handleLogoutAndRedirect} sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' }, color: 'white', borderRadius: 2, py: 1.5 }}>Se déconnecter</Button>
        </Paper>
    </Box>
  );
};


export default BannedPageComplete;