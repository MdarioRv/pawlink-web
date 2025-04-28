'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/useUser'
import { supabase } from '@/lib/supabaseClient'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import BotonRegresar from '@/components/back'

export default function PerfilUsuarioPage() {
    const { user, loading } = useUser()
    const router = useRouter()

    const [nombre, setNombre] = useState('')
    const [correo, setCorreo] = useState('')
    const [telefono, setTelefono] = useState('')
    const [direccion, setDireccion] = useState('')
    const [preview, setPreview] = useState<string | null>(null)
    const [imagen, setImagen] = useState<File | null>(null)
    const [perfilExistente, setPerfilExistente] = useState(false) // 🆕 Saber si ya existe

    // Cargar perfil al entrar
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
        if (user?.id) {
            cargarPerfil()
        }
    }, [user, loading, router])

    const cargarPerfil = async () => {
        const { data, error } = await supabase
            .from('perfiles')
            .select('*')
            .eq('id', user?.id)
            .maybeSingle() // 🆕 permitir si no existe

        if (error) {
            toast.error('Error al cargar perfil')
            return
        }

        if (data) {
            // Perfil encontrado
            setNombre(data.nombre || '')
            setCorreo(user?.email || '')
            setTelefono(data.telefono || '')
            setDireccion(data.direccion || '')
            if (data.foto) {
                setPreview(data.foto)
            }
            setPerfilExistente(true) // 🆕
        } else {
            // No existe perfil (nuevo usuario)
            setNombre('')
            setCorreo(user?.email || '')
            setTelefono('')
            setDireccion('')
            setPerfilExistente(false) // 🆕
        }
    }

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setImagen(file)
            setPreview(URL.createObjectURL(file))
        } else {
            toast.error('Selecciona una imagen válida')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.id) return

        let imageUrl = preview // usa el actual
        if (imagen) {
            const fileExt = imagen.name.split('.').pop()
            const fileName = `${uuidv4()}.${fileExt}`
            const filePath = `perfil/${fileName}`

            const { error: uploadError } = await supabase
            .storage
            .from('perfil') // ← este sí es un bucket, correcto
            .upload(filePath, imagen)
        

            if (uploadError) {
                toast.error('Error al subir imagen')
                return
            }

            const { data } = supabase.storage.from('perfil').getPublicUrl(filePath)
            imageUrl = data.publicUrl
        }

        // 🆕 Aquí el Upsert seguro
        const { error } = await supabase.from('perfiles').upsert({
            id: user.id,
            nombre,
            telefono,
            direccion,
            foto: imageUrl,
            email: user.email, // opcional si lo guardas en tabla
        })

        if (error) {
            toast.error('Error al actualizar perfil')
        } else {
            toast.success(perfilExistente ? 'Perfil actualizado ✅' : 'Perfil creado correctamente ✅')
            setPerfilExistente(true) // actualizamos el estado
        }
    }

    if (loading || !user) return null

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">

                {/* Botón Regresar */}
                <div className="text-left">
                    <BotonRegresar />
                </div>

                <h1 className="text-3xl font-bold text-blue-700">
                    {perfilExistente ? 'Mi Perfil' : 'Completa tu Perfil'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-black">Foto de perfil</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagenChange}
                            className="mt-2 text-gray-400"
                        />
                        {preview && (
                            <Image
                                src={preview}
                                alt="Foto de perfil"
                                width={120}
                                height={120}
                                className="mt-4 rounded-full border object-cover"
                                unoptimized
                            />
                        )}
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input
                            type="email"
                            value={correo}
                            disabled
                            className="mt-1 w-full px-4 py-2 border rounded-lg bg-gray-100 text-black"
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <textarea
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            rows={2}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        💾 {perfilExistente ? 'Guardar cambios' : 'Crear Perfil'}
                    </button>
                </form>
            </div>
        </main>
    )
}
