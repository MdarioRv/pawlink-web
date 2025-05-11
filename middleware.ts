import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    const protectedPaths = ['/dashboard', '/perfil', '/mascota']
    const publicAuthPages = ['/login', '/register']

    const isProtected = protectedPaths.some((path) =>
        req.nextUrl.pathname.startsWith(path)
    )

    const isAuthPage = publicAuthPages.some((path) =>
        req.nextUrl.pathname.startsWith(path)
    )

    // 🔒 Bloquea acceso a rutas protegidas si no hay sesión
    if (isProtected && !session) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // 🔁 Evita que usuarios logueados accedan a login o register
    if (isAuthPage && session) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
}
// Agrega esta exportación al final del archivo 👇
export const config = {
    matcher: ['/dashboard/:path*', '/perfil/:path*', '/mascota/:path*', '/login', '/register'],
}
