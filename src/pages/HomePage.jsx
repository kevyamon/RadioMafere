// src/pages/HomePage.jsx
import { useSelector } from 'react-redux';
import { useGetPostsQuery, useLikePostMutation } from '../features/api/apiSlice';
import { Box, Typography, Skeleton, Card, CardHeader, Avatar, CardContent, CardActions, IconButton, Divider, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AddPostForm from '../components/AddPostForm';
import CommentSection from '../components/CommentSection';
import AdvertisementSidebar from '../components/AdvertisementSidebar';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import InteractiveMap from '../components/InteractiveMap';

const socket = io('https://radio-mafere-backend.onrender.com');

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const [likePost] = useLikePostMutation();
  const navigate = useNavigate();

  const [pings, setPings] = useState([]);

  useEffect(() => {
    fetch('https://radio-mafere-backend.onrender.com/api/location/ping', { method: 'POST' });

    const handleNewPing = (newPing) => {
      setPings((currentPings) => [...currentPings, newPing]);
      setTimeout(() => {
        setPings((currentPings) => currentPings.filter(p => p.id !== newPing.id));
      }, 5000);
    };

    socket.on('new_listener_location', handleNewPing);
    
    return () => {
      socket.off('new_listener_location', handleNewPing);
    };
  }, []);

  const handleLike = (postId) => {
    if (!userInfo) return;
    likePost({ postId, userId: userInfo._id });
  };

  const handleStartConversation = (recipient) => {
    navigate('/messages', { state: { newRecipient: recipient } });
  };

  let content;

  if (isLoading) {
    content = <><Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} /><Skeleton variant="rectangular" height={200} /></>;
  } else if (isSuccess) {
    content = posts.map(post => {
      const isLiked = userInfo ? post.likes.includes(userInfo._id) : false;
      const isNotCurrentUser = userInfo?._id !== post.author?._id;

      return (
        <Card key={post._id} sx={{ mb: 2 }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>{post.author?.prenom.charAt(0).toUpperCase() || '?'}</Avatar>}
            title={post.author?.prenom || 'Utilisateur inconnu'}
            subheader={post.createdAt ? formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true, locale: fr }) : ''}
            action={
              userInfo && isNotCurrentUser && (
                <IconButton onClick={() => handleStartConversation(post.author)} title={`Envoyer un message à ${post.author.prenom}`}>
                  <MailOutlineIcon />
                </IconButton>
              )
            }
          />
          <CardContent>
            <Typography variant="body1">{post.content}</Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="like post" onClick={() => handleLike(post._id)} disabled={!userInfo}>
              {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography variant="body2">{post.likes.length}</Typography>
          </CardActions>
          <Divider />
          <CommentSection post={post} userInfo={userInfo} />
        </Card>
      );
    });
  } else if (isError) {
    content = <Typography color="error">{error.toString()}</Typography>;
  }

  return (
    <Grid container spacing={4}>
      {/* Colonne de gauche : Publicités */}
      <Grid item xs={12} md={3}>
        <Box sx={{ position: 'sticky', top: '20px' }}>
          <AdvertisementSidebar />
        </Box>
      </Grid>
      
      {/* Colonne du milieu : Fil d'actualités */}
      <Grid item xs={12} md={6}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>Fil d'actualités</Typography>
          <AddPostForm />
          <Box>{content}</Box>
        </Box>
      </Grid>
      
      {/* Colonne de droite : Carte */}
      <Grid item xs={12} md={3}>
        {/* L'AJOUT IMPORTANT EST ICI */}
        <Box sx={{ 
          position: 'sticky', 
          top: '20px', 
          height: '400px', // Hauteur fixe pour que la carte puisse s'afficher
          width: '100%'      // S'assure que la boîte prend toute la largeur de la colonne
        }}>
          <InteractiveMap pings={pings} />
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;