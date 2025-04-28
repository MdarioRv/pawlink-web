'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
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

export default function ImprimirCredencialPage() {
    const { id } = useParams()
    const [mascota, setMascota] = useState<Mascota | null>(null) // ✅

    useEffect(() => {
        const datos: Record<string, Mascota> = { // ✅
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
            <main className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">Cargando credencial...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white px-4 py-8 print:py-0 print:px-0">
            <div className="max-w-7xl mx-auto">
                <div className="w-[340px] h-[540px] mx-auto bg-white border border-gray-300 rounded-lg shadow-xl print:shadow-none print:border-none p-4 flex flex-col items-center justify-between">
                    <h1 className="text-lg font-bold text-blue-700">🐾 Carnet de Mascota</h1>

                    <Image
                        src={mascota.imagen}
                        alt={mascota.nombre}
                        width={140}
                        height={140}
                        className="rounded-full border object-cover"
                    />

                    <div className="text-center text-sm space-y-3 text-gray-800 ">
                        <p className="text-base font-bold">{mascota.nombre}</p>
                        <p>{mascota.tipo} - {mascota.raza}</p>
                        <p>{mascota.edad} años</p>
                    </div>

                    <QRCodeMascota id={String(id)} nombre={mascota.nombre} />

                    <div className="text-[14px] text-center text-gray-500 leading-tight">
                        En caso de extravío contacta:<br />
                        📞 {mascota.contacto.telefono}<br />
                        📧 {mascota.contacto.email}
                    </div>

                    <div className="print:hidden mt-4">
                        <button
                            onClick={() => window.print()}
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                            Imprimir
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
