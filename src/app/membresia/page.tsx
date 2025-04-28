'use client'
import Link from 'next/link'

// --- Iconos SVG (Ejemplos de Heroicons - ¡Reemplaza con tus preferidos!) ---

const CheckCircleIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06l-3.25 3.25-1.75-1.75a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06 0l3.75-3.75Z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
    </svg>
);

const StarIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>
);

// Iconos para Beneficios Premium
const MapPinIcon = ({ className = "w-8 h-8" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>);
const BellAlertIcon = ({ className = "w-8 h-8" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M12 6v.01M12 12.75a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" /></svg>);
const ClockIcon = ({ className = "w-8 h-8" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
const ShieldCheckIcon = ({ className = "w-8 h-8" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>);
// --- Fin Iconos ---


export default function MembresiaPage() {
    // Define características para reutilizar
    const features = [
        { id: 'profile', text: '📝 Perfil con datos de contacto y foto', free: true, premium: true },
        { id: 'scan', text: '📲 Escaneo QR desde cualquier celular', free: true, premium: true },
        { id: 'gps', text: '📍 Localización GPS precisa en tiempo real', free: false, premium: true, isPremiumExclusive: true },
        { id: 'notify', text: '🔔 Notificaciones instantáneas si lo escanean', free: false, premium: true, isPremiumExclusive: true },
        { id: 'history', text: '🗺️ Historial de ubicaciones para ver sus rutas', free: false, premium: true, isPremiumExclusive: true },
        { id: 'safezone', text: '🏡 Alertas si sale de su zona segura', free: false, premium: true, isPremiumExclusive: true },
    ];

    return (
        <main className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-20 md:space-y-24"> {/* Más espacio */}

                {/* Encabezado persuasivo */}
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-5 leading-tight"> {/* Azul más oscuro */}
                        Dale a tu mascota la <span className="text-yellow-500">protección completa</span> que se merece
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"> {/* Un poco más ancho */}
                        Con PAWLINK Premium, ganas mucho más que una placa: obtienes tranquilidad, tecnología avanzada y la seguridad de encontrarlo si se pierde.
                    </p>
                </section>

                {/* Comparación de planes */}
                <section className="grid md:grid-cols-2 gap-10 lg:gap-12 items-start">
                    {/* Gratuito */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition duration-300 flex flex-col h-full"> {/* Fondo gris claro, más padding */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                            {/* Icono Básico podría ir aquí si quieres */}
                            Plan Básico
                        </h2>
                        <ul className="space-y-3 text-gray-700 text-base mb-6 flex-grow"> {/* Más espacio, texto base, flex-grow */}
                            {features.map(feature => (
                                <li key={feature.id} className="flex items-start">
                                    {feature.free
                                        ? <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                                        : <XCircleIcon className="w-5 h-5 text-gray-400 mr-2 mt-0.5 shrink-0" />
                                    }
                                    <span className={!feature.free ? 'text-gray-500 line-through' : ''}>{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                        {/* Precio al final */}
                        <div className="mt-auto pt-6 border-t border-gray-200"> {/* Separador */}
                            <p className="text-blue-700 font-semibold text-sm mb-1">Placa QR Básica</p>
                            <p className="text-2xl font-bold text-blue-800 mb-1">$150 <span className="text-base font-normal">MXN</span></p>
                            <p className="text-xs text-gray-500">Pago único</p>
                            {/* Botón opcional si quieres añadirlo aquí también */}
                            {/* <Link href="/orden?plan=basico" className="...">Ordenar Placa Básica</Link> */}
                        </div>
                    </div>

                    {/* Premium */}
                    <div className="relative bg-white border-2 border-yellow-400 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition duration-300 flex flex-col h-full"> {/* Fondo blanco, borde más notorio */}
                        <div className="absolute -top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                            <StarIcon className="w-3 h-3" /> MÁS POPULAR
                        </div>
                        <h2 className="text-2xl font-bold text-yellow-700 mb-5 flex items-center">
                            <StarIcon className="w-6 h-6 mr-2 text-yellow-500" /> {/* Icono estrella */}
                            Plan Premium
                        </h2>
                        <ul className="space-y-3 text-gray-800 text-base mb-6 flex-grow"> {/* Más espacio, texto base, flex-grow */}
                            {features.map(feature => (
                                <li key={feature.id} className="flex items-start">
                                    {feature.premium
                                        ? <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 mt-0.5 shrink-0" />
                                        : <XCircleIcon className="w-5 h-5 text-gray-400 mr-2 mt-0.5 shrink-0" /> /* No debería haber X aquí si Premium lo incluye todo */
                                    }
                                    <span className={`${feature.isPremiumExclusive ? 'font-semibold text-yellow-800' : ''} ${!feature.premium ? 'text-gray-500 line-through' : ''}`}>
                                        {feature.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        {/* Precio y Suscripción al final */}
                        <div className="mt-auto pt-6 border-t border-gray-200"> {/* Separador */}
                            <p className="text-yellow-700 font-semibold text-sm mb-1">Placa QR + GPS</p>
                            <p className="text-2xl font-bold text-yellow-800 mb-1">$350 <span className="text-base font-normal">MXN</span></p>
                            <p className="text-xs text-gray-600 font-medium bg-yellow-100 px-2 py-1 rounded inline-block mb-2">
                                Incluye 1er mes de Servicio Premium
                            </p>
                            <p className="text-xs text-gray-500 leading-tight">
                                Después, servicio Premium por <strong className="text-gray-700">$XX MXN/mes</strong> para mantener funciones avanzadas (GPS, alertas, historial). Cancela cuando quieras.
                            </p>
                            {/* Botón opcional si quieres añadirlo aquí también */}
                            {/* <Link href="/orden?plan=premium" className="...">Ordenar Placa Premium</Link> */}
                        </div>
                    </div>
                </section>

                {/* Sección: Por qué Premium te da tranquilidad */}
                <section className="bg-gradient-to-r from-blue-50 to-yellow-50 py-12 px-6 rounded-2xl">
                    <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">Tu tranquilidad es nuestra prioridad</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <MapPinIcon className="w-12 h-12 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg text-gray-800 mb-1">Localización Precisa</h3>
                            <p className="text-sm text-gray-600">Encuéntralo rápidamente con GPS en tiempo real visible desde tu app.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <BellAlertIcon className="w-12 h-12 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg text-gray-800 mb-1">Alertas Inteligentes</h3>
                            <p className="text-sm text-gray-600">Recibe notificaciones si es escaneado o si sale de su zona segura.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <ClockIcon className="w-12 h-12 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg text-gray-800 mb-1">Historial Completo</h3>
                            <p className="text-sm text-gray-600">Revisa sus recorridos y entiende sus hábitos para mayor seguridad.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <ShieldCheckIcon className="w-12 h-12 text-blue-600 mb-3" />
                            <h3 className="font-semibold text-lg text-gray-800 mb-1">Protección Integral</h3>
                            <p className="text-sm text-gray-600">Todo lo necesario para asegurar su bienestar y tu calma.</p>
                        </div>
                    </div>
                </section>

                {/* Sección: Testimonios (Simple) */}
                <section className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">Dueños más tranquilos gracias a PAWLINK</h2>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <blockquote className="bg-gray-100 p-6 rounded-lg shadow-sm">
                            <p className="text-gray-700 italic mb-4">"Perdí a Rocky en el parque y lo encontré en 10 minutos gracias al GPS de Pawlink Premium. ¡No tiene precio esa tranquilidad!"</p>
                            <footer className="text-sm font-semibold text-blue-700">- Ana L.</footer>
                        </blockquote>
                        <blockquote className="bg-gray-100 p-6 rounded-lg shadow-sm">
                            <p className="text-gray-700 italic mb-4">"Me encanta recibir la notificación cuando el paseador escanea la placa al recoger a Max. Sé que está en buenas manos."</p>
                            <footer className="text-sm font-semibold text-blue-700">- Carlos M.</footer>
                        </blockquote>
                    </div>
                </section>


                {/* Llamado a la acción Final */}
                <section className="text-center border-t border-gray-200 pt-12">
                    <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-5">¿Listo para darle la mejor protección?</h3>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">Elige la placa que mejor se adapta a tus necesidades y empieza a disfrutar de la tranquilidad que te da PAWLINK.</p>
                    <Link
                        href="/orden"
                        className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-bold px-12 py-4 rounded-full shadow-lg transition transform hover:scale-105 duration-300"
                    >
                        Ver opciones de placa
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">Seleccionarás entre QR Básica o QR + GPS en el siguiente paso.</p>

                </section>
            </div>
        </main>
    )
}