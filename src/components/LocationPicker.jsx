import { Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const LocationPicker = ({ onLocationSelect, selectedLocation }) => {
  useMapEvents({
    click(e) {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });

  return selectedLocation ? (
    <Marker
      position={selectedLocation}
      icon={L.divIcon({
        className: "location-picker-marker",
        html: `<span style="color:#e11d48;font-size:1.5rem;"><i class="fas fa-map-marker-alt"></i></span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      })}
    />
  ) : null;
}

export default LocationPicker;
