/**
 * Product API Routes - /api/product
 * 
 * Arquitectura aplicada:
 * - ✅ Separación de responsabilidades (routing vs business logic)
 * - ✅ Validación centralizada con Zod
 * - ✅ Manejo de errores consistente
 * - ✅ Respuestas API estandarizadas
 * - ✅ Uso de service layer para lógica de negocio
 * 
 * Buenas prácticas implementadas:
 * - Validación de entrada antes de procesar
 * - Códigos HTTP semánticamente correctos (200, 201, 400, 404, 500)
 * - Mensajes de error descriptivos pero seguros
 * - Logging de errores para debugging
 * - Try-catch en cada handler
 * 
 * Endpoints disponibles:
 * - GET    /api/product       -> Listar todos los productos
 * - POST   /api/product       -> Crear nuevo producto
 * - PUT    /api/product       -> Actualizar producto existente
 * - DELETE /api/product       -> Eliminar producto
 * 
 * Mejoras futuras de escalabilidad:
 * - Dividir en rutas específicas: /api/product/[id]/route.ts para operaciones por ID
 * - Implementar middleware de autenticación/autorización
 * - Añadir rate limiting para prevenir abuso
 * - Implementar caché de respuestas (Redis/Next.js cache)
 * - Añadir paginación para GET (query params: page, limit)
 * - Implementar búsqueda y filtros (query params: search, category, status)
 * - Añadir webhooks para notificar cambios
 * - Implementar versioning de API (/api/v1/product)
 */

import { NextRequest } from 'next/server';
import { productService } from '@/services/product.service';
import { handleApiError, createSuccessResponse } from '@/utils/errors';
import { 
  CreateProductSchema, 
  UpdateProductSchema, 
  DeleteProductSchema 
} from '@/schemas/product.schema';

/**
 * GET /api/product
 * Obtiene todos los productos
 * 
 * Mejora futura: Implementar paginación
 * @example
 * GET /api/product?page=1&limit=20&category=Electrónica&status=Activo
 */
export async function GET() {
  try {
    const products = await productService.getAllProducts();
    return createSuccessResponse(products, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/product
 * Crea un nuevo producto
 * 
 * Body esperado:
 * {
 *   "name": "Producto Ejemplo",
 *   "category": "Categoría",
 *   "price": 99.99,
 *   "status": "Activo" // opcional, default: "Activo"
 * }
 * 
 * Mejora futura: Implementar autenticación
 * Solo usuarios con rol ADMIN deberían poder crear productos
 */
export async function POST(req: NextRequest) {
  try {
    // Parsear body de la request
    const body = await req.json();
    
    // Validar datos con Zod schema
    // Si falla, lanza ZodError que será manejado por handleApiError
    const validatedData = CreateProductSchema.parse(body);
    
    // Crear producto usando el servicio
    const product = await productService.createProduct(validatedData);
    
    // Retornar respuesta exitosa con código 201 (Created)
    return createSuccessResponse(product, 201);
  } catch (error) {
    // El handler de errores se encarga de formatear apropiadamente
    return handleApiError(error);
  }
}

/**
 * PUT /api/product
 * Actualiza un producto existente
 * 
 * Body esperado:
 * {
 *   "id": "507f1f77bcf86cd799439011",
 *   "name": "Producto Actualizado", // opcional
 *   "category": "Nueva Categoría",  // opcional
 *   "price": 149.99,                // opcional
 *   "status": "Inactivo"            // opcional
 * }
 * 
 * Solo se actualizan los campos enviados (partial update)
 * 
 * Mejora futura: Dividir en PATCH vs PUT
 * - PATCH para actualizaciones parciales
 * - PUT para reemplazar el recurso completo
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validar que incluya el ID y los campos sean válidos
    const validatedData = UpdateProductSchema.parse(body);
    const { id, ...updateData } = validatedData;
    
    // Actualizar producto
    const product = await productService.updateProduct(id, updateData);
    
    return createSuccessResponse(product, 200);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/product
 * Elimina un producto
 * 
 * Body esperado:
 * {
 *   "id": "507f1f77bcf86cd799439011"
 * }
 * 
 * Mejora futura: Usar route params en lugar de body
 * DELETE /api/product/[id] es más RESTful
 * 
 * Mejora de seguridad: Implementar soft delete
 * En lugar de eliminar físicamente, marcar como eliminado
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validar que incluya el ID
    const { id } = DeleteProductSchema.parse(body);
    
    // Eliminar producto
    const product = await productService.deleteProduct(id);
    
    return createSuccessResponse(product, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
