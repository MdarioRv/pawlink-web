'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { FaPaw, FaUserCircle, FaBell, FaDog, FaQrcode, FaStar, FaPlus } from 'react-icons/fa'
import QRCodeMascota from '@/components/QRCodeMascota'
import toast from 'react-hot-toast'

export default function DashboardPage() {
    const { user, loading } = useUser()
    const router = useRouter()
    const [mascotas, setMascotas] = useState<any[]>([])
    const [ordenes, setOrdenes] = useState<any[]>([])
    const [loadingMascotas, setLoadingMascotas] = useState(true)
    const [loadingOrdenes, setLoadingOrdenes] = useState(true)
    const [ultimaSesion, setUltimaSesion] = useState<string | null>(null)

    const handleEliminarMascota = async (mascotaId: string) => {
        const confirm = window.confirm('¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer.')

        if (!confirm) return

        const { error } = await supabase
            .from('mascotas')
            .delete()
            .eq('id', mascotaId)
            .eq('dueño_id', user?.id)

        if (error) {
            toast.error('Error al eliminar la mascota.')
        } else {
            toast.success('Mascota eliminada correctamente')
            setMascotas(prev => prev.filter(m => m.id !== mascotaId)) // actualiza el estado
        }
    }


    // 🔒 Redirigir si no hay usuario
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    useEffect(() => {
        if (user) {
            const fecha = user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : null
            setUltimaSesion(fecha)
        }
    }, [user])

    useEffect(() => {
        const fetchMascotas = async () => {
            if (!user) return
            const { data, error } = await supabase
                .from('mascotas')
                .select('*')
                .eq('dueño_id', user.id)

            if (!error && data) {
                setMascotas(data)
            }

            setLoadingMascotas(false)
        }

        fetchMascotas()
    }, [user])

    useEffect(() => {
        const cargarOrdenes = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('ordenes_placas')
                    .select(`
                        id,
                        tipo_placa,
                        precio,
                        estatus,
                        mascota_id,
                        mascotas (nombre)
                    `)
                    .eq('usuario_id', user.id)
                    .order('fecha', { ascending: false })

                if (!error && data) {
                    setOrdenes(data)
                }

                setLoadingOrdenes(false)
            }
        }

        cargarOrdenes()
    }, [user])

    // ⏳ Mientras se verifica sesión no renderizamos nada
    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <span className="text-sm text-gray-400">Cargando...</span>
            </main>
        )
    }

    // 🔒 Seguridad extra (por si user es null justo después del loading)
    if (!user) return null

    const plan = {
        tipo: 'Básico',
        beneficios: ['Perfil editable', 'Escaneo QR'],
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-20">

                {/* Encabezado */}
                <section className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
                        🐾 Bienvenido a tu Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Gestiona tus mascotas, tu cuenta y accede a herramientas inteligentes.
                    </p>
                </section>

                {/* Acciones rápidas */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Acciones rápidas</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                        <DashboardAction href="/mascota/registro" icon={<FaPlus />} label="Registrar Mascota" color="blue" />
                        <DashboardAction href="/perfil/usuario" icon={<FaUserCircle />} label="Mi Perfil" color="gray" />
                        <DashboardAction href="/membresia" icon={<FaStar />} label="Plan Premium" color="yellow" />
                        <DashboardAction href="/chatbot" icon={<FaBell />} label="Chat de Ayuda" color="green" />
                    </div>
                </section>

                {/* Resumen de cuenta */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Resumen de tu cuenta</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <DashboardStat icon={<FaPaw />} title="Total de Mascotas" value={mascotas.length} />
                        <DashboardStat icon={<FaStar />} title="Plan Actual" value={plan.tipo} extra={plan.beneficios} />
                        <DashboardStat icon={<FaBell />} title="Última Actividad" value={ultimaSesion || 'N/A'} />
                    </div>
                </section>

                {/* Mis Mascotas */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Mis Mascotas</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {mascotas.map((m) => (
                            <div key={m.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 hover:shadow-md transition">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <FaDog className="text-blue-600 h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{m.nombre}</h3>
                                        <p className="text-sm text-gray-500">{m.tipo}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Estado: <span className="font-medium text-green-600">{m.estado}</span>
                                </p>
                                <div className="flex flex-col gap-1 text-sm">
                                    <Link href={`/mascota/${m.id}`} className="text-blue-500 hover:underline">👁️ Vista Pública</Link>
                                    <Link href={`/mascota/${m.id}/editar`} className="text-green-500 hover:underline">✏️ Editar Datos</Link>
                                    <button
                                        onClick={() => handleEliminarMascota(m.id)}
                                        className="text-red-500 hover:underline text-sm font-medium"
                                    >
                                        🗑️ Eliminar Mascota
                                    </button>

                                    {m.estado === 'QR Básico' && (
                                        <Link href={`/orden?upgrade=gps&id=${m.id}`} className="text-yellow-600 hover:underline font-semibold">
                                            🔄 Activar GPS Premium
                                        </Link>
                                    )}
                                    {m.estado === 'Activo' && (
                                        <Link href={`/gps/configuracion?id=${m.id}`} className="text-blue-600 hover:underline font-semibold">
                                            📍 Configurar GPS
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Códigos QR */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FaQrcode className="text-blue-500" />
                        Códigos QR
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Escanea o descarga el QR de cada mascota. Puedes imprimirlo y colocarlo en su collar.
                    </p>
                    <div className="text-black grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {mascotas.map((m) => (
                            <div key={m.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-center space-y-4">
                                <h3 className="text-lg font-semibold">{m.nombre}</h3>
                                <QRCodeMascota id={m.id} nombre={m.nombre} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Historial de Órdenes */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Historial de Órdenes</h2>

                    {loadingOrdenes ? (
                        <div className="text-gray-500">Cargando órdenes...</div>
                    ) : ordenes.length === 0 ? (
                        <div className="text-gray-400">No tienes órdenes registradas todavía.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                                <thead className="bg-gray-100 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-3">Mascota</th>
                                        <th className="px-4 py-3">Tipo de Placa</th>
                                        <th className="px-4 py-3">Precio</th>
                                        <th className="px-4 py-3">Estatus</th>
                                        <th className="px-4 py-3">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-800 bg-white">
                                    {ordenes.map((orden) => (
                                        <tr key={orden.id} className="border-t">
                                            <td className="px-4 py-3">{orden.mascotas?.nombre || 'Sin nombre'}</td>
                                            <td className="px-4 py-3 capitalize">{orden.tipo_placa === 'qr' ? 'QR Básica' : 'QR + GPS Premium'}</td>
                                            <td className="px-4 py-3">${orden.precio}</td>
                                            <td className="px-4 py-3">
                                                {orden.estatus === 'pendiente' && <span className="text-yellow-600 font-semibold">Pendiente</span>}
                                                {orden.estatus === 'pagado' && <span className="text-green-600 font-semibold">Pagado</span>}
                                                {orden.estatus === 'enviado' && <span className="text-blue-600 font-semibold">Enviado</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link href={`/orden/${orden.id}`}>
                                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition text-sm">
                                                        Ver Detalles
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

            </div>
        </main>
    )
}

// COMPONENTES AUXILIARES
function DashboardAction({ href, icon, label, color }: { href: string, icon: React.ReactNode, label: string, color: string }) {
    const colorMap: Record<string, string> = {
        blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
        gray: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
        green: 'bg-green-100 text-green-700 hover:bg-green-200',
    }

    return (
        <Link href={href} className={`rounded-xl px-4 py-6 text-center font-medium transition ${colorMap[color]}`}>
            <div className="text-3xl mb-2">{icon}</div>
            {label}
        </Link>
    )
}

function DashboardStat({ icon, title, value, extra }: { icon: React.ReactNode, title: string, value: string | number, extra?: string[] }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-blue-600 text-xl">
                {icon}
                <span className="font-semibold text-gray-800">{title}</span>
            </div>
            <p className="text-3xl font-bold text-blue-700">{value}</p>
            {extra && (
                <ul className="text-sm text-gray-600 list-disc list-inside">
                    {extra.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            )}
        </div>
    )
}
