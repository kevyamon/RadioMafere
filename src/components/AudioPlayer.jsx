// src/components/AudioPlayer.jsx
import { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

// On récupère l'URL du flux depuis les variables d'environnement de Vite
const STREAM_URL = import.meta.env.VITE_STREAM_URL;

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Crée l'élément audio une seule fois
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  const togglePlayPause = () => {
    if (!STREAM_URL) {
      console.error("L'URL du flux de streaming n'est pas configurée.");
      // On pourrait afficher un toast ici si on le souhaitait
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = STREAM_URL;
      setIsLoading(true); // On commence le chargement
      audioRef.current.play().catch(e => {
        console.error("Erreur lors de la lecture du flux:", e);
        setIsLoading(false);
      });
    }
  };

  // Ajout des écouteurs d'événements pour gérer l'état
  useEffect(() => {
    const audio = audioRef.current;
    
    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting); // Quand le lecteur attend des données
    audio.addEventListener('canplay', handleCanPlay); // Quand il a assez de données pour jouer

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);


  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Typography variant="h6" sx={{ mr: 2 }}>
        Radio Maféré
      </Typography>
      
      <IconButton onClick={togglePlayPause} color="inherit" disabled={!STREAM_URL || isLoading}>
        {isLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : isPlaying ? (
          <PauseIcon />
        ) : (
          <PlayArrowIcon />
        )}
      </IconButton>

      <Typography variant="body1" sx={{ ml: 1 }}>
        {isLoading ? "Chargement..." : isPlaying ? "En direct" : "Hors ligne"}
      </Typography>
    </Box>
  );
};

export default AudioPlayer;