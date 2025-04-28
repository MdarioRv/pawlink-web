'use client'

import Link from 'next/link'

export default function ExitoPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-green-700 px-6">
            <div className="max-w-md text-center space-y-8">

                <div className="text-6xl">🎉</div>

                <h1 className="text-4xl font-bold">
                    ¡Gracias por tu compra!
                </h1>

                <p className="text-lg text-green-800">
                    Hemos recibido tu pago y estamos preparando tu placa PAWLINK. Pronto estará lista.
                </p>

                <Link href="/dashboard">
                    <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                        Ir al Dashboard
                    </button>
                </Link>

            </div>
        </main>
    )
}
