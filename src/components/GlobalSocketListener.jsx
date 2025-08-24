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
      dispatch(apiSlice.util.invalidateTags(['User', 'Post', 'Stats']));
    };

    // --- GESTION DES ANNONCES EN TEMPS RÉEL ---
    const handleNewPendingAnnouncement = (newAnnouncement) => {
      if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'super_admin')) {
        toast.info(`Nouvelle annonce à valider : "${newAnnouncement.title.substring(0, 20)}..."`);
        dispatch(apiSlice.util.invalidateTags(['PendingAnnouncement']));
      }
    };

    const handleAnnouncementStatusUpdated = ({ message, status }) => {
      if (status === 'approuvée') {
        toast.success(message);
      } else {
        toast.error(message);
      }
      dispatch(apiSlice.util.invalidateTags(['Announcement']));
    };

    // --- GESTION DES NOTIFICATIONS ---
    const handleNewNotification = () => {
      if (userInfo && (userInfo.role === 'admin' || userInfo.role === 'super_admin')) {
        dispatch(apiSlice.util.invalidateTags(['Notification']));
      }
    };

    // --- NOUVEL ÉCOUTEUR POUR LA MESSAGERIE ---
    const handleNewMessage = (newMessage) => {
      // On affiche une petite notification discrète
      // Le backend doit s'assurer que senderId est populé
      toast.info(`Nouveau message de ${newMessage.senderId?.prenom || 'un utilisateur'}`);
      // On invalide le tag pour forcer le rafraîchissement des conversations et des messages
      dispatch(apiSlice.util.invalidateTags(['Message']));
    };

    // On écoute tous les événements
    socket.on('status_updated', handleStatusUpdate);
    socket.on('new_post', handleNewPost);
    socket.on('stats_updated', handleStatsUpdate);
    socket.on('new_pending_announcement', handleNewPendingAnnouncement);
    socket.on('announcement_status_updated', handleAnnouncementStatusUpdated);
    socket.on('new_notification', handleNewNotification);
    socket.on('new_message', handleNewMessage);

    // On nettoie les écouteurs
    return () => {
      socket.off('status_updated', handleStatusUpdate);
      socket.off('new_post', handleNewPost);
      socket.off('stats_updated', handleStatsUpdate);
      socket.off('new_pending_announcement', handleNewPendingAnnouncement);
      socket.off('announcement_status_updated', handleAnnouncementStatusUpdated);
      socket.off('new_notification', handleNewNotification);
      socket.off('new_message', handleNewMessage);
    };
  }, [userInfo, dispatch, navigate]);

  return null;
};

export default GlobalSocketListener;