'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaShoppingCart, FaSpinner } from 'react-icons/fa'

export default function OrdenHistorialPage() {
    const { user, loading } = useUser()
    const router = useRouter()
    const [ordenes, setOrdenes] = useState<any[]>([])
    const [loadingOrdenes, setLoadingOrdenes] = useState(true)

    useEffect(() => {
        const cargarOrdenes = async () => {
            if (!user) {
                router.push('/login')
                return
            }

            // Buscar solo órdenes del usuario logueado
            const { data, error } = await supabase
                .from('ordenes_placas')
                .select(`
                    id,
                    mascota_id,
                    tipo_placa,
                    precio,
                    estatus,
                    fecha,
                    mascotas (nombre)
                `)
                .eq('usuario_id', user.id)
                .order('fecha', { ascending: false })

            if (error) {
                console.error('Error cargando órdenes:', error)
            } else {
                setOrdenes(data)
            }
            setLoadingOrdenes(false)
        }

        if (!loading) {
            cargarOrdenes()
        }
    }, [user, loading, router])

    if (loading || loadingOrdenes) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
                <p className="text-gray-600">Cargando historial de órdenes...</p>
            </main>
        )
    }

    if (ordenes.length === 0) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <FaShoppingCart className="text-5xl text-blue-600 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">No tienes órdenes</h1>
                <Link
                    href="/orden"
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                >
                    Ordenar ahora
                </Link>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Título */}
                <section className="text-center space-y-2">
                    <FaShoppingCart className="text-5xl text-blue-700 mx-auto" />
                    <h1 className="text-4xl font-bold text-blue-700">Mi Historial de Órdenes</h1>
                    <p className="text-gray-600">Aquí puedes gestionar tus pedidos.</p>
                </section>

                {/* Órdenes */}
                <section className="grid md:grid-cols-2 gap-6">
                    {ordenes.map((orden) => (
                        <div key={orden.id} className="bg-white p-6 rounded-xl shadow space-y-4">
                            <div>
                                <p className="font-bold text-gray-800">Mascota:</p>
                                <p>{orden.mascotas?.nombre || 'Sin nombre'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Tipo de placa:</p>
                                <p>{orden.tipo_placa === 'qr' ? 'QR Básica' : 'QR + GPS Premium'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Precio:</p>
                                <p>${orden.precio} MXN</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Estado:</p>
                                <p>{orden.estatus === 'pendiente' ? '⏳ Pendiente' : '✅ Pagado'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Fecha:</p>
                                <p>{new Date(orden.fecha).toLocaleDateString('es-MX')}</p>
                            </div>

                            {/* Botón Ver Detalles */}
                            <Link
                                href={`/orden/${orden.id}`}
                                className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-semibold transition"
                            >
                                Ver Detalles
                            </Link>
                        </div>
                    ))}
                </section>

            </div>
        </main>
    )
}
