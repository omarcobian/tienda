/**
 * Auth Validation Schemas using Zod
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Validación de formato de email con regex RFC 5322
 * - ✅ Requisitos mínimos de seguridad para contraseñas
 * - ✅ Validación de roles con enum
 * - ✅ Mensajes claros y específicos
 * 
 * Mejoras de seguridad implementadas:
 * - Contraseña mínima de 8 caracteres
 * - Validación de formato de email
 * - Roles restringidos a valores específicos
 * 
 * Escalabilidad futura:
 * - Añadir validación de complejidad de contraseña (mayúsculas, números, símbolos)
 * - Implementar rate limiting en las validaciones
 * - Añadir validación de 2FA (Two-Factor Authentication)
 * - Validar contra lista de contraseñas comprometidas (haveibeenpwned API)
 */

import { z } from 'zod';

/**
 * Schema para login
 * Valida credenciales de acceso al sistema
 */
export const LoginSchema = z.object({
  email: z.string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido")
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
});

/**
 * Schema para registro de usuario
 * Incluye validación de rol
 */
export const RegisterUserSchema = z.object({
  email: z.string()
    .min(1, "El email es obligatorio")
    .email("Formato de email inválido")
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(100, "La contraseña no puede exceder 100 caracteres"),
    // Mejora futura: añadir validación de complejidad
    // .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    //   "La contraseña debe contener mayúsculas, minúsculas, números y símbolos"),
  
  roll: z.enum(["USER", "ADMIN"], {
    message: "El rol debe ser 'USER' o 'ADMIN'"
  }).default("USER"),
});

/**
 * Tipos TypeScript inferidos de los schemas
 */
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
