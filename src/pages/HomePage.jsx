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
import { useState, useEffect } from 'react'; // <-- NOUVEAUX IMPORTS
import io from 'socket.io-client'; // <-- NOUVEL IMPORT
import InteractiveMap from '../components/InteractiveMap'; // <-- NOUVEL IMPORT

const socket = io('https://radio-mafere-backend.onrender.com'); // <-- NOUVELLE LIGNE

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const [likePost] = useLikePostMutation();
  const navigate = useNavigate();

  // --- NOUVELLE LOGIQUE POUR LA CARTE ---
  const [pings, setPings] = useState([]);

  useEffect(() => {
    // 1. On écoute les pings des autres utilisateurs
    const handleNewPing = (newPing) => {
      setPings((currentPings) => [...currentPings, newPing]);
      // On fait disparaître le ping après 5 secondes
      setTimeout(() => {
        setPings((currentPings) => currentPings.filter(p => p.id !== newPing.id));
      }, 5000);
    };

    socket.on('new_listener_location', handleNewPing);

    // 2. On nettoie l'écouteur quand on quitte la page
    return () => {
      socket.off('new_listener_location', handleNewPing);
    };
  }, []);
  // --- FIN DE LA NOUVELLE LOGIQUE ---

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
      {/* Colonne principale pour le contenu */}
      <Grid item xs={12} md={8}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>Fil d'actualités</Typography>
          <AddPostForm />
          <Box>{content}</Box>
        </Box>
      </Grid>
      
      {/* Colonne latérale pour la carte et les publicités */}
      <Grid item xs={12} md={4}>
        <Box sx={{ position: 'sticky', top: '20px' }}> {/* Pour que la colonne reste visible au scroll */}
          <InteractiveMap pings={pings} />
          <AdvertisementSidebar />
        </Box>
      </Grid>
    </Grid>
  );
};

export default HomePage;