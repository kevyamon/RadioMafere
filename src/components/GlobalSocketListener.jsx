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

    const handleStatusUpdate = ({ statut }) => {
      if (statut === 'banni' && userInfo) {
        toast.error('Votre compte a été banni par un administrateur.');
        localStorage.setItem('bannedUserId', userInfo._id);
        dispatch(logOut());
        navigate('/banned');
      }
    };

    const handleNewPost = (newPost) => {
      dispatch(
        apiSlice.util.updateQueryData('getPosts', undefined, (draftPosts) => {
          if (!draftPosts.some(post => post._id === newPost._id)) {
            draftPosts.unshift(newPost);
          }
        })
      );
    };

    const handleStatsUpdate = () => {
      dispatch(apiSlice.util.invalidateTags(['User', 'Post']));
    };

    socket.on('status_updated', handleStatusUpdate);
    socket.on('new_post', handleNewPost);
    socket.on('stats_updated', handleStatsUpdate);

    return () => {
      socket.off('status_updated', handleStatusUpdate);
      socket.off('new_post', handleNewPost);
      socket.off('stats_updated', handleStatsUpdate);
    };
  }, [userInfo, dispatch, navigate]);

  return null;
};

export default GlobalSocketListener;