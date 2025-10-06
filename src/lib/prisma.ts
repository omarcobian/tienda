/**
 * Prisma Client Instance - Singleton Pattern
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Singleton pattern para evitar múltiples instancias
 * - ✅ Prevención de múltiples clientes en desarrollo (hot reload)
 * - ✅ Reutilización de conexión a BD
 * - ✅ Configuración optimizada para Next.js
 * 
 * ¿Por qué este patrón?
 * ====================
 * En desarrollo, Next.js usa Hot Module Replacement (HMR) que recarga módulos.
 * Sin este patrón, cada recarga crearía una nueva instancia de PrismaClient,
 * agotando las conexiones disponibles a la BD.
 * 
 * En producción, se crea una única instancia al iniciar la aplicación.
 * 
 * Mejoras futuras para escalabilidad:
 * ===================================
 * 
 * 1. Connection Pooling avanzado
 *    - Configurar pool size según carga esperada
 *    - Diferentes pools para read/write operations
 * 
 * 2. Configurar timeouts y retries
 *    ```typescript
 *    new PrismaClient({
 *      datasources: {
 *        db: { url: process.env.DATABASE_URL }
 *      },
 *      log: ['query', 'error', 'warn'],
 *      errorFormat: 'pretty',
 *    })
 *    ```
 * 
 * 3. Implementar Read Replicas
 *    - Prisma Client para operaciones de lectura
 *    - Otro cliente para escrituras
 *    - Reducir carga en BD principal
 * 
 * 4. Middleware de Prisma
 *    - Logging automático de queries
 *    - Soft delete automático
 *    - Auditoría de cambios (createdBy, updatedBy)
 *    - Performance monitoring
 * 
 * 5. Query optimization
 *    - Eager loading con include
 *    - Select solo campos necesarios
 *    - Batching de queries cuando sea posible
 * 
 * @example Configuración avanzada:
 * ```typescript
 * const prisma = new PrismaClient({
 *   log: process.env.NODE_ENV === 'development' 
 *     ? ['query', 'error', 'warn'] 
 *     : ['error'],
 *   errorFormat: 'minimal',
 * })
 * 
 * // Middleware para soft delete
 * prisma.$use(async (params, next) => {
 *   if (params.action === 'delete') {
 *     params.action = 'update'
 *     params.args['data'] = { deletedAt: new Date() }
 *   }
 *   return next(params)
 * })
 * 
 * // Middleware para logging
 * prisma.$use(async (params, next) => {
 *   const before = Date.now()
 *   const result = await next(params)
 *   const after = Date.now()
 *   console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
 *   return result
 * })
 * ```
 */

import { PrismaClient } from '../../generated/prisma'

/**
 * Extender el tipo global para incluir prisma
 * Necesario para evitar errores de TypeScript con el patrón singleton
 */
const globalForPrisma = global as unknown as { 
  prisma: PrismaClient | undefined
}

/**
 * Crear instancia única de Prisma Client
 * En desarrollo: reutilizar instancia global si existe
 * En producción: crear nueva instancia
 */
const prisma = globalForPrisma.prisma || new PrismaClient({
  // Configuración opcional: descomentar para debugging
  // log: process.env.NODE_ENV === 'development' 
  //   ? ['query', 'error', 'warn'] 
  //   : ['error'],
})

/**
 * En desarrollo, guardar instancia en global para sobrevivir al HMR
 * En producción, no es necesario porque no hay HMR
 */
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

/**
 * Exportar instancia singleton
 * Esta es la única instancia que debe usarse en toda la aplicación
 */
export default prisma
