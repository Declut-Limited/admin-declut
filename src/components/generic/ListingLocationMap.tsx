import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ListingLocationMapProps {
  lat: number;
  lng: number;
  label: string;
}

export default function ListingLocationMap({ lat, lng, label }: ListingLocationMapProps) {
  return (
    <div className="w-full h-40 rounded-lg overflow-hidden">
      <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={defaultIcon}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}