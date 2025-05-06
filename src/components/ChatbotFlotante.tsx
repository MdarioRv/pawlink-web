'use client'

import { useState } from 'react'
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser } from '@/hooks/useUser'

type Remitente = 'user' | 'bot'

interface Mensaje {
    remitente: Remitente
    texto: string
}

export default function ChatbotFlotante() {
    const [abierto, setAbierto] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [mensajes, setMensajes] = useState<Mensaje[]>([
        {
            remitente: 'bot',
            texto: '🐾 ¡Hola! Soy tu asistente PawLink. ¿Sobre qué te gustaría ayuda? Aquí tienes algunas ideas:',
        },
        {
            remitente: 'bot',
            texto: '• ¿Qué alimento es mejor para mi perro?\n• ¿Cuándo debo vacunar a mi gato?\n• ¿Qué hacer si mi mascota se pierde?',
        },
    ])
    const [cargando, setCargando] = useState(false)
    const { user } = useUser()

    if (!user) return null

    const handleEnviar = async () => {
        const textoLimpio = mensaje.trim()
        if (!textoLimpio || cargando) return

        setMensajes((prev) => [...prev, { remitente: 'user', texto: textoLimpio }])
        setMensaje('')
        setCargando(true)

        try {
            const res = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pregunta: textoLimpio, userId: user.id }),
            })

            const data = await res.json()
            setMensajes((prev) => [...prev, { remitente: 'bot', texto: data.respuesta }])
        } catch {
            setMensajes((prev) => [
                ...prev,
                { remitente: 'bot', texto: '⚠️ Ocurrió un error al procesar tu pregunta.' },
            ])
        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            {/* Panel flotante */}
            <AnimatePresence>
                {abierto && (
                    <motion.div
                        key="chatbot"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 z-50 w-80 h-[420px] bg-white shadow-2xl rounded-2xl border border-blue-300 flex flex-col overflow-hidden"
                    >
                        <div className="flex justify-between items-center px-4 py-2 bg-blue-600 text-white">
                            <h2 className="text-base font-semibold">Asistente PawLink</h2>
                            <button onClick={() => setAbierto(false)} className="hover:text-red-300 transition">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-blue-50 text-sm">
                            {mensajes.map((m, i) => (
                                <div
                                    key={i}
                                    className={`whitespace-pre-wrap px-3 py-2 rounded-xl max-w-[80%] ${m.remitente === 'user'
                                        ? 'bg-blue-100 text-right self-end ml-auto'
                                        : 'bg-white border text-left'
                                        }`}
                                >
                                    {m.texto}
                                </div>
                            ))}
                            {cargando && (
                                <div className="text-blue-500 text-xs italic">Escribiendo respuesta...</div>
                            )}
                        </div>

                        <div className="flex gap-2 items-center p-3 border-t bg-white">
                            <input
                                type="text"
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleEnviar()}
                                placeholder="Escribe tu pregunta..."
                                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring focus:ring-blue-300"
                            />
                            <button
                                onClick={handleEnviar}
                                disabled={cargando}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50"
                            >
                                <FaPaperPlane className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botón flotante */}
            <div className="fixed bottom-6 right-6 z-40">
                {!abierto && (
                    <motion.button
                        key="boton"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setAbierto(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
                        aria-label="Abrir chat"
                    >
                        <FaComments className="w-5 h-5" />
                    </motion.button>
                )}
            </div>
        </>
    )
}
