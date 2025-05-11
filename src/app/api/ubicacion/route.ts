import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
    console.log("🔄 API /ubicacion llamada")
    try {
        const { lat, lng, ciudad, mascota_id } = await req.json()

        if (!lat || !lng || !mascota_id) {
            return NextResponse.json(
                { error: 'Faltan datos obligatorios (lat, lng, mascota_id)' },
                { status: 400 }
            )
        }

        const { error } = await supabase.from('ubicaciones').insert([
            {
                lat,
                lng,
                ciudad: ciudad || null,
                mascota_id,
            },
        ])

        if (error) {
            console.error('Error al insertar ubicación:', error.message)
            return NextResponse.json({ error: 'Error al guardar ubicación' }, { status: 500 })
        }

        return NextResponse.json({ mensaje: '📍 Ubicación guardada correctamente' })
    } catch (error) {
        console.error('Error general:', error)
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 })
    }
}
