// /app/api/chatbot/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { pregunta } = await req.json()

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'HTTP-Referer': process.env.OPENROUTER_REFERER || 'http://localhost:3000',
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free', // modelo gratuito ✅
                messages: [
                    {
                        role: 'system',
                        content:
                            'Eres un asistente experto en cuidado de mascotas. Da respuestas claras, breves y útiles para dueños de perros y gatos.',
                    },
                    {
                        role: 'user',
                        content: pregunta,
                    },
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
