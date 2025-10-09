/**
 * Types definitions for the application
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Tipado fuerte con TypeScript
 * - ✅ Separación de tipos de dominio y DTOs
 * - ✅ Documentación de cada tipo
 * - ✅ Reutilización de tipos compartidos
 * 
 * Escalabilidad futura:
 * - Generar tipos automáticamente desde Prisma schema
 * - Sincronizar tipos entre frontend y backend
 * - Usar utility types para transformaciones (Partial, Pick, Omit)
 */

// ============================================================================
// PRODUCT TYPES
// ============================================================================

/**
 * Tipo base de producto (legacy - mantener por compatibilidad)
 * @deprecated Usar ProductWithId para nuevos desarrollos
 */
export type product = {
  name: string
  status: "Activo" | "Inactivo"
  category: string
  price: number
  date: string
}

/**
 * Producto completo con ID (como viene de la BD)
 */
export type ProductWithId = {
  id: string
  name: string
  status: "Activo" | "Inactivo"
  category: string
  price: number
  description: string
  date: string
}

/**
 * DTO para crear un producto
 * No incluye id ni date (se generan automáticamente)
 */
export type CreateProductDTO = Omit<ProductWithId, 'id' | 'date'>

/**
 * DTO para actualizar un producto
 * Todos los campos son opcionales excepto el ID
 */
export type UpdateProductDTO = Partial<Omit<ProductWithId, 'id'>> & { id: string }

// ============================================================================
// USER & AUTH TYPES
// ============================================================================

/**
 * Roles disponibles en el sistema
 */
export type UserRole = "USER" | "ADMIN"

/**
 * Usuario completo (con contraseña - solo para uso interno)
 * NUNCA exponer este tipo en respuestas API
 */
export type UserInternal = {
  id: string
  email: string
  password: string
  roll: UserRole
}

/**
 * Usuario público (sin contraseña - para respuestas API)
 */
export type User = Omit<UserInternal, 'password'>

/**
 * DTO para login
 */
export type LoginDTO = {
  email: string
  password: string
}

/**
 * DTO para registro de usuario
 */
export type RegisterDTO = {
  email: string
  password: string
  roll?: UserRole
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Respuesta exitosa genérica
 */
export type ApiSuccessResponse<T = unknown> = {
  success: true
  data: T
}

/**
 * Respuesta de error genérica
 */
export type ApiErrorResponse = {
  success: false
  error: {
    message: string
    details?: string[]
    stack?: string
  }
}

/**
 * Tipo de respuesta API (puede ser éxito o error)
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

// ============================================================================
// UI/COMPONENT TYPES
// ============================================================================

/**
 * Props para stats de productos
 */
export type ProductStat = {
  label: string
  value: number
  color?: string
}
