'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCodeMascota from '@/components/QRCodeMascota'
import { FaQrcode, FaSpinner } from 'react-icons/fa'

interface Mascota {
    id: string
    nombre: string
}

export default function MisQRPage() {
    const { user, loading } = useUser()
    const router = useRouter()
    const [mascotas, setMascotas] = useState<Mascota[]>([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    useEffect(() => {
        const cargarMascotas = async () => {
            if (!user) return

            const { data, error } = await supabase
                .from('mascotas')
                .select('id, nombre')
                .eq('dueño_id', user.id)

            if (!error && data) {
                setMascotas(data as Mascota[])
            }
            setCargando(false)
        }

        if (!loading) {
            cargarMascotas()
        }
    }, [user, loading])

    if (loading || cargando) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
                <p className="text-gray-500">Cargando tus códigos QR...</p>
            </main>
        )
    }

    if (!mascotas.length) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-blue-50 text-center px-4">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-blue-700">No tienes mascotas registradas</h1>
                    <p className="text-gray-600">Registra una mascota primero para generar su QR.</p>
                    <Link href="/mascota/registro">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
                            Registrar Mascota
                        </button>
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-6">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-blue-700 flex items-center justify-center gap-2">
                        <FaQrcode className="text-5xl" /> Códigos QR
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Escanea o descarga el QR de cada mascota. Puedes imprimirlo y colocarlo en su collar.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {mascotas.map((mascota) => (
                        <div key={mascota.id} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center space-y-4 hover:shadow-md transition">
                            <h3 className="text-lg font-semibold">{mascota.nombre}</h3>
                            <QRCodeMascota id={mascota.id} nombre={mascota.nombre} />
                        </div>
                    ))}
                </div>

            </div>
        </main>
    )
}
