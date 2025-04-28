'use client'
import { useRouter } from 'next/navigation'
import { FiArrowLeft } from 'react-icons/fi'

export default function BotonDashboard() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm sm:text-base font-medium transition mt-4"
        >
            <FiArrowLeft className="w-5 h-5" />
            Volver al Dashboard
        </button>
    )
}
