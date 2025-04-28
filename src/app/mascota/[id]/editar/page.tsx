'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import BotonRegresar from '@/components/back'

export default function EditarMascotaPage() {
    const { user, loading } = useUser()
    const router = useRouter()
    const { id } = useParams()

    const [nombre, setNombre] = useState('')
    const [tipo, setTipo] = useState('')
    const [raza, setRaza] = useState('')
    const [edad, setEdad] = useState<number>(0)
    const [salud, setSalud] = useState('')
    const [imagen, setImagen] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)




    // Protección client-side
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])





    // Cargar datos reales
    useEffect(() => {
        const fetchMascota = async () => {
            if (!id || typeof id !== 'string') return

            const { data, error } = await supabase
                .from('mascotas')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                toast.error('No se pudo cargar la mascota')
                router.push('/dashboard')
                return
            }

            setNombre(data.nombre)
            setTipo(data.tipo)
            setRaza(data.raza)
            setEdad(data.edad)
            setSalud(data.salud)
            setPreview(data.imagen)
        }

        if (user && id) fetchMascota()
    }, [id, user])


    // Imagen
    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setImagen(file)
            setPreview(URL.createObjectURL(file))
        } else {
            toast.error('Selecciona una imagen válida')
        }
    }



    // Guardar
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!id || typeof id !== 'string') return
        let imageUrl = preview

        if (imagen) {
            const ext = imagen.name.split('.').pop()
            const fileName = `${Date.now()}.${ext}`
            const filePath = `mascotas/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('mascotas')
                .upload(filePath, imagen)

            if (uploadError) {
                toast.error('Error al subir la imagen')
                return
            }

            const { data } = supabase.storage.from('mascotas').getPublicUrl(filePath)
            imageUrl = data.publicUrl
        }

        const { error } = await supabase
            .from('mascotas')
            .update({
                nombre,
                tipo,
                raza,
                edad,
                salud,
                imagen: imageUrl,
            })
            .eq('id', id)

        if (error) {
            toast.error('Error al actualizar')
        } else {
            toast.success('Mascota actualizada correctamente')
            router.push('/dashboard')
        }
    }

    if (loading || !user) return null

    return (
        <main className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
                {/* Botón Regresar */}
                <div className="text-left">
                    <BotonRegresar />
                </div>
                <h1 className="text-3xl font-bold text-blue-700">Editar Mascota</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Perro">Perro</option>
                            <option value="Gato">Gato</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Raza</label>
                        <input
                            type="text"
                            value={raza}
                            onChange={(e) => setRaza(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Edad</label>
                        <input
                            type="number"
                            value={edad}
                            onChange={(e) => setEdad(Number(e.target.value))}
                            min={0}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado de Salud</label>
                        <textarea
                            value={salud}
                            onChange={(e) => setSalud(e.target.value)}
                            rows={3}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Foto</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagenChange}
                            className="mt-2 text-gray-400"
                        />
                        {preview && (
                            <Image
                                src={preview}
                                alt="Preview mascota"
                                width={150}
                                height={150}
                                className="mt-4 rounded-lg object-cover border"
                            />
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Guardar cambios
                    </button>
                </form>
            </div>
        </main>
    )
}
