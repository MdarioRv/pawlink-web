'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { FaShieldAlt, FaUsers, FaShoppingCart, FaDog } from 'react-icons/fa' // ✅ quitamos FaChartBar

export default function AdminPage() {
    const { user, loading } = useUser()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loadingPerfil, setLoadingPerfil] = useState(true)

    // Nuevos estados para estadísticas
    const [totalMascotas, setTotalMascotas] = useState(0)
    const [totalUsuarios, setTotalUsuarios] = useState(0)
    const [totalOrdenes, setTotalOrdenes] = useState(0)

    useEffect(() => {
        const verificarAdmin = async () => {
            if (!user) {
                router.push('/login')
                return
            }

            const { data } = await supabase // ✅ quitamos 'error'
                .from('admin_users')
                .select('id')
                .eq('id', user.id)
                .single()

            if (!data) {
                router.push('/dashboard') // No es admin
                return
            }

            setIsAdmin(true)
            setLoadingPerfil(false)
        }

        if (!loading) {
            verificarAdmin()
        }
    }, [user, loading, router])

    // 🎯 Nueva carga de estadísticas
    useEffect(() => {
        const cargarEstadisticas = async () => {
            const [{ count: mascotasCount }, { count: usuariosCount }, { count: ordenesCount }] = await Promise.all([
                supabase.from('mascotas').select('*', { count: 'exact', head: true }),
                supabase.from('perfiles').select('*', { count: 'exact', head: true }),
                supabase.from('ordenes_placas').select('*', { count: 'exact', head: true }),
            ])
            setTotalMascotas(mascotasCount || 0)
            setTotalUsuarios(usuariosCount || 0)
            setTotalOrdenes(ordenesCount || 0)
        }

        if (isAdmin) {
            cargarEstadisticas()
        }
    }, [isAdmin])

    if (loading || loadingPerfil) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-white">
                <span className="text-gray-500 text-sm">Cargando acceso administrativo...</span>
            </main>
        )
    }

    if (!isAdmin) return null

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Admin */}
                <section className="text-center space-y-2">
                    <div className="flex justify-center">
                        <FaShieldAlt className="text-4xl text-blue-700" />
                    </div>
                    <h1 className="text-4xl font-extrabold text-blue-700">Panel Administrativo 🛡️</h1>
                    <p className="text-gray-600 text-lg">Accede a las herramientas de administración.</p>
                </section>

                {/* 📊 Resumen Estadísticas */}
                <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-xl shadow-md text-center border">
                        <FaUsers className="text-3xl text-blue-600 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-blue-600">{totalUsuarios}</h3>
                        <p className="text-gray-500 text-sm mt-1">Usuarios Registrados</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center border">
                        <FaShoppingCart className="text-3xl text-yellow-500 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-yellow-500">{totalOrdenes}</h3>
                        <p className="text-gray-500 text-sm mt-1">Órdenes Realizadas</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md text-center border">
                        <FaDog className="text-3xl text-green-600 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-green-600">{totalMascotas}</h3>
                        <p className="text-gray-500 text-sm mt-1">Mascotas Registradas</p>
                    </div>

                </section>

                {/* Opciones de Administración */}
                <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 text-center pt-6">
                    <Link href="/admin/usuarios" className="bg-white shadow-md p-6 rounded-xl border hover:shadow-lg transition">
                        <FaUsers className="text-3xl text-blue-600 mx-auto mb-2" />
                        <h2 className="text-xl font-bold text-blue-600">Gestionar Usuarios</h2>
                        <p className="text-gray-500 text-sm mt-2">Ver y administrar cuentas registradas.</p>
                    </Link>

                    <Link href="/admin/ordenes" className="bg-white shadow-md p-6 rounded-xl border hover:shadow-lg transition">
                        <FaShoppingCart className="text-3xl text-yellow-600 mx-auto mb-2" />
                        <h2 className="text-xl font-bold text-yellow-600">Órdenes</h2>
                        <p className="text-gray-500 text-sm mt-2">Ver pedidos, pagos y envíos.</p>
                    </Link>

                    <Link href="/admin/mascotas" className="bg-white shadow-md p-6 rounded-xl border hover:shadow-lg transition">
                        <FaDog className="text-3xl text-green-600 mx-auto mb-2" />
                        <h2 className="text-xl font-bold text-green-600">Mascotas</h2>
                        <p className="text-gray-500 text-sm mt-2">Administrar registros de mascotas.</p>
                    </Link>
                </section>

            </div>
        </main>
    )
}
