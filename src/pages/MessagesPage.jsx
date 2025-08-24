// src/pages/MessagesPage.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // <-- NOUVEL IMPORT
import { useGetConversationsQuery } from '../features/api/apiSlice'; // <-- NOUVEL IMPORT
import { Box, Typography, Grid, Paper } from '@mui/material';
import ConversationList from '../components/ConversationList';
import MessagePane from '../components/MessagePane';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const location = useLocation(); // <-- NOUVEL IMPORT
  const { data: conversations, isSuccess } = useGetConversationsQuery(); // <-- NOUVEL IMPORT

  // --- NOUVELLE LOGIQUE ---
  useEffect(() => {
    // On vérifie si on arrive sur la page avec un destinataire dans l'état de navigation
    const newRecipient = location.state?.newRecipient;
    if (newRecipient && isSuccess) {
      // On cherche si une conversation avec cette personne existe déjà
      const existingConversation = conversations.find(
        (conv) => conv.otherParticipant._id === newRecipient._id
      );

      if (existingConversation) {
        // Si oui, on la sélectionne
        setSelectedConversation(existingConversation);
      } else {
        // Si non, on crée une "fausse" conversation temporaire pour l'interface
        // Le backend créera la vraie conversation au premier message envoyé
        setSelectedConversation({
          _id: `new-${newRecipient._id}`, // Un ID temporaire
          otherParticipant: newRecipient,
          lastMessage: null, // Pas encore de message
        });
      }
    }
  }, [location.state, conversations, isSuccess]);
  // --- FIN DE LA NOUVELLE LOGIQUE ---


  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Messagerie Privée
      </Typography>
      
      <Paper elevation={3} sx={{ height: 'calc(100vh - 160px)', display: 'flex' }}>
        <Grid container>
          <Grid item xs={12} sm={4} md={3}>
            <ConversationList 
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversation?._id}
            />
          </Grid>

          <Grid item xs={12} sm={8} md={9}>
            <MessagePane conversation={selectedConversation} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MessagesPage;