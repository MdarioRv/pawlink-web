'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FaDog, FaSpinner } from 'react-icons/fa'
import Link from 'next/link'

export default function AdminMascotasPage() {
    const { user, loading } = useUser()
    const router = useRouter()
    const [mascotas, setMascotas] = useState<any[]>([])
    const [loadingMascotas, setLoadingMascotas] = useState(true)

    useEffect(() => {
        const cargarMascotas = async () => {
            if (!user) {
                router.push('/login')
                return
            }

            // Validar que sea admin
            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('id')
                .eq('id', user.id)
                .maybeSingle()

            if (adminError || !adminData) {
                router.push('/dashboard')
                return
            }

            // Cargar mascotas (gracias a la política RLS ya funcionan todas o propias)
            const { data, error } = await supabase
                .from('mascotas')
                .select('id, nombre, tipo, raza, edad, salud, imagen, created_at')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error cargando mascotas:', error)
            } else {
                setMascotas(data)
            }
            setLoadingMascotas(false)
        }

        if (!loading) {
            cargarMascotas()
        }
    }, [user, loading, router])

    if (loading || loadingMascotas) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
                <p className="text-gray-600">Cargando mascotas...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Título */}
                <div className="text-center">
                    <FaDog className="text-5xl text-green-600 mx-auto mb-2" />
                    <h1 className="text-4xl font-bold text-green-600">Administrar Mascotas</h1>
                    <p className="text-gray-600 mt-2">Listado completo de mascotas registradas.</p>
                </div>

                {/* Listado */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mascotas.map((mascota) => (
                        <div key={mascota.id} className="bg-white p-6 rounded-xl shadow space-y-4">
                            {mascota.imagen ? (
                                <img src={mascota.imagen} alt="Mascota" className="w-full h-48 object-cover rounded-lg" />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg text-gray-400">
                                    Sin foto
                                </div>
                            )}

                            <div>
                                <p className="font-bold text-gray-800">Nombre:</p>
                                <p>{mascota.nombre || 'Sin nombre'}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Tipo:</p>
                                <p>{mascota.tipo}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Raza:</p>
                                <p>{mascota.raza}</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Edad:</p>
                                <p>{mascota.edad} años</p>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">Salud:</p>
                                <p>{mascota.salud}</p>
                            </div>

                            <Link
                                href={`/mascota/${mascota.id}`}
                                className="block mt-4 bg-green-600 hover:bg-green-700 text-white text-center py-2 rounded-lg font-semibold transition"
                            >
                                Ver Pública
                            </Link>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    )
}
