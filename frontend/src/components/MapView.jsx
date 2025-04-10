// MapView.jsx
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

    useEffect(() => {
        complaints.forEach((complaint) => {
            if (complaint.location && complaint.location.includes(',')) {
                // Parse lat & lng safely
                const parts = complaint.location.split(',').map(coord => coord.trim());
                const lat = parseFloat(parts[0]);
                const lng = parseFloat(parts[1]);
                if (isNaN(lat) || isNaN(lng)) {
                    console.warn('Invalid coordinates found:', complaint.location);
                    return;
                }
                const key = `${lat},${lng}`;
                if (!addresses[key]) {
                    // Append email parameter for identification as required by Nominatim policy
                    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&email=your-email@example.com`;
                    // Excerpt from MapView.jsx – Updated Reverse Geocode Call
                    axios
                        .get(`http://localhost:8000/api/geocode/reverse?lat=${lat}&lon=${lng}`)
                        .then((res) => {
                            if (res.data && res.data.display_name) {
                                setAddresses((prev) => ({ ...prev, [key]: res.data.display_name }));
                            }
                        })
                        .catch((err) => console.error("Geocoding error: ", err));

                }
            }
        });
        // Include complaints in dependency but omit addresses (it is updated inside)
    }, [complaints]);

    // Determine map center: use the first valid complaint coordinate if available, else a default.
    const getCenter = () => {
        for (let c of complaints) {
            if (c.location && c.location.includes(',')) {
                const parts = c.location.split(',').map(coord => parseFloat(coord.trim()));
                const [lat, lng] = parts;
                if (!isNaN(lat) && !isNaN(lng)) {
                    return [lat, lng];
                }
            }
        }
        // Default center (e.g., center of Delhi)
        return [28.6139, 77.2090];
    };

    return (
        <div className="map-view" style={{ height: '500px', marginTop: '20px' }}>
            <MapContainer center={getCenter()} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {complaints.map((c, idx) => {
                    if (c.location && c.location.includes(',')) {
                        const parts = c.location.split(',').map(coord => parseFloat(coord.trim()));
                        const [lat, lng] = parts;
                        if (isNaN(lat) || isNaN(lng)) return null;
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
                                                alt="complaint"
                                                style={{ maxWidth: '200px', marginTop: '10px' }}
                                            />
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};

export default MapView;
