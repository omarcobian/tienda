/**
 * Admin User Registration API Route - /api/admin
 * 
 * Arquitectura aplicada:
 * - ✅ Uso de service layer para lógica de autenticación
 * - ✅ Validación con Zod schemas
 * - ✅ Hash de contraseñas con bcrypt
 * - ✅ Manejo de errores consistente
 * 
 * Endpoint:
 * - POST /api/admin -> Crear nuevo usuario con rol ADMIN
 * 
 * IMPORTANTE - SEGURIDAD:
 * ========================
 * Este endpoint permite crear administradores sin autenticación.
 * En producción, esto es un RIESGO DE SEGURIDAD CRÍTICO.
 * 
 * Mejoras OBLIGATORIAS antes de producción:
 * 
 * 1. Implementar autenticación/autorización
 *    - Solo admins existentes pueden crear nuevos admins
 *    - Verificar token JWT en headers
 *    - Validar permisos del usuario autenticado
 * 
 * 2. Rate limiting estricto
 *    - Máximo 3 intentos de registro por IP/hora
 *    - Bloqueo temporal tras múltiples intentos
 * 
 * 3. Validación adicional
 *    - Verificar email corporativo (@empresa.com)
 *    - Requiere código de invitación o link seguro
 *    - Confirmación por email antes de activar cuenta
 * 
 * 4. Auditoría
 *    - Registrar quién creó cada admin
 *    - Notificar a super-admins cuando se crea nuevo admin
 *    - Mantener log de todas las creaciones
 * 
 * @example Implementación segura (futuro):
 * ```typescript
 * export async function POST(req: NextRequest) {
 *   // 1. Verificar autenticación
 *   const currentUser = await authenticateRequest(req);
 *   
 *   // 2. Verificar autorización
 *   if (currentUser.roll !== 'ADMIN') {
 *     throw new AuthorizationError('Solo administradores pueden crear nuevos admins');
 *   }
 *   
 *   // 3. Continuar con creación...
 * }
 * ```
 */

import { NextRequest } from 'next/server';
import { authService } from '@/services/auth.service';
import { handleApiError, createSuccessResponse } from '@/utils/errors';
import { RegisterUserSchema } from '@/schemas/auth.schema';

/**
 * POST /api/admin
 * Crea un nuevo usuario con rol ADMIN
 * 
 * Body esperado:
 * {
 *   "email": "admin@empresa.com",
 *   "password": "contraseñaSegura123"
 * }
 * 
 * ⚠️ ADVERTENCIA: Este endpoint no está protegido
 * En producción debe requerir autenticación de otro admin
 */
export async function POST(req: NextRequest) {
  try {
    // Parsear datos del body
    const body = await req.json();
    
    // Validar y forzar rol ADMIN
    const userData = RegisterUserSchema.parse({
      ...body,
      roll: 'ADMIN', // Forzar rol ADMIN
    });
    
    // Registrar usuario con contraseña hasheada
    const user = await authService.register(userData);
    
    /**
     * Mejora futura: Enviar email de confirmación
     * await sendConfirmationEmail(user.email, confirmationToken);
     * 
     * return createSuccessResponse({ 
     *   message: 'Admin creado. Verifica tu email para activar la cuenta',
     *   email: user.email 
     * }, 201);
     */
    
    return createSuccessResponse(user, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
