'use client'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// 🐾 Icono personalizado
const mascotaIcon = L.icon({
    iconUrl: '/huella.png',
    iconSize: [25, 25],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
})

interface Props {
    lat: number
    lng: number
    ciudad?: string
    fecha?: string
    historial?: { lat: number; lng: number; fecha: string }[]
}

export default function UbicacionMapaLeaflet({ lat, lng, ciudad, fecha, historial }: Props) {
    useEffect(() => {
        // Eliminamos _getIconUrl con tipado correcto
        delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => string })._getIconUrl
        L.Icon.Default.mergeOptions({ shadowUrl: '' })
    }, [])

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={16}
            scrollWheelZoom={true}
            className="h-[400px] w-full rounded-lg z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Último punto */}
            <Marker position={[lat, lng]} icon={mascotaIcon}>
                <Popup>
                    Última ubicación conocida en <strong>{ciudad || 'desconocida'}</strong><br />
                    {fecha ? new Date(fecha).toLocaleString() : ''}
                </Popup>
            </Marker>

            {/* Historial de caminata */}
            {historial && historial.length > 1 && (
                <Polyline
                    positions={historial.map(p => [p.lat, p.lng])}
                    color="blue"
                    weight={4}
                />
            )}
        </MapContainer>
    )
}
