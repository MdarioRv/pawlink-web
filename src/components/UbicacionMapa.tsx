'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Se importa dinámicamente para evitar SSR
const MapaLeaflet = dynamic(() => import('./UbicacionMapaLeaflet'), { ssr: false })

export default function UbicacionMapa({
    lat, lng, ciudad, fecha, historial,
}: {
    lat: number
    lng: number
    ciudad?: string
    fecha?: string
    historial?: { lat: number; lng: number; fecha: string }[]
}) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="text-center text-sm text-gray-500">Cargando mapa...</div>

    return <MapaLeaflet lat={lat} lng={lng} ciudad={ciudad} fecha={fecha} historial={historial} />
}
