'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { FiLogOut, FiMenu, FiX, FiShield, FiShoppingCart } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Header() {
    const { user } = useUser()
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [ordenesPendientes, setOrdenesPendientes] = useState(0)

    useEffect(() => {
        const verificarAdmin = async () => {
            if (!user) return

            const { data, error } = await supabase
                .from('admin_users')
                .select('id')
                .eq('id', user.id)
                .single()

            if (data && !error) {
                setIsAdmin(true)
            }
        }

        const cargarOrdenesPendientes = async () => {
            if (!user) return

            const { data, error } = await supabase
                .from('ordenes_placas')
                .select('id')
                .eq('usuario_id', user.id)
                .eq('estatus', 'pendiente')

            if (!error && data) {
                setOrdenesPendientes(data.length)
            }
        }

        verificarAdmin()
        cargarOrdenesPendientes()
    }, [user])

    const handleLogout = async () => {
        const confirm = window.confirm('¿Estás seguro que deseas cerrar sesión?')
        if (!confirm) return

        const { error } = await supabase.auth.signOut()
        if (!error) {
            toast.success('Sesión cerrada correctamente')
            router.push('/login')
        } else {
            toast.error('Ocurrió un error al cerrar sesión')
        }
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
                        PAWLINK
                    </Link>

                    {/* Botón hamburguesa (solo móvil) */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="lg:hidden text-2xl text-blue-600 focus:outline-none"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>

                    {/* Navegación grande (escritorio) */}
                    <nav className="hidden lg:flex items-center gap-6 text-base font-medium">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 transition">Inicio</Link>
                        <Link href="/Preguntas" className="text-gray-700 hover:text-blue-600 transition">Preguntas</Link>
                        <Link href="/membresia" className="text-gray-700 hover:text-blue-600 transition">Membresía</Link>

                        {user && (
                            <Link href="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
                        )}

                        {isAdmin && (
                            <Link href="/admin" className="text-red-600 hover:underline flex items-center gap-1">
                                <FiShield /> Admin
                            </Link>
                        )}

                        {/* Carrito de órdenes pendientes */}
                        {ordenesPendientes > 0 && (
                            <Link href="/orden/historial" className="relative text-blue-600 hover:text-blue-700">
                                <FiShoppingCart className="text-2xl" />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {ordenesPendientes}
                                </span>
                            </Link>
                        )}
                    </nav>

                    {/* Acciones grandes (escritorio) */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href="/orden"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition shadow"
                        >
                            Ordenar Ahora
                        </Link>

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-md transition text-sm font-medium"
                            >
                                <FiLogOut className="w-4 h-4" />
                                Cerrar sesión
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="text-blue-600 hover:underline text-sm font-medium"
                            >
                                Iniciar sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Menú móvil animado */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-2'}`}
            >
                <div className="px-4 pb-4 flex flex-col gap-3 text-base font-medium">
                    <Link href="/" className="text-gray-700 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Inicio</Link>
                    <Link href="/Preguntas" className="text-gray-700 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Preguntas</Link>
                    <Link href="/membresia" className="text-gray-700 hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>Membresía</Link>

                    {user && (
                        <Link href="/dashboard" className="text-blue-600 hover:underline" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    )}

                    {isAdmin && (
                        <Link href="/admin" className="text-red-600 hover:underline flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                            <FiShield /> Admin
                        </Link>
                    )}

                    {/* Carrito de órdenes pendientes en mobile */}
                    {ordenesPendientes > 0 && (
                        <Link href="/orden/historial" className="flex items-center gap-2 text-blue-600 hover:text-blue-700" onClick={() => setMenuOpen(false)}>
                            <FiShoppingCart className="text-xl" />
                            {ordenesPendientes} Pendiente(s)
                        </Link>
                    )}

                    <Link
                        href="/orden"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-center font-semibold hover:bg-blue-700 transition shadow"
                        onClick={() => setMenuOpen(false)}
                    >
                        Ordenar Ahora
                    </Link>

                    {user ? (
                        <button
                            onClick={() => {
                                handleLogout()
                                setMenuOpen(false)
                            }}
                            className="mt-2 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-md transition text-sm font-medium"
                        >
                            <FiLogOut className="w-4 h-4" />
                            Cerrar sesión
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="text-blue-600 hover:underline text-center text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                        >
                            Iniciar sesión
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
