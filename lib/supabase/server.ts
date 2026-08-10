// @/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // createServerClient crea un cliente de Supabase optimizado para el servidor
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // getAll se usa para leer las cookies de la petición entrante
        getAll() {
          return cookieStore.getAll()
        },
        // setAll se usa para escribir cookies en la respuesta saliente
        // Esto es vital para refrescar el token de sesión automáticamente
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Este catch es necesario porque el Middleware a veces 
            // no puede escribir cookies directamente si la respuesta 
            // ya se ha empezado a enviar. La lógica de refresco 
            // principal ocurre en el Middleware.
          }
        },
      },
    }
  )
}
