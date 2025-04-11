import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Import icons using ES module syntax
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default icon issue with ES modules
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ complaints }) => {
  const [addresses, setAddresses] = useState({});

  // For each complaint, get a human-readable address via reverse geocoding if valid numeric coordinates are found.
  useEffect(() => {
    complaints.forEach((complaint) => {
      let lat, lng;

      // First, try to extract numeric coordinates from complaint.coordinates
      if (complaint.coordinates) {
        try {
          const coords = JSON.parse(complaint.coordinates);
          if (Array.isArray(coords) && coords.length === 2 && !coords.some(isNaN)) {
            lat = parseFloat(coords[0]);
            lng = parseFloat(coords[1]);
          }
        } catch (e) {
          console.error("Error parsing complaint.coordinates:", e);
        }
      }
      // Fallback: If no valid coordinates field, try to parse complaint.location
      if (lat == null || lng == null) {
        if (complaint.location && complaint.location.includes(',')) {
          const parts = complaint.location.split(',').map(coord => parseFloat(coord.trim()));
          if (parts.length === 2 && !parts.some(isNaN)) {
            [lat, lng] = parts;
          } else {
            console.warn('Invalid numeric coordinates in complaint.location:', complaint.location);
            return; // Skip reverse geocoding if coordinates cannot be parsed
          }
        } else {
          console.warn('No coordinates found in complaint:', complaint);
          return;
        }
      }

      const key = `${lat},${lng}`;
      if (!addresses[key]) {
        // Use your own backend reverse geocode endpoint or Nominatim directly.
        axios
          .get(`http://localhost:8000/api/geocode/reverse?lat=${lat}&lon=${lng}`)
          .then((res) => {
            if (res.data && res.data.display_name) {
              setAddresses(prev => ({ ...prev, [key]: res.data.display_name }));
            }
          })
          .catch((err) => console.error("Geocoding error: ", err));
      }
    });
  }, [complaints]); // Do not include addresses in the dependency array to prevent infinite loops

  // Determine map center: returns the first valid numeric coordinates found.
  const getCenter = () => {
    for (let c of complaints) {
      let lat, lng;
      if (c.coordinates) {
        try {
          const coords = JSON.parse(c.coordinates);
          if (Array.isArray(coords) && coords.length === 2 && !coords.some(isNaN)) {
            return [parseFloat(coords[0]), parseFloat(coords[1])];
          }
        } catch (e) {
          console.error("Error parsing center coordinates:", e);
        }
      } else if (c.location && c.location.includes(',')) {
        const parts = c.location.split(',').map(coord => parseFloat(coord.trim()));
        if (parts.length === 2 && !parts.some(isNaN)) {
          return parts;
        }
      }
    }
    // Fallback center (Delhi)
    return [28.6139, 77.2090];
  };

  return (
    <div className="map-view" style={{ height: '500px', marginTop: '20px' }}>
      <MapContainer center={getCenter()} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
          OpenStreetMap</a> contributors'
        />
        {complaints.map((c, idx) => {
          let lat, lng;
          if (c.coordinates) {
            try {
              const coords = JSON.parse(c.coordinates);
              if (Array.isArray(coords) && coords.length === 2 && !coords.some(isNaN)) {
                lat = parseFloat(coords[0]);
                lng = parseFloat(coords[1]);
              }
            } catch (e) {
              console.error("Error parsing complaint.coordinates:", e);
            }
          }
          if (lat == null || lng == null) {
            if (c.location && c.location.includes(',')) {
              const parts = c.location.split(',').map(coord => parseFloat(coord.trim()));
              if (parts.length === 2 && !parts.some(isNaN)) {
                [lat, lng] = parts;
              } else {
                return null;
              }
            } else {
              return null;
            }
          }
          const key = `${lat},${lng}`;
          const address = addresses[key];
          return (
            <Marker key={idx} position={[lat, lng]}>
              <Popup>
                <div className="popup-content">
                  <h4>{c.title || "Complaint"}</h4>
                  <p><strong>Description:</strong> {c.description}</p>
                  <p><strong>Date:</strong> {new Date(c.createdAt).toLocaleDateString()}</p>
                  <p><strong>User:</strong> {c.user}</p>
                  {address && <p><strong>Location:</strong> {address}</p>}
                  {c.media && (
                    <img
                      src={c.media}
                      alt="Complaint"
                      style={{ maxWidth: '200px', marginTop: '10px' }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
