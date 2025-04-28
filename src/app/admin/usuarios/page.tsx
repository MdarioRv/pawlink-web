'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import { useRouter } from 'next/navigation'
import { FaShieldAlt, FaSpinner } from 'react-icons/fa'

// ✅ Tipado correcto
interface Usuario {
  id: string
  nombre: string | null
  email: string
  creado_en: string
  esAdmin?: boolean
}

export default function UsuariosAdminPage() {
    const { user, loading } = useUser()
    const router = useRouter()
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [admins, setAdmins] = useState<Usuario[]>([])
    const [loadingUsuarios, setLoadingUsuarios] = useState(true)

    useEffect(() => {
        const cargarUsuarios = async () => {
            if (!user) {
                router.push('/login')
                return
            }

            // Verificar si es admin
            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('id')
                .eq('id', user.id)
                .maybeSingle()

            if (adminError || !adminData) {
                router.push('/dashboard')
                return
            }

            // Cargar perfiles
            const { data: perfilesData, error: perfilesError } = await supabase
                .from('perfiles')
                .select('id, nombre, email, creado_en')
                .order('creado_en', { ascending: false })

            if (perfilesError || !perfilesData) {
                console.error('Error cargando usuarios:', perfilesError)
                setLoadingUsuarios(false)
                return
            }

            // Cargar lista de admins
            const { data: adminsData, error: adminsError } = await supabase
                .from('admin_users')
                .select('id')

            if (adminsError || !adminsData) {
                console.error('Error cargando administradores:', adminsError)
                setLoadingUsuarios(false)
                return
            }

            const adminIds = adminsData.map((admin) => admin.id)

            const usuariosConRol: Usuario[] = perfilesData.map((perfil: {
                id: string
                nombre: string | null
                email: string
                creado_en: string
            }) => ({
                id: perfil.id,
                nombre: perfil.nombre,
                email: perfil.email,
                creado_en: perfil.creado_en,
                esAdmin: adminIds.includes(perfil.id),
            }))

            setUsuarios(usuariosConRol.filter((u) => !u.esAdmin)) // Normales
            setAdmins(usuariosConRol.filter((u) => u.esAdmin))    // Admins
            setLoadingUsuarios(false)
        }

        if (!loading) {
            cargarUsuarios()
        }
    }, [user, loading, router])

    if (loading || loadingUsuarios) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
                <p className="text-gray-600">Cargando usuarios...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Encabezado */}
                <div className="text-center space-y-2">
                    <FaShieldAlt className="text-5xl text-blue-700 mx-auto" />
                    <h1 className="text-4xl font-bold text-blue-700">Administrar Usuarios</h1>
                    <p className="text-gray-600">Gestiona administradores y usuarios de la plataforma.</p>
                </div>

                {/* Administradores */}
                <SeccionUsuarios titulo="👑 Administradores" usuarios={admins} />

                {/* Usuarios normales */}
                <SeccionUsuarios titulo="👤 Usuarios" usuarios={usuarios} />
            </div>
        </main>
    )
}

function SeccionUsuarios({ titulo, usuarios }: { titulo: string, usuarios: Usuario[] }) {
    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">{titulo}</h2>

            {/* Desktop */}
            <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Nombre</th>
                            <th className="px-4 py-2 text-left text-sm font-bold text-gray-700">Email</th>
                            <th className="px-4 py-2 text-right text-sm font-bold text-gray-700">Registrado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id} className="border-b">
                                <td className="px-4 py-3">{usuario.nombre || 'Sin nombre'}</td>
                                <td className="px-4 py-3">{usuario.email}</td>
                                <td className="px-4 py-3 text-right">{new Date(usuario.creado_en).toLocaleDateString('es-MX')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile */}
            <div className="block md:hidden space-y-4">
                {usuarios.map((usuario) => (
                    <div key={usuario.id} className="bg-white p-4 rounded-xl shadow-md space-y-2">
                        <p><strong>Nombre:</strong> {usuario.nombre || 'Sin nombre'}</p>
                        <p><strong>Email:</strong> {usuario.email}</p>
                        <p><strong>Registrado:</strong> {new Date(usuario.creado_en).toLocaleDateString('es-MX')}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
