import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
    try {
        const { pregunta, userId } = await req.json()

        if (!userId) {
            return NextResponse.json(
                { respuesta: '⚠️ Debes iniciar sesión para usar el asistente.' },
                { status: 401 }
            )
        }

        // Obtener mascotas del usuario
        const { data: mascotas } = await supabase
            .from('mascotas')
            .select('nombre, tipo, raza, edad, salud')
            .eq('dueño_id', userId)

        const contextoMascotas = mascotas && mascotas.length > 0
            ? mascotas.map(m =>
                `- ${m.nombre} (${m.tipo}), raza: ${m.raza}, ${m.edad} años, salud: ${m.salud || 'sin especificar'}`
            ).join('\n')
            : 'Este usuario no ha registrado mascotas aún.'

        const descripcionPlataforma = `
PAWLINK es una plataforma web para la identificación y rastreo de mascotas.
Ofrece placas QR inteligentes (y GPS en su versión premium), una vista pública accesible desde el QR,
panel de administración, registro con foto, edad exacta, salud, y ubicación GPS visualizable en el dashboard.
Funciona con Supabase como backend y está hecha en Next.js + Tailwind. Los usuarios pueden comprar placas,
gestionar sus mascotas, ver ubicación simulada y editar sus datos desde el dashboard.
`

        const prompt = `
Eres el Asistente Inteligente de PAWLINK, una plataforma de identificación y rastreo para mascotas.

Contexto del sistema:
${descripcionPlataforma}

Mascotas del usuario:
${contextoMascotas}

Responde con claridad, de forma amigable y útil para los dueños de mascotas. Si la pregunta es sobre PAWLINK, responde como si fueras parte del sistema.
`

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://pawlink-web.vercel.app',
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: pregunta },
                ],
            }),
        })

        const data = await response.json()

        if (!response.ok || !data.choices) {
            console.error('Error desde OpenRouter:', data)
            return NextResponse.json(
                { respuesta: '⚠️ Lo siento, ocurrió un error al obtener la respuesta.' },
                { status: 500 }
            )
        }

        const respuesta = data.choices[0]?.message?.content || '⚠️ No tengo una respuesta clara para eso.'

        // Guardar pregunta y respuesta en Supabase
        await supabase.from('chat_historial').insert([
            { user_id: userId, remitente: 'user', mensaje: pregunta },
            { user_id: userId, remitente: 'bot', mensaje: respuesta },
        ])

        return NextResponse.json({ respuesta })
    } catch (error) {
        console.error('Error en API /chatbot:', error)
        return NextResponse.json(
            { respuesta: '⚠️ Ocurrió un error interno al procesar tu pregunta.' },
            { status: 500 }
        )
    }
}
