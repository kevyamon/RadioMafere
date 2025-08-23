// src/components/EventCard.jsx
import { Card, CardContent, Typography, Box, Button, Chip } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

const EventCard = ({ event, onParticipate, isParticipating, userInfo }) => {
  const eventDate = new Date(event.date);

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: 5, borderColor: 'primary.main' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom>
          {event.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {event.description}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon sx={{ mr: 1, color: 'action.active' }} />
          <Typography variant="body2">
            {format(eventDate, "'Le' EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
          </Typography>
        </Box>
        
        {event.location && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 1, color: 'action.active' }} />
            <Typography variant="body2">{event.location}</Typography>
          </Box>
        )}
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
        <Chip 
          icon={<PeopleIcon />} 
          label={`${event.participants.length} participant(s)`} 
        />
        {userInfo && (
            <Button 
                variant={isParticipating ? "outlined" : "contained"} 
                size="small"
                onClick={() => onParticipate(event._id)}
            >
                {isParticipating ? "Je ne participe plus" : "Je participe"}
            </Button>
        )}
      </Box>
    </Card>
  );
};

export default EventCard;