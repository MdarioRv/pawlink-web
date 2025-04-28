'use client'
import Link from 'next/link'
import { FaCheckCircle } from 'react-icons/fa'

export default function PagoExitoPage() {
    return (
        <main className="min-h-screen bg-green-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center space-y-6">

                <FaCheckCircle className="text-green-500 mx-auto text-5xl" />
                <h1 className="text-3xl font-bold text-green-700">¡Pago realizado con éxito!</h1>

                <p className="text-gray-600 text-lg">
                    Gracias por tu compra. Tu placa está siendo procesada y recibirás un correo con más detalles pronto.
                </p>

                <div className="flex justify-center gap-4 pt-4">
                    <Link href="/dashboard">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                            Ir al Dashboard
                        </button>
                    </Link>
                    <Link href="/">
                        <button className="bg-gray-100 border text-black border-gray-300 px-6 py-2 rounded hover:bg-gray-200 transition">
                            Volver al Inicio
                        </button>
                    </Link>
                </div>

            </div>
        </main>
    )
}
