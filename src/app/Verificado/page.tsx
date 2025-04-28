'use client'

export default function VerificadoPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
                <h1 className="text-3xl font-bold text-green-700">¡Cuenta verificada! ✅</h1>
                <p className="text-gray-600 text-sm">
                    Tu correo electrónico ha sido confirmado con éxito. Ahora puedes iniciar sesión y empezar a usar PAWLINK.
                </p>
                <a
                    href="/login"
                    className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                    Iniciar sesión
                </a>
            </div>
        </main>
    )
}
