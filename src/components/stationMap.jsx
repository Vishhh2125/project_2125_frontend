import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import LiveLocationMarker from "./LiveLocationMarker";

const createMarkerIcon = () =>
  L.divIcon({
    className: "station-marker",
    html: `<span style="color:#2563eb;font-size:1.5rem;"><i class="fas fa-charging-station"></i></span>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
const StationMap = ({ stations, userLocation, mapRef }) => {
  return (
    <MapContainer
      center={userLocation || [18.5204, 73.8567]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stations.map((station) => (
        <Marker key={station._id} position={[station.location.latitude, station.location.longitude]} icon={createMarkerIcon()}>
          <Popup>
            <div className="space-y-1">
              <h4 className="font-bold">{station.name}</h4>
              <p>Connection: {station.connectorType}</p>
              <p>Power Output: {station.powerOutput} kW</p>
              <p className={station.status === "Active" ? "text-green-600" : "text-red-600"}>
                {station.status}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
      <LiveLocationMarker />
    </MapContainer>
  );
}

export default StationMap;