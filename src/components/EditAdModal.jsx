// src/components/EditAdModal.jsx
import { useState, useEffect } from 'react';
import { useUpdateAdvertisementMutation } from '../features/api/apiSlice';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const EditAdModal = ({ ad, open, onClose }) => {
  const [formData, setFormData] = useState({ companyName: '', targetUrl: '' });
  const [status, setStatus] = useState('active');
  const [updateAdvertisement, { isLoading }] = useUpdateAdvertisementMutation();

  useEffect(() => {
    if (ad) {
      setFormData({ companyName: ad.companyName, targetUrl: ad.targetUrl });
      setStatus(ad.status);
    }
  }, [ad]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.checked ? 'active' : 'inactive');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adFormData = new FormData();
    adFormData.append('companyName', formData.companyName);
    adFormData.append('targetUrl', formData.targetUrl);
    adFormData.append('status', status);

    try {
      await updateAdvertisement({ id: ad._id, formData: adFormData }).unwrap();
      toast.success('Publicité mise à jour avec succès !');
      onClose();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  if (!ad) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2">
          Modifier la publicité
        </Typography>
        <TextField
          fullWidth required margin="normal"
          label="Nom de l'entreprise" name="companyName"
          value={formData.companyName} onChange={handleChange}
        />
        <TextField
          fullWidth required margin="normal"
          label="URL de destination" name="targetUrl"
          value={formData.targetUrl} onChange={handleChange}
        />
        <FormControlLabel
          control={<Switch checked={status === 'active'} onChange={handleStatusChange} />}
          label={status === 'active' ? 'Active' : 'Inactive'}
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Sauvegarder'}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Annuler
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default EditAdModal;