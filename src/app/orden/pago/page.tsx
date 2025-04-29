'use client'

import { Suspense } from 'react'
import PagoPage from './PagoPage'

export const dynamic = 'force-dynamic'

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando detalles de pago...</div>}>
            <PagoPage />
        </Suspense>
    )
}
