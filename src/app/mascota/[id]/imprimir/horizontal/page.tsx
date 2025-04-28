'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import QRCodeMascota from '@/components/QRCodeMascota'

// ✅ Definimos la interfaz correcta
interface Mascota {
    nombre: string
    tipo: string
    raza: string
    edad: number
    imagen: string
    contacto: {
        nombre: string
        telefono: string
        email: string
    }
}

export default function ImprimirHorizontalPage() {
    const { id } = useParams()
    const [mascota, setMascota] = useState<Mascota | null>(null)

    useEffect(() => {
        const datos: Record<string, Mascota> = {
            '1': {
                nombre: 'Loba',
                tipo: 'Perro',
                raza: 'Husky',
                edad: 4,
                imagen: '/loba.jpg',
                contacto: {
                    nombre: 'Ana Torres',
                    telefono: '55 5555 5555',
                    email: 'ana@mail.com',
                },
            },
        }

        const clave = String(id)
        setMascota(datos[clave] || null)
    }, [id])

    if (!mascota) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">Cargando tarjeta horizontal...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-white print:py-0 print:px-0">
            <div className="w-[520px] h-[300px] bg-white border border-gray-300 rounded-xl shadow-xl print:shadow-none print:border-none flex items-center justify-between p-4">

                {/* Foto mascota */}
                <div className="flex-shrink-0">
                    <Image
                        src={mascota.imagen}
                        alt={mascota.nombre}
                        width={100}
                        height={100}
                        className="rounded-full object-cover border"
                    />
                </div>

                {/* Datos */}
                <div className="flex-grow text-gray-800 px-4 space-y-1 text-sm">
                    <h2 className="text-xl font-bold text-blue-700">{mascota.nombre}</h2>
                    <p>{mascota.tipo} - {mascota.raza}</p>
                    <p>Edad: {mascota.edad} años</p>
                    <hr className="my-2" />
                    <p className="text-xs text-gray-600">En caso de extravío contactar:</p>
                    <p className="text-xs">📞 {mascota.contacto.telefono}</p>
                    <p className="text-xs">📧 {mascota.contacto.email}</p>
                </div>

                {/* QR */}
                <div className="flex-shrink-0 bg-white p-1 border border-gray-300 rounded-lg">
                    <QRCodeMascota id={String(id)} nombre={mascota.nombre} />
                </div>
            </div>
        </main>
    )
}
