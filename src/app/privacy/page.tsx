export default function PoliticaPrivacidad() {
    return (
        <main className="min-h-screen bg-white py-16 px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-blue-700 text-center">Política de Privacidad</h1>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Información que recopilamos</h2>
                    <p className="text-gray-700 text-sm">
                        En PAWLINK recopilamos datos personales como nombre, correo electrónico, información de tu mascota (nombre, edad, raza), y en caso de plan premium, su ubicación GPS en tiempo real.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Uso de la información</h2>
                    <p className="text-gray-700 text-sm">
                        La información se utiliza exclusivamente para: identificar a tu mascota, contactarte en caso de extravío, gestionar tu cuenta y mejorar nuestros servicios.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Compartición de datos</h2>
                    <p className="text-gray-700 text-sm">
                        No compartimos tu información con terceros, excepto si es requerida por autoridades competentes en caso de emergencia o pérdida de mascota.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Seguridad de los datos</h2>
                    <p className="text-gray-700 text-sm">
                        Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos. Toda la información se almacena en servidores seguros mediante Supabase y cifrado moderno.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Tus derechos</h2>
                    <p className="text-gray-700 text-sm">
                        Puedes acceder, modificar o eliminar tus datos en cualquier momento desde tu perfil, o solicitándolo por correo a soporte@pawlink.com.
                    </p>
                </section>

                <section className="text-sm text-gray-500 mt-6 text-center">
                    Última actualización: abril 2025
                </section>
            </div>
        </main>
    )
}
