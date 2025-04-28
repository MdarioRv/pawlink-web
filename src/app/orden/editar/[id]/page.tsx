'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import BotonRegresar from '@/components/back'

export default function EditarDireccionOrdenPage() {
    const params = useParams()
    const ordenId = params?.id as string
    const router = useRouter()
    const { user, loading } = useUser()

    const [direccion, setDireccion] = useState({
        nombre: '',
        telefono: '',
        calle: '',
        colonia: '',
        ciudad: '',
        estado: '',
        codigoPostal: ''
    })
    const [tipoPlaca, setTipoPlaca] = useState<'qr' | 'gps' | ''>('')
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarDatos = async () => {
            if (!user || !ordenId) return

            const { data: orden } = await supabase
                .from('ordenes_placas')
                .select('direccion_nombre, direccion_telefono, direccion_calle, direccion_colonia, direccion_ciudad, direccion_estado, direccion_codigo_postal, tipo_placa')
                .eq('id', ordenId)
                .eq('usuario_id', user.id)
                .maybeSingle()

            if (orden) {
                setDireccion({
                    nombre: orden.direccion_nombre || '',
                    telefono: orden.direccion_telefono || '',
                    calle: orden.direccion_calle || '',
                    colonia: orden.direccion_colonia || '',
                    ciudad: orden.direccion_ciudad || '',
                    estado: orden.direccion_estado || '',
                    codigoPostal: orden.direccion_codigo_postal || ''
                })
                setTipoPlaca(orden.tipo_placa)
            }
            setCargando(false)
        }

        if (!loading) cargarDatos()
    }, [user, ordenId, loading])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDireccion(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleGuardar = async () => {
        const { nombre, telefono, calle, ciudad, estado, codigoPostal } = direccion

        if (!nombre || !telefono || !calle || !ciudad || !estado || !codigoPostal || !tipoPlaca) {
            toast.error('Completa todos los campos obligatorios')
            return
        }

        const precioNuevo = tipoPlaca === 'qr' ? 150 : 350

        const { error } = await supabase
            .from('ordenes_placas')
            .update({
                direccion_nombre: direccion.nombre,
                direccion_telefono: direccion.telefono,
                direccion_calle: direccion.calle,
                direccion_colonia: direccion.colonia,
                direccion_ciudad: direccion.ciudad,
                direccion_estado: direccion.estado,
                direccion_codigo_postal: direccion.codigoPostal,
                tipo_placa: tipoPlaca,
                precio: precioNuevo
            })
            .eq('id', ordenId)

        if (error) {
            toast.error('Error al guardar cambios')
        } else {
            toast.success('Orden actualizada ✅')
            router.push(`/orden/confirmacion?id=${ordenId}`)
        }
    }

    if (loading || cargando) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                Cargando datos de orden...
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
                <div className="text-left">
                    <BotonRegresar />
                </div>
                <h1 className="text-3xl font-bold text-blue-700 text-center">Editar Orden 📦</h1>
                <p className="text-gray-600 text-center">Modifica los datos de tu orden antes de pagar.</p>

                {/* Cambiar tipo de placa */}
                <div className="text-left">
                    <h2 className="text-xl font-bold text-blue-600 mb-4">Tipo de Placa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setTipoPlaca('qr')}
                            className={`border rounded-lg p-4 text-center ${tipoPlaca === 'qr' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'} transition`}
                        >
                            <p className="font-bold text-blue-700">Placa QR Básica</p>
                            <p className="text-sm text-gray-600">Sin GPS • $150 MXN</p>
                        </button>

                        <button
                            onClick={() => setTipoPlaca('gps')}
                            className={`border rounded-lg p-4 text-center ${tipoPlaca === 'gps' ? 'border-yellow-600 bg-yellow-50' : 'border-gray-300 bg-white'} transition`}
                        >
                            <p className="font-bold text-yellow-700">Placa QR + GPS</p>
                            <p className="text-sm text-gray-700">Incluye GPS • $350 MXN</p>
                        </button>
                    </div>
                </div>

                {/* Dirección de envío */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Nombre del receptor *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={direccion.nombre}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Teléfono *</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={direccion.telefono}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Calle */}
                    <div className="md:col-span-2">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Calle y número *</label>
                        <input
                            type="text"
                            name="calle"
                            value={direccion.calle}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Colonia */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Colonia (opcional)</label>
                        <input
                            type="text"
                            name="colonia"
                            value={direccion.colonia}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Ciudad */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Ciudad *</label>
                        <input
                            type="text"
                            name="ciudad"
                            value={direccion.ciudad}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Estado / Provincia *</label>
                        <input
                            type="text"
                            name="estado"
                            value={direccion.estado}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Código Postal */}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Código Postal *</label>
                        <input
                            type="text"
                            name="codigoPostal"
                            value={direccion.codigoPostal}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Botón guardar */}
                <div className="text-center pt-8">
                    <button
                        onClick={handleGuardar}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </main>
    )
}
