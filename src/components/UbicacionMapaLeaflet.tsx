'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Corrige íconos por defecto de Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
})

export default function UbicacionMapaLeaflet({
    lat,
    lng,
    ciudad,
    fecha,
}: {
    lat: number
    lng: number
    ciudad?: string
    fecha?: string
}) {
    return (
        <div className="w-full h-[300px] rounded-lg overflow-hidden shadow-md border border-gray-200">
            <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        Última ubicación registrada{ciudad ? ` en ${ciudad}` : ''}.<br />
                        {fecha && <span>{fecha}</span>}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
