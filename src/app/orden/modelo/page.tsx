'use client'

import { Suspense } from 'react'
import SeleccionarModeloPage from './SeleccionarModeloPage'

export const dynamic = 'force-dynamic' // Forzar página dinámica, obligatorio para evitar errores con useSearchParams

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando selección de modelo...</div>}>
            <SeleccionarModeloPage />
        </Suspense>
    )
}
