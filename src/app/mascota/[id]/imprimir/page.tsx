'use client'

import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import QRCodeMascota from '@/components/QRCodeMascota'

// ✅ Interfaz correcta
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

export default function ImprimirMascotaPage() {
    const { id } = useParams()
    const [mascota, setMascota] = useState<Mascota | null>(null)

    useEffect(() => {
        const datos: Record<string, Mascota> = {
            '1': {
                nombre: 'Firulais',
                tipo: 'Perro',
                raza: 'Labrador',
                edad: 5,
                imagen: '/firulais.jpg',
                contacto: {
                    nombre: 'Juan Pérez',
                    telefono: '55 1234 5678',
                    email: 'juan@mail.com',
                },
            },
        }

        const clave = String(id)
        setMascota(datos[clave] || null)
    }, [id])

    if (!mascota) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600">Cargando ficha de mascota...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white px-4 py-8 print:px-0 print:py-0">
            <div className="max-w-xl mx-auto border border-gray-300 rounded-xl shadow-md p-6 space-y-6 print:shadow-none print:border-none">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-700">Ficha de Mascota</h1>
                    <p className="text-gray-500 text-sm">Imprime esta hoja y colócala en un lugar visible</p>
                </div>

                {/* Imagen */}
                <div className="flex justify-center">
                    <Image
                        src={mascota.imagen}
                        alt={mascota.nombre}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover border"
                    />
                </div>

                {/* Datos */}
                <div className="text-gray-800 space-y-1 text-sm">
                    <p><strong>Nombre:</strong> {mascota.nombre}</p>
                    <p><strong>Tipo:</strong> {mascota.tipo}</p>
                    <p><strong>Raza:</strong> {mascota.raza}</p>
                    <p><strong>Edad:</strong> {mascota.edad} años</p>
                    <hr className="my-3" />
                    <p><strong>Contacto del dueño:</strong></p>
                    <p>📞 {mascota.contacto.telefono}</p>
                    <p>📧 {mascota.contacto.email}</p>
                </div>

                {/* Código QR */}
                <div className="text-center pt-4 print:pt-2">
                    <QRCodeMascota id={String(id)} nombre={mascota.nombre} />
                </div>

                {/* Botón imprimir */}
                <div className="text-center print:hidden">
                    <button
                        onClick={() => window.print()}
                        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                    >
                        🖨️ Imprimir
                    </button>
                </div>

            </div>
        </main>
    )
}
