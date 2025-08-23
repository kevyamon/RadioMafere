// src/components/Navbar.jsx
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { logOut } from '../features/auth/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  }

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/landing');
    handleClose();
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
          // Si l'utilisateur est connecté
          <div>
            <Button component={RouterLink} to="/announcements" color="inherit">
              Annonces
            </Button>
            <Button component={RouterLink} to="/agenda" color="inherit">
              Agenda
            </Button>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleNavigate('/profile')}>Profil</MenuItem>
              {userInfo.role !== 'user' && (
                <MenuItem onClick={() => handleNavigate('/dashboard')}>Dashboard</MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
            </Menu>
          </div>
        ) : (
          // Si l'utilisateur n'est pas connecté
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