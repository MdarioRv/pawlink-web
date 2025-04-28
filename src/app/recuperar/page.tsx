'use client'

import { useState } from 'react'
import Link from 'next/link' // Importa Link para la navegación
import { FiMail, FiCheckCircle, FiAlertCircle } from 'react-icons/fi' // Importa iconos necesarios

export default function RecuperarContrasenaPageImproved() {
    const [email, setEmail] = useState('')
    const [enviado, setEnviado] = useState(false)
    const [isLoading, setIsLoading] = useState(false) // Estado para la carga
    const [error, setError] = useState('') // Estado para errores

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('') // Limpia errores previos
        setIsLoading(true) // Inicia estado de carga
        setEnviado(false) // Resetea el estado de enviado por si reintenta

        // --- Simulación de llamada a API (Supabase iría aquí) ---
        console.log('Solicitando recuperación para:', email)
        try {
            // Aquí iría tu lógica real async con Supabase
            // Ejemplo: const { error } = await supabase.auth.resetPasswordForEmail(email)
            // if (error) throw error
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula espera
            console.log('Solicitud procesada (simulado)')
            setEnviado(true) // Muestra mensaje de éxito
        } catch (apiError: any) {
            console.error('Error en recuperación (simulado):', apiError)
            // Mapea errores de API a mensajes amigables
            setError('No se pudo procesar la solicitud. Verifica el correo o inténtalo más tarde.')
            // Ejemplo con error real: setError(apiError.message || 'Ocurrió un error')
        } finally {
            setIsLoading(false) // Termina estado de carga
        }
        // --- Fin Simulación ---
    }

    return (
        // Contenedor principal con fondo gradiente y centrado (consistente con login)
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            {/* Tarjeta del formulario */}
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl w-full max-w-md space-y-6">
                {/* Placeholder para Logo/Título App (opcional, para consistencia) */}

                <h1 className="text-3xl text-center font-bold text-indigo-600">
                    Recuperar Contraseña
                </h1>

                {/* Mensaje de Error */}
                {error && !enviado && ( // Muestra error solo si no se ha enviado con éxito
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md relative" role="alert">
                        <div className="flex items-center">
                            <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                            <span className="block sm:inline text-sm">{error}</span>
                        </div>
                    </div>
                )}

                {/* Mensaje de Éxito */}
                {enviado ? (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 px-4 py-4 rounded-md space-y-3 text-center" role="status">
                        <div className="flex justify-center items-center mb-2">
                            <FiCheckCircle className="h-6 w-6 mr-2 text-green-600" />
                            <p className="font-semibold">¡Enlace enviado!</p>
                        </div>
                        <p className="text-sm">
                            Revisa la bandeja de entrada de <strong className='font-medium'>{email}</strong>.
                            Si no lo ves, revisa tu carpeta de spam.
                        </p>
                        {/* Enlace para volver al login desde el mensaje de éxito */}
                        <div className="pt-3">
                            <Link href="/login" // Ajusta la ruta a tu página de login
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Formulario (se oculta si ya se envió)
                    <>
                        <p className="text-sm text-gray-600 text-center">
                            Ingresa tu correo electrónico registrado y te enviaremos las instrucciones.
                        </p>
                        <form onSubmit={manejarEnvio} className="space-y-5">
                            <div>
                                <label htmlFor="email-recovery" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo electrónico
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </span>
                                    <input
                                        type="email"
                                        id="email-recovery" // ID único para el label
                                        required
                                        className="pl-10 pr-4 py-2 block w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading} // Deshabilita durante carga
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading} // Deshabilita si está cargando
                                className={`w-full flex justify-center items-center bg-indigo-600 text-white py-2.5 px-4 rounded-md font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out ${isLoading ? 'opacity-70 cursor-not-allowed' : '' // Estilo cuando está cargando
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        {/* Spinner */}
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </>
                                ) : (
                                    'Enviar enlace de recuperación'
                                )}
                            </button>
                        </form>

                        {/* Enlace para volver al login desde el formulario */}
                        <div className="text-center pt-2">
                            <Link href="/login" // Ajusta la ruta a tu página de login
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    )
}