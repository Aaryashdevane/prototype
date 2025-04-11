import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

const Routing = ({ from, to }) => {
  const map = useMap();

  useEffect(() => {
    if (!from || !to || isNaN(from[0]) || isNaN(to[0])) return;
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      createMarker: () => null,
      // Optionally, you can set the serviceUrl here if you plan to use your own routing server.
      // serviceUrl: "https://your.routing.server/route/v1"
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [from, to, map]);

  return null;
};

const DirectionPopup = ({ from, to, onClose }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "white",
        padding: "1rem",
        borderRadius: "10px",
        width: "80%",
        maxWidth: "700px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Directions</h3>
        <button onClick={onClose} style={{ fontSize: "18px" }}>
          ✖
        </button>
      </div>
      <div style={{ height: "400px", marginTop: "10px" }}>
        <MapContainer center={from} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <Routing from={from} to={to} />
        </MapContainer>
      </div>
    </div>
  );
};

export default DirectionPopup;
