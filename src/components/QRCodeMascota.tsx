'use client'

import { useRef } from 'react'
import QRCode from 'react-qr-code'
import { toPng } from 'html-to-image'

interface QRCodeMascotaProps {
    id: string
    nombre?: string
}

export default function QRCodeMascota({ id, nombre }: QRCodeMascotaProps) {
    const qrRef = useRef<HTMLDivElement>(null)

    // 👉 Obtiene el dominio actual dinámicamente
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pawlink.vercel.app'
    const url = `${origin}/mascota/${id}`

    const descargarQR = async () => {
        if (qrRef.current) {
            const dataUrl = await toPng(qrRef.current)
            const link = document.createElement('a')
            link.download = `QR_${nombre || 'mascota'}.png`
            link.href = dataUrl
            link.click()
        }
    }

    return (
        <div className="text-center space-y-4">
            <div ref={qrRef} className="inline-block p-4 bg-white rounded shadow">
                <QRCode value={url} size={180} />
            </div>
            <p className="text-sm text-gray-600 break-all">{url}</p>
            <button
                onClick={descargarQR}
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Descargar QR
            </button>
        </div>
    )
}
