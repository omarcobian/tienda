/**
 * Product Service - Capa de lógica de negocio para Productos
 * 
 * Buenas prácticas aplicadas:
 * - ✅ Separación de lógica de negocio de las rutas API
 * - ✅ Funciones puras y reutilizables
 * - ✅ Validación de datos usando Zod schemas
 * - ✅ Manejo de errores con clases personalizadas
 * - ✅ Tipado fuerte con TypeScript
 * - ✅ Single Responsibility Principle
 * 
 * Patrón aplicado: Service Layer Pattern
 * - Encapsula la lógica de negocio
 * - Facilita testing unitario
 * - Permite reutilización en diferentes contextos
 * 
 * Escalabilidad futura:
 * - Implementar caching con Redis para listados frecuentes
 * - Añadir paginación, búsqueda y filtros avanzados
 * - Implementar soft delete (marcar como eliminado sin borrar)
 * - Añadir auditoría de cambios (quién modificó qué y cuándo)
 * - Implementar búsqueda full-text con ElasticSearch
 * - Añadir manejo de imágenes de productos (upload a S3/Cloudinary)
 */

import prisma from '@/lib/prisma';
import {
  CreateProductSchema,
  UpdateProductSchema,
  DeleteProductSchema,
  GetProductByIdSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from '@/schemas/product.schema';
import { NotFoundError } from '@/utils/errors';

/**
 * Interface para el servicio de productos
 * Define el contrato que debe cumplir la implementación
 */
export interface IProductService {
  getAllProducts(): Promise<ProductWithId[]>;
  getProductById(id: string): Promise<ProductWithId>;
  createProduct(data: CreateProductInput): Promise<ProductWithId>;
  updateProduct(id: string, data: Partial<UpdateProductInput>): Promise<ProductWithId>;
  deleteProduct(id: string): Promise<ProductWithId>;
}

/**
 * Tipo para producto con ID (respuesta de BD)
 */
type ProductWithId = {
  id: string;
  name: string;
  category: string;
  price: number;
  status: "Activo" | "Inactivo";
  date: string;
};

/**
 * Implementación del servicio de productos
 */
class ProductService implements IProductService {
  
  /**
   * Obtiene todos los productos
   * 
   * Mejora futura: Implementar paginación
   * @example
   * const products = await productService.getAllProducts({ page: 1, limit: 20 });
   */
  async getAllProducts(): Promise<ProductWithId[]> {
    try {
      const products = await prisma.product.findMany({
        orderBy: {
          date: 'desc', // Más recientes primero
        },
      });
      
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Obtiene un producto por ID
   * Lanza NotFoundError si no existe
   */
  async getProductById(id: string): Promise<ProductWithId> {
    // Validar formato de ID
    GetProductByIdSchema.parse({ id });
    
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      throw new NotFoundError(`Producto con ID ${id} no encontrado`);
    }
    
    return product;
  }

  /**
   * Crea un nuevo producto
   * Valida los datos antes de insertar en BD
   * 
   * Mejora futura: Validar que no exista producto duplicado por nombre
   */
  async createProduct(data: CreateProductInput): Promise<ProductWithId> {
    // Validación de datos con Zod
    const validatedData = CreateProductSchema.parse(data);
    
    // Verificar si ya existe un producto con el mismo nombre (opcional)
    // Mejora futura: activar esta validación si es necesario
    // const existingProduct = await prisma.product.findFirst({
    //   where: { name: { equals: validatedData.name, mode: 'insensitive' } }
    // });
    // if (existingProduct) {
    //   throw new ConflictError(`Ya existe un producto con el nombre "${validatedData.name}"`);
    // }
    
    // Crear producto con fecha automática
    const product = await prisma.product.create({
      data: {
        ...validatedData,
        date: new Date().toISOString(),
      },
    });
    
    return product;
  }

  /**
   * Actualiza un producto existente
   * Solo actualiza los campos proporcionados (partial update)
   * 
   * Mejora futura: Implementar versionado de productos para historial de cambios
   */
  async updateProduct(id: string, data: Partial<UpdateProductInput>): Promise<ProductWithId> {
    // Validar ID y datos
    const validationData = { id, ...data };
    UpdateProductSchema.parse(validationData);
    
    // Verificar que el producto existe
    await this.getProductById(id);
    
    // Actualizar solo los campos proporcionados
    const updateData = { ...data };
    delete updateData.id;
    
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    });
    
    return product;
  }

  /**
   * Elimina un producto
   * 
   * Mejora futura: Implementar soft delete en lugar de eliminación física
   * - Añadir campo deletedAt en el schema
   * - Marcar como eliminado en lugar de borrar
   * - Permitir restauración de productos eliminados
   * 
   * @example
   * // Soft delete implementation:
   * async deleteProduct(id: string): Promise<ProductWithId> {
   *   return await prisma.product.update({
   *     where: { id },
   *     data: { deletedAt: new Date() }
   *   });
   * }
   */
  async deleteProduct(id: string): Promise<ProductWithId> {
    // Validar ID
    DeleteProductSchema.parse({ id });
    
    // Verificar que el producto existe
    await this.getProductById(id);
    
    // Eliminar producto
    const product = await prisma.product.delete({
      where: { id },
    });
    
    return product;
  }
}

/**
 * Exportar instancia singleton del servicio
 * Esto permite reutilizar la misma instancia en toda la aplicación
 * 
 * Mejora futura: Implementar inyección de dependencias para testing
 */
export const productService = new ProductService();
