// src/components/AnnouncementCard.jsx
import { Card, CardContent, Typography, Box, Chip, CardMedia, Grid } from '@mui/material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const categoryColors = {
  emploi: 'primary',
  vente: 'secondary',
  service: 'success',
  immobilier: 'info',
  autre: 'default',
};

const AnnouncementCard = ({ announcement }) => {
  return (
    <Card sx={{ mb: 3 }}>
      {announcement.images && announcement.images.length > 0 && (
        <CardMedia
          component="img"
          height="200"
          image={announcement.images[0].url} // Affiche la première image
          alt={announcement.title}
        />
      )}
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" component="div">
            {announcement.title}
          </Typography>
          <Chip 
            label={announcement.category} 
            color={categoryColors[announcement.category] || 'default'} 
            size="small" 
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Publié par {announcement.author.prenom} {formatDistanceToNow(parseISO(announcement.createdAt), { addSuffix: true, locale: fr })}
        </Typography>
        <Typography variant="body1" paragraph>
          {announcement.content}
        </Typography>
        {announcement.contactInfo && (
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Contact : {announcement.contactInfo}
            </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;