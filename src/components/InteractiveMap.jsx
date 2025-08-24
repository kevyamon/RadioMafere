// src/components/InteractiveMap.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Typography } from '@mui/material';
import L from 'leaflet';

// Coordonnées approximatives du centre de la Côte d'Ivoire
const centerPosition = [7.539989, -5.547081];

// On crée une icône personnalisée pour nos "pings"
const pingIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="rgba(255,152,0,0.7)" stroke="white" stroke-width="3">
        <animate attributeName="r" from="40" to="50" dur="1s" begin="0s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="50" r="30" fill="rgba(255,152,0,0.9)"/>
    </svg>`),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const InteractiveMap = ({ pings }) => {
  return (
    <Box sx={{ height: '400px', width: '100%', mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ p: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', position: 'relative', zIndex: 1000 }}>
        Nos auditeurs en direct
      </Typography>
      <MapContainer
        center={centerPosition}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', marginTop: '-60px' }} // On ajuste pour que le titre passe par-dessus
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* On affiche un marqueur pour chaque ping reçu */}
        {pings.map(ping => (
          <Marker 
            key={ping.id} 
            position={[ping.lat, ping.lon]} 
            icon={pingIcon}
          >
            <Popup>Un nouvel auditeur près d'ici !</Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default InteractiveMap;