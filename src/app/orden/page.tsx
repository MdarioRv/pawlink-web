'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import BotonRegresar from '@/components/back'

export const dynamic = 'force-dynamic'

interface MascotaUsuario {
    id: string
    nombre: string
}

function OrdenarPlacaPage() {
    const searchParams = useSearchParams()
    const isUpgrade = searchParams.get('upgrade') === 'gps'
    const idMascota = searchParams.get('id')
    const router = useRouter()
    const { user } = useUser()

    const [seleccion, setSeleccion] = useState<'qr' | 'gps' | null>(null)
    const [nombreMascota, setNombreMascota] = useState<string | null>(null)
    const [yaTieneOrden, setYaTieneOrden] = useState<boolean>(false)
    const [mascotasUsuario, setMascotasUsuario] = useState<MascotaUsuario[]>([])
    const [idMascotaSeleccionada, setIdMascotaSeleccionada] = useState<string>('')

    const precio = seleccion === 'qr' ? 150 : seleccion === 'gps' ? 350 : 0

    useEffect(() => {
        if (isUpgrade) {
            setSeleccion('gps')
        }
    }, [isUpgrade])

    useEffect(() => {
        const fetchMascota = async () => {
            if (idMascota && isUpgrade) {
                const { data: mascota } = await supabase
                    .from('mascotas')
                    .select('nombre')
                    .eq('id', idMascota)
                    .single()

                if (mascota) setNombreMascota(mascota.nombre)

                const { data: ordenExistente } = await supabase
                    .from('ordenes_placas')
                    .select('id')
                    .eq('mascota_id', idMascota)
                    .maybeSingle()

                setYaTieneOrden(!!ordenExistente)
            }
        }

        fetchMascota()
    }, [idMascota, isUpgrade])

    useEffect(() => {
        const cargarMascotas = async () => {
            if (!isUpgrade && user) {
                const { data } = await supabase
                    .from('mascotas')
                    .select('id, nombre')
                    .eq('dueño_id', user.id)

                if (data) setMascotasUsuario(data)
            }
        }

        cargarMascotas()
    }, [isUpgrade, user])

    useEffect(() => {
        const validarOrden = async () => {
            if (idMascotaSeleccionada) {
                const { data: ordenExistente } = await supabase
                    .from('ordenes_placas')
                    .select('id')
                    .eq('mascota_id', idMascotaSeleccionada)
                    .maybeSingle()

                setYaTieneOrden(!!ordenExistente)
            }
        }

        if (!isUpgrade) {
            validarOrden()
        }
    }, [idMascotaSeleccionada, isUpgrade])

    const handleOrdenar = async () => {
        if (!seleccion || !user) {
            toast.error('Falta información para completar la orden')
            return
        }

        const mascotaIdFinal = isUpgrade ? idMascota : idMascotaSeleccionada

        if (!mascotaIdFinal) {
            toast.error('Debes seleccionar una mascota para asociar la orden')
            return
        }

        const { data, error } = await supabase
            .from('ordenes_placas')
            .insert([
                {
                    usuario_id: user.id,
                    mascota_id: mascotaIdFinal,
                    tipo_placa: seleccion,
                    precio: precio,
                    estatus: 'pendiente',
                }
            ])
            .select('id')
            .single()

        if (error || !data) {
            toast.error('Error al crear orden')
        } else {
            toast.success('Orden creada correctamente')
            router.push(`/orden/modelo?id=${data.id}`)
        }
    }

    if (isUpgrade && !idMascota) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-red-50 text-red-600 font-semibold text-lg">
                ❌ Error: No se proporcionó una mascota válida para actualizar a GPS Premium.
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-10 text-center">

                <div className="text-left">
                    <BotonRegresar />
                </div>

                <h1 className="text-4xl font-extrabold text-blue-700">Selecciona tu placa PAWLINK</h1>
                <p className="text-gray-600 text-lg">Elige la opción que más se ajuste a ti.</p>

                {isUpgrade && (
                    <div className="bg-yellow-100 border border-yellow-400 rounded-md p-4 text-yellow-800 mb-6 text-sm">
                        Estás actualizando la mascota <strong>{nombreMascota || `ID: ${idMascota}`}</strong> a GPS Premium.
                    </div>
                )}

                {!isUpgrade && mascotasUsuario.length > 0 && (
                    <div className="text-left">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            Selecciona la mascota para la placa:
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={idMascotaSeleccionada}
                            onChange={(e) => setIdMascotaSeleccionada(e.target.value)}
                        >
                            <option value="">-- Elige una mascota --</option>
                            {mascotasUsuario.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div
                        onClick={() => setSeleccion('qr')}
                        className={`cursor-pointer rounded-xl border p-6 transition shadow hover:shadow-lg ${seleccion === 'qr' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                    >
                        <h2 className="text-xl font-bold text-blue-700">Placa QR básica</h2>
                        <p className="text-gray-600">Ideal para identificar rápidamente a tu mascota.</p>
                        <ul className="text-sm mt-2 list-disc list-inside text-gray-700 space-y-1">
                            <li>✅ Incluye código QR grabado</li>
                            <li>🚫 No incluye GPS</li>
                            <li>🚫 No incluye notificaciones</li>
                        </ul>
                        <p className="mt-4 text-lg font-semibold text-blue-600">$150 MXN</p>
                    </div>

                    <div
                        onClick={() => setSeleccion('gps')}
                        className={`cursor-pointer rounded-xl border p-6 transition shadow hover:shadow-lg ${seleccion === 'gps' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white'}`}
                    >
                        <h2 className="text-xl font-bold text-yellow-700">Placa QR + GPS</h2>
                        <p className="text-gray-700">Localiza a tu mascota en tiempo real con nuestra tecnología IoT.</p>
                        <ul className="text-sm mt-2 list-disc list-inside text-gray-800 space-y-1">
                            <li>✅ QR grabado + chip GPS integrado</li>
                            <li>✅ Incluye 1 mes de plan premium</li>
                            <li>✅ Acceso a notificaciones y ubicación</li>
                        </ul>
                        <p className="mt-4 text-lg font-semibold text-yellow-700">$350 MXN</p>
                    </div>
                </div>

                {seleccion && (
                    <div className="pt-6">
                        <button
                            onClick={handleOrdenar}
                            disabled={yaTieneOrden}
                            className={`px-8 py-3 rounded-lg font-semibold transition text-white 
                                ${yaTieneOrden ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {seleccion === 'qr'
                                ? 'Ordenar Placa QR Básica'
                                : 'Ordenar Placa QR + GPS (Premium)'}
                        </button>
                        {yaTieneOrden && (
                            <p className="text-sm text-red-500 mt-2">Esta mascota ya tiene una orden pendiente o activa.</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                            Se te pedirá iniciar sesión antes de finalizar.
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando selección de tipo de placa...</div>}>
            <OrdenarPlacaPage />
        </Suspense>
    )
}
