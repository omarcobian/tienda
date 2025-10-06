/**
 * Login Component - Formulario de autenticación
 * 
 * Arquitectura aplicada:
 * - ✅ Componente cliente con manejo de estado
 * - ✅ Integración con contexto de autenticación
 * - ✅ Validación de formulario
 * - ✅ Feedback visual de estados (loading, error)
 * - ✅ Redirección basada en rol de usuario
 * 
 * IMPORTANTE - Problemas de seguridad y arquitectura:
 * ====================================================
 * 
 * 1. Doble autenticación (API + Mock):
 *    - Se llama a /api/auth (backend con BD)
 *    - Luego se usa login() del hook que tiene usuarios mock
 *    - Esto causa inconsistencia y problemas de seguridad
 * 
 * 2. Usuarios mock en frontend:
 *    - useAuth tiene usuarios hardcodeados
 *    - No debería haber usuarios mock en producción
 * 
 * 3. Sin JWT/tokens:
 *    - Solo se guarda en localStorage sin seguridad
 *    - No hay expiración de sesión
 *    - Vulnerable a XSS
 * 
 * Refactorización necesaria para producción:
 * ==========================================
 * 
 * A. Eliminar usuarios mock de useAuth
 * B. Implementar JWT en backend (/api/auth)
 * C. Guardar token JWT en httpOnly cookie (más seguro que localStorage)
 * D. Verificar token en cada request protegido
 * E. Implementar refresh token para renovar sesión
 * 
 * @example Flujo correcto con JWT (futuro):
 * ```typescript
 * const handleLogin = async (e: React.FormEvent) => {
 *   e.preventDefault()
 *   setLoading(true)
 *   
 *   try {
 *     const response = await fetch('/api/auth', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ email, password })
 *     })
 *     
 *     const data = await response.json()
 *     
 *     if (response.ok) {
 *       // Token se guarda automáticamente en httpOnly cookie
 *       // Actualizar contexto con datos de usuario
 *       setUser(data.user)
 *       router.push(data.user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/user')
 *     } else {
 *       setError(data.error.message)
 *     }
 *   } catch (err) {
 *     setError('Error de conexión')
 *   } finally {
 *     setLoading(false)
 *   }
 * }
 * ```
 */

"use client"

import { useState } from "react"
import { useAuth } from "@hooks/useAuth";
import { redirect } from "next/navigation";

export default function Login() {
  // Contexto de autenticación
  const { user, login } = useAuth()
  
  // Estado del formulario
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  /**
   * Handler del login
   * 
   * PROBLEMA: Hay inconsistencia entre la API real y el mock
   * - La API valida contra BD con contraseñas hasheadas
   * - El hook useAuth valida contra usuarios mock
   * 
   * Solución temporal: Mantener ambos para compatibilidad
   * Solución definitiva: Eliminar mock y usar solo API con JWT
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // 1. Validar contra API real (BD)
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.status === 401) {
        setError("Credenciales inválidas")
        return
      }

      if (!response.ok) {
        setError("Error al iniciar sesión")
        return
      }

      // 2. Si API es exitosa, actualizar contexto mock
      // NOTA: Esto es temporal, en producción solo usar JWT
      await login(email, password)
      
    } catch (error) {
      console.error('Login error:', error)
      setError("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Redirección basada en rol
   * Si el usuario ya está autenticado, redirigir a su dashboard
   */
  if (user) {
    return user.role === "admin" 
      ? redirect("/dashboard/admin") 
      : redirect("/dashboard/user")
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white mx-auto p-6 rounded-xl shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900">Sistema POS</h3>
          <p className="text-sm text-gray-600 mt-2">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Campo: Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>

          {/* Campo: Contraseña */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Botón de submit */}
          <button 
            type="submit" 
            className="w-full bg-black text-white py-2 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Usuarios de prueba - Solo para desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-2">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>Admin: admin@pos.com / admin123</p>
              <p>Empleado: empleado@pos.com / emp123</p>
            </div>
            <p className="text-xs text-orange-600 mt-2">
              ⚠️ Estos usuarios están en el mock del frontend. En producción usar solo BD.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

