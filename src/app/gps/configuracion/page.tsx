'use client'
import { useState } from 'react'

export default function ConfiguracionGPSPage() {
    const [gpsActivo, setGpsActivo] = useState(true)
    const [zonaSegura, setZonaSegura] = useState({
        lat: 19.4326,
        lng: -99.1332,
        radio: 500, // metros
    })

    const toggleGps = () => setGpsActivo(!gpsActivo)

    return (
        <main className="min-h-screen bg-blue-50 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
                <h1 className="text-3xl font-bold text-blue-700 text-center">Configuración del GPS 📡</h1>

                {/* Estado del GPS */}
                <section className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800">Estado del rastreo</h2>
                    <p className="text-sm text-gray-600">
                        El rastreo está actualmente:{" "}
                        <span className={gpsActivo ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {gpsActivo ? 'Activado' : 'Desactivado'}
                        </span>
                    </p>
                    <button
                        onClick={toggleGps}
                        className={`px-6 py-2 rounded font-medium transition ${gpsActivo ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                            } text-white`}
                    >
                        {gpsActivo ? 'Desactivar GPS' : 'Activar GPS'}
                    </button>
                </section>

                {/* Zona segura */}
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">Zona segura</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <label className="block font-medium text-gray-700">Latitud</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={zonaSegura.lat}
                                onChange={(e) => setZonaSegura({ ...zonaSegura, lat: parseFloat(e.target.value) })}
                                className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700">Longitud</label>
                            <input
                                type="number"
                                step="0.0001"
                                value={zonaSegura.lng}
                                onChange={(e) => setZonaSegura({ ...zonaSegura, lng: parseFloat(e.target.value) })}
                                className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700">Radio (m)</label>
                            <input
                                type="number"
                                value={zonaSegura.radio}
                                onChange={(e) => setZonaSegura({ ...zonaSegura, radio: parseInt(e.target.value) })}
                                className="text-black w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <p className="text-sm text-gray-500">
                        Esta zona segura define el área donde tu mascota puede moverse sin generar alertas. Puedes modificarla libremente.
                    </p>
                </section>
            </div>
        </main>
    )
}
