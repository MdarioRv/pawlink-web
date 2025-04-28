'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import BotonRegresar from '@/components/back'

export default function RegistroMascotaPage() {
    const router = useRouter()
    const { user } = useUser()

    const [nombre, setNombre] = useState('')
    const [tipo, setTipo] = useState('')
    const [raza, setRaza] = useState('')
    const [edad, setEdad] = useState<number>(0)
    const [salud, setSalud] = useState('')
    const [imagen, setImagen] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        const maxSizeMB = 2
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']

        if (!file) return

        if (!validTypes.includes(file.type)) {
            toast.error('Formato inválido. Solo JPG, PNG o WebP.')
            return
        }

        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > maxSizeMB) {
            toast.error(`La imagen excede el límite de ${maxSizeMB} MB`)
            return
        }

        setImagen(file)
        setPreview(URL.createObjectURL(file))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.error('Usuario no autenticado')
            return
        }

        let imageUrl = ''
        if (imagen) {
            const fileExt = imagen.name.split('.').pop()
            const fileName = `${uuidv4()}.${fileExt}`
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

        const { error } = await supabase.from('mascotas').insert([
            {
                nombre,
                tipo,
                raza,
                edad,
                salud,
                imagen: imageUrl,
                dueño_id: user.id,
            },
        ])

        if (error) {
            toast.error('Error al registrar mascota')
        } else {
            toast.success('Mascota registrada correctamente')
            router.push('/dashboard')
        }
    }

    return (
        <main className="min-h-screen bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 space-y-6">
                {/* Botón Regresar */}
                <div className="text-left">
                    <BotonRegresar />
                </div>

                <h1 className="text-3xl font-bold text-blue-700">Registrar nueva mascota</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
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
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Edad</label>
                        <input
                            type="number"
                            value={edad}
                            onChange={(e) => setEdad(Number(e.target.value))}
                            min={0}
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado de salud</label>
                        <select
                            value={salud}
                            onChange={(e) => setSalud(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Salud excelente">Salud excelente</option>
                            <option value="Vacunado y desparasitado">Vacunado y desparasitado</option>
                            <option value="Condición especial">Condición especial</option>
                            <option value="Requiere medicación">Requiere medicación</option>
                            <option value="Otro">Otro</option>
                        </select>

                        {salud === 'Otro' && (
                            <textarea
                                placeholder="Especifica el estado de salud..."
                                className="mt-2 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                            />
                        )}
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700">Foto</label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
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
                        Guardar
                    </button>
                </form>
            </div>
        </main>
    )
}
