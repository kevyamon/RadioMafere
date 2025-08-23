// src/pages/LandingPage.jsx
import { Box, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const LandingPage = () => {
  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)', // Prend toute la hauteur de l'écran moins la navbar (qu'on cachera plus tard)
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white', // Couleur du texte
        // NOTE: On ajoutera l'image de fond ici plus tard
        backgroundColor: '#333', // Fond temporaire
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
  );
};

export default LandingPage;