/**
 * Auth API Route - /api/auth
 * 
 * Arquitectura aplicada:
 * - ✅ Separación de lógica de autenticación en service layer
 * - ✅ Hash de contraseñas con bcrypt (seguridad)
 * - ✅ Validación de credenciales con Zod
 * - ✅ Manejo de errores consistente y seguro
 * - ✅ Respuestas estandarizadas
 * 
 * Mejoras de seguridad implementadas:
 * - Contraseñas hasheadas (nunca en texto plano)
 * - Mensajes de error genéricos (evitar user enumeration)
 * - Validación de formato de email
 * - Requisitos mínimos de contraseña
 * 
 * Endpoint:
 * - POST /api/auth -> Autenticar usuario (login)
 * 
 * IMPORTANTE - Mejoras futuras CRÍTICAS para producción:
 * ========================================================
 * 1. Implementar JWT (JSON Web Tokens) para autenticación stateless
 *    - Generar token al login exitoso
 *    - Incluir claims: userId, email, role, exp
 *    - Firmar con secret key (env variable)
 * 
 * 2. Implementar refresh tokens para sesiones persistentes
 *    - Access token de corta duración (15 min)
 *    - Refresh token de larga duración (7 días)
 *    - Endpoint para renovar tokens
 * 
 * 3. Implementar rate limiting
 *    - Máximo 5 intentos por IP cada 15 minutos
 *    - Bloqueo temporal tras intentos fallidos
 *    - CAPTCHA tras 3 intentos fallidos
 * 
 * 4. Añadir sesiones en servidor
 *    - Usar Redis para almacenar sesiones
 *    - Permitir cerrar sesión desde el servidor
 *    - Invalidar tokens comprometidos
 * 
 * 5. Implementar 2FA (Two-Factor Authentication)
 *    - TOTP (Time-based One-Time Password)
 *    - SMS o Email verification
 * 
 * 6. Logging y auditoría
 *    - Registrar todos los intentos de login
 *    - IP, timestamp, user agent, resultado
 *    - Alertas de actividad sospechosa
 * 
 * 7. OAuth2/OIDC para login social
 *    - Google, GitHub, Microsoft
 *    - Usar NextAuth.js o Auth0
 */

import { NextRequest } from 'next/server';
import { authService } from '@/services/auth.service';
import { handleApiError, createSuccessResponse } from '@/utils/errors';
import { LoginSchema } from '@/schemas/auth.schema';

/**
 * POST /api/auth
 * Autentica un usuario con email y contraseña
 * 
 * Body esperado:
 * {
 *   "email": "usuario@example.com",
 *   "password": "contraseña123"
 * }
 * 
 * Respuesta exitosa:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "507f1f77bcf86cd799439011",
 *     "email": "usuario@example.com",
 *     "roll": "ADMIN"
 *   }
 * }
 * 
 * Respuesta de error:
 * {
 *   "success": false,
 *   "error": {
 *     "message": "Credenciales inválidas"
 *   }
 * }
 * 
 * NOTA: En producción, esta respuesta debería incluir un JWT token
 * en lugar de los datos del usuario directamente
 * 
 * @example Implementación con JWT (futuro):
 * ```typescript
 * const token = jwt.sign(
 *   { userId: user.id, email: user.email, role: user.roll },
 *   process.env.JWT_SECRET,
 *   { expiresIn: '15m' }
 * );
 * 
 * return createSuccessResponse({ 
 *   token, 
 *   refreshToken,
 *   user: { id: user.id, email: user.email, role: user.roll }
 * });
 * ```
 */
export async function POST(req: NextRequest) {
  try {
    // Parsear credenciales del body
    const body = await req.json();
    
    // Validar formato de credenciales
    const credentials = LoginSchema.parse(body);
    
    // Autenticar usuario
    const user = await authService.login(credentials);
    
    /**
     * Mejora futura: Generar JWT token aquí
     * const token = generateAccessToken(user);
     * const refreshToken = generateRefreshToken(user);
     * 
     * // Guardar refresh token en BD
     * await saveRefreshToken(user.id, refreshToken);
     * 
     * return createSuccessResponse({ token, refreshToken, user }, 200);
     */
    
    // Por ahora, retornar usuario directamente
    return createSuccessResponse(user, 200);
  } catch (error) {
    // El handler de errores se encarga de formatear apropiadamente
    // Los errores de autenticación retornan 401
    return handleApiError(error);
  }
}

/**
 * Mejora futura: Añadir endpoint de logout
 * 
 * POST /api/auth/logout
 * Invalida el token del usuario
 * 
 * @example
 * export async function DELETE(req: NextRequest) {
 *   try {
 *     const token = req.headers.get('Authorization')?.replace('Bearer ', '');
 *     
 *     if (!token) {
 *       throw new AuthenticationError('Token no proporcionado');
 *     }
 *     
 *     // Invalidar token (añadir a blacklist en Redis)
 *     await invalidateToken(token);
 *     
 *     return createSuccessResponse({ message: 'Sesión cerrada exitosamente' }, 200);
 *   } catch (error) {
 *     return handleApiError(error);
 *   }
 * }
 */

/**
 * Mejora futura: Añadir endpoint de refresh token
 * 
 * POST /api/auth/refresh
 * Renueva el access token usando el refresh token
 * 
 * @example
 * export async function PATCH(req: NextRequest) {
 *   try {
 *     const { refreshToken } = await req.json();
 *     
 *     // Verificar refresh token
 *     const payload = verifyRefreshToken(refreshToken);
 *     
 *     // Generar nuevo access token
 *     const newAccessToken = generateAccessToken({
 *       id: payload.userId,
 *       email: payload.email,
 *       roll: payload.role
 *     });
 *     
 *     return createSuccessResponse({ token: newAccessToken }, 200);
 *   } catch (error) {
 *     return handleApiError(error);
 *   }
 * }
 */

