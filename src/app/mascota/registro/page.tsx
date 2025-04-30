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
    const [edadAnios, setEdadAnios] = useState(0)
    const [edadMeses, setEdadMeses] = useState(0)
    const [salud, setSalud] = useState('')
    const [imagen, setImagen] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const maxMB = 3

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']

        if (!file) return

        if (!validTypes.includes(file.type)) {
            toast.error('Formato inválido. Solo JPG, PNG o WebP.')
            return
        }

        const fileSizeMB = file.size / (1024 * 1024)
        if (fileSizeMB > maxMB) {
            toast.error(`La imagen excede el límite de ${maxMB} MB.`)
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

        if (edadMeses > 11) {
            toast.error('La cantidad máxima de meses es 11')
            return
        }

        let edadFinal = edadAnios
        let unidadEdad: 'años' | 'meses' = 'años'

        if (edadAnios === 0 && edadMeses > 0) {
            edadFinal = edadMeses
            unidadEdad = 'meses'
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

        const { error } = await supabase.from('mascotas').insert([{
            nombre,
            tipo,
            raza,
            edad: edadFinal,
            unidad_edad: unidadEdad,
            salud,
            imagen: imageUrl,
            dueño_id: user.id,
        }])

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
                            className="mt-1 w-full px-4 py-2 border rounded-lg text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg text-black"
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
                            className="mt-1 w-full px-4 py-2 border rounded-lg text-black"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Edad (Años)</label>
                            <input
                                type="number"
                                value={edadAnios}
                                onChange={(e) => setEdadAnios(Number(e.target.value))}
                                min={0}
                                className="mt-1 w-full px-4 py-2 border rounded-lg text-black"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Edad (Meses)</label>
                            <input
                                type="number"
                                value={edadMeses}
                                onChange={(e) => setEdadMeses(Math.min(11, Number(e.target.value)))}
                                min={0}
                                max={11}
                                className="mt-1 w-full px-4 py-2 border rounded-lg text-black"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Estado de salud</label>
                        <select
                            value={salud}
                            onChange={(e) => setSalud(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg text-black"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Salud excelente">Salud excelente</option>
                            <option value="Vacunado y desparasitado">Vacunado y desparasitado</option>
                            <option value="Condición especial">Condición especial</option>
                            <option value="Requiere medicación">Requiere medicación</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Foto (máximo 3 MB)</label>
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
