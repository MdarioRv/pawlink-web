# 🐾 PAWLINK

PAWLINK es una plataforma inteligente de identificación y rastreo para mascotas, usando placas QR y tecnología GPS.

---

## 🚀 Tecnologías usadas

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS v4
- Supabase (Auth, Database, Storage)
- Vercel (Hosting)

---

## 🛠️ Funcionalidades principales

- Registro de usuarios y mascotas
- Generación de QR dinámico
- Sistema de órdenes de placas (QR y GPS)
- Edición y visualización pública de mascotas
- Panel administrativo para gestión avanzada
- Geolocalización simulada para rastreo

---

## 📦 Instalación local

```bash
git clone https://github.com/tu_usuario/pawlink.git
cd pawlink
npm install
npm run dev

## Crea un archivo .env.local con tus claves de Supabase:

NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
