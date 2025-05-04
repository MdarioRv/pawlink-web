'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import toast from 'react-hot-toast'
import BotonRegresar from '@/components/back'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'

export default function AyudaPage() {
    const { user } = useUser()
    const router = useRouter()

    const [tipo, setTipo] = useState('')
    const [mensaje, setMensaje] = useState('')
    const [imagen, setImagen] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
            toast.error('Formato no válido. Usa PNG, JPG o WebP.')
            return
        }

        const sizeMB = file.size / (1024 * 1024)
        if (sizeMB > 3) {
            toast.error('Máximo permitido: 3MB')
            return
        }

        setImagen(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.error('Debes iniciar sesión para enviar una solicitud')
            return
        }

        let imagenUrl = ''
        if (imagen) {
            const ext = imagen.name.split('.').pop()
            const filename = `${uuidv4()}.${ext}`
            const path = `ayuda/${filename}`

            const { error: uploadError } = await supabase.storage
                .from('ayuda')
                .upload(path, imagen)

            if (uploadError) {
                toast.error('Error al subir imagen')
                return
            }

            const { data } = supabase.storage.from('ayuda').getPublicUrl(path)
            imagenUrl = data.publicUrl
        }

        const { error } = await supabase.from('ayuda').insert([{
            usuario_id: user.id,
            tipo,
            mensaje,
            imagen: imagenUrl || null
        }])

        if (error) {
            toast.error('Error al enviar solicitud')
        } else {
            toast.success('Solicitud enviada correctamente')
            router.push('/dashboard') // o a donde desees redirigir
        }
    }

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-6">
                <div className="text-left">
                    <BotonRegresar />
                </div>

                <h1 className="text-3xl font-bold text-blue-700">Centro de Ayuda</h1>
                <p className="text-gray-600">Envíanos tu problema o solicitud de asistencia.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo de solicitud</label>
                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="problema técnico">Problema técnico</option>
                            <option value="mascota perdida">Mascota perdida</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                        <textarea
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Imagen (opcional, máx 3MB)</label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleImagenChange}
                            className="mt-2 text-gray-500"
                        />

                        {preview && (
                            <Image
                                src={preview}
                                alt="Vista previa"
                                width={150}
                                height={150}
                                className="mt-4 rounded-lg border object-cover"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                    >
                        Enviar solicitud
                    </button>
                </form>
            </div>
        </main>
    )
}
