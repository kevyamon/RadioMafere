// src/components/InteractiveMap.jsx
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // On importe le CSS directement ici pour plus de robustesse

// On garde l'icône animée
const pingIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="rgba(255,152,0,0.7)" stroke="white" stroke-width="3">
        <animate attributeName="r" from="40" to="50" dur="1s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="50" r="30" fill="rgba(255,152,0,0.9)"/>
    </svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

// Le composant Marker a maintenant besoin d'une référence à la carte
const AnimatedMarker = ({ ping, map }) => {
  useEffect(() => {
    if (map && ping) {
      // Animation "flyTo" qui zoome et se déplace vers le nouveau ping
      map.flyTo([ping.lat, ping.lon], 7, { // Zoom à 7
        animate: true,
        duration: 2 // en secondes
      });
    }
  }, [ping, map]);

  return (
    <Marker 
      key={ping.id} 
      position={[ping.lat, ping.lon]} 
      icon={pingIcon}
    >
      <Popup>Un nouvel auditeur près d'ici !</Popup>
    </Marker>
  );
};


const InteractiveMap = ({ pings }) => {
  const [map, setMap] = useState(null);
  const latestPing = pings.length > 0 ? pings[pings.length - 1] : null;

  return (
    <Box sx={{ height: '400px', width: '100%', mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: 3, position: 'relative' }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          p: 2, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          color: 'white',
          zIndex: 1000, // Pour s'afficher au-dessus de la carte
          textAlign: 'center'
        }}
      >
        Nos auditeurs en direct
      </Typography>

      <MapContainer
        center={[7.539989, -5.547081]}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap} // On sauvegarde l'instance de la carte
        zoomControl={true} // On s'assure que le contrôle est activé
      >
        {/* NOUVEAU FOND DE CARTE "DARK" */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* On anime seulement le dernier ping pour éviter les mouvements chaotiques */}
        {latestPing && <AnimatedMarker ping={latestPing} map={map} />}

      </MapContainer>
    </Box>
  );
};

export default InteractiveMap;