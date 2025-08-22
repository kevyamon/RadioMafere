import { useSelector } from 'react-redux';
import { useGetPostsQuery } from '../features/api/apiSlice';
import { Box, Typography, CircularProgress, Card, CardContent, CardHeader, CardActions, Avatar, Skeleton, IconButton, Divider } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddPostForm from '../components/AddPostForm';
import CommentSection from '../components/CommentSection'; // On importe le nouveau composant
import { useLikePostMutation } from '../features/api/apiSlice';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const LandingPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery();
  const [likePost] = useLikePostMutation();

  const handleLike = (postId) => {
    if (!userInfo) return;
    likePost({ postId, userId: userInfo._id });
  };

  let content;

  if (isLoading) {
    content = <><Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} /><Skeleton variant="rectangular" height={200} /></>;
  } else if (isSuccess) {
    content = posts.map(post => {
      const isLiked = userInfo ? post.likes.includes(userInfo._id) : false;
      return (
        <Card key={post._id} sx={{ mb: 2 }}>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}>{post.author?.prenom.charAt(0).toUpperCase() || '?'}</Avatar>}
            title={post.author?.prenom || 'Utilisateur inconnu'}
            subheader={post.createdAt ? formatDistanceToNow(parseISO(post.createdAt), { addSuffix: true, locale: fr }) : ''}
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
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>Fil d'actualités</Typography>
      <AddPostForm />
      <Box>{content}</Box>
    </Box>
  );
};

export default LandingPage;