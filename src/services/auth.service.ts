/**
 * Auth Service - Capa de lógica de negocio para Autenticación
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Hash de contraseñas con bcrypt (seguridad)
 * - ✅ Validación de credenciales con Zod
 * - ✅ Separación de lógica de autenticación
 * - ✅ Manejo de errores específicos
 * - ✅ No exponer información sensible en errores
 * 
 * Mejoras de seguridad implementadas:
 * - Contraseñas hasheadas con bcrypt (salt rounds: 10)
 * - Comparación segura de contraseñas
 * - Mensajes de error genéricos para evitar user enumeration
 * 
 * Escalabilidad futura:
 * - Implementar JWT para autenticación stateless
 * - Añadir refresh tokens para sesiones persistentes
 * - Implementar rate limiting para prevenir brute force
 * - Añadir autenticación de dos factores (2FA)
 * - Integrar OAuth2/OIDC para login social (Google, GitHub)
 * - Implementar sesiones con Redis para mejor rendimiento
 * - Añadir logging de intentos de login para auditoría
 */

import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import {
  LoginSchema,
  RegisterUserSchema,
  type LoginInput,
  type RegisterUserInput,
} from '@/schemas/auth.schema';
import { AuthenticationError, ConflictError } from '@/utils/errors';

/**
 * Número de salt rounds para bcrypt
 * 10 es un balance entre seguridad y performance
 * Cada incremento duplica el tiempo de hash
 */
const SALT_ROUNDS = 10;

/**
 * Tipo de usuario retornado (sin contraseña)
 */
export type AuthUser = {
  id: string;
  email: string;
  roll: "USER" | "ADMIN";
};

/**
 * Interface para el servicio de autenticación
 */
export interface IAuthService {
  login(credentials: LoginInput): Promise<AuthUser>;
  register(userData: RegisterUserInput): Promise<AuthUser>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}

/**
 * Implementación del servicio de autenticación
 */
class AuthService implements IAuthService {
  
  /**
   * Autentica un usuario con email y contraseña
   * 
   * Seguridad: Usa mensaje genérico para evitar user enumeration attack
   * No revela si el email existe o si la contraseña es incorrecta
   * 
   * Mejora futura: Implementar rate limiting
   * - Limitar intentos de login por IP/email
   * - Bloquear temporalmente tras X intentos fallidos
   * - Implementar CAPTCHA tras varios intentos
   */
  async login(credentials: LoginInput): Promise<AuthUser> {
    // Validar credenciales
    const validatedCredentials = LoginSchema.parse(credentials);
    const { email, password } = validatedCredentials;
    
    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    // Si no existe el usuario, lanzar error genérico
    if (!user) {
      throw new AuthenticationError("Credenciales inválidas");
    }
    
    // Comparar contraseña hasheada
    const isPasswordValid = await this.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      throw new AuthenticationError("Credenciales inválidas");
    }
    
    // Retornar usuario sin contraseña
    return {
      id: user.id,
      email: user.email,
      roll: user.roll,
    };
  }

  /**
   * Registra un nuevo usuario
   * Hashea la contraseña antes de guardar
   * 
   * Mejora futura:
   * - Enviar email de confirmación
   * - Validar formato de email con servicio externo
   * - Implementar verificación en 2 pasos
   */
  async register(userData: RegisterUserInput): Promise<AuthUser> {
    // Validar datos
    const validatedData = RegisterUserSchema.parse(userData);
    const { email, password, roll } = validatedData;
    
    // Verificar si el email ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      throw new ConflictError("El email ya está registrado");
    }
    
    // Hashear contraseña
    const hashedPassword = await this.hashPassword(password);
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        roll,
      },
    });
    
    // Retornar usuario sin contraseña
    return {
      id: user.id,
      email: user.email,
      roll: user.roll,
    };
  }

  /**
   * Hashea una contraseña usando bcrypt
   * 
   * @param password - Contraseña en texto plano
   * @returns Contraseña hasheada
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compara una contraseña en texto plano con su hash
   * 
   * @param password - Contraseña en texto plano
   * @param hash - Hash almacenado en BD
   * @returns true si coinciden, false si no
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

/**
 * Exportar instancia singleton del servicio
 */
export const authService = new AuthService();
