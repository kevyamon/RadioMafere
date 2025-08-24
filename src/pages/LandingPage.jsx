// src/pages/LandingPage.jsx
import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';
import { useState, useEffect } from 'react';
import io from 'socket.io-client'; // <-- NOUVEL IMPORT

const socket = io('https://radio-mafere-backend.onrender.com');

const LandingPage = () => {
  const [pings, setPings] = useState([]);

  // --- NOUVELLE LOGIQUE ---
  useEffect(() => {
    // 1. On envoie notre propre "ping" au backend quand on arrive sur la page
    fetch('https://radio-mafere-backend.onrender.com/api/location/ping', { method: 'POST' });

    // 2. On écoute les pings des autres utilisateurs
    const handleNewPing = (newPing) => {
      setPings((currentPings) => [...currentPings, newPing]);

      // On fait disparaître le ping après 5 secondes pour un effet animé
      setTimeout(() => {
        setPings((currentPings) => currentPings.filter(p => p.id !== newPing.id));
      }, 5000);
    };

    socket.on('new_listener_location', handleNewPing);

    // 3. On nettoie l'écouteur quand on quitte la page
    return () => {
      socket.off('new_listener_location', handleNewPing);
    };
  }, []);
  // --- FIN DE LA NOUVELLE LOGIQUE ---

  return (
    <Box>
      <Box
        sx={{
          height: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          backgroundColor: '#333',
          p: 3,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Radio Maféré
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          La voix de la communauté, au cœur de chez vous.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            component={RouterLink} 
            to="/login" 
            variant="contained" 
            size="large"
          >
            Se connecter
          </Button>
          <Button 
            component={RouterLink} 
            to="/register" 
            variant="outlined" 
            size="large"
            sx={{ color: 'white', borderColor: 'white' }}
          >
            S'inscrire
          </Button>
        </Stack>
      </Box>

      <Container sx={{ mt: 4 }}>
        <InteractiveMap pings={pings} />
      </Container>
    </Box>
  );
};

export default LandingPage;