'use client'

import { useState } from 'react'

const faqData = [
    {
        question: '¿Qué es PawLink?',
        answer: 'PawLink es una placa inteligente con código QR que te permite conectar digitalmente con tu mascota en caso de extravío.',
    },
    {
        question: '¿Cómo funciona el código QR?',
        answer: 'Cualquier persona puede escanear el código QR con su celular para acceder al perfil de tu mascota y contactarte.',
    },
    {
        question: '¿Necesito pagar una suscripción?',
        answer: 'Puedes usar una cuenta gratuita con funciones básicas. Para acceder a rastreo GPS y otras funciones avanzadas, ofrecemos un plan premium. Claro que se ocupa la placa anteriormente comprada.',
    },
    // Espacios para agregar más preguntas...
    {
        question: '¿Puedo actualizar los datos de mi mascota?',
        answer: 'Sí, puedes editar el perfil de tu mascota en cualquier momento desde tu cuenta.',
    },
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggleIndex = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <main className="min-h-screen bg-gray-50 py-16 px-6 text-gray-800">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-blue-700 mb-12">Preguntas Frecuentes</h1>
                <div className="space-y-6">
                    {faqData.map((item, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-lg shadow-sm bg-white transition-all"
                        >
                            <button
                                onClick={() => toggleIndex(index)}
                                className="w-full text-left px-5 py-4 font-medium text-lg flex justify-between items-center hover:bg-blue-50 focus:outline-none"
                            >
                                {item.question}
                                <span className="text-blue-500">
                                    {openIndex === index ? '−' : '+'}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* 👇 Aquí puedes seguir agregando más preguntas personalizadas después */}
                    {/* 
          {
            question: '¿Tu nueva pregunta?',
            answer: 'Aquí irá la respuesta.',
          }
          */}
                </div>
            </div>
        </main>
    )
}
