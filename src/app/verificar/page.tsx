'use client'

import Link from 'next/link'

export default function VerificarCorreoPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-blue-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
                <h1 className="text-3xl font-bold text-blue-700">Verifica tu correo 📬</h1>
                <p className="text-gray-600 text-sm">
                    Hemos enviado un enlace de confirmación a tu correo electrónico.
                </p>
                <p className="text-gray-500 text-sm">
                    Por favor revisa tu bandeja de entrada y sigue el enlace para activar tu cuenta.
                </p>
                <p className="text-xs text-gray-400">
                    Si no lo ves, revisa tu carpeta de spam o correo no deseado.
                </p>
                <Link href="/" className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    Volver al inicio
                </Link>
            </div>
        </main>
    )
}
