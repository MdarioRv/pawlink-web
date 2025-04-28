'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { FaShoppingCart, FaSpinner } from 'react-icons/fa'

export default function AdminOrdenesPage() {
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

            // Verificar si el usuario es admin
            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('id')
                .eq('id', user.id)
                .single()

            if (adminError || !adminData) {
                router.push('/dashboard')
                return
            }

            // Cargar órdenes + nombre de la mascota
            const { data, error } = await supabase
                .from('ordenes_placas')
                .select(`
                    id,
                    mascota_id,
                    tipo_placa,
                    precio,
                    estatus,
                    fecha,
                    mascotas:mascota_id (nombre),
                    usuario_id
                `)
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
            <main className="min-h-screen flex items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
                <p className="text-gray-600">Cargando órdenes...</p>
            </main>
        )
    }

    const pendientes = ordenes.filter(o => o.estatus === 'pendiente')
    const pagadas = ordenes.filter(o => o.estatus === 'pagado')
    const enviadas = ordenes.filter(o => o.estatus === 'enviado')

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Título */}
                <section className="text-center space-y-2">
                    <FaShoppingCart className="text-5xl text-blue-700 mx-auto" />
                    <h1 className="text-4xl font-bold text-blue-700">Administrar Órdenes</h1>
                    <p className="text-gray-600">Revisión de órdenes de placas QR y GPS.</p>
                </section>

                {/* Órdenes Pendientes */}
                <section>
                    <h2 className="text-2xl font-bold text-yellow-600 mb-4">⏳ Órdenes Pendientes</h2>
                    {pendientes.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendientes.map((orden) => (
                                <OrdenCard key={orden.id} orden={orden} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay órdenes pendientes.</p>
                    )}
                </section>

                {/* Órdenes Pagadas */}
                <section>
                    <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Órdenes Pagadas</h2>
                    {pagadas.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pagadas.map((orden) => (
                                <OrdenCard key={orden.id} orden={orden} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay órdenes pagadas.</p>
                    )}
                </section>

                {/* Órdenes Enviadas */}
                <section>
                    <h2 className="text-2xl font-bold text-blue-600 mb-4">📦 Órdenes Enviadas</h2>
                    {enviadas.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enviadas.map((orden) => (
                                <OrdenCard key={orden.id} orden={orden} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay órdenes enviadas.</p>
                    )}
                </section>

            </div>
        </main>
    )
}

function OrdenCard({ orden }: { orden: any }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <div>
                <p className="font-bold text-gray-800">Mascota:</p>
                <p>{orden.mascotas?.nombre || 'Sin nombre'}</p>
                {/* ✅ Corrección aquí */}
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
                <p className="font-bold text-gray-800">Fecha:</p>
                <p>{new Date(orden.fecha).toLocaleDateString('es-MX')}</p>
            </div>

            <Link
                href={`/admin/ordenes/${orden.id}`}
                className="block bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-semibold transition"
            >
                Ver Detalles
            </Link>
        </div>
    )
}
