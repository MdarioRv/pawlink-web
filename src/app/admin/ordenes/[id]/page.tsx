'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { FaArrowLeft, FaSpinner } from 'react-icons/fa'

export default function AdminOrdenDetallePage() {
    const { user, loading } = useUser()
    const router = useRouter()
    const { id } = useParams()
    const [orden, setOrden] = useState<any>(null)
    const [loadingOrden, setLoadingOrden] = useState(true)

    useEffect(() => {
        const cargarOrden = async () => {
            if (!user) {
                router.push('/login')
                return
            }

            // Validar que sea admin
            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('id')
                .eq('id', user.id)
                .single()

            if (adminError || !adminData) {
                router.push('/dashboard')
                return
            }

            // Cargar datos de la orden
            const { data, error } = await supabase
                .from('ordenes_placas')
                .select(`
                    id,
                    tipo_placa,
                    precio,
                    estatus,
                    fecha,
                    mascotas (nombre, tipo),
                    usuario_id,
                    perfiles:usuario_id (nombre, email)
                `)
                .eq('id', id)
                .single()

            if (error || !data) {
                console.error('Error cargando orden:', error)
                router.push('/admin/ordenes')
                return
            }

            setOrden(data)
            setLoadingOrden(false)
        }

        if (!loading) {
            cargarOrden()
        }
    }, [user, loading, router, id])

    if (loading || loadingOrden) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
                <p className="text-gray-600">Cargando orden...</p>
            </main>
        )
    }

    if (!orden) {
        return (
            <main className="min-h-screen flex items-center justify-center text-red-600">
                Orden no encontrada
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8 bg-white rounded-xl shadow-md p-8">

                {/* Botón volver */}
                <Link href="/admin/ordenes" className="inline-flex items-center text-blue-600 hover:underline mb-4">
                    <FaArrowLeft className="mr-2" />
                    Volver a Órdenes
                </Link>

                {/* Detalle de la Orden */}
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Detalle de la Orden</h1>

                <div className="space-y-4 text-gray-700">
                    <p><strong>Nombre de la mascota:</strong> {orden.mascotas?.nombre || 'Sin nombre'}</p>
                    <p><strong>Tipo de mascota:</strong> {orden.mascotas?.tipo || 'Desconocido'}</p>
                    <p><strong>Tipo de placa:</strong> {orden.tipo_placa === 'qr' ? 'QR Básica' : 'QR + GPS Premium'}</p>
                    <p><strong>Precio:</strong> ${orden.precio} MXN</p>
                    <p><strong>Fecha de orden:</strong> {new Date(orden.fecha).toLocaleDateString('es-MX')}</p>
                    <p><strong>Estatus:</strong> 
                        {orden.estatus === 'pendiente' && <span className="text-yellow-600 font-semibold ml-2">Pendiente</span>}
                        {orden.estatus === 'pagado' && <span className="text-green-600 font-semibold ml-2">Pagado</span>}
                        {orden.estatus === 'enviado' && <span className="text-blue-600 font-semibold ml-2">Enviado</span>}
                    </p>
                </div>

                {/* Información del Usuario */}
                <div className="border-t pt-6 mt-6 space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Información del Usuario</h2>
                    <p><strong>Nombre:</strong> {orden.perfiles?.nombre || 'Sin nombre registrado'}</p>
                    <p><strong>Email:</strong> {orden.perfiles?.email || 'Sin email registrado'}</p>
                </div>

            </div>
        </main>
    )
}
