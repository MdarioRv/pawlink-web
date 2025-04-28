'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import BotonRegresar from '@/components/back'

export default function ConfirmacionOrdenPage() {
    const searchParams = useSearchParams()
    const ordenId = searchParams.get('id')
    const { user, loading } = useUser()
    const router = useRouter()

    const [orden, setOrden] = useState<any>(null)
    const [mascota, setMascota] = useState<any>(null)
    const [modeloSeleccionado, setModeloSeleccionado] = useState<string | null>(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (!loading && !user) router.push('/login')
        if (user && ordenId) cargarOrden()
    }, [user, ordenId, loading])

    const cargarOrden = async () => {
        const { data, error } = await supabase
            .from('ordenes_placas')
            .select(`
                id,
                mascota_id,
                tipo_placa,
                precio,
                estatus,
                direccion_calle,
                direccion_colonia,
                direccion_ciudad,
                direccion_estado,
                direccion_codigo_postal,
                mascotas (nombre)
            `)

            .eq('id', ordenId)
            .eq('usuario_id', user?.id)
            .maybeSingle()

        if (error || !data) {
            toast.error('Orden no encontrada')
            router.push('/dashboard')
        } else {
            setOrden(data)
            setMascota(data.mascotas)
            const modelo = localStorage.getItem('modeloSeleccionado')
            setModeloSeleccionado(modelo)
        }

        setCargando(false)
    }

    const handleProcederPago = () => {
        router.push(`/orden/pago?id=${ordenId}`)
    }

    if (loading || cargando) {
        return <main className="min-h-screen flex items-center justify-center">Cargando...</main>
    }

    if (!orden) return null

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-8 text-center">

                <div className="text-left">
                    <BotonRegresar />
                </div>

                <h1 className="text-3xl font-bold text-blue-700">Confirmación de Pedido 🛒</h1>

                {/* Resumen Producto */}
                <div className="space-y-4 text-left">
                    <div>
                        <p className="font-bold text-gray-700">Placa:</p>
                        <p className="text-gray-600">{orden.tipo_placa === 'qr' ? 'Placa QR Básica' : 'Placa QR + GPS Premium'}</p>
                    </div>

                    <div>
                        <p className="font-bold text-gray-700">Para Mascota:</p>
                        <p className="text-gray-600">{mascota?.nombre || 'Sin nombre'}</p>
                    </div>

                    <div>
                        <p className="font-bold text-gray-700">Modelo Seleccionado:</p>
                        <p className="text-gray-600">{modeloSeleccionado ? modeloSeleccionado.toUpperCase() : 'No seleccionado'}</p>
                    </div>

                    <div>
                        <p className="font-bold text-gray-700">Dirección de Envío:</p>
                        <p className="text-gray-600">
                            {orden.direccion_calle}
                            {orden.direccion_colonia && `, ${orden.direccion_colonia}`}
                            , {orden.direccion_ciudad}, {orden.direccion_estado}, CP {orden.direccion_codigo_postal}
                        </p>
                    </div>


                    <div className="font-bold text-lg text-gray-900 mt-6">
                        Total a Pagar: <span className="text-blue-700">${orden.precio} MXN</span>
                    </div>
                </div>

                <div className="pt-6 space-y-3">
                    <button
                        onClick={handleProcederPago}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                    >
                        Proceder al Pago Seguro
                    </button>

                    <Link
                        href={`/orden/editar/${orden.id}`}
                        className="block text-center text-red-500 hover:underline text-sm"
                    >
                        Editar Orden
                    </Link>
                </div>

            </div>
        </main>
    )
}
