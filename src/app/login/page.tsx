'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!form.email || !form.password) {
            toast.error('Todos los campos son obligatorios')
            return
        }

        const { error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password,
        })

        if (error) {
            setError('Correo o contraseña incorrectos')
        } else {
            toast.success('Inicio de sesión exitoso 🎉')
            setTimeout(() => {
                window.location.href = '/dashboard' // Redirige de forma confiable
            }, 300)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-indigo-600">PAWLINK</h2>
                </div>

                <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Inicia sesión</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4 flex items-center" role="alert">
                        <FiAlertCircle className="mr-2 flex-shrink-0" />
                        <span className="block sm:inline text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                        <div className="relative rounded-md shadow-sm">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiMail className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="pl-10 pr-4 py-2 block w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <div className="relative rounded-md shadow-sm">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <FiLock className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="pl-10 pr-10 py-2 block w-full border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="text-right text-sm">
                        <Link href="/recuperar" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-semibold hover:bg-indigo-700 transition">
                        Iniciar sesión
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-8">
                    ¿Aún no tienes una cuenta?{' '}
                    <Link href="/register" className="text-indigo-600 hover:text-indigo-500 hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </main>
    )
}
