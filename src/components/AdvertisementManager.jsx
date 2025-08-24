// src/components/AdvertisementManager.jsx
import { useState } from 'react';
import {
  useGetActiveAdvertisementsQuery,
  useCreateAdvertisementMutation,
  useDeleteAdvertisementMutation,
} from '../features/api/apiSlice';
import EditAdModal from './EditAdModal';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Paper,
  Grid,
  Stack,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

const AdvertisementManager = () => {
  const { data: ads, isLoading: isLoadingAds } = useGetActiveAdvertisementsQuery();
  const [createAdvertisement, { isLoading: isCreating }] = useCreateAdvertisementMutation();
  const [deleteAdvertisement, { isLoading: isDeleting }] = useDeleteAdvertisementMutation();

  const [formData, setFormData] = useState({ companyName: '', targetUrl: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [editingAd, setEditingAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez sélectionner une image pour la publicité.");
      return;
    }
    const adFormData = new FormData();
    adFormData.append('companyName', formData.companyName);
    adFormData.append('targetUrl', formData.targetUrl);
    adFormData.append('image', file);
    try {
        await createAdvertisement(adFormData).unwrap();
        toast.success("Publicité créée avec succès !");
        setFormData({ companyName: '', targetUrl: '' });
        setFile(null);
        setPreview(null);
        document.getElementById('ad-image-input').value = null;
    } catch (err) {
        toast.error(err?.data?.message || "Erreur lors de la création.");
    }
  };

  const handleOpenModal = (ad) => {
    setEditingAd(ad);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingAd(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette publicité ? Cette action est irréversible.")) {
      try {
        await deleteAdvertisement(id).unwrap();
        toast.success("Publicité supprimée avec succès.");
      } catch (err) {
        toast.error("Erreur lors de la suppression.");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestion des Publicités
      </Typography>

      {/* --- DÉBUT DU FORMULAIRE RESTAURÉ --- */}
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 4 }} variant="outlined">
        <Typography variant="h6" sx={{ mb: 2 }}>Ajouter une publicité</Typography>
        <TextField fullWidth required label="Nom de l'entreprise" name="companyName" value={formData.companyName} onChange={handleTextChange} sx={{ mb: 2 }} />
        <TextField fullWidth required label="URL de destination" name="targetUrl" value={formData.targetUrl} onChange={handleTextChange} sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="outlined" component="label">
            Choisir une image
            <input id="ad-image-input" type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {preview && <Box component="img" src={preview} alt="Aperçu" sx={{ height: 40, border: '1px solid #ddd', borderRadius: 1 }} />}
          <Button type="submit" variant="contained" disabled={isCreating}>
            {isCreating ? <CircularProgress size={24} /> : 'Créer'}
          </Button>
        </Stack>
      </Paper>
      {/* --- FIN DU FORMULAIRE RESTAURÉ --- */}


      <Typography variant="h6" gutterBottom>Publicités Actives et Inactives</Typography>
      {isLoadingAds && <CircularProgress />}
      {ads && ads.length > 0 ? (
        <Grid container spacing={2}>
            {ads.map(ad => (
                <Grid item key={ad._id} xs={12} sm={6} md={4}>
                    <Paper variant='outlined'>
                        <img 
                            src={ad.imageUrl} alt={ad.companyName} 
                            style={{ width: '100%', display: 'block', height: '150px', objectFit: 'contain', backgroundColor: ad.status === 'inactive' ? '#f5f5f5' : 'transparent', opacity: ad.status === 'inactive' ? 0.5 : 1 }} 
                        />
                        <Box sx={{ p: 1 }}>
                            <Typography variant='subtitle1'>{ad.companyName}</Typography>
                            <Typography variant='body2' color={ad.status === 'inactive' ? 'text.secondary' : 'inherit'}>
                                Statut: {ad.status} | Vues: {ad.views} | Clics: {ad.clicks}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <IconButton size="small" onClick={() => handleOpenModal(ad)}><EditIcon /></IconButton>
                                <IconButton size="small" onClick={() => handleDelete(ad._id)} disabled={isDeleting}><DeleteIcon /></IconButton>
                            </Stack>
                        </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
      ) : (
        <Typography>Aucune publicité pour le moment.</Typography>
      )}

      <EditAdModal ad={editingAd} open={isModalOpen} onClose={handleCloseModal} />
    </Box>
  );
};

export default AdvertisementManager;