'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { FaCheckCircle, FaExclamationTriangle, FaTrash } from 'react-icons/fa'
import BotonRegresar from '@/components/back'

export default function OrdenDetallePage() {
    const { id } = useParams()
    const { user, loading } = useUser()
    const router = useRouter()

    const [orden, setOrden] = useState<any>(null)
    const [cargando, setCargando] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }

        if (user && id) {
            cargarOrden()
        }
    }, [user, id, loading])

    const cargarOrden = async () => {
        const { data, error } = await supabase
            .from('ordenes_placas')
            .select(`
        id,
        tipo_placa,
        precio,
        estatus,
        fecha,
        mascota_id,
        mascotas (nombre)
      `)
            .eq('id', id)
            .eq('usuario_id', user?.id)
            .single()

        if (!data || error) {
            toast.error('Orden no encontrada')
            router.push('/dashboard')
            return
        }

        setOrden(data)
        setCargando(false)
    }

    const handleEliminar = async () => {
        setIsDeleting(true)
        const { error } = await supabase
            .from('ordenes_placas')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error('Error al eliminar la orden')
        } else {
            toast.success('Orden eliminada correctamente ❌')
            router.push('/dashboard')
        }

        setIsDeleting(false)
        setShowModal(false)
    }

    if (loading || cargando) {
        return <main className="min-h-screen flex items-center justify-center">Cargando orden...</main>
    }

    if (!orden) {
        return <main className="min-h-screen flex items-center justify-center text-red-600">Orden no encontrada</main>
    }

    const nombrePlaca = orden.tipo_placa === 'qr' ? 'QR Básica' : 'QR + GPS Premium'
    const precio = `$${orden.precio} MXN`
    const fecha = new Date(orden.fecha).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <main className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 sm:p-8 space-y-6">
                <div className="text-left">
                    <BotonRegresar />
                </div>
                {/* Encabezado */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-blue-700">Detalle de la Orden</h1>
                    <p className="text-gray-600">Consulta tu compra y accede a más acciones.</p>
                </div>

                {/* Info */}
                <div className="space-y-2 text-gray-800 text-sm sm:text-base">
                    <p><strong>Mascota:</strong> {orden.mascotas?.nombre || 'Sin nombre'}</p>
                    <p><strong>Tipo de Placa:</strong> {nombrePlaca}</p>
                    <p><strong>Precio:</strong> {precio}</p>
                    <p><strong>Fecha de Orden:</strong> {fecha}</p>
                    <p><strong>Estatus:</strong>{' '}
                        {orden.estatus === 'pendiente' && <span className="text-yellow-600 font-semibold">PENDIENTE</span>}
                        {orden.estatus === 'pagado' && <span className="text-green-600 font-semibold">PAGADO</span>}
                        {orden.estatus === 'enviado' && <span className="text-blue-600 font-semibold">ENVIADO</span>}
                    </p>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-4 pt-4">
                    {orden.estatus === 'pendiente' && (
                        <>
                            <Link href={`/orden/editar/${orden.id}`} className="w-full">
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                                    ✏️ Editar Orden
                                </button>
                            </Link>
                            <Link href={`/orden/pago?id=${orden.id}`} className="w-full">
                                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition">
                                    💳 Proceder al Pago
                                </button>
                            </Link>
                            <button
                                onClick={() => setShowModal(true)}
                                disabled={isDeleting}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
                            >
                                {isDeleting ? 'Eliminando...' : '🗑️ Cancelar Orden'}
                            </button>
                        </>
                    )}

                    {orden.estatus === 'pagado' && (
                        <>
                            <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-md flex items-center gap-2">
                                <FaCheckCircle className="text-green-600" />
                                Esta orden ya ha sido pagada. ¡Gracias!
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                disabled={isDeleting}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
                            >
                                {isDeleting ? 'Eliminando...' : '🗑️ Eliminar Orden'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Modal de confirmación */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <FaExclamationTriangle className="text-xl" />
                            <h2 className="text-lg font-bold">¿Eliminar esta orden?</h2>
                        </div>
                        <p className="text-gray-700 text-sm mb-4">
                            Esta acción no se puede deshacer. Se eliminará la orden permanentemente de tu historial.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEliminar}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
