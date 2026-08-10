// app/login/page.tsx
'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, LogIn, AlertTriangle } from 'lucide-react'

// 1. Creamos un componente interno que maneja el formulario y usa useSearchParams
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Obtener la URL a la que quería ir originalmente
  const redirectTo = searchParams.get('redirectedFrom') || '/admin'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error('Credenciales inválidas. Por favor verifique su email y contraseña.')
      }

      if (data?.session) {
        // Redirección completa de ventana para enviar las cookies/sesión de Supabase
        window.location.href = redirectTo
      }

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
          <AlertTriangle className="w-10 h-10 text-red-600 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-stone-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          required
          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#8B262A]/30 focus:border-[#8B262A] transition-all text-sm"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-stone-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#8B262A]/30 focus:border-[#8B262A] transition-all text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-[#8B262A] hover:bg-[#8B262A]/90 text-white font-bold py-3.5 rounded-full text-xs uppercase tracking-widest transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Iniciando sesión...
          </>
        ) : (
          'Ingresar al panel'
        )}
      </button>
    </form>
  )
}

// 2. Exportamos la página principal envolviendo LoginForm dentro de Suspense
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-stone-200 shadow-xl space-y-8">
        
        {/* Encabezado */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-[#8B262A]/10 text-[#8B262A] rounded-full flex items-center justify-center mx-auto border border-[#8B262A]/20">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight uppercase pt-4">
            PANEL DE CONTROL
          </h1>
          <p className="text-stone-600 text-sm font-serif italic">
            Inicie sesión para administrar su menú
          </p>
        </div>

        {/* Formulario envuelto en Suspense */}
        <Suspense fallback={<div className="text-center text-sm text-stone-500">Cargando formulario...</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center pt-4 border-t border-stone-200">
          <a href="/" className="text-xs text-stone-500 hover:text-[#8B262A] font-medium">
            ← Volver a la carta pública
          </a>
        </div>

      </div>
    </main>
  )
}