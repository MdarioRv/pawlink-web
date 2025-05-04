'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useUser } from '@/hooks/useUser'
import { v4 as uuidv4 } from 'uuid'
import { motion } from 'framer-motion'
import { FaPaw, FaSpinner } from 'react-icons/fa'
import Image from 'next/image'
import toast from 'react-hot-toast'

import BotonRegresar from '@/components/back'
import InputField from '@/components/form/InputField'
import SelectField from '@/components/form/SelectField'

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
    const [loading, setLoading] = useState(false)

    const inputFileRef = useRef<HTMLInputElement>(null)
    const maxMB = 3

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        const validTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!file) return

        if (!validTypes.includes(file.type)) {
            toast.error('Formato inválido. Usa JPG, PNG o WebP.')
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
        if (!user) return toast.error('No estás autenticado.')
        if (edadMeses > 11) return toast.error('Máximo 11 meses permitidos.')

        setLoading(true)

        let edadFinal = edadAnios
        let unidadEdad: 'años' | 'meses' = 'años'
        if (edadAnios === 0 && edadMeses > 0) {
            edadFinal = edadMeses
            unidadEdad = 'meses'
        }

        let imageUrl = ''
        if (imagen) {
            const ext = imagen.name.split('.').pop()
            const fileName = `${uuidv4()}.${ext}`
            const filePath = `mascotas/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('mascotas')
                .upload(filePath, imagen)

            if (uploadError) {
                toast.error('Error al subir la imagen.')
                setLoading(false)
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
            toast.error('Error al registrar la mascota.')
        } else {
            toast.success('Mascota registrada correctamente.')
            setTimeout(() => {
                router.push('/dashboard')
            }, 400)
        }

        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-100 to-white py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8"
            >
                <div className="mb-6">
                    <BotonRegresar />
                </div>

                <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-8">
                    Registrar nueva mascota 🐶
                </h1>

                <form onSubmit={handleSubmit}>
                    {/* Dropzone con clic funcional */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto (máx. 3 MB)</label>
                        <div
                            onClick={() => inputFileRef.current?.click()}
                            className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                        >
                            <input
                                type="file"
                                ref={inputFileRef}
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleImagenChange}
                                className="hidden"
                            />
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Preview mascota"
                                    width={180}
                                    height={180}
                                    className="mx-auto rounded-lg object-cover border"
                                />
                            ) : (
                                <p className="text-blue-600 font-medium">Haz clic o arrastra una imagen aquí</p>
                            )}
                        </div>
                    </div>

                    <InputField
                        label="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        placeholder="Ej. Max, Luna..."
                    />

                    <SelectField
                        label="Tipo"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                        options={['Perro', 'Gato', 'Otro']}
                        required
                    />

                    <InputField
                        label="Raza"
                        value={raza}
                        onChange={(e) => setRaza(e.target.value)}
                        placeholder="Ej. Labrador, Persa..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Edad (años)"
                            type="number"
                            value={edadAnios}
                            onChange={(e) => setEdadAnios(Number(e.target.value))}
                            min={0}
                        />
                        <InputField
                            label="Edad (meses)"
                            type="number"
                            value={edadMeses}
                            onChange={(e) => setEdadMeses(Math.min(11, Number(e.target.value)))}
                            min={0}
                            max={11}
                        />
                    </div>

                    <SelectField
                        label="Estado de salud"
                        value={salud}
                        onChange={(e) => setSalud(e.target.value)}
                        options={[
                            'Salud excelente',
                            'Vacunado y desparasitado',
                            'Condición especial',
                            'Requiere medicación',
                            'Otro'
                        ]}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-8 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <FaPaw />}
                        {loading ? 'Guardando...' : 'Guardar Mascota'}
                    </button>
                </form>
            </motion.div>
        </main>
    )
}
