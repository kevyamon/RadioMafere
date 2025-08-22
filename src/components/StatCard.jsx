import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, customcolor }) => ({
  backgroundColor: customcolor || theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
    cursor: 'pointer',
  },
  height: '100%', // Assure que toutes les cartes ont la même hauteur
}));

const StatCard = ({ title, value, icon, color }) => {
  return (
    <StyledCard customcolor={color}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography sx={{ opacity: 0.9 }}>{title}</Typography>
          <Box sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, opacity: 0.3 }}>
            {icon}
          </Box>
        </Box>
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            alignSelf: 'flex-end',
            fontSize: { xs: '2rem', sm: '2.5rem' } // Police plus petite sur mobile
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default StatCard;