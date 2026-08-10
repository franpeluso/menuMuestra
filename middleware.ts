// /middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. Crear el cliente de Supabase para el Middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Actualizar las cookies en la petición entrante
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          // Actualizar las cookies en la respuesta saliente
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 2. OBTENER EL USUARIO (IMPORTANTE: getUser(), no getSession())
  // getUser() verifica el token JWT en cada petición, lo cual es seguro.
  // getSession() no verifica el token y puede ser inseguro en el servidor.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. LÓGICA DE PROTECCIÓN DE RUTAS
  const isUrlAdmin = request.nextUrl.pathname.startsWith('/admin')
  const isUrlLogin = request.nextUrl.pathname.startsWith('/login')

  // Si trata de entrar a /admin y NO está logueado -> Redirigir a /login
  if (isUrlAdmin && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Opcional: Guardar la URL original para volver después del login
    url.searchParams.set('redirectedFrom', request.nextUrl.pathname) 
    return NextResponse.redirect(url)
  }

  // Si trata de entrar a /login y SÍ está logueado -> Redirigir a /admin
  if (isUrlLogin && user) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return supabaseResponse
}

// 4. CONFIGURAR EL MATCH (A qué rutas aplica)
export const config = {
  matcher: [
    // Aplica a /admin y todas sus subrutas (/admin/platos, etc.)
    '/admin/:path*',
    // Aplica también a la página de login para la lógica inversa
    '/login',
    // Excluir rutas internas de Next.js, archivos estáticos e imágenes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}