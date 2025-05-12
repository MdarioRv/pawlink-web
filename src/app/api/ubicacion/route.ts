import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cliente Supabase
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Función para obtener ciudad usando Nominatim (OpenStreetMap)
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: {
                'User-Agent': 'pawlink-web', // requerido por Nominatim
            },
        })

        const data = await res.json()
        return (
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.municipality ||
            data?.address?.state ||
            'desconocida'
        )
    } catch (err) {
        console.error('Error al obtener ciudad:', err)
        return 'desconocida'
    }
}

export async function POST(req: Request) {
    console.log('🔄 API /ubicacion llamada')
    try {
        const { lat, lng, mascota_id } = await req.json()

        if (!lat || !lng || !mascota_id) {
            return NextResponse.json(
                { error: 'Faltan datos obligatorios (lat, lng, mascota_id)' },
                { status: 400 }
            )
        }

        // Obtener ciudad automáticamente
        const ciudad = await reverseGeocode(lat, lng)

        // Insertar en Supabase
        const { error } = await supabase.from('ubicaciones').insert([
            {
                lat,
                lng,
                ciudad,
                mascota_id,
            },
        ])

        if (error) {
            console.error('Error al insertar ubicación:', error.message)
            return NextResponse.json({ error: 'Error al guardar ubicación' }, { status: 500 })
        }

        return NextResponse.json({ mensaje: '📍 Ubicación guardada correctamente', ciudad })
    } catch (error) {
        console.error('Error general:', error)
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
    }
}
