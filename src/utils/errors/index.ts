/**
 * Custom Error Classes y Error Handling Utilities
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Errores personalizados con códigos HTTP específicos
 * - ✅ Mensajes de error estructurados y consistentes
 * - ✅ Separación de errores de negocio, validación y sistema
 * - ✅ Stack traces en desarrollo para debugging
 * 
 * Escalabilidad futura:
 * - Integrar con sistema de logging (Winston, Pino)
 * - Enviar errores críticos a servicio de monitoreo (Sentry, Datadog)
 * - Añadir internacionalización (i18n) para mensajes
 * - Implementar error tracking y analytics
 */

import { ZodError } from 'zod';

/**
 * Clase base para errores personalizados de la aplicación
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error de validación de datos (400)
 */
export class ValidationError extends AppError {
  constructor(message: string = "Error de validación") {
    super(message, 400);
  }
}

/**
 * Error de autenticación (401)
 */
export class AuthenticationError extends AppError {
  constructor(message: string = "Credenciales inválidas") {
    super(message, 401);
  }
}

/**
 * Error de autorización (403)
 */
export class AuthorizationError extends AppError {
  constructor(message: string = "No tienes permisos para realizar esta acción") {
    super(message, 403);
  }
}

/**
 * Error de recurso no encontrado (404)
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Recurso no encontrado") {
    super(message, 404);
  }
}

/**
 * Error de conflicto (409) - ej: email duplicado
 */
export class ConflictError extends AppError {
  constructor(message: string = "El recurso ya existe") {
    super(message, 409);
  }
}

/**
 * Error interno del servidor (500)
 */
export class InternalError extends AppError {
  constructor(message: string = "Error interno del servidor") {
    super(message, 500, false); // no es operacional, indica un bug
  }
}

/**
 * Formatea errores de Zod para respuestas amigables
 * Convierte errores de validación en formato legible
 */
export function formatZodError(error: ZodError): string[] {
  return error.errors.map(err => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
}

/**
 * Interfaz para respuestas de error estandarizadas
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    details?: string[];
    stack?: string;
  };
}

/**
 * Interfaz para respuestas exitosas estandarizadas
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * Handler centralizado de errores para API Routes
 * Convierte diferentes tipos de errores en respuestas HTTP consistentes
 * 
 * @param error - Error capturado
 * @returns Response con formato estandarizado
 */
export function handleApiError(error: unknown): Response {
  // Error de validación con Zod
  if (error instanceof ZodError) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: "Error de validación",
        details: formatZodError(error),
      },
    };
    return Response.json(errorResponse, { status: 400 });
  }

  // Errores personalizados de la aplicación
  if (error instanceof AppError) {
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: error.message,
        // Solo incluir stack trace en desarrollo
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    };
    return Response.json(errorResponse, { status: error.statusCode });
  }

  // Error desconocido - no debería llegar aquí
  console.error('Unhandled error:', error);
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: "Error interno del servidor",
      // Solo mostrar detalles en desarrollo
      ...(process.env.NODE_ENV === 'development' && {
        details: [error instanceof Error ? error.message : String(error)],
        stack: error instanceof Error ? error.stack : undefined,
      }),
    },
  };
  
  return Response.json(errorResponse, { status: 500 });
}

/**
 * Helper para crear respuestas exitosas consistentes
 */
export function createSuccessResponse<T>(data: T, status: number = 200): Response {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };
  return Response.json(response, { status });
}
