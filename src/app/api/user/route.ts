/**
 * User Registration API Route - /api/user
 * 
 * Arquitectura aplicada:
 * - ✅ Uso de service layer para lógica de autenticación
 * - ✅ Validación con Zod schemas
 * - ✅ Hash de contraseñas con bcrypt
 * - ✅ Manejo de errores consistente
 * 
 * Endpoint:
 * - POST /api/user -> Crear nuevo usuario con rol USER
 * 
 * Mejoras futuras:
 * - Implementar confirmación por email
 * - Rate limiting para prevenir spam de registros
 * - CAPTCHA para prevenir bots
 * - Validar que el email no esté en lista negra
 */

import { NextRequest } from 'next/server';
import { authService } from '@/services/auth.service';
import { handleApiError, createSuccessResponse } from '@/utils/errors';
import { RegisterUserSchema } from '@/schemas/auth.schema';

/**
 * POST /api/user
 * Crea un nuevo usuario con rol USER
 * 
 * Body esperado:
 * {
 *   "email": "usuario@example.com",
 *   "password": "contraseña123"
 * }
 * 
 * Mejora futura: Añadir verificación de email
 * - Generar token de verificación
 * - Enviar email con link de confirmación
 * - Marcar cuenta como no verificada
 * - Requerir verificación para login
 */
export async function POST(req: NextRequest) {
  try {
    // Parsear datos del body
    const body = await req.json();
    
    // Validar y forzar rol USER
    const userData = RegisterUserSchema.parse({
      ...body,
      roll: 'USER', // Forzar rol USER
    });
    
    // Registrar usuario con contraseña hasheada
    const user = await authService.register(userData);
    
    /**
     * Mejora futura: Proceso de verificación por email
     * 
     * // Generar token de verificación
     * const verificationToken = generateVerificationToken(user.id);
     * 
     * // Guardar token en BD con expiración
     * await saveVerificationToken(user.id, verificationToken, 24h);
     * 
     * // Enviar email
     * await sendVerificationEmail(user.email, verificationToken);
     * 
     * return createSuccessResponse({ 
     *   message: 'Usuario registrado. Verifica tu email para activar la cuenta',
     *   email: user.email 
     * }, 201);
     */
    
    return createSuccessResponse(user, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
