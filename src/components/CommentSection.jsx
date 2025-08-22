import { useState } from 'react';
import { useAddCommentMutation } from '../features/api/apiSlice';
import { Box, TextField, Button, Typography, Avatar, Grid, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const CommentSection = ({ post, userInfo }) => {
  const [commentText, setCommentText] = useState('');
  const [addComment, { isLoading }] = useAddCommentMutation();

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment({ postId: post._id, text: commentText }).unwrap();
      setCommentText('');
    } catch (error) {
      toast.error('Impossible d\'ajouter le commentaire.');
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
      {/* Affichage des commentaires existants */}
      {post.comments.map((comment) => (
        <Grid container wrap="nowrap" spacing={2} key={comment._id} sx={{ mb: 2 }}>
          <Grid item>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {comment.author?.prenom.charAt(0).toUpperCase() || '?'}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle2" component="span" sx={{ fontWeight: 'bold' }}>
              {comment.author?.prenom || 'Utilisateur'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {comment.createdAt ? formatDistanceToNow(parseISO(comment.createdAt), { addSuffix: true, locale: fr }) : ''}
            </Typography>
            <Typography variant="body2">{comment.text}</Typography>
          </Grid>
        </Grid>
      ))}
      
      {/* Formulaire pour ajouter un commentaire (si l'utilisateur est connecté) */}
      {userInfo && (
        <Box component="form" onSubmit={handleSubmitComment} sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            label="Ajouter un commentaire..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button type="submit" variant="contained" disabled={isLoading || !commentText.trim()}>
            {isLoading ? <CircularProgress size={24} /> : 'Publier'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;