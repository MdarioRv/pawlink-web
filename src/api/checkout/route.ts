import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!) // ✅ sin apiVersion

export async function POST(req: NextRequest) {
    const body = await req.json()

    const { ordenId, descripcion, precio } = body

    if (!ordenId || !descripcion || !precio) {
        return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'mxn',
                        product_data: { name: descripcion },
                        unit_amount: precio * 100, // Stripe maneja en centavos
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_URL}/orden/exito?id=${ordenId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
            metadata: {
                ordenId: ordenId,
            },
        })

        return NextResponse.json({ id: session.id })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
