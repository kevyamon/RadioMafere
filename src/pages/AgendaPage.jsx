// src/pages/AgendaPage.jsx
import { useSelector } from 'react-redux';
// On importe le nouveau hook pour la participation
import { useGetEventsQuery, useToggleParticipationMutation } from '../features/api/apiSlice';
import { Box, Typography, CircularProgress, Grid, Alert } from '@mui/material';
import EventCard from '../components/EventCard';
import { toast } from 'react-toastify';

const AgendaPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: events, isLoading, isSuccess, isError, error } = useGetEventsQuery();
  
  // On récupère la fonction de mutation et l'état de chargement
  const [toggleParticipation, { isLoading: isParticipatingLoading }] = useToggleParticipationMutation();

  const handleParticipate = async (eventId) => {
    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!userInfo) {
        toast.info("Vous devez être connecté pour participer.");
        return;
    }
    
    try {
      // On appelle la mutation avec l'ID de l'événement
      await toggleParticipation(eventId).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Une erreur est survenue.");
    }
  };

  let content;

  if (isLoading) {
    content = <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  } else if (isSuccess) {
    if (events.length === 0) {
        content = <Alert severity="info">Il n'y a aucun événement à venir pour le moment.</Alert>;
    } else {
        content = (
            <Grid container spacing={3}>
            {events.map((event) => {
                // La logique pour savoir si l'utilisateur participe est plus robuste
                const isParticipating = userInfo ? event.participants.some(p => p._id === userInfo._id) : false;
                
                return (
                <Grid item key={event._id} xs={12} md={6} lg={4}>
                    <EventCard 
                        event={event} 
                        onParticipate={handleParticipate}
                        isParticipating={isParticipating}
                        userInfo={userInfo}
                    />
                </Grid>
                );
            })}
            </Grid>
        );
    }
  } else if (isError) {
    content = <Alert severity="error">{error?.data?.message || 'Impossible de charger les événements.'}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Agenda des événements
      </Typography>
      <Box sx={{ mt: 4 }}>
        {content}
      </Box>
    </Box>
  );
};

export default AgendaPage;