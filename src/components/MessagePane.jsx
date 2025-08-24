// src/components/MessagePane.jsx
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useSendMessageMutation, useDeleteMessageMutation, useUpdateMessageMutation } from '../features/api/apiSlice';
import { Box, Typography, TextField, Button, CircularProgress, Paper, IconButton, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { parseISO, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-toastify';

const MessagePane = ({ conversation }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // --- NOUVEAUX ÉTATS POUR L'ÉDITION ---
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const { data: messages, isLoading: isLoadingMessages } = useGetMessagesQuery(conversation?._id, {
    skip: !conversation,
    pollingInterval: 30000,
  });

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation(); // <-- NOUVEAU
  const [updateMessage] = useUpdateMessageMutation(); // <-- NOUVEAU

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await sendMessage({ recipientId: conversation.otherParticipant._id, text }).unwrap();
      setText('');
    } catch (err) {
      toast.error("Erreur lors de l'envoi du message.");
    }
  };

  // --- NOUVELLES FONCTIONS ---
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await deleteMessage(messageId).unwrap();
        toast.success("Message supprimé.");
      } catch (err) {
        toast.error("Impossible de supprimer le message.");
      }
    }
  };
  
  const handleStartEdit = (message) => {
    setEditingMessageId(message._id);
    setEditingText(message.text);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText('');
  };
  
  const handleUpdateMessage = async (e) => {
      e.preventDefault();
      if (!editingText.trim()) return;
      try {
          await updateMessage({ messageId: editingMessageId, text: editingText }).unwrap();
          handleCancelEdit(); // On quitte le mode édition
      } catch (err) {
          toast.error("Impossible de modifier le message.");
      }
  };


  if (!conversation) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography color="text.secondary">Sélectionnez une conversation pour commencer</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)' }}>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {isLoadingMessages && <CircularProgress />}
        {messages?.map((msg) => {
          const isSender = msg.senderId._id === userInfo._id;
          const isEditing = editingMessageId === msg._id;

          return (
            <Box key={msg._id} sx={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start', mb: 2 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 1.5,
                  maxWidth: '70%',
                  bgcolor: isSender ? 'primary.main' : 'grey.200',
                  color: isSender ? 'white' : 'black',
                  borderRadius: isSender ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                }}
              >
                {isEditing ? (
                    <Box component="form" onSubmit={handleUpdateMessage}>
                        <TextField
                            variant="standard"
                            size="small"
                            fullWidth
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            autoFocus
                            sx={{ input: { color: 'white' } }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Button type="submit" size="small" variant="contained" color="success">Sauvegarder</Button>
                            <Button size="small" onClick={handleCancelEdit} variant="outlined" color="inherit">Annuler</Button>
                        </Stack>
                    </Box>
                ) : (
                    <>
                        <Typography variant="body1">{msg.text}</Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                                {format(parseISO(msg.createdAt), 'HH:mm', { locale: fr })}
                            </Typography>
                            {isSender && (
                                <Stack direction="row" spacing={0.5}>
                                    <IconButton size="small" onClick={() => handleStartEdit(msg)} sx={{ color: 'rgba(255,255,255,0.7)' }}><EditIcon sx={{ fontSize: '1rem' }} /></IconButton>
                                    <IconButton size="small" onClick={() => handleDeleteMessage(msg._id)} sx={{ color: 'rgba(255,255,255,0.7)' }}><DeleteIcon sx={{ fontSize: '1rem' }} /></IconButton>
                                </Stack>
                            )}
                        </Stack>
                    </>
                )}
              </Paper>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Écrivez votre message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <IconButton type="submit" color="primary" disabled={isSending || !text.trim()}>
          {isSending ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessagePane;