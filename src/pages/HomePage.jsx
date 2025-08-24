// src/pages/HomePage.jsx
import { useSelector } from 'react-redux';
import { useGetPostsQuery, useLikePostMutation } from '../features/api/apiSlice';
import { Box, Typography, Skeleton, Card, CardHeader, Avatar, CardContent, CardActions, IconButton, Divider, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MailOutlineIcon from '@mui/icons-material/MailOutline'; // <-- NOUVEL IMPORT
import AddPostForm from '../components/AddPostForm';
import CommentSection from '../components/CommentSection';
import AdvertisementSidebar from '../components/AdvertisementSidebar';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom'; // <-- NOUVEL IMPORT

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const [likePost] = useLikePostMutation();
  const navigate = useNavigate(); // <-- NOUVEL IMPORT

  const handleLike = (postId) => {
    if (!userInfo) return;
    likePost({ postId, userId: userInfo._id });
  };

  // --- NOUVELLE FONCTION ---
  const handleStartConversation = (recipient) => {
    // On navigue vers la page de messagerie en passant les infos du destinataire
    navigate('/messages', { state: { newRecipient: recipient } });
  };
  // --- FIN DE LA NOUVELLE FONCTION ---

  let content;

  if (isLoading) {
    content = <><Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} /><Skeleton variant="rectangular" height={200} /></>;
  } else if (isSuccess) {
    content = posts.map(post => {
      const isLiked = userInfo ? post.likes.includes(userInfo._id) : false;
      // On vérifie si l'auteur du post n'est pas l'utilisateur connecté
      const isNotCurrentUser = userInfo?._id !== post.author?._id;

      return (
        <Card key={post._id} sx={{ mb: 2 }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>{post.author?.prenom.charAt(0).toUpperCase() || '?'}</Avatar>}
            title={post.author?.prenom || 'Utilisateur inconnu'}
            subheader={post.createdAt ? formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true, locale: fr }) : ''}
            action={
              // On affiche le bouton seulement si l'auteur n'est pas l'utilisateur lui-même
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
      <Grid item xs={12} md={8}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>Fil d'actualités</Typography>
          <AddPostForm />
          <Box>{content}</Box>
        </Box>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <AdvertisementSidebar />
      </Grid>
    </Grid>
  );
};

export default HomePage;