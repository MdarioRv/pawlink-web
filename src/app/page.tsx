import Link from 'next/link';
import { ShieldCheckIcon, QrCodeIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">


      {/* Hero / Bienvenida */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 md:py-28 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-800 mb-5 tracking-tight">
          <span className="inline-block mr-2">🐾</span>
          Bienvenido a <span className="text-blue-600">PAWLINK</span>
        </h1>
        <p className="text-lg md:text-xl max-w-3xl text-gray-700 mb-8 leading-relaxed">
          La placa inteligente con QR que conecta a tu mascota perdida contigo al instante. Más seguridad, más tranquilidad.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 z-10">
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            Registrarse
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12 md:mb-16">
            ¿Cómo funciona <span className="text-blue-600">PawLink</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-12 text-center">
            <div className="flex flex-col items-center p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-5">
                <QrCodeIcon className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">Placa QR Única</h3>
              <p className="text-gray-600 leading-relaxed">
                Tu mascota lleva una placa duradera con un código QR único vinculado a su perfil digital seguro.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-5">
                <MapPinIcon className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">Escaneo y Localización</h3>
              <p className="text-gray-600 leading-relaxed">
                Cualquier persona con un smartphone puede escanear el QR para acceder a la información de contacto y notificar la ubicación (si la activas).
              </p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-4 rounded-full inline-block mb-5">
                <ShieldCheckIcon className="h-10 w-10 md:h-12 md:w-12 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-3">Reencuentro Rápido</h3>
              <p className="text-gray-600 leading-relaxed">
                Recibes una alerta instantánea y la persona que encontró a tu mascota puede contactarte fácilmente para un reencuentro seguro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios destacados */}
      <section className="bg-blue-700 text-white py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">La tranquilidad que mereces</h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 md:mb-12 text-blue-100 leading-relaxed">
            PawLink va más allá de una placa tradicional, ofreciendo una solución digital completa para la seguridad de tu mejor amigo.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 max-w-2xl mx-auto text-left">
            {[
              "Actualiza datos al instante",
              "Perfil completo (fotos, salud, etc.)",
              "Notificaciones de escaneo",
              "Acceso global vía web",
              "Contacto directo y seguro",
              "Diseño duradero y amigable"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircleIcon className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparación con placa tradicional */}
      <section className="py-16 bg-blue-50 px-4 text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-8">¿Por qué PawLink es mejor?</h2>
        <p className="max-w-2xl mx-auto mb-6">
          A diferencia de una placa común, PawLink ofrece un sistema completo de identificación, contacto, rastreo y gestión digital.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:scale-105 transform transition duration-300">
            <h3 className="text-xl font-semibold mb-2">Placa tradicional</h3>
            <ul className="text-left space-y-1 text-sm">
              <li>🔴 Solo incluye un nombre y teléfono</li>
              <li>🔴 No se puede actualizar información</li>
              <li>🔴 Sin localización o respaldo</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-blue-600 hover:scale-105 transform transition duration-300">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">PawLink</h3>
            <ul className="text-left space-y-1 text-sm">
              <li>✅ Perfil editable en línea</li>
              <li>✅ QR escaneable desde cualquier celular</li>
              <li>✅ Registro GPS (plan premium)</li>
              <li>✅ Perfil de cada mascota</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="text-center py-16 md:py-20 px-6 bg-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿Listo para proteger a tu mascota?</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Únete a la comunidad PawLink hoy mismo. Crear el perfil digital de tu mascota es rápido, fácil y el primer paso hacia su seguridad.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-1 transition-all duration-300 ease-in-out text-lg"
          >
            Crear Cuenta Ahora
          </Link>
        </div>
      </section>


    </main>
  );
}
