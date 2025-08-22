import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddPostMutation } from '../features/api/apiSlice';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const AddPostForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [addPost, { isLoading }] = useAddPostMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await addPost({ content }).unwrap();
      setContent(''); // Vide le champ après succès
      toast.success('Votre dédicace a été envoyée !');
    } catch (error) {
      toast.error(error?.data?.message || 'Impossible d\'envoyer la dédicace.');
    }
  };

  // N'affiche le formulaire que si l'utilisateur est connecté
  if (!userInfo) return null;

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        multiline
        rows={3}
        label={`Une dédicace, ${userInfo.prenom} ?`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 1 }}
        disabled={isLoading || !content.trim()}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Envoyer'}
      </Button>
    </Box>
  );
};

export default AddPostForm;