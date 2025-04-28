'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Este componente se carga solo en cliente (evita errores con window)
const MapaLeaflet = dynamic(() => import('./UbicacionMapaLeaflet'), { ssr: false })

export default function UbicacionMapa({ lat, lng, ciudad, fecha }: {
    lat: number, lng: number, ciudad?: string, fecha?: string
}) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className="text-center text-sm text-gray-500">Cargando mapa...</div>

    return <MapaLeaflet lat={lat} lng={lng} ciudad={ciudad} fecha={fecha} />
}
