// src/components/ConversationList.jsx
import { useGetConversationsQuery } from '../features/api/apiSlice';
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Avatar, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const ConversationList = ({ onSelectConversation, selectedConversationId }) => {
  const { data: conversations, isLoading, isError, isSuccess } = useGetConversationsQuery();

  let content;

  if (isLoading) {
    content = <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  } else if (isError) {
    content = <Alert severity="error">Impossible de charger les conversations.</Alert>;
  } else if (isSuccess && conversations.length === 0) {
    content = <Typography sx={{ p: 2 }}>Aucune conversation.</Typography>;
  } else if (isSuccess) {
    content = (
      <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
        {conversations.map((conv) => (
          <ListItem key={conv._id} disablePadding>
            <ListItemButton
              onClick={() => onSelectConversation(conv)}
              selected={selectedConversationId === conv._id}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {conv.otherParticipant?.prenom.charAt(0).toUpperCase() || '?'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={conv.otherParticipant?.prenom || 'Utilisateur'}
                secondary={
                  <Typography noWrap variant="body2" color="text.secondary">
                    {conv.lastMessage?.text || '...'}
                  </Typography>
                }
              />
               <Typography variant="caption" color="text.secondary" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                {conv.lastMessage ? formatDistanceToNow(parseISO(conv.lastMessage.createdAt), { locale: fr }) : ''}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  return (
    <Box sx={{ borderRight: '1px solid #ddd', height: 'calc(100vh - 160px)', overflowY: 'auto' }}>
      {content}
    </Box>
  );
};

export default ConversationList;