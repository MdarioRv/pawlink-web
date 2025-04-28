'use client'
import { useEffect, useRef, useState } from 'react'
import { FaUserCircle, FaRobot } from 'react-icons/fa'
import BotonRegresar from '@/components/back'

type Mensaje = {
    remitente: 'usuario' | 'bot'
    contenido: string
    hora: string
}

export default function ChatbotPage() {
    const [input, setInput] = useState('')
    const [mensajes, setMensajes] = useState<Mensaje[]>([])
    const [escribiendo, setEscribiendo] = useState(false)
    const chatEndRef = useRef<HTMLDivElement | null>(null)

    const obtenerHora = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    useEffect(() => {
        // Mensaje inicial del bot
        setMensajes([
            {
                remitente: 'bot',
                contenido: '¡Hola! Soy el asistente virtual de PAWLINK. ¿En qué puedo ayudarte hoy?',
                hora: obtenerHora(),
            },
        ])
    }, [])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mensajes, escribiendo])

    const manejarEnviar = () => {
        if (!input.trim()) return

        const nuevoMensaje: Mensaje = {
            remitente: 'usuario',
            contenido: input.trim(),
            hora: obtenerHora(),
        }

        setMensajes((prev) => [...prev, nuevoMensaje])
        setInput('')
        setEscribiendo(true)

        // Simular respuesta del bot
        setTimeout(() => {
            const respuesta: string =
                input.toLowerCase().includes('gps')
                    ? 'El plan premium incluye rastreo GPS, notificaciones y zona segura.'
                    : input.toLowerCase().includes('placa')
                        ? 'Cada placa tiene un QR único que conecta al perfil de tu mascota.'
                        : 'Lo siento, aún estoy aprendiendo. Pronto podré ayudarte mejor. 🐾'

            setMensajes((prev) => [
                ...prev,
                {
                    remitente: 'bot',
                    contenido: respuesta,
                    hora: obtenerHora(),
                },
            ])
            setEscribiendo(false)
        }, 1200)
    }

    return (
        <main className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto space-y-6">
                {/* Botón Regresar */}
                <div className="text-left">
                    <BotonRegresar />
                </div>
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">Asistente Virtual PAWLINK 🤖</h1>

                {/* Chatbox */}
                <div className="border border-gray-300 rounded-xl bg-gray-50 shadow-inner h-[400px] overflow-y-auto p-4 space-y-3 text-black">
                    {mensajes.map((msg, i) => (
                        <div key={i} className={`flex ${msg.remitente === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex items-end gap-2 max-w-xs">
                                {msg.remitente === 'bot' && <FaRobot className="text-gray-500 mt-1" />}
                                <div className={`p-3 rounded-lg text-sm shadow ${msg.remitente === 'usuario' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'}`}>
                                    <p>{msg.contenido}</p>
                                    <p className="text-[10px] text-gray-500 mt-1 text-right">{msg.hora}</p>
                                </div>
                                {msg.remitente === 'usuario' && <FaUserCircle className="text-blue-600 mt-1" />}
                            </div>
                        </div>
                    ))}

                    {escribiendo && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse ">
                                <FaRobot /> Escribiendo...
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 border border-gray-300 rounded px-4 py-2 text-black"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && manejarEnviar()}
                    />
                    <button
                        onClick={manejarEnviar}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </main>
    )
}
