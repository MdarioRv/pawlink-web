'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import { FaSpinner, FaExclamationCircle, FaShoppingCart, FaCreditCard } from 'react-icons/fa'
import BotonRegresar from '@/components/back'

export default function PagoPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user, loading } = useUser()
    const ordenId = searchParams.get('id')

    const [orden, setOrden] = useState<any>(null)
    const [mascota, setMascota] = useState<any>(null)
    const [cargando, setCargando] = useState(true)
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)

    useEffect(() => {
        if (!loading && !user) router.push('/login')
        if (ordenId && user) cargarOrden()
        else if (!loading && !ordenId) setCargando(false)
    }, [user, ordenId, loading])

    const cargarOrden = async () => {
        setCargando(true)
        if (!user?.id || !ordenId) {
            toast.error('No se pudo iniciar la carga de la orden.')
            setCargando(false)
            return
        }

        const { data, error } = await supabase
            .from('ordenes_placas')
            .select('id, mascota_id, tipo_placa, precio, estatus')
            .eq('id', ordenId)
            .eq('usuario_id', user.id)
            .single()

        if (error || !data) {
            toast.error(error?.message || 'Orden no encontrada o no accesible.')
            setOrden(null)
        } else {
            setOrden(data)
            const { data: mascotaData, error: mascotaError } = await supabase
                .from('mascotas')
                .select('nombre')
                .eq('id', data.mascota_id)
                .single()
            setMascota(mascotaError || !mascotaData ? { nombre: 'Mascota' } : mascotaData)
        }

        setCargando(false)
    }

    const handlePagar = async () => {
        if (isProcessingPayment) return
        setIsProcessingPayment(true)

        const { error } = await supabase
            .from('ordenes_placas')
            .update({ estatus: 'pagado' })
            .eq('id', ordenId)

        if (error) {
            toast.error('Error al procesar el pago')
        } else {
            toast.success('¡Pago realizado exitosamente! ✅')
            setOrden((prevOrden: any) => ({ ...prevOrden, estatus: 'pagado' }))
            router.push('/orden/exito')
        }
    }

    const handleEliminar = async () => {
        const confirm = window.confirm('¿Seguro que deseas cancelar y eliminar esta orden? Esta acción no se puede deshacer.')
        if (!confirm) return

        const { error } = await supabase
            .from('ordenes_placas')
            .delete()
            .eq('id', ordenId)

        if (error) {
            toast.error('Error al eliminar la orden')
        } else {
            toast.success('Orden eliminada correctamente 🗑️')
            router.push('/dashboard')
        }
    }

    const isLoading = loading || cargando
    if (isLoading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center text-gray-600 bg-gray-50">
                <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
                <p>Cargando detalles de la orden...</p>
            </main>
        )
    }

    if (!ordenId) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center text-red-600 bg-gray-50">
                <FaExclamationCircle className="text-4xl mb-4" />
                <p>No se especificó un ID de orden en la URL.</p>
            </main>
        )
    }

    if (!orden) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center text-red-600 bg-gray-50">
                <FaExclamationCircle className="text-4xl mb-4" />
                <p>Orden no encontrada o no tienes permiso para verla.</p>
                <button onClick={() => router.push('/dashboard')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Volver al Dashboard
                </button>
            </main>
        )
    }

    const nombrePlaca = orden.tipo_placa === 'qr' ? 'Placa QR Básica' : 'Placa QR + GPS Premium'
    const precioFormateado = orden.precio ? `$${orden.precio.toFixed(2)} MXN` : 'Precio no disponible'

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">

                <div className="bg-blue-600 p-5 text-white flex items-center space-x-3">
                    <FaShoppingCart className="text-2xl" />
                    <h1 className="text-xl font-semibold">Confirmación de Pedido</h1>
                </div>
                <div className="text-left">
                    <BotonRegresar />
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Detalles del Producto</h2>
                        <div className="flex justify-between items-start space-x-4">
                            <div>
                                <p className="font-medium text-gray-700">{nombrePlaca}</p>
                                <p className="text-sm text-gray-500">Para: {mascota?.nombre || 'Tu mascota'}</p>
                            </div>
                            <p className="text-lg font-semibold text-blue-700 whitespace-nowrap">{precioFormateado}</p>
                        </div>
                    </div>

                    <div className="border-t pt-6 space-y-3">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Resumen de Pago</h2>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal:</span>
                            <span>{precioFormateado}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Envío:</span>
                            <span className="font-medium text-green-600">Gratis</span>
                        </div>
                        <div className="border-t border-gray-200 my-3"></div>
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <span>Total a Pagar:</span>
                            <span>{precioFormateado}</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <button
                            onClick={handlePagar}
                            disabled={isProcessingPayment || orden.estatus === 'pagado'}
                            className={`w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${(isProcessingPayment || orden.estatus === 'pagado') ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isProcessingPayment ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Procesando...
                                </>
                            ) : orden.estatus === 'pagado' ? (
                                'Orden Ya Pagada'
                            ) : (
                                <>
                                    <FaCreditCard className="mr-2" />
                                    Proceder al Pago Seguro
                                </>
                            )}
                        </button>

                        {orden.estatus === 'pendiente' && (
                            <button
                                onClick={handleEliminar}
                                className="mt-4 w-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-md transition duration-200 ease-in-out sm:px-6 sm:py-3 sm:rounded-lg sm:text-base text-sm"
                            >
                                🗑️ Cancelar Orden
                            </button>
                        )}


                        {orden.estatus === 'pagado' && (
                            <p className="text-center text-sm text-green-700 mt-3">Esta orden ya fue completada.</p>
                        )}
                    </div>

                    <div className="text-center text-xs text-gray-400 pt-4">
                        Identificador de Orden: {orden.id}
                    </div>
                </div>
            </div>
        </main>
    )
}
