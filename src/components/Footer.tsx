import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-400 text-center py-6 px-6 text-sm">
            <p>&copy; {new Date().getFullYear()} PawLink. Todos los derechos reservados.</p>
            <p className="mt-1">
                <Link href="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link> |{' '}
                <Link href="/terms" className="hover:text-white transition-colors">Términos de Servicio</Link>
            </p>
            <p className="mt-1">Creado con 💙 por el equipo de desarrollo.</p>
        </footer>
    )
}
