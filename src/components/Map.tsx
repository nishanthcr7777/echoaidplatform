import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';

    // Fix for default marker icon issue with webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    interface MapProps {
      lat: number;
      lng: number;
      locationName: string;
    }

    export default function Map({ lat, lng, locationName }: MapProps) {
      if (typeof window === 'undefined') {
        return null;
      }

      return (
        <div style={{ position: 'relative', zIndex: 0 }}>
          <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom={false} style={{ height: '200px', width: '100%', borderRadius: '8px' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
              <Popup>
                {locationName}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      );
    }
