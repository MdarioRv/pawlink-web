'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import UbicacionMapa from '@/components/UbicacionMapa'
import { FaPaw } from 'react-icons/fa'
import BotonRegresar from '@/components/back'

export default function MascotaPublicaPage() {
    const { id } = useParams()
    const [mascota, setMascota] = useState<any>(null)
    const [dueño, setDueño] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const obtenerDatos = async () => {
            if (!id) return

            // 1. Cargar datos de la mascota
            const { data: mascotaData, error: mascotaError } = await supabase
                .from('mascotas')
                .select('*')
                .eq('id', id)
                .single()

            if (mascotaError || !mascotaData) {
                console.error('Error al cargar mascota:', mascotaError)
                setLoading(false)
                return
            }

            setMascota(mascotaData)

            // 2. Cargar datos del dueño
            const { data: perfilData } = await supabase
                .from('perfiles')
                .select('nombre, telefono, direccion, foto, email')
                .eq('id', mascotaData.dueño_id)
                .single()

            setDueño({
                nombre: perfilData?.nombre || 'Usuario',
                telefono: perfilData?.telefono || 'No disponible',
                email: perfilData?.email || 'No disponible',
            })

            // 3. Cargar última ubicación
            const { data: ubicacionData } = await supabase
                .from('ubicaciones')
                .select('*')
                .eq('mascota_id', id)
                .order('fecha', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (ubicacionData) {
                setMascota((prev: any) => ({
                    ...prev,
                    ubicacion: ubicacionData
                }))
            }

            setLoading(false)
        }

        obtenerDatos()
    }, [id])

    if (loading) {
        return <main className="min-h-screen flex justify-center items-center">Cargando ficha de mascota...</main>
    }

    if (!mascota) {
        return <main className="min-h-screen flex justify-center items-center text-red-600">Mascota no encontrada</main>
    }

    return (
        <main className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
                {/* Botón Regresar */}
                <div className="text-left">
                    <BotonRegresar />
                </div>

                {/* Encabezado */}
                <div className="flex items-center gap-3">
                    <FaPaw className="text-blue-600 w-8 h-8" />
                    <h1 className="text-3xl font-bold text-blue-800">Hola, soy {mascota.nombre}</h1>
                </div>

                {/* Imagen */}
                <div className="flex justify-center">
                    <Image
                        src={mascota.imagen}
                        alt={`Foto de ${mascota.nombre}`}
                        width={200}
                        height={200}
                        className="rounded-xl border object-cover"
                        unoptimized
                    />
                </div>

                {/* Información */}
                <div className="space-y-2 text-gray-700 text-base">
                    <p><strong>Tipo:</strong> {mascota.tipo}</p>
                    <p><strong>Raza:</strong> {mascota.raza}</p>
                    <p><strong>Edad:</strong> {mascota.edad} años</p>
                    <p><strong>Estado de salud:</strong> {mascota.salud}</p>
                </div>

                {/* Mapa si existe ubicación */}
                {mascota.ubicacion && (
                    <div className="pt-4 space-y-2">
                        <h2 className="text-xl font-semibold text-gray-800">Última ubicación conocida 📍</h2>
                        <UbicacionMapa
                            lat={mascota.ubicacion.lat}
                            lng={mascota.ubicacion.lng}
                            ciudad={mascota.ubicacion.ciudad}
                            fecha={mascota.ubicacion.fecha}
                        />
                    </div>
                )}

                {/* Contacto */}
                {dueño && (
                    <div className="mt-6 bg-blue-100 border border-blue-300 text-blue-800 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-1">¿Encontraste a {mascota.nombre}?</h3>
                        <p className="text-sm">Por favor contacta a su dueño:</p>
                        <p className="mt-1 font-medium">👤 {dueño.nombre}</p>
                        <p className="font-medium">📞 {dueño.telefono}</p>
                        <p className="font-medium">📧 {dueño.email}</p>
                    </div>
                )}
            </div>
        </main>
    )
}
