// src/components/CreateAnnouncementForm.jsx
import { useState } from 'react';
import { useCreateAnnouncementMutation } from '../features/api/apiSlice';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { toast } from 'react-toastify';

const CreateAnnouncementForm = () => {
  // State pour les champs de texte
  const [textData, setTextData] = useState({
    title: '',
    content: '',
    category: 'autre',
    contactInfo: '',
  });
  // State séparé pour les fichiers
  const [files, setFiles] = useState([]);

  const [createAnnouncement, { isLoading }] = useCreateAnnouncementMutation();

  const handleTextChange = (e) => {
    setTextData({ ...textData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    // On limite à 5 fichiers
    if (e.target.files.length > 5) {
      toast.error("Vous ne pouvez sélectionner que 5 photos au maximum.");
      return;
    }
    setFiles(Array.from(e.target.files)); // On convertit la FileList en un vrai tableau
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // On utilise FormData car nous envoyons des fichiers
    const formData = new FormData();
    formData.append('title', textData.title);
    formData.append('content', textData.content);
    formData.append('category', textData.category);
    formData.append('contactInfo', textData.contactInfo);

    // On ajoute chaque fichier au FormData
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      await createAnnouncement(formData).unwrap();
      toast.success('Votre annonce a été soumise et est en attente de validation.');
      // On vide le formulaire après succès
      setTextData({ title: '', content: '', category: 'autre', contactInfo: '' });
      setFiles([]);
      // On vide aussi le champ de sélection de fichier
      document.getElementById('image-upload-input').value = null;
    } catch (error) {
      toast.error(error?.data?.message || 'Impossible de soumettre votre annonce.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Publier une nouvelle annonce
      </Typography>
      
      {/* Champs de texte */}
      <TextField fullWidth required label="Titre" name="title" value={textData.title} onChange={handleTextChange} sx={{ mb: 2 }} />
      <FormControl fullWidth required sx={{ mb: 2 }}>
        <InputLabel id="category-label">Catégorie</InputLabel>
        <Select labelId="category-label" name="category" value={textData.category} label="Catégorie" onChange={handleTextChange}>
          <MenuItem value="emploi">Emploi</MenuItem>
          <MenuItem value="vente">Vente</MenuItem>
          <MenuItem value="service">Service</MenuItem>
          <MenuItem value="immobilier">Immobilier</MenuItem>
          <MenuItem value="autre">Autre</MenuItem>
        </Select>
      </FormControl>
      <TextField fullWidth required multiline rows={4} label="Description" name="content" value={textData.content} onChange={handleTextChange} sx={{ mb: 2 }} />
      <TextField fullWidth label="Contact (email, téléphone...)" name="contactInfo" value={textData.contactInfo} onChange={handleTextChange} sx={{ mb: 2 }} />
      
      {/* Champ d'upload de fichiers */}
      <Button variant="outlined" component="label" sx={{ mb: 2 }}>
        Ajouter des photos (5 max)
        <input id="image-upload-input" type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
      </Button>
      
      {/* Affichage des fichiers sélectionnés */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {files.map((file, index) => (
          <Chip key={index} label={file.name} onDelete={() => setFiles(files.filter(f => f.name !== file.name))} />
        ))}
      </Box>

      <Button type="submit" variant="contained" disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : 'Soumettre pour validation'}
      </Button>
    </Box>
  );
};

export default CreateAnnouncementForm;