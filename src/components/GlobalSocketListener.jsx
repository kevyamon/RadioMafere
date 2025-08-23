// src/components/GlobalSocketListener.jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { logOut } from '../features/auth/authSlice';
import { apiSlice } from '../features/api/apiSlice';
import { toast } from 'react-toastify';

const socket = io('https://radio-mafere-backend.onrender.com');

const GlobalSocketListener = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      socket.emit('user_connected', userInfo._id);
    }

    // --- GESTION DES MISES À JOUR DE STATUT (BANNI, etc.) ---
    const handleStatusUpdate = ({ statut }) => {
      if (statut === 'banni' && userInfo) {
        toast.error('Votre compte a été banni par un administrateur.');
        localStorage.setItem('bannedUserId', userInfo._id);
        dispatch(logOut());
        navigate('/banned');
      }
    };

    // --- GESTION DES NOUVEAUX POSTS ---
    const handleNewPost = (newPost) => {
      dispatch(
        apiSlice.util.updateQueryData('getPosts', undefined, (draftPosts) => {
          if (!draftPosts.some(post => post._id === newPost._id)) {
            draftPosts.unshift(newPost);
          }
        })
      );
    };

    // --- GESTION DES MISES À JOUR DE STATS ---
    const handleStatsUpdate = () => {
      // On rafraîchit les stats, les utilisateurs, etc.
      dispatch(apiSlice.util.invalidateTags(['User', 'Post', 'Stats']));
    };

    // --- NOUVEAU : GESTION DES ANNONCES EN TEMPS RÉEL ---
    // Pour les admins : une nouvelle annonce est en attente
    const handleNewPendingAnnouncement = (newAnnouncement) => {
      if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'super_admin')) {
        toast.info(`Nouvelle annonce à valider : "${newAnnouncement.title.substring(0, 20)}..."`);
        // On force le rafraîchissement de la liste des annonces en attente
        dispatch(apiSlice.util.invalidateTags(['PendingAnnouncement']));
      }
    };

    // Pour l'auteur : le statut de son annonce a changé
    const handleAnnouncementStatusUpdated = ({ message, status }) => {
      if (status === 'approuvée') {
        toast.success(message);
      } else {
        toast.error(message);
      }
      // On rafraîchit aussi la liste publique au cas où
      dispatch(apiSlice.util.invalidateTags(['Announcement']));
    };


    // On écoute tous les événements
    socket.on('status_updated', handleStatusUpdate);
    socket.on('new_post', handleNewPost);
    socket.on('stats_updated', handleStatsUpdate);
    socket.on('new_pending_announcement', handleNewPendingAnnouncement);
    socket.on('announcement_status_updated', handleAnnouncementStatusUpdated);

    // On nettoie les écouteurs quand le composant est démonté
    return () => {
      socket.off('status_updated', handleStatusUpdate);
      socket.off('new_post', handleNewPost);
      socket.off('stats_updated', handleStatsUpdate);
      socket.off('new_pending_announcement', handleNewPendingAnnouncement);
      socket.off('announcement_status_updated', handleAnnouncementStatusUpdated);
    };
  }, [userInfo, dispatch, navigate]);

  return null; // Ce composant n'affiche rien, il ne fait qu'écouter
};

export default GlobalSocketListener;