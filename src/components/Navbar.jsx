// src/components/Navbar.jsx
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { logOut } from '../features/auth/authSlice';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../features/api/apiSlice'; // <-- NOUVEAUX IMPORTS
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge, // <-- NOUVEL IMPORT
  ListItemText, // <-- NOUVEL IMPORT
  Divider, // <-- NOUVEL IMPORT
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications'; // <-- NOUVEL IMPORT
import { useState } from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- NOUVELLE LOGIQUE POUR LES NOTIFICATIONS ---
  // On ne fetch les notifs que si l'utilisateur est un admin
  const isAdmin = userInfo && (userInfo.role === 'admin' || userInfo.role === 'super_admin');
  const { data: notificationData } = useGetNotificationsQuery(undefined, {
    skip: !isAdmin, // On saute la requête si ce n'est pas un admin
  });
  const [markAsRead] = useMarkAsReadMutation();
  // --- FIN DE LA NOUVELLE LOGIQUE ---

  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // <-- NOUVEL ÉTAT POUR LE MENU NOTIF

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/landing');
    handleClose();
  };

  // NOUVELLE FONCTION : Gère le clic sur une notification
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    // Si la notif a un lien, on y va
    if (notification.link) {
      navigate(notification.link);
    }
    handleNotificationMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to={userInfo ? "/home" : "/landing"}
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          Radio Maféré
        </Typography>

        {userInfo ? (
          <div>
            <Button component={RouterLink} to="/announcements" color="inherit">
              Annonces
            </Button>
            <Button component={RouterLink} to="/agenda" color="inherit">
              Agenda
            </Button>

            {/* --- NOUVEAU BLOC POUR L'ICÔNE DE NOTIFICATION --- */}
            {isAdmin && (
              <>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={handleNotificationMenuOpen}
                >
                  <Badge badgeContent={notificationData?.unreadCount || 0} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Menu
                  anchorEl={notificationAnchorEl}
                  open={Boolean(notificationAnchorEl)}
                  onClose={handleNotificationMenuClose}
                  sx={{ mt: '45px' }}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Box sx={{ width: 360, maxHeight: 400, overflow: 'auto' }}>
                    <Typography variant="h6" sx={{ p: 2 }}>Notifications</Typography>
                    <Divider />
                    {notificationData?.notifications && notificationData.notifications.length > 0 ? (
                      notificationData.notifications.map((notif) => (
                        <MenuItem
                          key={notif._id}
                          onClick={() => handleNotificationClick(notif)}
                          sx={{
                            backgroundColor: !notif.read ? 'action.hover' : 'transparent',
                            whiteSpace: 'normal',
                            my: 1,
                          }}
                        >
                          <ListItemText
                            primary={notif.message}
                            secondary={formatDistanceToNow(parseISO(notif.createdAt), { addSuffix: true, locale: fr })}
                          />
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <ListItemText primary="Aucune nouvelle notification" />
                      </MenuItem>
                    )}
                  </Box>
                </Menu>
              </>
            )}
            {/* --- FIN DU BLOC NOTIFICATION --- */}

            <IconButton
              size="large"
              aria-label="account of current user"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ mt: '45px' }}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => handleNavigate('/profile')}>Profil</MenuItem>
              {isAdmin && (
                <MenuItem onClick={() => handleNavigate('/dashboard')}>Dashboard</MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
            </Menu>
          </div>
        ) : (
          <Box>
            <Button component={RouterLink} to="/login" color="inherit">
              Se connecter
            </Button>
            <Button component={RouterLink} to="/register" color="inherit">
              S'inscrire
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;