import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/api/apiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { Container, Box, Typography, TextField, Button, CircularProgress } from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(loginData).unwrap();
      dispatch(setCredentials(userData));
      toast.success(`Bienvenue, ${userData.prenom} !`);
      navigate('/home'); // <-- MODIFIÉ
    } catch (error) {
      if (error?.data?.isBanned) {
        navigate('/banned');
      } else {
        toast.error(error?.data?.message || 'Identifiants invalides.');
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Connexion</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal" required fullWidth id="login"
            label="Email, Username ou Téléphone" name="login"
            autoComplete="email" autoFocus
            value={loginData.login} onChange={handleChange}
          />
          <TextField
            margin="normal" required fullWidth name="password"
            label="Mot de passe" type="password" id="password"
            autoComplete="current-password"
            value={loginData.password} onChange={handleChange}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Se Connecter'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;