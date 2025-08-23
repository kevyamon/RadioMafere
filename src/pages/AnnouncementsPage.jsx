// src/pages/AnnouncementsPage.jsx
import { useSelector } from 'react-redux';
import { useGetApprovedAnnouncementsQuery } from '../features/api/apiSlice';
import { Box, Typography, CircularProgress, Alert, Divider } from '@mui/material';
import CreateAnnouncementForm from '../components/CreateAnnouncementForm';
import AnnouncementCard from '../components/AnnouncementCard';

const AnnouncementsPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: announcements, isLoading, isSuccess, isError, error } = useGetApprovedAnnouncementsQuery();

  let content;

  if (isLoading) {
    content = <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  } else if (isSuccess) {
    if (announcements.length === 0) {
      content = <Alert severity="info">Il n'y a aucune annonce pour le moment.</Alert>;
    } else {
      content = (
        <Box>
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement._id} announcement={announcement} />
          ))}
        </Box>
      );
    }
  } else if (isError) {
    content = <Alert severity="error">{error?.data?.message || 'Impossible de charger les annonces.'}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Annonces de la communauté
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Trouvez ce que vous cherchez ou proposez vos services à la communauté de Maféré.
      </Typography>

      {/* Le formulaire n'est visible que si l'utilisateur est connecté */}
      {userInfo && (
        <>
          <CreateAnnouncementForm />
          <Divider sx={{ my: 4 }} />
        </>
      )}

      <Typography variant="h5" component="h2" gutterBottom>
        Annonces récentes
      </Typography>
      {content}
    </Box>
  );
};

export default AnnouncementsPage;