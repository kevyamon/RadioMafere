// src/components/AdvertisementSidebar.jsx
import { useGetActiveAdvertisementsQuery } from '../features/api/apiSlice';
import { Box, Typography, Card, CardMedia, CardContent, CircularProgress, Alert, Grid } from '@mui/material';

const AdvertisementSidebar = () => {
  const { data: ads, isLoading, isSuccess, isError } = useGetActiveAdvertisementsQuery();

  const backendUrl = 'https://radio-mafere-backend.onrender.com';

  let content;

  if (isLoading) {
    content = <CircularProgress size={24} />;
  } else if (isSuccess && ads.length > 0) {
    content = (
      // On utilise une Grid pour mettre les éléments côte à côte
      <Grid container spacing={2}>
        {ads.map((ad) => (
          // Chaque pub prend 6 colonnes sur 12, donc 2 par ligne
          <Grid item key={ad._id} xs={6}> 
            <Card>
              <a 
                href={`${backendUrl}/api/advertisements/${ad._id}/click`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <CardMedia
                  component="img"
                  image={ad.imageUrl}
                  alt={ad.companyName}
                  sx={{ 
                      width: '100%', 
                      display: 'block',
                      maxHeight: '120px', // On réduit un peu la hauteur
                      objectFit: 'contain'
                  }}
                />
              </a>
              <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                <Typography variant="caption" align="center" component="div" sx={{ fontWeight: 'bold' }}>
                  {ad.companyName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  } else if (isSuccess && ads.length === 0) {
    return null; 
  } else if (isError) {
    content = <Alert severity="warning" sx={{ fontSize: '0.8rem' }}>Impossible de charger les publicités.</Alert>;
  }


  return (
    <Box>
      <Typography variant="overline" display="block" gutterBottom>
        Publicités
      </Typography>
      {content}
    </Box>
  );
};

export default AdvertisementSidebar;