// LiveLocationMarker.jsx
import { useEffect, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

const liveIcon = L.divIcon({
  className: "live-location-marker",
  html: `<span style="color:#22c55e;font-size:2rem;">
              <i class="fas fa-location-arrow">
                </i>
        </span>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function LiveLocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        map.setView(coords, map.getZoom());
      },
      (err) => {
        // Optionally handle error
      },
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return position ? (
    <Marker position={position} icon={liveIcon}>
      
    </Marker>
  ) : null;
}