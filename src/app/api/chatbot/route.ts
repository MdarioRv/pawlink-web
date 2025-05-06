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
        const { data: mascotas, error } = await supabase
            .from('mascotas')
            .select('nombre, tipo, raza, edad, salud')
            .eq('dueño_id', userId)

        const contextoMascotas = mascotas && mascotas.length > 0
            ? mascotas.map(m => `- ${m.nombre}, ${m.tipo}, raza: ${m.raza}, ${m.edad} años, salud: ${m.salud || 'desconocida'}`).join('\n')
            : 'Este usuario aún no ha registrado mascotas.'

        const prompt = `
                    Eres un asistente experto en salud y cuidado de mascotas.
                    A continuación tienes el perfil del usuario:

        ${contextoMascotas}

                Responde de forma útil y personalizada.
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
        return NextResponse.json({ respuesta })
    } catch (error) {
        console.error('Error en API /chatbot:', error)
        return NextResponse.json(
            { respuesta: '⚠️ Ocurrió un error interno al procesar tu pregunta.' },
            { status: 500 }
        )
    }
}
