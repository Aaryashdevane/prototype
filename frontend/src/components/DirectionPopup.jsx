import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "./DirectionPopup.css"; // Add a CSS file for custom styling

const Routing = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    console.log("Routing from:", from, "to:", to);

    // Validate the map and coordinates
    if (!map) {
      console.error("Map is not initialized yet.");
      return;
    }

    if (!from || !to || from.length !== 2 || to.length !== 2 || isNaN(from[0]) || isNaN(to[0])) {
      console.error("Invalid coordinates for routing:", { from, to });
      return;
    }

    // Add routing control to the map
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      createMarker: (i, waypoint) => {
        return L.marker(waypoint.latLng, {
          icon: L.icon({
            iconUrl: i === 0 ? "https://cdn-icons-png.flaticon.com/512/684/684908.png" : "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [30, 30],
          }),
        });
      },
    }).addTo(map);

    // Cleanup the routing control when the component unmounts
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [from, to, map]);

  return null;
};

const DirectionPopup = ({ from, to, onClose }) => {
  return (
    <div className="direction-popup">
      <div className="direction-popup-header">
        <h3>Directions</h3>
        <button onClick={onClose} className="close-button">
          ✖
        </button>
      </div>
      <div className="direction-popup-map">
        <MapContainer center={from} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Routing from={from} to={to} />
        </MapContainer>
      </div>
    </div>
  );
};

export default DirectionPopup;