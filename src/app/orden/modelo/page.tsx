'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

export const dynamic = 'force-dynamic' // Muy importante para forzar dinámica

function SeleccionarModeloPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const ordenId = searchParams.get('id')

    const modelosDisponibles = [
        { id: 'hueso', nombre: 'Hueso', imagen: '/modelo-hueso.png' },
        { id: 'redondo', nombre: 'Redondo', imagen: '/modelo-redondo.png' },
        { id: 'corazon', nombre: 'Corazón', imagen: '/modelo-corazon.png' },
    ]

    const [modeloSeleccionado, setModeloSeleccionado] = useState<string | null>(null)

    const handleContinuar = async () => {
        if (!modeloSeleccionado) {
            toast.error('Por favor selecciona un modelo de placa.')
            return
        }

        if (!ordenId) {
            toast.error('Orden no encontrada.')
            return
        }

        const { error } = await supabase
            .from('ordenes_placas')
            .update({ modelo: modeloSeleccionado })
            .eq('id', ordenId)

        if (error) {
            toast.error('Error al guardar modelo.')
        } else {
            toast.success('Modelo seleccionado exitosamente.')
            router.push(`/orden/direccion?id=${ordenId}`)
        }
    }

    if (!ordenId) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center text-red-600 font-semibold text-lg bg-red-50">
                ❌ Error: No se proporcionó una orden válida.
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                <Link href="/orden" className="text-blue-600 hover:underline text-sm">&larr; Regresar</Link>

                <h1 className="text-3xl font-bold text-blue-700 text-center">Selecciona el Modelo de tu Placa 🐾</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {modelosDisponibles.map((modelo) => (
                        <div
                            key={modelo.id}
                            className={`border rounded-lg p-4 bg-white shadow cursor-pointer hover:ring-2 hover:ring-blue-500 transition ${
                                modeloSeleccionado === modelo.id ? 'ring-2 ring-blue-600' : ''
                            }`}
                            onClick={() => setModeloSeleccionado(modelo.id)}
                        >
                            <Image
                                src={modelo.imagen}
                                alt={modelo.nombre}
                                width={96}
                                height={96}
                                className="mx-auto mb-4"
                            />
                            <h2 className="text-center font-semibold text-gray-800">{modelo.nombre}</h2>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={handleContinuar}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition"
                    >
                        Confirmar Modelo y Continuar
                    </button>
                </div>

            </div>
        </main>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando selección de modelo...</div>}>
            <SeleccionarModeloPage />
        </Suspense>
    )
}
