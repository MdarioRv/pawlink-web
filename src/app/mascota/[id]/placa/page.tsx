'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

// ✅ Interfaz correcta
interface Mascota {
    nombre: string
}

export default function PlacaVisualPage() {
    const { id } = useParams()
    const [mascota, setMascota] = useState<Mascota | null>(null)

    useEffect(() => {
        const datos: Record<string, Mascota> = {
            '1': {
                nombre: 'Firulais',
            },
        }

        const clave = String(id)
        setMascota(datos[clave] || null)
    }, [id])

    if (!mascota) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">Cargando diseño de placa...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white py-10 px-4 flex flex-col items-center space-y-12">
            <h1 className="text-2xl font-bold text-blue-700 text-center">Vista de Placa para {mascota.nombre}</h1>

            {/* Vista Frontal - forma de hueso */}
            <div className="relative w-[280px] h-[140px] bg-gradient-to-r from-blue-300 to-blue-500 shadow-2xl border-[6px] border-blue-800 rounded-[999px] flex items-center justify-center before:content-[''] before:absolute before:w-20 before:h-20 before:bg-inherit before:rounded-full before:left-[-30px] before:top-[50%] before:translate-y-[-50%] after:content-[''] after:absolute after:w-20 after:h-20 after:bg-inherit after:rounded-full after:right-[-30px] after:top-[50%] after:translate-y-[-50%]">
                <h2 className="text-white text-4xl font-extrabold drop-shadow-sm tracking-widest uppercase">
                    {mascota.nombre}
                </h2>
            </div>
            <p className="text-gray-500 text-sm">🟦 Vista Frontal – Estilo huesito</p>

            {/* Vista Trasera */}
            <div className="w-[240px] h-[240px] bg-white rounded-full shadow-xl border-4 border-gray-300 flex items-center justify-center p-6">
                <QRCode value={`https://pawlink.vercel.app/mascota/${id}`} size={140} />
            </div>
            <p className="text-gray-500 text-sm">⬛ Vista Posterior – Código QR escaneable</p>
        </main>
    )
}
