// src/pages/DashboardPage.jsx
import { useSelector } from 'react-redux';
import { useGetUsersQuery, useUpdateUserStatusMutation, useGetStatsQuery } from '../features/api/apiSlice';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  Button, 
  Grid, 
  Alert,
  Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import StatCard from '../components/StatCard';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import TodayIcon from '@mui/icons-material/Today';
import CalendarViewWeekIcon from '@mui/icons-material/CalendarViewWeek';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PendingAnnouncements from '../components/PendingAnnouncements';
import AdvertisementManager from '../components/AdvertisementManager'; // <-- On importe le composant manquant

const getRoleChipColor = (role) => {
  if (role === 'super_admin') return 'secondary';
  if (role === 'admin') return 'primary';
  return 'default';
};

const getStatusChipColor = (status) => {
  if (status === 'actif') return 'success';
  if (status === 'bloqué') return 'warning';
  if (status === 'banni') return 'error';
  return 'default';
};

const DashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: stats, isLoading: isLoadingStats } = useGetStatsQuery();
  const { data: users, isLoading: isLoadingUsers, isSuccess: isUsersSuccess, isError: isUsersError, error: usersError } = useGetUsersQuery();
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus({ userId, statut: newStatus }).unwrap();
      toast.success('Statut de l\'utilisateur mis à jour !');
    } catch (err) {
      toast.error(err?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Tableau de Bord
      </Typography>

      {isLoadingStats && <CircularProgress />}
      {stats && (
        <Box>
          <Typography variant="h5" gutterBottom>Activité des Utilisateurs</Typography>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <StatCard title="Aujourd'hui" value={stats.activeUsers?.daily ?? 0} icon={<TodayIcon fontSize="inherit" />} color="#ff9800" />
            </Grid>
            <Grid item xs={6} sm={4}>
              <StatCard title="Cette semaine" value={stats.activeUsers?.weekly ?? 0} icon={<CalendarViewWeekIcon fontSize="inherit" />} color="#2196f3" />
            </Grid>
            <Grid item xs={6} sm={4}>
              <StatCard title="Ce mois-ci" value={stats.activeUsers?.monthly ?? 0} icon={<CalendarMonthIcon fontSize="inherit" />} color="#4caf50" />
            </Grid>
          </Grid>
          
          <Typography variant="h5" gutterBottom>Statistiques Générales</Typography>
          <Grid container spacing={2} sx={{ mb: 5 }}>
            <Grid item xs={6} sm={3}>
              <StatCard title="Total Users" value={stats.totalUsers ?? 0} icon={<PeopleIcon fontSize="inherit" />} color="#673ab7" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Publications" value={stats.totalPosts ?? 0} icon={<PostAddIcon fontSize="inherit" />} color="#009688" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Actifs" value={stats.usersByStatus.actif ?? 0} icon={<CheckCircleIcon fontSize="inherit" />} color="#0288d1" />
            </Grid>
            <Grid item xs={6} sm={3}>
              <StatCard title="Bannis" value={stats.usersByStatus.banni ?? 0} icon={<BlockIcon fontSize="inherit" />} color="#d32f2f" />
            </Grid>
          </Grid>
        </Box>
      )}
      
      <Typography variant="h5" gutterBottom>Gestion des Utilisateurs</Typography>
      {isLoadingUsers && <CircularProgress />}
      {isUsersError && <Alert severity="error">{usersError?.data?.message || 'Erreur lors du chargement des utilisateurs.'}</Alert>}
      {isUsersSuccess && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rôle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.prenom} {user.nom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} color={getRoleChipColor(user.role)} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.statut} color={getStatusChipColor(user.statut)} size="small" />
                  </TableCell>
                  <TableCell>
                    {user.statut === 'actif' ? (
                      <Button variant="contained" color="error" size="small" onClick={() => handleStatusChange(user._id, 'banni')} disabled={isUpdating || user.role === 'super_admin' || user._id === userInfo._id}>Bannir</Button>
                    ) : (
                      <Button variant="contained" color="success" size="small" onClick={() => handleStatusChange(user._id, 'actif')} disabled={isUpdating || user.role === 'super_admin' || user._id === userInfo._id}>Réactiver</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Divider sx={{ my: 4 }} />
      <PendingAnnouncements />

      {/* --- On ajoute la gestion des publicités ici --- */}
      <Divider sx={{ my: 4 }} />
      <AdvertisementManager />
      
    </Box>
  );
};

export default DashboardPage;