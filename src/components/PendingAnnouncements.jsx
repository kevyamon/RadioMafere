// src/components/PendingAnnouncements.jsx
import { useGetPendingAnnouncementsQuery, useUpdateAnnouncementStatusMutation } from '../features/api/apiSlice';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Stack,
  Divider,
  Grid,
} from '@mui/material';
import { toast } from 'react-toastify';

const PendingAnnouncements = () => {
  const { data: announcements, isLoading, isSuccess, isError, error } = useGetPendingAnnouncementsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateAnnouncementStatusMutation();

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`L'annonce a été ${status === 'approuvée' ? 'approuvée' : 'rejetée'}.`);
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  let content;

  if (isLoading) {
    content = <CircularProgress />;
  } else if (isSuccess) {
    if (announcements.length === 0) {
      content = <Alert severity="success">Aucune annonce en attente de modération.</Alert>;
    } else {
      content = announcements.map((annonce) => (
        <Paper key={annonce._id} sx={{ p: 2, mb: 2 }} variant="outlined">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{annonce.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Par : {annonce.author.prenom}
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
            "{annonce.content}"
          </Typography>

          {annonce.images && annonce.images.length > 0 && (
             <Grid container spacing={1} sx={{ mb: 2 }}>
                {annonce.images.map(image => (
                    <Grid item key={image.public_id}>
                        <Box
                            component="img"
                            sx={{
                                height: 60,
                                width: 60,
                                objectFit: 'cover',
                                borderRadius: 1,
                                border: '1px solid #ddd'
                            }}
                            alt="miniature"
                            src={image.url}
                        />
                    </Grid>
                ))}
            </Grid>
          )}

          <Divider sx={{ my: 1 }} />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleUpdateStatus(annonce._id, 'approuvée')}
              disabled={isUpdating}
            >
              Approuver
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleUpdateStatus(annonce._id, 'rejetée')}
              disabled={isUpdating}
            >
              Rejeter
            </Button>
          </Stack>
        </Paper>
      ));
    }
  } else if (isError) {
    content = <Alert severity="error">{error.toString()}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Annonces en attente de modération ({isSuccess ? announcements.length : 0})
      </Typography>
      {content}
    </Box>
  );
};

export default PendingAnnouncements;