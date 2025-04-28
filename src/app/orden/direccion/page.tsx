'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import BotonRegresar from '@/components/back'

export default function DireccionOrdenPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const ordenId = searchParams.get('id')
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
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const cargarDatos = async () => {
            if (!user || !ordenId) return

            const { data: orden } = await supabase
                .from('ordenes_placas')
                .select('direccion_nombre, direccion_telefono, direccion_calle, direccion_colonia, direccion_ciudad, direccion_estado, direccion_codigo_postal')
                .eq('id', ordenId)
                .eq('usuario_id', user.id)
                .single()

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
        const camposObligatorios = [
            { nombre: 'nombre', etiqueta: 'Nombre del receptor' },
            { nombre: 'telefono', etiqueta: 'Teléfono' },
            { nombre: 'calle', etiqueta: 'Calle y número' },
            { nombre: 'ciudad', etiqueta: 'Ciudad' },
            { nombre: 'estado', etiqueta: 'Estado/Provincia' },
            { nombre: 'codigoPostal', etiqueta: 'Código Postal' },
        ]

        for (const campo of camposObligatorios) {
            if (!direccion[campo.nombre as keyof typeof direccion]?.trim()) {
                toast.error(`Falta completar: ${campo.etiqueta}`)
                return
            }
        }

        const { error } = await supabase
            .from('ordenes_placas')
            .update({
                direccion_nombre: direccion.nombre,
                direccion_telefono: direccion.telefono,
                direccion_calle: direccion.calle,
                direccion_colonia: direccion.colonia,
                direccion_ciudad: direccion.ciudad,
                direccion_estado: direccion.estado,
                direccion_codigo_postal: direccion.codigoPostal
            })
            .eq('id', ordenId)

        if (error) {
            toast.error('Error al guardar dirección')
        } else {
            toast.success('Dirección guardada ✅')
            router.push(`/orden/confirmacion?id=${ordenId}`)
        }
    }

    if (loading || cargando) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                Cargando dirección...
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
                <div className="text-left">
                    <BotonRegresar />
                </div>
                <h1 className="text-3xl font-bold text-blue-700 text-center">Datos de Envío 📦</h1>
                <p className="text-gray-600 text-center">Ingresa la dirección donde recibirás tu placa PAWLINK.</p>

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
                <div className="text-center pt-6">
                    <button
                        onClick={handleGuardar}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg"
                    >
                        Guardar dirección y continuar
                    </button>
                </div>
            </div>
        </main>
    )
}
