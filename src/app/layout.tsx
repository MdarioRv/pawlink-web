// src/app/layout.tsx
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable}
          antialiased
          bg-white text-gray-800 transition-colors duration-200
        `}
      >
        <Header />
        {children}
        <Footer />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
