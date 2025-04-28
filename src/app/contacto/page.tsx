'use client'
import { useState } from 'react'

export default function ContactoPage() {
    const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
    const [enviado, setEnviado] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setEnviado(true)

        // Simular envío, en el futuro usar fetch a backend/Supabase función
        console.log('Mensaje enviado:', form)
    }
    return (
        <main className="min-h-screen bg-blue-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
                <h1 className="text-3xl font-bold text-blue-700 text-center">Contáctanos 💬</h1>
                <p className="text-sm text-gray-600 text-center">
                    ¿Tienes dudas, sugerencias o necesitas ayuda? Llena el siguiente formulario y nos pondremos en contacto contigo.
                </p>

                {enviado ? (
                    <div className="text-center text-green-600 font-semibold">✅ Tu mensaje ha sido enviado. ¡Gracias!</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Asunto</label>
                            <input
                                type="text"
                                name="asunto"
                                value={form.asunto}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mensaje</label>
                            <textarea
                                name="mensaje"
                                value={form.mensaje}
                                onChange={handleChange}
                                rows={4}
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Enviar mensaje
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    )
}